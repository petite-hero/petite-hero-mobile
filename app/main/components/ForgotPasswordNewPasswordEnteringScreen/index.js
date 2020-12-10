import React, { useContext, useState } from 'react';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, PORT } from '../../../const/const';
import { Loader } from '../../../utils/loader';
import styles from './styles/index.css';
import { showMessage } from '../../../utils/showMessage';

const ForgotPasswordNewPasswordEnteringScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const [invalidPasswordMessage, setInvalidPasswordMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);
  const [invalidConfirmPasswordMessage, setInvalidConfirmPasswordMessage] = useState("");
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
  const [loading, setLoading]   = useState(false);

  const isValidated = () => {
    let result = true;
    if (!password) {
      setValidPassword(false);
      setInvalidPasswordMessage(t("signup-password-empty"));
      result = false
    } else if (password.length !== 6) {
      setValidPassword(false);
      setInvalidPasswordMessage(t("signup-password-invalid"));
      result = false;
    }
    if (!confirmPassword) {
      setValidConfirmPassword(false);
      setInvalidConfirmPasswordMessage(t("signup-password-again-empty"));
      result = false;
    } else if (password !== confirmPassword) {
      setValidConfirmPassword(false);
      setInvalidConfirmPasswordMessage(t("signup-password-again-invalid"));
      result = false;
    }
    return result;
  }

  const resetPassword = async() => {
    if (!isValidated()) {
      setLoading(false);
      return null;
    }
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetch("http://" + ip + PORT + "/account/" + props.route.params.phone + "/reset-password", {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: password,
          confirmPassword: confirmPassword
        })
      });
      const result = await response.json();
      if (result.code === 200) {
        showMessage(t("forgot-success"));
        props.navigation.navigate("Login");
      } else if (result.code === 400) {
        setValidPhone(false);
        setInvalidPhoneMessage(t("signup-username-existed"));
      } else {
        showMessage(t("forgot-fail"));
        props.navigation.navigate("Login");
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
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
            width: 250,
            height: 250
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
        onPress={() => {props.navigation.navigate("Welcome")}}
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
          {t("forgot-new-password-title")}
        </Text>
        {/* password */}
        <View style={{
          width: "80%",
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
            onChangeText={(text) => {setPassword(text); setValidPassword(true); setInvalidPasswordMessage("");}}
            placeholder={t("forgot-new-password")}
            placeholderTextColor={COLORS.MEDIUM_CYAN}
            maxLength={6}
            style={{
              fontSize: 16,
              fontFamily: "Montserrat",
              height: 50,
              width: "80%"
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
        {!validPassword &&
          <View style={{
            marginTop: -10,
            marginLeft: "10%",
            marginRight: "10%",
            alignSelf: "flex-start"
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: "Montserrat",
              color: COLORS.RED
            }}>
            {invalidPasswordMessage}
            </Text>
          </View>
        }
        {/* end password */}
        {/* confirm password */}
        <View style={{
          width: "80%",
          borderBottomWidth: 1,
          borderColor: COLORS.STRONG_CYAN,
          marginBottom: "5%",
          flexDirection: "row",
          alignContent: "space-between",
          alignItems: "center"
        }}>
          <TextInput 
            secureTextEntry={secureTextConfirm}
            keyboardType="numeric"
            value={confirmPassword}
            onChangeText={(text) => {setConfirmPassword(text); setValidConfirmPassword(true); setInvalidConfirmPasswordMessage("");}}
            placeholder={t("forgot-new-password-again")}
            placeholderTextColor={COLORS.MEDIUM_CYAN}
            maxLength={6}
            style={{
              fontSize: 16,
              fontFamily: "Montserrat",
              height: 50,
              width: "80%"
            }}
          />
          <TouchableOpacity 
            style={{
              width: "20%",
              height: 40,
              alignItems: "flex-end",
              justifyContent: "center"
            }}
            onPress={() => {setSecureTextConfirm(!secureTextConfirm)}}
          >
            {secureTextConfirm ? 
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
        {!validConfirmPassword &&
          <View style={{
            marginTop: -10,
            marginLeft: "10%",
            marginRight: "10%",
            alignSelf: "flex-start"
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: "Montserrat",
              color: COLORS.RED
            }}>
            {invalidConfirmPasswordMessage}
            </Text>
          </View>
        }
        {/* end confirm password */}
        <TouchableOpacity style={{
          width: "80%",
          height: 50,
          borderRadius: 25,
          marginTop: "10%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.STRONG_CYAN
        }}
          onPress={() => {setLoading(true); resetPassword()}}
        >
          <Text style={{
            fontSize: 16, 
            fontFamily: "Acumin", 
            color: COLORS.WHITE
          }}>
            {t("signup-next")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default ForgotPasswordNewPasswordEnteringScreen;