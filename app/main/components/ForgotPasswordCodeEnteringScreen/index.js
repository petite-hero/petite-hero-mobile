import React, { useContext, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { COLORS, PORT } from '../../../const/const';
import { Loader } from '../../../utils/loader';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import styles from './styles/index.css';
import { showMessage } from '../../../utils/showMessage';
import AsyncStorage from '@react-native-community/async-storage';
import { fetchWithTimeout } from '../../../utils/fetch';

const CELLS = 6;

const ForgotPasswordCodeEnteringScreen = (props) => {
  const { t }                              = useContext(props.route.params.localizationContext);
  const [value, setValue]                  = useState("");
  const [message, setMessage]              = useState("");
  const [loading, setLoading]              = useState(false);
  const ref                                = useBlurOnFulfill({value, cellCount: CELLS});
  const [property, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const isValidated = () => {
    let isValidated = true;
    if (!value) {
      isValidated = false;
      setMessage(t("forgot-phone-empty"));
    }
    return isValidated;
  }

  const verifyOtp = async() => {
    try {
      if (!isValidated()) {
        setLoading(false);
        return null;
      }
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/account/verify-otp?token=" + value +"&username=" + props.route.params.phone, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.code === 200) {
        props.navigation.navigate("NewPassword", {phone: props.route.params.phone});
      } else if (result.code === 404) {
        setMessage(t("forgot-phone-invalid"));
      } else {
        showMessage(result.msg);
      }
    } catch (error) {
      showMessage(error.message);
      setLoading(false);
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
          {t("forgot-enter-otp-title")}
        </Text>
        <View style={{
          width: "80%"
        }}>
          <CodeField
            ref={ref}
            {...property}
            value={value}
            onChangeText={setValue}
            cellCount={CELLS}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}> 
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
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
            setLoading(true); verifyOtp();
          }}
        >
          <Text style={{
            fontSize: 16, 
            fontFamily: "Acumin", 
            color: COLORS.WHITE
          }}>
            {t("forgot-enter-otp-next")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ForgotPasswordCodeEnteringScreen;