import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, AsyncStorage, Image} from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import styles from './styles/index.css';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { fetchWithTimeout } from '../../../utils/fetch';
import { handleError } from '../../../utils/handleError';
import { Loader } from '../../../utils/loader';

const QuestCreatingScreen = (props) => {
  const { t }                             = useContext(props.route.params.localizationContext);
  const [name, setName]                   = useState("");
  const [validName, setValidName]         = useState(true);
  const [details, setDetails]             = useState("");
  const [validDetail, setValidDetail]     = useState(true);
  const [loading, setLoading]             = useState(false);
  const [badge, setBadge]                 = useState("");
  const [title, setTitle]                 = useState("");
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
      data.append("reward", badge.id);
      data.append("title", title);
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
        <TouchableOpacity onPress={() => {props.navigation.goBack()}}>
          <Image
            source={require("../../../../assets/icons/back.png")}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
        {/* end icon back */}
        {/* title of the screen */}
        <Text style={{
          fontSize: 20,
          fontFamily: "AcuminBold"
        }}>
          {t("quest-add-title")}
        </Text>
        {/* end title of the screen */}
        {/* create this View for center title purpose */}
        <View style={{marginRight: "10%"}}></View>
        {/* end View */}
      </View>
      {/* form */}
      {/* quest name */}
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
          fontSize: 16
        }}>
          {t("quest-add-name")}
        </Text>
        <TextInput
          value={name}
          onChangeText={(text) => {setName(text); setValidName(true)}}
          style={{
            fontSize: 16,
            fontFamily: "Acumin",
            width: "100%",
            borderBottomWidth: 2,
            borderColor: COLORS.GREY
          }}
        />
        { !validName &&
          <Text style={{
            fontFamily: "Acumin",
            fontSize: 14,
            color: COLORS.RED
          }}>
            {t("quest-add-name-empty")}
          </Text>
        }
      </View>
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
          fontSize: 16
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
      <View style={{
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: 15,
        marginLeft: "10%",
        marginRight: "10%",
      }}>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16
        }}>
          {t("quest-add-details")}
        </Text>
        <TextInput
          value={details}
          onChangeText={(text) => {setDetails(text); setValidDetail(true)}}
          style={{
            fontSize: 16,
            fontFamily: "Acumin",
            width: "100%",
            borderBottomWidth: 2,
            borderColor: COLORS.GREY
          }}
        />
        { !validDetail &&
          <Text style={{
            fontFamily: "Acumin",
            fontSize: 14,
            color: COLORS.RED
          }}>
            {t("quest-add-details-empty")}
          </Text>
        }
      </View>
      {/* end quest details */}
      {/* quest title */}
      <View style={{
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: 15,
        marginLeft: "10%",
        marginRight: "10%",
      }}>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16
        }}>
          {t("quest-add-smartwatch-title")}
        </Text>
        <TextInput
          value={title}
          onChangeText={(text) => {setTitle(text); setValidTitle(true)}}
          style={{
            fontSize: 16,
            fontFamily: "Acumin",
            width: "100%",
            borderBottomWidth: 2,
            borderColor: COLORS.GREY
          }}
        />
        { !validTitle &&
          <Text style={{
            fontFamily: "Acumin",
            fontSize: 14,
            color: COLORS.RED
          }}>
            {t("quest-add-smartwatch-title-empty")}
          </Text>
        }
      </View>
      {/* end quest title */}
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
        onPress={() => {setLoading(true); createQuest()}}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          {t("quest-add-save")}
        </Text>
      </TouchableOpacity>
      {/* end button Save */}
      {/* end form */}
    </View>
  )
}

export default QuestCreatingScreen;