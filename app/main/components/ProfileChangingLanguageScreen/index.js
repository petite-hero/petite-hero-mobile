import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Text, AsyncStorage, Image } from "react-native";
import { Icon } from "react-native-elements";
import { RadioButton } from "react-native-paper";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { COLORS, PORT } from "../../../const/const";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";
import { Loader } from "../../../utils/loader";
import { ConfirmationModal } from "../../../utils/modal";
import styles from "./styles/index.css";

const ProfileChangingLanguageScreen = (props) => {
  const { t, locale, setLocale } = useContext(props.route.params.localizationContext);
  const { signOut } = useContext(props.route.params.authContext);
  const [language, setLanguage] = useState(props.route.params.language);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const hideModal = () => {
    setShowModal(false);
    setLoading(true);
  }

  const changeLanguage = async(language) => {
    try {
      const ip = await AsyncStorage.getItem("IP");
      const id = await AsyncStorage.getItem("user_id");
      const data = new FormData();
      data.append("language", language)
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + id, {
        method: "PUT",
        body: data
      });
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        await AsyncStorage.removeItem("child_id");
        await AsyncStorage.removeItem("user_id");
        setLocale(result.data.language);
        signOut();
      } else {
        handleError(result.msg);
      }
    } catch (error) {
      handleError(error.message);
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
            {t("profile-personal-profile-language")}
          </Text>
        </View>
        {/* end title of the screen */}
        {/* create this View for center title purpose */}
        <View style={{marginRight: "10%"}}></View>
        {/* end View */}
      </View>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <TouchableOpacity style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
          activeOpacity={1}
          onPress={() => {setLanguage("vi")}}
        >
          <Image
            source={require("../../../../assets/icons/vietnamese.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50
            }}
          />
          <RadioButton
            value="vi"
            status={ language === 'vi' ? 'checked' : 'unchecked' }
            onPress={() => {setLanguage("vi")}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
          activeOpacity={1}
          onPress={() => {setLanguage("en")}}
        >
          <Image
            source={require("../../../../assets/icons/english.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50
            }}
          />
          <RadioButton
            value="en"
            status={ language === 'en' ? 'checked' : 'unchecked' }
            onPress={() => {setLanguage("en")}}
          />
        </TouchableOpacity>
      </View>
      {/* button Save */}
      <TouchableOpacity style={{
        marginLeft: "10%",
        marginRight: "10%",
        marginTop: "10%",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        height: heightPercentageToDP("5%"),
        backgroundColor: language === locale ? COLORS.LIGHT_GREY : COLORS.YELLOW
      }}
        onPress={() => {setShowModal(true);}}
        disabled={language === locale}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          {t("profile-personal-profile-save")}
        </Text>
      </TouchableOpacity>
      <ConfirmationModal
        visible={showModal} 
        message={t("profile-setting-language-info")}
        option="info"
        onConfirm={async() => {
          hideModal();
          changeLanguage(language === "en" ? "english" : "vietnamese");
        }}
      />
    </View>
  );
};

export default ProfileChangingLanguageScreen;
