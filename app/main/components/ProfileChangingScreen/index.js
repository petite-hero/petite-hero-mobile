import React, { useContext, useRef, useState } from "react";
import { View, TouchableOpacity, Text, TextInput, AsyncStorage } from "react-native";
import { Icon } from "react-native-elements";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Header from "../../../base/components/Header";
import { COLORS, PORT } from "../../../const/const";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";
import { Loader } from "../../../utils/loader";
import styles from "./styles/index.css";

const ProfileChangingScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [value, setValue] = useState(props.route.params.value);
  const [validValue, setValidValue] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (type) => {
    let isValidated = true;
    if (type === "email") {
      if (value[Object.keys(value)[0]].length === 0) {
        setValidValue(false);
        setMessage(t("profile-personal-profile-email-empty"));
        isValidated = false;
      } else {
        const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!value[Object.keys(value)[0]].match(mailformat)) {
          setValidValue(false);
          setMessage(t("profile-personal-profile-email-invalid"));
          isValidated = false;
        }
      }
    }
    return isValidated;
  }

  const changeValue = (newValue) => {
    const key = Object.keys(value)[0];
    const tmp = {...value};
    tmp[key] = newValue;
    setValue(tmp);
  }

  const changeProfile = async() => {
    if (!validate("email")) {
      setLoading(false);
      return null;
    }
    try {
      const ip = await AsyncStorage.getItem("IP");
      const id = await AsyncStorage.getItem("user_id");
      const data = new FormData();
      Object.keys(value).map((key, index) => {
        data.append(key, value[key]);
      });
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + id, {
        method: "PUT",
        body: data
      });
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        props.route.params.goBack();
        props.navigation.goBack();
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
    <View style={styles.container}>
      <Loader loading={loading}/>
      {/* header */}
      <Header navigation={props.navigation} title={t("profile-personal-profile-change") + " " + props.route.params.screenName}/>
      {/* end header */}
      {/* changed field */}
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
          {props.route.params.screenName}
        </Text>
        <TextInput
          value={value[Object.keys(value)[0]]}
          onChangeText={(text) => {changeValue(text); setValidValue(true)}}
          style={{
            fontSize: 16,
            fontFamily: "Acumin",
            backgroundColor: COLORS.WHITE,
            borderBottomWidth: 2,
            borderColor: COLORS.GREY,
            width: "100%",
          }}
        />
        { !validValue &&
          <Text style={{
            fontFamily: "Acumin",
            fontSize: 14,
            color: COLORS.RED
          }}>
            {message}
          </Text>
        }
      </View>
      {/* end changed field */}
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
        onPress={() => {setLoading(true); changeProfile()}}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          {t("profile-personal-profile-save")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileChangingScreen;
