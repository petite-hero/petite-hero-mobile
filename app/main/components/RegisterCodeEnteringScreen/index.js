import React, { useContext, useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { COLORS, PORT } from '../../../const/const';
import { Loader } from '../../../utils/loader';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import styles from './styles/index.css';
import { showMessage } from '../../../utils/showMessage';

const CELLS = 6;

const RegisterCodeEnteringScreen = (props) => {
  const { t }                              = useContext(props.route.params.localizationContext);
  const [value, setValue]                  = useState("");
  const [loading, setLoading]              = useState(false);
  const ref                                = useBlurOnFulfill({value, cellCount: CELLS});
  const [property, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const sendOtp = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = props.route.params.phone;
      const response = await fetch("http://" + ip + PORT + "/account/send-otp?username=" + id, {
        method: "POST"
      });
      const result = await response.json();
      if (result.code === 200) {
        //
      } else {
        showMessage(result.msg);
      }
    } catch (error) {
      showMessage(error);
    } finally {
      setLoading(false);
    }
  }

  const verify = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const data = new FormData();
      data.append("token", value);
      data.append("username", props.route.params.phone);
      const response = await fetch("http://" + ip + PORT + "/account/verify-otp", {
        method: "POST",
        body: data
      });
      const result = await response.json();
      if (result.code === 200) {
        props.route.params.phone ? 
          props.navigation.goBack()
        :
          props.navigation.navigate("RegisterEnteringInformation", {phone: props.route.params.phone});
      }
    } catch (error) {
      showMessage(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    props.route.params.phone && sendOtp();
  }, [])

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
          {t("signup-enter-otp-title")}
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
            verify();
          }}
        >
          <Text style={{
            fontSize: 16, 
            fontFamily: "Acumin", 
            color: COLORS.WHITE
          }}>
            {t("signup-enter-otp-next")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default RegisterCodeEnteringScreen;