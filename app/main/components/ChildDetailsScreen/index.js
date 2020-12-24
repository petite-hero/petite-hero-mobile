import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Loader } from "../../../utils/loader";
import { fetchWithTimeout } from "../../../utils/fetch";
import { showMessage } from "../../../utils/showMessage";
import Header from "../../../base/components/Header";
import InputField from "../../../base/components/InputField";
import { ConfirmationModal } from "../../../utils/modal";

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
          alignItems: "center",
          justifyContent: "center",
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
        <Image
          source={require("../../../../assets/icons/camera.png")}
          style={{
            width: 70,
            height: 70
          }}
        />
      }
      </TouchableOpacity>
    </View>
  )
};

const GenderPickerComponent = ({t, isCollaboratorChild, genders, setGenders}) => {
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
        color: COLORS.BLACK,
        marginBottom: 10
      }}>
        { t("child-add-gender") }
      </Text>
      <View style={{
        flexDirection: "row"
      }}>
        {
          genders.map((value, index) => {
            if (isCollaboratorChild && index == 1) return <View key={index + ""}></View>
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
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 45,
                    borderRadius: 22.5,
                    backgroundColor: value.active ? value.color : COLORS.GREY,
                  }}
                  onPress={() => toggleGender(index)}
                >
                  <Image
                    source={value.title === "Boy" ? require("../../../../assets/icons/boy.png") : require("../../../../assets/icons/girl.png")}
                    style={{width: 25, height: 25, marginLeft: 10}}
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
  const [validName, setValidName] = useState(true);
  const [nickName, setNickName]   = useState("");
  const [language, setLanguage]   = useState("English");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [photo, setPhoto]         = useState("");
  const [yob, setYob]             = useState("");
  const [validYob, setValidYob]   = useState(true);
  const [deviceId, setDeviceId]   = useState("");
  const [loading, setLoading]     = useState(true);
  const [deleteAction, setDeleteAction] = useState(false);
  const [deleteDevice, setDeleteDevice] = useState(false);
  const [genders, setGenders] = useState([
    {title: "Boy", active: false, name: "male", color: COLORS.STRONG_CYAN},
    {title: "Girl", active: false, name: "female", color: COLORS.STRONG_CYAN}
  ]);

  const validate = () => {
    let isValidated = true;
    if (name.length === 0) {setValidName(false); isValidated = false;}
    if (yob.length === 0 || !parseInt(yob) || parseInt(yob) != yob) {setValidYob(false); isValidated = false;}
    return isValidated;
  }

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
        setYob(new Date().getFullYear() - result.data.age + "");
        setDeviceId(result.data.androidId);
      } else {
        showMessage(result.msg);
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const updateChildProfile = async() => {
    try {
      if (!validate()) {
        setLoading(false);
        return null;
      }
      const ip = await AsyncStorage.getItem('IP');
      const gender = genders.find(gender => gender.active).name;
      const data = new FormData();
      data.append("name", name);
      data.append("nickName", nickName);
      data.append("language", language);
      data.append("gender", gender);
      data.append("childPhoto", photo);
      data.append("yob", yob);
      const response = await fetchWithTimeout("http://" + ip + PORT + "/child/" + props.route.params.childId, {
        method: "PUT",
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        body: data
      });
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        AsyncStorage.setItem("child_id", props.route.params.childId + "");
        props.route.params.goBack();
        props.navigation.goBack();
        showMessage("Child profile changed successfully!");
      } else {
        showMessage(result.msg);
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const deleteChild = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem("user_id");
      const body = props.route.params.isCollaboratorChild ? JSON.stringify({
        collborator: id
      }) : "";
      const response = await fetchWithTimeout("http://" + ip + PORT + "/child/" + props.route.params.childId, {
        method: "DELETE",
        body: body
      });
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        props.route.params.goBack();
        props.navigation.goBack();
        showMessage("Child deleted successfully!");
      } else {
        showMessage(result.msg);
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const deleteChildDevice = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem("user_id");
      const response = await fetchWithTimeout("http://" + ip + PORT + "/child/" + props.route.params.childId + "/delete-device", {
        method: "DELETE"
      });
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        showMessage("Child's device is deleted successfully!");
      } else {
        showMessage(result.msg);
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getChildDetails();
  }, [loading]);

  return (
    loading ? <Loader loading={true}/>
    :
    <ScrollView style={styles.container}>
      {/* CONFIRMATION MODAL */}
      <ConfirmationModal t={t} message={t("child-details-delete-message")} visible={deleteAction} onConfirm={() => {setLoading(true); setDeleteAction(false); deleteChild()}} onClose={() => {setDeleteAction(false)}}/>
      <ConfirmationModal t={t} message={t("child-details-delete-device-message") + deviceId} visible={deleteDevice} onConfirm={() => {setLoading(true); setDeleteDevice(false); deleteChildDevice()}} onClose={() => {setDeleteDevice(false)}}/>
      {/* <Loader loading={loading}/> */}
      <Header navigation={props.navigation} title={props.route.params.screenName}/>
      {/* form */}
      {/* child image */}
      <ImagePickerComponent photo={photo} currentPhoto={currentPhoto} setPhoto={setPhoto}/>
      {/* end child image */}
      {/* child name */}
      <InputField title={ t("child-add-name") } value={name} setValue={setName} valid={validName} setValid={setValidName} invalidMessage={t("child-add-name-empty")} editable={!props.route.params.isCollaboratorChild}/>
      {/* end child name */}
      {/* child nick name */}
      <InputField title={t("child-add-nickname")} value={nickName} setValue={setNickName} editable={!props.route.params.isCollaboratorChild}/>
      {/* end child nick name */}
      {/* child year of birth */}
      <InputField title={t("child-add-yob")} value={yob} setValue={setYob} valid={validYob} setValid={setValidYob} invalidMessage={t("child-add-yob-empty")} keyboardType="numeric" editable={!props.route.params.isCollaboratorChild} dataType="integer" invalidDataTypeMessage={t("child-add-yob-invalid")}/>
      {/* end child year of birth */}
      {/* child gender */}
      <GenderPickerComponent t={t} isCollaboratorChild={props.route.params.isCollaboratorChild} genders={genders} setGenders={setGenders}/>
      {/* end child gender */}
      {/* device id */}
      {
      !props.route.params.isCollaboratorChild &&
      <View style={{
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: "2.5%",
        marginLeft: "10%",
        marginRight: "10%",
        marginBottom: "2.5%"
      }}>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          {t("child-details-token")}
        </Text>
        <View style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          {
          deviceId ?
            <Text style={{
              fontFamily: "AcuminBold",
              fontSize: 14,
              color: COLORS.STRONG_GREY
            }}>
              {deviceId}
            </Text>
          :
            <Text style={{
              fontFamily: "AcuminBold",
              fontSize: 14,
              color: COLORS.STRONG_GREY
            }}>
              {t("child-details-no-token")}
            </Text>
          }
          {
          deviceId ?
          <TouchableOpacity
            onPress={() => {setDeleteDevice(true)}}
            style={{ 
              width: 40,
              height: 40,
              borderRadius: 20,
              elevation: 8,
              backgroundColor: COLORS.RED,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              source={require("../../../../assets/icons/delete.png")}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
          :
          <TouchableOpacity
            onPress={() => {props.navigation.navigate("ChildAddingShowingQr", {qr: props.route.params.childId + ""})}}
            style={{ marginRight: -10 }}
          >
            <Image
              source={require("../../../../assets/icons/forth.png")}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
          }
        </View>
      </View>
      }
      {/* end device id */}
      {/* button Save */}
      <View style={{
        marginTop: "10%",
        marginLeft: "10%",
        marginRight: "10%",
        marginBottom: "10%"
      }}>
        {
        !props.route.params.isCollaboratorChild ?
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between"
        }}>
          <TouchableOpacity style={{
            width: "48%",
            paddingTop: "5%",
            paddingBottom: "5%",
            marginTop: "10%",
            backgroundColor: COLORS.WHITE,
            borderWidth: 2,
            borderRadius: heightPercentageToDP("5%"),
            borderColor: COLORS.RED,
            alignItems: "center",
            justifyContent: "center"
          }}
            onPress={() => {setDeleteAction(true)}}
          >
            <Text style={{
              fontFamily: "Acumin",
              fontSize: 16,
              color: COLORS.RED
            }}>
              {t("child-details-delete")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            width: "48%",
            paddingTop: "5%",
            paddingBottom: "5%",
            marginTop: "10%",
            backgroundColor: COLORS.YELLOW,
            borderRadius: heightPercentageToDP("5%"),
            alignItems: "center",
            justifyContent: "center"
          }}
            onPress={() => {setLoading(true); updateChildProfile()}}
          >
            <Text style={{
              fontFamily: "Acumin",
              fontSize: 16,
              color: COLORS.BLACK
            }}>
              {t("child-details-save")}
            </Text>
          </TouchableOpacity>
        </View>
        : 
        <TouchableOpacity style={{
          width: "100%",
          paddingTop: "5%",
          paddingBottom: "5%",
          marginTop: "10%",
          backgroundColor: COLORS.WHITE,
          borderWidth: 2,
          borderRadius: heightPercentageToDP("5%"),
          borderColor: COLORS.RED,
          alignItems: "center",
          justifyContent: "center"
        }}
          onPress={() => {setDeleteAction(true)}}
        >
          <Text style={{
            fontFamily: "Acumin",
            fontSize: 16,
            color: COLORS.RED
          }}>
            {t("child-details-delete")}
          </Text>
        </TouchableOpacity>
        }
      </View>
    </ScrollView>
  )
}


export default ChildDetailsScreen;