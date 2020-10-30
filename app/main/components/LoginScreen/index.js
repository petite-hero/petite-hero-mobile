import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import { Icon } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import styles from './styles/index.css';
import { fetchWithTimeout } from '../../../utils/fetch';
import { handleError } from '../../../utils/handleError';
import { Loader } from '../../../utils/loader';

const LoginScreen = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading]   = useState(false);
  const { signIn } = React.useContext(props.route.params.authContext);
  const localizationContext = React.useContext(props.route.params.localizationContext);

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
      } else {
        handleError(result.msg);
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
      <View style={{width: "100%", height: "30%", backgroundColor: COLORS.STRONG_ORANGE}}>
        
      </View>
      <View style={{
        position: "absolute",
        backgroundColor: COLORS.NUDE,
        width: "100%",
        height: "74%",
        top: "26%",
        alignItems: "center",
        borderTopRightRadius: 30,
        borderTopLeftRadius:  30,
      }}>
        <TouchableOpacity style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          marginTop: -35,
          marginLeft: 250,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.STRONG_ORANGE,
          elevation: 10
        }}
          onPress={() => {setLoading(true); login(username, password)}}
        >
          <Text style={{fontSize: 40, color: COLORS.WHITE}}> &gt; </Text>
        </TouchableOpacity>
        <Text style={{
          marginTop: "10%",
          marginBottom: "10%",
          marginLeft: "10%",
          fontSize: 40,
          fontFamily: "MontserratBold",
          alignSelf: "baseline",
          color: COLORS.STRONG_ORANGE
        }}>
          Sign in
        </Text>
        <View style={{
          width: "80%",
          height: 100
        }}>
          <TextInput 
            keyboardType="phone-pad"
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholder={"Phone Number"}
            style={{
              borderRadius: 50,
              height: 50,
              backgroundColor: COLORS.NUDE,
              marginBottom: "5%",
              paddingLeft: "5%",
              elevation: 8,
            }}
          />
          <View style={{
            height: 50,
            flexDirection: "row",
            alignContent: "space-between",
            alignItems: "center",
            backgroundColor: COLORS.NUDE,
            borderRadius: 50,
            elevation: 8
          }}>
            <TextInput 
              secureTextEntry={secureText}
              keyboardType="numeric"
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder={"Password"}
              style={{
                height: 50,
                width: "80%",
                paddingLeft: "5%",
              }}
            />
            <TouchableOpacity 
              style={{
                width: "20%",
                height: 50
              }}
              onPress={() => {setSecureText(!secureText)}}
            >
              <Icon
                name={secureText ? "visibility" : "visibility-off"}
                type="material"
                color={COLORS.GREY}
                style={{
                  width: "100%",
                  height: "100%",
                  alignSelf: "center",
                  justifyContent: "center"
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={{
          marginTop: "10%"
        }}>
          <Text style={{
            color: COLORS.STRONG_ORANGE
          }}>
            Forgot your password?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;