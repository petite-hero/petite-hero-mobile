import React, { useContext, useState } from 'react';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, PORT } from '../../../const/const';
import { Loader } from '../../../utils/loader';
import styles from './styles/index.css';
import { showMessage } from '../../../utils/showMessage';

const RegisterScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState(true);
  const [invalidPhoneMessage, setInvalidPhoneMessage] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const [invalidPasswordMessage, setInvalidPasswordMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);
  const [invalidConfirmPasswordMessage, setInvalidConfirmPasswordMessage] = useState("");
  const [loading, setLoading]   = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);

  const isValidated = () => {
    let result = true;
    if (!phone) {
      setValidPhone(false);
      setInvalidPhoneMessage(t("signup-username-empty"));
      result = false;
    }
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

  const register = async() => {
    if (!isValidated()) {
      setLoading(false);
      return null;
    }
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetch("http://" + ip + PORT + "/account/parent/register", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: phone,
          password: password
        })
      });
      const result = await response.json();
      if (result.code === 200) {
        props.navigation.navigate("RegisterCodeEntering", {phone: phone});
      } else if (result.code === 400) {
        setValidPhone(false);
        setInvalidPhoneMessage(t("signup-username-existed"));
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
      {/* username */}
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
          {t("signup-title")}
        </Text>
        <View style={{
          width: "80%"
        }}>
          <TextInput
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {setPhone(text); setValidPhone(true); setInvalidPhoneMessage("")}}
            placeholder={t("signup-username")}
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
        </View>
        {!validPhone &&
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
            {invalidPhoneMessage}
            </Text>
          </View>
        }
        {/* end username */}
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
            placeholder={t("signup-password-again")}
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
          onPress={() => {setLoading(true); setTimeout(() => register(phone), 200)}}
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


export default RegisterScreen;