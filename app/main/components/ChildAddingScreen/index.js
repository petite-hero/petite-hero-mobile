import React, { useContext, useState } from "react";
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import { Loader } from "../../../utils/loader";
import { fetchWithTimeout } from "../../../utils/fetch";
import { showMessage } from "../../../utils/showMessage";
import Header from "../../../base/components/Header";
import InputField from "../../../base/components/InputField";
import ButtonSave from "../../../base/components/ButtonSave";
import GenderPickerComponent from "./GenderPickerComponent";
import ImagePickerComponent from "./ImagePickerComponent";
import { ConfirmationModal } from "../../../utils/modal";

const ChildAddingScreen = (props) => {
  const { t }                     = useContext(props.route.params.localizationContext);
  const [name, setName]           = useState("");
  const [validName, setValidName] = useState(true);
  const [nickName, setNickName]   = useState("");
  const [language, setLanguage]   = useState("English");
  const [photo, setPhoto]         = useState("");
  const [yob, setYob]             = useState("");
  const [validYob, setValidYob]   = useState(true);
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState("");
  const [genders, setGenders] = useState([
    {title: "Boy", active: true, name: "male", color: COLORS.STRONG_CYAN},
    {title: "Girl", active: false, name: "female", color: COLORS.STRONG_CYAN}
  ]);

  const validate = () => {
    let isValidated = true;
    if (name.length === 0) {setValidName(false); isValidated = false;}
    if (yob.length === 0 || !parseInt(yob)) {setValidYob(false); isValidated = false;}
    return isValidated;
  }

  const createQrCode = async() => {
    if (!validate()) {
      setLoading(false);
      return null;
    }
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const gender = genders.find(gender => gender.active).name;
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
        await AsyncStorage.setItem("child_id", childId);
        props.route.params.goBack();
        props.navigation.navigate("ChildAddingShowingQr", {qr: childId});
      } else {
        if (result.msg?.includes("4-11")) {
          setMessage(t("profile-children-add-invalid-age"));
        } else {
          showMessage(result.msg);
        }
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      {message.length !== 0 && <ConfirmationModal t={t} visible={message.length !== 0} message={message} option={"info"} onConfirm={() => setMessage("")}/>}
      <Loader loading={loading}/>
      {/* header */}
      <Header navigation={props.navigation} title={t("child-add-title")}/>
      {/* end header */}
      {/* form */}
      {/* child image */}
      <ImagePickerComponent photo={photo} setPhoto={setPhoto}/>
      {/* end child image */}
      {/* child name */}
      <InputField title={t("child-add-name")} value={name} setValue={setName} valid={validName} setValid={setValidName} invalidMessage={t("child-add-name-empty")}/>
      {/* end child name */}
      {/* child nick name */}
      <InputField title={t("child-add-nickname")} value={nickName} setValue={setNickName}/>
      {/* end child nick name */}
      {/* child year of birth */}
      <InputField title={t("child-add-yob")} value={yob} setValue={setYob} valid={validYob} setValid={setValidYob} invalidMessage={t("child-add-yob-empty")} keyboardType="numeric"/>
      {/* end child year of birth */}
      {/* child gender */}
      <GenderPickerComponent t={t} genders={genders} setGenders={setGenders}/>
      {/* end child gender */}
      {/* button Save */}
      <ButtonSave title={t("child-add-next")} action={() => {setLoading(true); createQrCode()}}/>
    </ScrollView>
  )
}


export default ChildAddingScreen;