import React, { useState } from "react";
import { View, TouchableOpacity, Text, TextInput, AsyncStorage, Switch, ScrollView, Image } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { COLORS, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { Loader } from "../../../utils/loader";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";

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
          backgroundColor: COLORS.STRONG_CYAN
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

const GenderPickerComponent = ({genders, setGenders}) => {
  const toggleGender = (genderIndex) => {
    let tmp = [...genders];
    tmp.map((value, index) => {
      index === genderIndex ? value.active = true : value.active = false;
    });
    setGenders(tmp);
  }

  return (
    <View style={{
      flexDirection: "column",
      alignItems: "flex-start",
      paddingTop: "2.5%",
      paddingLeft: "10%",
      paddingRight: "10%",
      paddingBottom: "2.5%"
    }}>
      <Text style={{
        fontFamily: "AcuminBold",
        fontSize: 16,
        marginBottom: 15
      }}>
        Gender
      </Text>
      <View style={{
        flexDirection: "row"
      }}>
        {
          genders.map((value, index) => {
            return (
              <View
                key={index}
                style={{
                  minWidth: 45,
                  height: 45,
                  marginRight: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {toggleGender(index)}}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 45,
                    borderRadius: 22.5,
                    backgroundColor: value.active ? value.color : COLORS.GREY,
                  }}
                >
                  <Icon
                    name={value.name}
                    type={value.type}
                    color={COLORS.WHITE}
                    containerStyle={{
                      alignSelf: "center",
                      alignContent: "flex-start"
                    }}
                    iconStyle={{
                      marginLeft: 10
                    }}
                  />
                  {
                    value.active &&
                    <Text style={{
                      alignSelf: "center",
                      textAlign: "center",
                      fontSize: 16,
                      fontFamily: "AcuminBold",
                      color: COLORS.WHITE,
                      marginLeft: 10,
                      marginRight: 10
                    }}>
                      {value.title}
                    </Text>
                  }
                </TouchableOpacity>
              </View>
            )
          }) 
        }
      </View>
    </View>
  )
}

const ChildAddingScreen = (props) => {
  const [name, setName]           = useState("");
  const [nickName, setNickName]   = useState("");
  const [language, setLanguage]   = useState("English");
  const [photo, setPhoto]         = useState("");
  const [yob, setYob]             = useState("");
  const [loading, setLoading]     = useState(false);
  const [genders, setGenders] = useState([
    {title: "Male", active: true, name: "male", type: "fontisto", color: COLORS.STRONG_CYAN},
    {title: "Female", active: false, name: "female", type: "fontisto", color: COLORS.STRONG_CYAN}
  ]);

  const createQrCode = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const gender = genders.find(gender => gender.active).title;
      const data = new FormData();
      data.append("name", name);
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
      if (result.code === 200 && result.msg === "OK") {
        const childId = result.data.childId.toString();
        props.navigation.navigate("ChildAddingShowingQr", {qr: childId});
        // props.navigation.navigate("ChildAddingShowingQr", {qr: "Hello"});
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
    <ScrollView style={styles.container}>
      <Loader loading={loading}/>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20%",
        marginLeft: "10%",
        marginRight: "10%",
        marginBottom: "10%",
      }}>
        {/* icon back */}
        <Icon
          name="keyboard-arrow-left"
          type="material"
          color={COLORS.BLACK}
          onPress={() => {props.navigation.goBack()}}
        />
        {/* end icon back */}
        {/* title of the screen */}
        <View style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Text style={{
            fontSize: 20,
            fontFamily: "AcuminBold"
          }}>
            Add New Child
          </Text>
        </View>
        {/* end title of the screen */}
        {/* create this View for center title purpose */}
        <View style={{marginRight: "10%"}}></View>
        {/* end View */}
      </View>
      {/* form */}
      {/* child name */}
      <View style={{
        flexDirection: "column",
        alignItems: "flex-start",
        paddingTop: "2.5%",
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingBottom: "2.5%"
      }}>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16
        }}>
          Your Child's Name
        </Text>
          <TextInput
            value={name}
            onChangeText={(text) => {setName(text)}}
            style={{
              fontSize: 16,
              fontFamily: "Acumin",
              backgroundColor: COLORS.WHITE,
              borderBottomWidth: 2,
              borderColor: COLORS.GREY,
              width: "100%",
            }}
          />
      </View>
      {/* end child name */}
      {/* child nick name */}
      <View style={{
        flexDirection: "column",
        alignItems: "flex-start",
        paddingTop: "2.5%",
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingBottom: "2.5%"
      }}>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16
        }}>
          Nickname (Optional)
        </Text>
          <TextInput
            value={nickName}
            onChangeText={(text) => {setNickName(text)}}
            style={{
              fontSize: 16,
              fontFamily: "Acumin",
              backgroundColor: COLORS.WHITE,
              borderBottomWidth: 2,
              borderColor: COLORS.GREY,
              width: "100%",
            }}
          />
      </View>
      {/* end child nick name */}
      {/* child year of birth */}
      <View style={{
        flexDirection: "column",
        alignItems: "flex-start",
        paddingTop: "2.5%",
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingBottom: "2.5%"
      }}>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16
        }}>
          Year of birth
        </Text>
          <TextInput
            value={yob}
            onChangeText={(text) => {setYob(text)}}
            style={{
              fontSize: 16,
              fontFamily: "Acumin",
              backgroundColor: COLORS.WHITE,
              borderBottomWidth: 2,
              borderColor: COLORS.GREY,
              width: "100%",
            }}
          />
      </View>
      {/* end child year of birth */}
      {/* child gender */}
      <GenderPickerComponent genders={genders} setGenders={setGenders}/>
      {/* end child gender */}
      {/* button Save */}
      <TouchableOpacity style={{
        marginLeft: "10%",
        marginRight: "10%",
        marginTop: "10%",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        height: heightPercentageToDP("5%"),
        backgroundColor: COLORS.YELLOW
      }}
        onPress={() => {setLoading(true); createQrCode()}}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          Next
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}


export default ChildAddingScreen;