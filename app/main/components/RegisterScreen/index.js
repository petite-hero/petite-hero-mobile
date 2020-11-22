import React, { useContext, useState } from 'react';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AsyncStorage } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import { Loader } from '../../../utils/loader';
import { Icon } from 'react-native-elements';
import styles from './styles/index.css';
import { handleError } from '../../../utils/handleError';

const RegisterScreen = (props) => {

  const { t } = useContext(props.route.params.localizationContext);
  const [phone, setPhone] = useState("");
  const [loading, setLoading]   = useState(false);

  const register = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetch("http://" + ip + PORT + "/account/parent/register", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: phone
        })
      });
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        props.navigation.navigate("Login");
      } else {
        handleError(result.msg);
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
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
          {t("signup-title")}
        </Text>
        <View style={{
          width: "80%",
          height: 100
        }}>
          <TextInput
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            placeholder={t("signup-username")}
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
          // onPress={() => {setLoading(true); register(phone)}}
          onPress={() => {register(phone)}}
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