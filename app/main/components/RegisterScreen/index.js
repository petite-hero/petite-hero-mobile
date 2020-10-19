import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AsyncStorage } from 'react-native';
import { COLORS, IP, PORT } from '../../../const/const';
import styles from './styles/index.css';

const RegisterScreen = (props) => {
  const [phone, setPhone] = useState("");

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
      console.log(result);
      if (result.code === 200 && result.msg === "OK") {
        props.navigation.navigate("Login");
      } else {
        // do something else later
      }
    } catch (error) {

    }
  }

  return (
    <SafeAreaView style={styles.container}>
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
          onPress={() => {register(phone)}}
        >
          <Text style={{fontSize: 40, color: COLORS.WHITE}}> &gt; </Text>
        </TouchableOpacity>
        <Text style={{
          marginTop: "10%",
          marginBottom: "10%",
          marginLeft: "10%",
          fontSize: 40,
          alignSelf: "baseline",
          fontWeight: "bold",
          color: COLORS.STRONG_ORANGE
        }}>
          Sign up
        </Text>
        <View style={{
          width: "80%",
          height: 100
        }}>
          <TextInput 
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => setPhone(text)}
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
        </View>
      </View>
    </SafeAreaView>
  );
};


export default RegisterScreen;