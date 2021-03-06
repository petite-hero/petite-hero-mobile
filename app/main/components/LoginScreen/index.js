import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, PORT } from '../../../const/const';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import styles from './styles/index.css';
import { fetchWithTimeout } from '../../../utils/fetch';
import { showMessage } from '../../../utils/showMessage';
import { Loader } from '../../../utils/loader';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Constants from 'expo-constants';

const LoginScreen = (props) => {

  // hung - test
  // const [username, setUsername] = useState("0847641376");
  // const [password, setPassword] = useState("123456");
  const { t, setLocale } = useContext(props.route.params.localizationContext);
  const { signIn } = React.useContext(props.route.params.authContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
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
          password: password,
          deviceId: Constants.deviceId
        })
      });
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        if (result.data.isVerify == false) {
          props.navigation.navigate("RegisterCodeEntering", {phone: username});
          return null;
        } else if (result.data.isExpired === true) {
          props.navigation.navigate("ProfileShowingSubscription", {
            phone: username, 
            message: true,
            goBack: () => setLoading(false)
          });
          return null;
        }
        const token = await registerForPushNotificationsAsync();
        await sendToken(username, token);
        await AsyncStorage.setItem("user_id", username);
        setLocale(result.data.language);
        signIn({jwt: result.data.jwt});
      } else if (result.code === 404 && result.msg.includes("Wrong username or password")) {
        setShowInvalidMessage(true);
        setPassword("");
        setMessage("");
      } else if (result.msg.includes("Your device has changed")) {
        setMessage(t("signin-invalid-device-1"));
      } else {
        showMessage(result.msg);
        setMessage("");
      }
    } catch (error) {
      showMessage(error.message);
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
      showMessage(error.message);
    }
  }
  
  return (
    <View style={styles.container}>
      <Loader loading={loading}/>
      <View style={{
        width: "100%",
        height: "30%",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Image
          source={require("../../../../assets/logo.png")}
          style={{
            width: 164,
            height: 164
          }}>
        </Image>
      </View>
      <TouchableOpacity
        style={{
          position: "absolute",
          left: "10%",
          top: "5%",
          width: widthPercentageToDP("10%"),
          height: widthPercentageToDP("10%"),
          alignItems: "center",
          justifyContent: "center"
        }}
        onPress={() => {props.navigation.goBack()}}
      >
        <Image
          source={require("../../../../assets/icons/back.png")}
          style={{width: 30, height: 30}}
        />
      </TouchableOpacity>
      <View style={{
        position: "absolute",
        backgroundColor: COLORS.WHITE,
        width: "100%",
        height: "70%",
        top: "26%",
        alignItems: "center"
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
            maxLength={11}
            style={{
              fontSize: 16,
              fontFamily: "Montserrat",
              height: 50,
              backgroundColor: COLORS.WHITE,
              borderBottomWidth: 1,
              borderColor: COLORS.STRONG_CYAN,
              marginBottom: "5%",
              color: COLORS.BLACK
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
              onChangeText={(text) => {showInvalidMessage && setShowInvalidMessage(false); setPassword(text);}}
              placeholder={t("signin-password")}
              placeholderTextColor={COLORS.MEDIUM_CYAN}
              maxLength={6}
              style={{
                fontSize: 16,
                fontFamily: "Montserrat",
                height: 50,
                width: "80%",
                color: COLORS.BLACK
              }}
            />
            <TouchableOpacity 
              style={{
                width: "20%",
                height: 40,
                alignItems: "flex-end",
                justifyContent: "center"
              }}
              onPress={() => {setSecureText(!secureText)}}
            >
              {secureText ? 
              <Image
                source={require("../../../../assets/icons/eye-on.png")}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                }}
              />
              :
              <Image
                source={require("../../../../assets/icons/eye-off.png")}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                }}
              />
              }
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
          {message.length !== 0 &&
            <View style={{
              marginTop: -10
            }}>
              <Text style={{
                fontSize: 14,
                fontFamily: "Montserrat",
                color: COLORS.RED
              }}>
                {message}
                <Text style={{
                  fontSize: 14,
                  fontFamily: "MontserratBold",
                  color: COLORS.RED,
                  textDecorationLine: "underline"
                }}
                  onPress={() => (Linking.openURL(`tel:${"0332987559"}`))}
                >
                  {t("signin-invalid-device-2")}
                </Text>
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