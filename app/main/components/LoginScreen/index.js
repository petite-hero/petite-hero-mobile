import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import { Icon } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import styles from './styles/index.css';
import { fetchWithTimeout } from '../../../utils/fetch';
import { handleError } from '../../../utils/handleError';
import { Loader } from '../../../utils/loader';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const LoginScreen = (props) => {

  // hung - test
  // const [username, setUsername] = useState("0987654321");
  // const [password, setPassword] = useState("123456");

  const { t } = useContext(props.route.params.localizationContext);
  const { signIn } = React.useContext(props.route.params.authContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showInvalidMessage, setShowInvalidMessage] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading]   = useState(false);

  const registerForPushNotificationsAsync = async() => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      alert('You need to grant permission to receive Notifications!');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }

  const login = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/account/login", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        const token = await registerForPushNotificationsAsync();
        await sendToken(username, token);
        await AsyncStorage.setItem("user_id", username);
        signIn({jwt: result.data.jwt});
      } else if (result.code === 404 && result.msg === "Wrong username or password. Please try again") {
        setShowInvalidMessage(true);
        setPassword("");
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const sendToken = async(id, token) => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/token", {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: id,
          pushToken: token
        })
      });
    } catch (error) {
      handleError(error.message);
    }
  }
  
  return (
    <View style={styles.container}>
      <Loader loading={loading}/>
      <Icon
        name="keyboard-arrow-left"
        type="material"
        color={COLORS.BLACK}
        containerStyle={{
          position: "absolute",
          left: "10%",
          top: "15%",
          width: widthPercentageToDP("10%"),
          height: widthPercentageToDP("10%"),
          borderRadius: widthPercentageToDP("5%"),
          backgroundColor: COLORS.WHITE,
          alignItems: "center",
          justifyContent: "center",
          elevation: 10
        }}
        onPress={() => {props.navigation.goBack()}}
      />
      <View style={{
        position: "absolute",
        backgroundColor: COLORS.WHITE,
        width: "100%",
        height: "74%",
        top: "26%",
        alignItems: "center",
        borderTopRightRadius: 30,
        borderTopLeftRadius:  30,
      }}>
        <Text style={{
          marginTop: "10%",
          marginBottom: "10%",
          marginLeft: "10%",
          fontSize: 20,
          fontFamily: "MontserratBold",
          alignSelf: "baseline",
          color: COLORS.BLACK
        }}>
          {t("signin-title")}
        </Text>
        <View style={{
          width: "80%"
        }}>
          <TextInput
            keyboardType="phone-pad"
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholder={t("signin-username")}
            placeholderTextColor={COLORS.MEDIUM_CYAN}
            style={{
              fontSize: 16,
              fontFamily: "MontserratBold",
              height: 50,
              backgroundColor: COLORS.WHITE,
              borderBottomWidth: 1,
              borderColor: COLORS.STRONG_CYAN,
              marginBottom: "5%",
            }}
          />
          <View style={{
            height: 50,
            backgroundColor: COLORS.WHITE,
            borderBottomWidth: 1,
            borderColor: COLORS.STRONG_CYAN,
            marginBottom: "5%",
            flexDirection: "row",
            alignContent: "space-between",
            alignItems: "center"
          }}>
            <TextInput 
              secureTextEntry={secureText}
              keyboardType="numeric"
              value={password}
              onChangeText={(text) => {showInvalidMessage && setShowInvalidMessage(false); setPassword(text)}}
              placeholder={t("signin-password")}
              placeholderTextColor={COLORS.MEDIUM_CYAN}
              style={{
                fontSize: 16,
                fontFamily: "MontserratBold",
                height: 50,
                width: "80%"
              }}
            />
            <TouchableOpacity 
              style={{
                width: "20%",
                height: 50,
                alignItems: "flex-end"
              }}
              onPress={() => {setSecureText(!secureText)}}
            >
              <Icon
                name={secureText ? "visibility" : "visibility-off"}
                type="material"
                color={COLORS.MEDIUM_CYAN}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center"
                }}
              />
            </TouchableOpacity>
          </View>
          {showInvalidMessage &&
            <View style={{
              marginTop: -10
            }}>
              <Text style={{
                fontSize: 14,
                fontFamily: "Montserrat",
                color: COLORS.RED
              }}>
              {t("signin-invalid-message")}
              </Text>
            </View>
          }
        </View>
        <TouchableOpacity style={{
          marginTop: 10
        }}
          onPress={() => props.navigation.navigate("ForgotPassword")}
        >
          <Text style={{
            fontSize: 14,
            fontFamily: "Acumin",
            color: COLORS.STRONG_CYAN
          }}>
            {t("signin-forgot-password")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          width: "80%",
          height: 50,
          borderRadius: 25,
          marginTop: "7%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: username.length < 10 || password.length == 0 ? COLORS.LIGHT_GREY : COLORS.STRONG_CYAN
        }}
          onPress={() => {setLoading(true); login(username, password)}}
          disabled={username.length < 10 || password.length == 0}
        >
          <Text style={{
            fontSize: 16, 
            fontFamily: "Acumin", 
            color: COLORS.WHITE
          }}>
            {t("signin-next")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;