import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { COLORS, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import AsyncStorage from '@react-native-community/async-storage';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { Loader } from "../../../utils/loader";
import { fetchWithTimeout } from "../../../utils/fetch";
import { showMessage } from "../../../utils/showMessage";
import Header from "../../../base/components/Header";

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
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 45,
                    borderRadius: 22.5,
                    backgroundColor: value.active ? value.color : COLORS.GREY,
                  }}
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

const ProfileConfirmCollaboratorScreen = (props) => {
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
        showMessage(result.msg);
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const confirmOrDeny = async(status) => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem("user_id");
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/collaborator/confirm", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collaboratorPhoneNumber: id,
          isConfirm: status,
          listChildId: [props.route.params.childId]
        })
      });
      const result = await response.json();
      console.log(result);
      if (result.code === 200) {
        props.route.params.goBack();
        props.navigation.goBack();
      } else {
        showMessage(result.msg);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getChildDetails();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Loader loading={loading}/>
      <Header navigation={props.navigation} title={props.route.params.screenName}/>
      {/* child image */}
      <View style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "10%"
      }}>
        <View style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.MEDIUM_GREY
        }}>
          {currentPhoto ?
            <Image
              source={{uri: "data:image/png;base64," + currentPhoto}}
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
        </View>
      </View>
      {/* end child image */}
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
      <View style={{
        marginLeft: "10%",
        marginRight: "10%",
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
          borderColor: COLORS.YELLOW,
          alignItems: "center",
          justifyContent: "center"
        }}
          onPress={() => {setLoading(true); confirmOrDeny(false)}}
        >
          <Text style={{
            fontFamily: "Acumin",
            fontSize: 16
          }}>
            {t("profile-collaborators-deny")}
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
          onPress={() => {setLoading(true); confirmOrDeny(true)}}
        >
          <Text style={{
            fontFamily: "Acumin",
            fontSize: 16
          }}>
            {t("profile-collaborators-accept")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default ProfileConfirmCollaboratorScreen;