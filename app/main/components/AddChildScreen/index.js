import React, { useState } from "react";
import { Text, SafeAreaView, TextInput, TouchableOpacity, View, Image, AsyncStorage } from "react-native";
import { RadioButton } from 'react-native-paper';
import { COLORS, IP, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = (props) => {
  const getPermission = async() => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  }
  
  const pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    });

    if (!result.cancelled) {
      const localUri = result.uri;
      const fileName = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName);
      const type = match ? `image/${match[1]}` : `image`;
      props.setPhoto({ uri: localUri, name: fileName, type });
    }
  }

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      width: "80%",
      justifyContent: "flex-start",
      marginBottom: 20
    }}>
      <Text style={{

      }}>
        {props.title}
      </Text>
      <TouchableOpacity
        title="Choose file"
        onPress={async() => {await getPermission(); await pickImage()}}
        style={{
          width: 100,
          height: 30,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.STRONG_ORANGE
        }}
      >
        <Text>Choose file</Text>
      </TouchableOpacity>
    </View>
  )
};

const AddChildScreen = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [nickName, setNickName]   = useState("");
  const [language, setLanguage]   = useState("English");
  const [gender, setGender]       = useState("Male");
  const [photo, setPhoto]         = useState({});
  const [yob, setYob]             = useState("");
  const [qr, setQr]               = useState("");

  const createQrCode = async() => {
    const ip = await AsyncStorage.getItem('IP');
    const id = await AsyncStorage.getItem('user_id');
    const data = new FormData();
    data.append("firstName", firstName);
    data.append("lastName", lastName);
    data.append("nickName", nickName);
    data.append("language", language);
    data.append("gender", gender);
    data.append("childAvatar", photo);
    data.append("yob", yob);
    const response = await fetch("http://" + ip + PORT + "/parent/" + id + "/children", {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data;'
      },
      body: data
    });
    const result = await response.json();
    if (result.code === 200 && result.msg === "OK") {
      const data = JSON.stringify({
        childId: result.data.childId.toString(),
        timestamp: new Date().getTime().toString(),
        phone: id
      });
      await AsyncStorage.setItem("child_id", result.data.childId + "");
      console.log("test");
      setQr("https://api.qrserver.com/v1/create-qr-code/?data=" + data + "&amp;size=250x250");
    } else {
      // do something else later
    }
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
            keyboardType="numeric"
            value={yob}
            onChangeText={(text) => setYob(text)}
            placeholder="Year of birth"
            style={styles.textInput}
          />
          <View style={{
            width: "80%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <Text style={{
              marginRight: 20
            }}>
              Language
            </Text>
            <Text>English</Text>
            <RadioButton
              value="English"
              status={language === "English" ? "checked" : "unchecked"}
              onPress={() => {setLanguage("English")}}
            />
            <Text>Vietnamese</Text>
            <RadioButton
              value="Vietnamese"
              status={language === "Vietnamese" ? "checked" : "unchecked"}
              onPress={() => {setLanguage("Vietnamese")}}
            />
          </View>
          <View style={{
            width: "80%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20
          }}>
            <Text style={{
              marginRight: 20
            }}>
              Gender
            </Text>
            <Text>Male</Text>
            <RadioButton
              value="Male"
              status={gender === "Male" ? "checked" : "unchecked"}
              onPress={() => {setGender("Male")}}
            />
            <Text>Female</Text>
            <RadioButton
              value="Female"
              status={gender === "Female" ? "checked" : "unchecked"}
              onPress={() => {setGender("Female")}}
            />
          </View>
          <ImagePickerComponent title="Attached file " data={photo} setPhoto={setPhoto}/>
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