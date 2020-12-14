import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, PORT } from '../../../const/const';
import styles from './styles/index.css';
import { fetchWithTimeout } from '../../../utils/fetch';
import { showMessage } from '../../../utils/showMessage';
import { Loader } from '../../../utils/loader';
import ImagePickerComponent from '../ChildAddingScreen/ImagePickerComponent';
import ButtonSave from '../../../base/components/ButtonSave';
import InputField from './InputField';

const RegisterEnteringInformationScreen = (props) => {
  const { t, setLocale } = useContext(props.route.params.localizationContext);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [nameInvalidMessage, setNameInvalidMessage] = useState("");
  const [email, setEmail] = useState("");
  const [emailInvalidMessage, setEmailInvalidMessage] = useState("");
  const [photo, setPhoto] = useState("");
  const [languages, setLanguages] = useState([
    {name: "Vietnamese", locale: "vi", active: true},
    {name: "English", locale: "en-US", active: false}
  ])

  const isValidated = () => {
    let result = true;
    if (!name) {
      setNameInvalidMessage(t("signup-name-empty"));
      result = false;
    }
    if (!email) {
      setEmailInvalidMessage(t("signup-email-empty"));
      result = false;
    } else {
      const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!email.match(mailformat)) {
        setEmailInvalidMessage(t("signup-email-invalid"));
        result = false;
      }
    }
    return result;
  }

  const updateProfile = async() => {
    if (!isValidated()) {
      setLoading(false);
      return null;
    }
    try {
      const ip = await AsyncStorage.getItem('IP');
      const language = languages.find(lang => lang.active).name;
      const data = new FormData();
      data.append("name", name);
      data.append("language", language);
      data.append("avatar", photo);
      data.append("email", email);
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + props.route.params.phone, {
        method: "PUT",
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        body: data
      });
      const result = await response.json();
      if (result.code === 200) {
        props.navigation.navigate("Login");
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <View style={styles.container}>
      <Loader loading={loading}/>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20%",
        marginLeft: "10%",
        marginRight: "10%",
      }}>
        {/* icon back */}
        <TouchableOpacity 
          style={{
            width: 30,
            height: 30
          }}
          onPress={() => {props.navigation.navigate("Welcome")}}
        >
          <Image
            source={require("../../../../assets/icons/back.png")}
            style={{
              width: "100%",
              height: "100%"
            }}
          />
        </TouchableOpacity>
      </View>
      <ImagePickerComponent photo={photo} setPhoto={setPhoto}/>
      <View style={{
        marginLeft: "10%",
        marginRight: "10%",
        marginBottom: "10%"
      }}>
        <InputField title={t("signup-name")} value={name} setValue={setName} invalidMessage={nameInvalidMessage} setInvalidMessage={setNameInvalidMessage} placeholder={t("signup-name-placeholder")}/>
        <InputField title={t("signup-email")} value={email} setValue={setEmail} invalidMessage={emailInvalidMessage} setInvalidMessage={setEmailInvalidMessage} placeholder={t("signup-email-placeholder")}/>
        <Text style={{
          marginTop: "5%",
          fontFamily: "MontserratBold",
          fontSize: 20,
          color: COLORS.BLACK
        }}>
          {t("signup-language")}
        </Text>
        <View style={{
          flexDirection: "row"
        }}>
          {languages.map((language, index) => {
            return (
              <TouchableOpacity key={index} style={{
                width: 50,
                height: 50,
                padding: 3,
                marginTop: 5,
                marginRight: 10,
                borderRadius: 25,
                borderWidth: 2,
                borderColor: language.active ? COLORS.STRONG_CYAN : COLORS.WHITE,
              }}
                onPressOut={() => {
                  const newArray = [...languages];
                  const currentIndex = newArray.indexOf(language);
                  newArray.map((language, index) => {
                    if (index === currentIndex) language.active = true;
                    else language.active = false;
                  });
                  setLanguages(newArray);
                }}
              >
                <Image
                  source={language.name === "Vietnamese" 
                  ? require("../../../../assets/icons/vietnamese.png")
                  : require("../../../../assets/icons/english.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 25
                  }}
                />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      <ButtonSave
        title={"Next"}
        action={() => {setLoading(true); updateProfile()}}
        style={{
          marginTop: 0,
          backgroundColor: COLORS.STRONG_CYAN
        }}
      />
    </View>
  );
};

export default RegisterEnteringInformationScreen;