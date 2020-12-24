import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Text, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, PORT } from '../../../const/const';
import styles from './styles/index.css';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { fetchWithTimeout } from '../../../utils/fetch';
import { showMessage } from '../../../utils/showMessage';
import { Loader } from '../../../utils/loader';
import InputField from '../../../base/components/InputField';
import ButtonSave from '../../../base/components/ButtonSave';
import Header from '../../../base/components/Header';

const QuestCreatingScreen = (props) => {
  const { t }                             = useContext(props.route.params.localizationContext);
  const [name, setName]                   = useState("");
  const [validName, setValidName]         = useState(true);
  const [details, setDetails]             = useState("");
  const [validDetail, setValidDetail]     = useState(true);
  const [loading, setLoading]             = useState(false);
  const [badge, setBadge]                 = useState("");
  const [title, setTitle]                 = useState("a");
  const [validTitle, setValidTitle]       = useState(true);

  const validate = () => {
    let isValidated = true;
    if (name.length === 0) {setValidName(false); isValidated = false;}
    if (details.length === 0) {setValidDetail(false); isValidated = false;}
    if (title.length === 0) {setValidTitle(false); isValidated = false;}
    return isValidated;
  }

  const createQuest = async() => {
    if (!validate()) {
      setLoading(false);
      return null;
    }
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem("user_id");
      const childId = await AsyncStorage.getItem('child_id');
      const data = new FormData();
      data.append("childId", childId);
      data.append("creatorPhoneNumber", id);
      data.append("description", details);  
      data.append("name", name);
      if (badge !== "") {
        data.append("reward", badge.id);
      }
      data.append("title", title);
      // data.append("title", "a");
      const response = await fetchWithTimeout("http://" + ip + PORT + "/child/quest", {
        method: "POST",
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        body: data
      });
      const result = await response.json();
      if (result.code === 200) {
        props.route.params.onGoBack();
        props.navigation.goBack();
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
      <Header navigation={props.navigation} title={t("quest-add-title")}/>
      {/* form */}
      {/* quest name */}
      <InputField title={t("quest-add-name")} value={name} setValue={setName} valid={validName} setValid={setValidName} invalidMessage={t("quest-add-name-empty")} maxLength={50}/>
      {/* end quest name */}
      {/* choose reward */}
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
          {t("quest-add-choose-reward")}
        </Text>
        <View style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          {
          badge ?
            <View style={{
              width: widthPercentageToDP("16%"),
              height: widthPercentageToDP("16%"),
              borderRadius: widthPercentageToDP("8%"),
              marginTop: 15,
              backgroundColor: COLORS.LIGHT_CYAN,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden"
            }}>
              <Image
                source={badge.image}
                style={{
                  width: "90%",
                  height: "90%"
                }}
              />
            </View>
          :
            <Text style={{
              fontFamily: "AcuminBold",
              fontSize: 14,
              color: COLORS.STRONG_GREY
            }}>
              {t("quest-add-no-reward")}
            </Text>
          }
          <TouchableOpacity
            onPress={() => {props.navigation.navigate("QuestChoosingBadge", {badge: badge, onGoBack: (badge) => {setBadge(badge)}})}}
            style={{ marginRight: -10 }}
          >
            <Image
              source={require("../../../../assets/icons/forth.png")}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* end choose reward */}
      {/* quest details */}
      <InputField title={t("quest-add-details")} value={details} setValue={setDetails} valid={validDetail} setValid={setValidDetail} invalidMessage={t("quest-add-details-empty")} maxLength={255} multiline={true}/>
      {/* end quest details */}
      {/* quest title */}
      {/* <InputField title={t("quest-add-smartwatch-title")} value={title} setValue={setTitle} valid={validTitle} setValid={setValidTitle} invalidMessage={t("quest-add-smartwatch-title-empty")} maxLength={50}/> */}
      {/* end quest title */}
      {/* button Save */}
      <ButtonSave title={t("quest-add-save")} action={() => {setLoading(true); createQuest()}} style={{marginBottom: 50}}/>
      {/* end button Save */}
      {/* end form */}
    </View>
  )
}

export default QuestCreatingScreen;