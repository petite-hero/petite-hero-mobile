import React, { useContext, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { COLORS, PORT } from '../../../const/const';
import { Loader } from '../../../utils/loader';
import styles from './styles/index.css';
import { showMessage } from '../../../utils/showMessage';
import { fetchWithTimeout } from '../../../utils/fetch';

const ForgotPasswordScreen = (props) => {
  const { t }                 = useContext(props.route.params.localizationContext);
  const [phone, setPhone]     = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidated = () => {
    let isValidated = true;
    if (!phone) {
      isValidated = false;
      setMessage(t("forgot-phone-empty"));
    }
    return isValidated;
  }

  const sendOtp = async() => {
    try {
      if (!isValidated()) {
        setLoading(false);
        return null;
      }
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/account/send-otp?username=" + phone, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.code === 200) {
        props.navigation.navigate("CodeEntering", {phone: phone});
      } else if (result.code === 404) {
        setMessage(t("forgot-phone-invalid"));
      } else {
        showMessage(result.msg);
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
          {t("forgot-title")}
        </Text>
        <View style={{
          width: "80%"
        }}>
          <TextInput
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            placeholder={t("forgot-phone")}
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
            }}
          />
        </View>
        { message.length > 0 &&
          <Text style={{
            alignSelf: "flex-start",
            marginLeft: "10%",
            marginRight: "10%",
            fontFamily: "Acumin",
            fontSize: 14,
            color: COLORS.RED
          }}>
            {message}
          </Text>
        }
        <TouchableOpacity style={{
          width: "80%",
          height: 50,
          borderRadius: 25,
          marginTop: "10%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.STRONG_CYAN
        }}
          onPress={() => {
            setLoading(true);
            sendOtp();
          }}
        >
          <Text style={{
            fontSize: 16, 
            fontFamily: "Acumin", 
            color: COLORS.WHITE
          }}>
            {t("forgot-next")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ForgotPasswordScreen;