import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Text, AsyncStorage, Image } from "react-native";
import { Icon } from "react-native-elements";
import { RadioButton } from "react-native-paper";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Header from "../../../base/components/Header";
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
      {/* header */}
      <Header navigation={props.navigation} title={t("profile-personal-profile-language")}/>
      {/* end header */}
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
          onPress={() => {setLanguage("en-US")}}
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
            status={ language === 'en-US' ? 'checked' : 'unchecked' }
            onPress={() => {setLanguage("en-US")}}
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
          changeLanguage(language === "en-US" ? "english" : "vietnamese");
        }}
        onClose={() => {}}
      />
    </View>
  );
};

export default ProfileChangingLanguageScreen;
