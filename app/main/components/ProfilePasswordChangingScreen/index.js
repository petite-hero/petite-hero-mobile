import React, { useContext, useRef, useState } from "react";
import { View, TouchableOpacity, Text, TextInput, AsyncStorage } from "react-native";
import { Icon } from "react-native-elements";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { COLORS, PORT } from "../../../const/const";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";
import { Loader } from "../../../utils/loader";
import styles from "./styles/index.css";

const Message = (props) => {
  return (
    <View style={{
      marginTop: -10,
      marginLeft: "10%",
      marginRight: "10%",
    }}>
      <Text style={{
        fontFamily: "Acumin",
        fontSize: 14,
        color: COLORS.RED
      }}>
        {props.message}
      </Text>
    </View>
  );
}

const PasswordField = (props) => {
  return (
    <View style={{
      flexDirection: "column",
      alignItems: "flex-start",
      marginTop: "2.5%",
      marginLeft: "10%",
      marginRight: "10%",
      marginBottom: "2.5%",
      borderBottomWidth: 2,
      borderColor: COLORS.GREY
    }}>
      <Text style={{
        fontFamily: "AcuminBold",
        fontSize: 16
      }}>
        {props.title}
      </Text>
      <View style={{
        flexDirection: "row"
      }}>
        <TextInput
          value={props.value}
          keyboardType="numeric"
          onChangeText={(text) => {props.setValue(text)}}
          style={{
            fontSize: 16,
            fontFamily: "Acumin",
            backgroundColor: COLORS.WHITE,
            width: "85%"
          }}
          secureTextEntry={props.secured}
        />
        <TouchableOpacity 
          style={{
            width: "20%",
            height: 35
          }}
          onPress={() => {props.setSecured(!props.secured)}}
        >
          <Icon
            name={props.secured ? "visibility-off" : "visibility"}
            type="material"
            color={COLORS.STRONG_GREY}
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center"
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const ProfilePasswordChangingScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [validCurrentPassword, setValidCurrentPassword] = useState(true);
  const [currentPasswordSecured, setCurrentPasswordSecured] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [validNewPassword, setValidNewPassword] = useState(true);
  const [newPasswordSecured, setNewPasswordSecured] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);
  const [confirmPasswordSecured, setConfirmPasswordSecured] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validate = () => {
    let isValid = true;
    if (!currentPassword) {setValidCurrentPassword(false); isValid = false}
    if (!newPassword) {setValidNewPassword(false); isValid = false}
    if (confirmPassword !== newPassword) {setConfirmPassword(false); isValid = false}
    return isValid;
  }

  const changePassword = async() => {
    if (!validate()) {
      setLoading(false);
      return null;
    }
    try {
      const ip = await AsyncStorage.getItem("IP");
      const id = await AsyncStorage.getItem("user_id");
      const response = await fetchWithTimeout("http://" + ip + PORT + "/account/" + id + "/password", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          password: newPassword,
          confirmPassword: confirmPassword
        })
      });
      const result = await response.json();
      console.log(result);
      if (result.code === 200 && result.msg === "OK") {
        props.route.params.goBack();
        props.navigation.goBack();
      } else if (result.code == 400 && result.msg === "Your old password is not match. Please check again") {
        setMessage("Current password is wrong. Please try again.")
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
            {t("profile-setting-password")}
          </Text>
        </View>
        {/* end title of the screen */}
        {/* create this View for center title purpose */}
        <View style={{marginRight: "10%"}}></View>
        {/* end View */}
      </View>
      {/* current password field */}
      <PasswordField title={t("profile-current-password")} value={currentPassword} setValue={setCurrentPassword} secured={currentPasswordSecured} setSecured={setCurrentPasswordSecured}/>
      { !validCurrentPassword && <Message message="Your Current Password cannot be empty."/> }
      {/* end current password */}
      {/* new password field */}
      <PasswordField title={t("profile-new-password")} value={newPassword} setValue={setNewPassword} secured={newPasswordSecured} setSecured={setNewPasswordSecured}/>
      { !validNewPassword && <Message message="Your New Password cannot be empty."/> }
      {/* end new password */}
      {/* confirm password field */}
      <PasswordField title={t("profile-confirm-password")} value={confirmPassword} setValue={setConfirmPassword} secured={confirmPasswordSecured} setSecured={setConfirmPasswordSecured}/>
      { !validConfirmPassword && <Message message="Confirm Password does not match with the new password."/> }
      { message.length > 0 && <Message message={message}/> }
      {/* end confirm password */}
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
        onPress={() => {setLoading(true); changePassword()}}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          {t("profile-setting-password-save")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePasswordChangingScreen;
