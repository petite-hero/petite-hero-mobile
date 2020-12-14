import React, { useContext, useRef, useState } from "react";
import { View, TouchableOpacity, Text, TextInput, Image } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { heightPercentageToDP } from "react-native-responsive-screen";
import Header from "../../../base/components/Header";
import { COLORS, PORT } from "../../../const/const";
import { fetchWithTimeout } from "../../../utils/fetch";
import { showMessage } from "../../../utils/showMessage";
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
          onChangeText={(text) => {props.setValue(text); [...props.action()]}}
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
            width: "17.5%",
            height: 40,
            alignItems: "flex-end",
            justifyContent: "center"
          }}
          onPress={() => {props.setSecured(!props.secured)}}
        >
          {props.secured ? 
          <Image
            source={require("../../../../assets/icons/eye-on.png")}
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
            }}
          />
          :
          <Image
            source={require("../../../../assets/icons/eye-off.png")}
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
            }}
          />
          }
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
    if (confirmPassword !== newPassword) {setValidConfirmPassword(false); isValid = false}
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
        showMessage("Password changed successfully.")
      } else if (result.code == 400 && result.msg === "Your old password is not match. Please check again") {
        setMessage("Current password is wrong. Please try again.")
      } else {  
        showMessage(result.msg);
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
      {/* header */}
      <Header navigation={props.navigation} title={t("profile-setting-password")}/>
      {/* end header */}
      {/* current password field */}
      <PasswordField title={t("profile-current-password")} value={currentPassword} setValue={setCurrentPassword} secured={currentPasswordSecured} setSecured={setCurrentPasswordSecured} action={() => [setMessage(""), setValidCurrentPassword(true)]}/>
      { !validCurrentPassword && <Message message="Your Current Password cannot be empty."/> }
      {/* end current password */}
      {/* new password field */}
      <PasswordField title={t("profile-new-password")} value={newPassword} setValue={setNewPassword} secured={newPasswordSecured} setSecured={setNewPasswordSecured} action={() => [setMessage(""), setValidNewPassword(true)]}/>
      { !validNewPassword && <Message message="Your New Password cannot be empty."/> }
      {/* end new password */}
      {/* confirm password field */}
      <PasswordField title={t("profile-confirm-password")} value={confirmPassword} setValue={setConfirmPassword} secured={confirmPasswordSecured} setSecured={setConfirmPasswordSecured} action={() => [setMessage(""), setValidConfirmPassword(true)]}/>
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
