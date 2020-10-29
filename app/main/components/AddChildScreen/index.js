import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Image, AsyncStorage } from "react-native";
import { RadioButton } from 'react-native-paper';
import { COLORS, IP, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Loader } from "../../../utils/loader";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";

import * as Notifications from 'expo-notifications';

// silent notification for updating location
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    let noti = notification.request.content;
    if (noti.title == null) {
      // console.log("Do not show notification");
    } else {
      // console.log("Show notification")
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.MAX
      }
    }
  }
});

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
      <Text style={{marginLeft: 15}}>
        {props.data.name ? "..." + props.data.name.slice(props.data.name.length-11, props.data.name.length) : "No file selected"}
      </Text>
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
  const [loading, setLoading]     = useState(false);

  const createQrCode = async() => {
    try {
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
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + id + "/children", {
        method: "POST",
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        body: data
      });
      const result = await response.json();
      // console.log(result);
      if (result.code === 200 && result.msg === "OK") {
        const data = result.data.childId.toString();
        await AsyncStorage.setItem("child_id", result.data.childId + "");
        setQr("https://api.qrserver.com/v1/create-qr-code/?data=" + data + "&amp;size=250x250");
      } else {
        handleError(result.msg);
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // listen to smartwatch QR scanning updates
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const listenQRScanned = () => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Silent noti for updating child loc
      if (notification.request.content.title === "Petite Hero" && notification.request.content.body === "Done setting up child device") { 
        props.navigation.goBack();
      }
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  };

  React.useEffect(() => {
    // listen to location update from server
    listenQRScanned();
  }, []);


  return (
    <View style={styles.container}>
      <Loader loading={loading}/>
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
            onPress={() => {setLoading(true); createQrCode()}}
          >
            <Text style={{
              fontSize: 20,
              fontFamily: "Acumin"
            }}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </> : 
      <View onLayout={() => setLoading(true)}>
        <Loader loading={loading}/>
        <View style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Image style={{width: 250, height: 250}} source={{uri: qr}} onLoad={() => {setLoading(false)}} />
          <Text style={{
            fontSize: 25,
            fontFamily: "Acumin",
            textAlign: "center",
            marginTop: 20
          }}>
            Please scan this QR using smartwatch
          </Text>
        </View>
      </View>}
    </View>
  )
}


export default AddChildScreen;