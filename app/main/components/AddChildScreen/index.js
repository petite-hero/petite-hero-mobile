import React, { useState } from "react";
import { Text, SafeAreaView, TextInput, TouchableOpacity, View, Image } from "react-native";
import { COLORS, IP, PORT } from "../../../const/const";
import styles from "./styles/index.css"

const AddChildScreen = (props) => {
  const [firstName, setFirstName] = useState("string");
  const [lastName, setLastName]   = useState("string");
  const [nickName, setNickName]   = useState("string");
  const [language, setLanguage]   = useState("English");
  const [gender, setGender]       = useState("Male");
  const [photo, setPhoto]         = useState("string");
  const [yob, setYob]             = useState("1999");
  const [qr, setQr]               = useState("");

  const createQrCode = async() => {
    // const response = await fetch("http://" + IP + PORT + "/parent/0938194701/children", {
    //   method: "POST",
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     firstName  : firstName,
    //     gender     : gender,
    //     language   : language,
    //     lastName   : lastName,
    //     nickName   : nickName,
    //     photo      : photo,
    //     yob        : yob
    //   })
    // });
    // const result = await response.json();
    // if (result.code === 200 && result.msg === "OK") {
      const data = JSON.stringify({
        firstName  : firstName,
        lastName   : lastName,
        nickName   : nickName,
        gender     : gender,
        language   : language,
        photo      : photo,
        yob        : yob,
        pushToken  : null,
        phone      : "0938194701"
      });
      setQr("https://api.qrserver.com/v1/create-qr-code/?data=" + data + "&amp;size=250x250");
    // } else {
    //   // do something else later
    // }
  }

  return (
    <SafeAreaView style={styles.container}>
      {!qr ? <>
        <View style={{
          width: "100%",
          height: "74%",
          top: "10%",
          backgroundColor: COLORS.NUDE,
          alignItems: "center",
          borderTopRightRadius: 30,
          borderTopLeftRadius:  30,
        }}>
          <TextInput
            keyboardType="default"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
            placeholder="First name"
            style={styles.textInput}
          />
          <TextInput
            keyboardType="default"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            placeholder="Last name"
            style={styles.textInput}
          />
          <TextInput
            keyboardType="default"
            value={nickName}
            onChangeText={(text) => setNickName(text)}
            placeholder="Nick name"
            style={styles.textInput}
          />
          <TextInput
            keyboardType="default"
            value={language}
            onChangeText={(text) => setLanguage(text)}
            placeholder="Language"
            style={styles.textInput}
          />
          <TextInput
            keyboardType="default"
            value={gender}
            onChangeText={(text) => setGender(text)}
            placeholder="Gender"
            style={styles.textInput}
          />
          <TextInput
            keyboardType="default"
            value={photo}
            onChangeText={(text) => setPhoto(text)}
            placeholder="Photo"
            style={styles.textInput}
          />
          <TextInput
            keyboardType="default"
            value={yob}
            onChangeText={(text) => setYob(text)}
            placeholder="Year of birth"
            style={styles.textInput}
          />
        </View>
        <View style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <TouchableOpacity
            style={{
              width: "40%",
              height: 50,
              borderRadius: 15,
              backgroundColor: COLORS.STRONG_ORANGE,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {createQrCode()}}
          >
            <Text style={{
              fontSize: 20
            }}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </> : 
      <>
        <View style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Image style={{width: 250, height: 250}} source={{uri: qr}} />
          <Text style={{
            fontSize: 25,
            textAlign: "center",
            marginTop: 20
          }}>
            Please scan this QR using smartwatch
          </Text>
        </View>
      </>}
    </SafeAreaView>
  )
}


export default AddChildScreen;