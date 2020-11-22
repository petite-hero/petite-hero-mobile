import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, TextInput, AsyncStorage, ScrollView, Image } from 'react-native';
import { COLORS, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { heightPercentageToDP } from 'react-native-responsive-screen';
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
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "10%"
    }}>
      <TouchableOpacity
        title="Choose file"
        onPress={async() => {await getPermission(); await pickImage()}}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: COLORS.MEDIUM_GREY
        }}
        activeOpacity={0.8}
      >
      {props.photo ?
        <Image
          source={{uri: props.photo.uri}}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 60
          }}
        />
      :
      props.currentPhoto ?
        <Image
          source={{uri: "data:image/png;base64," + props.currentPhoto}}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 60
          }}
        />
      :
        <Icon
          name="photo-camera"
          type="material"
          color={COLORS.WHITE}
          containerStyle={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
          iconStyle={{
            transform: [{ scaleX: 2 }, { scaleY: 2 }]
          }}
        />
      }
      </TouchableOpacity>
    </View>
  )
};

const GenderPickerComponent = ({t, genders, setGenders}) => {
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
        color: COLORS.GREY,
        marginBottom: 10
      }}>
        { t("child-add-gender") }
      </Text>
      <View style={{
        flexDirection: "row"
      }}>
        {
          genders.map((value, index) => {
            if (value.active == true) return (
              <View
                key={index}
                style={{
                  minWidth: 45,
                  height: 45,
                  marginRight: 10,
                }}
              >
                <TouchableOpacity
                  // onPress={() => {toggleGender(index)}}
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
                      {value.title === "Boy" ? t("child-add-gender-boy") : t("child-add-gender-girl")}
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

const ChildDetailsScreen = (props) => {
  const { t }                     = useContext(props.route.params.localizationContext);
  const [name, setName]           = useState("");
  const [nickName, setNickName]   = useState("");
  const [language, setLanguage]   = useState("English");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [photo, setPhoto]         = useState("");
  const [yob, setYob]             = useState("");
  const [loading, setLoading]     = useState(true);
  const [genders, setGenders] = useState([
    {title: "Boy", active: false, name: "male", type: "fontisto", color: COLORS.STRONG_CYAN},
    {title: "Girl", active: false, name: "female", type: "fontisto", color: COLORS.STRONG_CYAN}
  ]);

  const getGender = (gender) => {
    let newArray = [...genders];
    newArray = newArray.map((item, index) => {
      if (gender.toLowerCase() === item.name) item.active = true;
      return item;
    });
    return newArray;
  }

  const getChildDetails = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/child/" + props.route.params.childId);
      const result = await response.json();
      if (result.code === 200) {
        setName(result.data.name);
        setNickName(result.data.nickName);
        setLanguage(result.data.language);
        setCurrentPhoto(result.data.photo);
        setGenders(getGender(result.data.gender));
        setYob(new Date().getFullYear() - result.data.age);
      } else {
        handleError(result.msg);
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  }

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

  useEffect(() => {
    getChildDetails();
  }, []);

  return (
    loading ? <Loader loading={true}/>
    :
    <ScrollView style={styles.container}>
      {/* <Loader loading={loading}/> */}
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
            {props.route.params.screenName}
          </Text>
        </View>
        {/* end title of the screen */}
        {/* create this View for center title purpose */}
        <View style={{marginRight: "10%"}}></View>
        {/* end View */}
      </View>
      {/* form */}
      {/* child image */}
      <ImagePickerComponent photo={photo} currentPhoto={currentPhoto} setPhoto={setPhoto}/>
      {/* end child image */}
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
          fontSize: 16,
          color: COLORS.GREY
        }}>
          { t("child-add-name") }
        </Text>
        {/* <TextInput
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
        /> */}
        <Text
          style={{
            fontSize: 16,
            fontFamily: "AcuminBold",
            width: "100%",
          }}
        >
          {name}
        </Text>
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
          fontSize: 16,
          color: COLORS.GREY
        }}>
          { t("child-add-nickname") }
        </Text>
        {/* <TextInput
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
        /> */}
        <Text
        style={{
          fontSize: 16,
          fontFamily: "AcuminBold",
          width: "100%",
        }}
        >
          {nickName}
        </Text>
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
          fontSize: 16,
          color: COLORS.GREY
        }}>
          { t("child-add-yob") }
        </Text>
        {/* <TextInput
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
        /> */}
        <Text
        style={{
          fontSize: 16,
          fontFamily: "AcuminBold",
          width: "100%",
        }}
        >
          {yob}
        </Text>
      </View>
      {/* end child year of birth */}
      {/* child gender */}
      <GenderPickerComponent t={t} genders={genders} setGenders={setGenders}/>
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
        // onPress={() => {setLoading(true); createQrCode()}}
        onPress={() => props.navigation.goBack()}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          OK
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}


export default ChildDetailsScreen;