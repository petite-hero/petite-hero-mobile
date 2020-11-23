import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Text, TextInput, AsyncStorage, Switch, ScrollView, Image } from 'react-native';
import { COLORS, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { Loader } from "../../../utils/loader";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";

const CollaboratorAddingScreen = (props) => {
  const { t }                       = useContext(props.route.params.localizationContext);
  const [name, setName]             = useState("");
  const [phone, setPhone]           = useState("");
  const [validPhone, setValidPhone] = useState(true);
  const [loading, setLoading]       = useState(false);

  const validate = () => {
    let isValidated = true;
    if (phone.length === 0) {setValidPhone(false); isValidated = false};
    return isValidated;
  }

  const findCollab = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + phone);
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        setName(result.data)
      } else {
        handleError(result.msg);
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const addCollab = async() => {
    if (!validate()) {
      setLoading(false);
      return null;
    }
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
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
    <ScrollView style={styles.container}>
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
            {t("collaborator-add-title")}
          </Text>
        </View>
        {/* end title of the screen */}
        {/* create this View for center title purpose */}
        <View style={{marginRight: "10%"}}></View>
        {/* end View */}
      </View>
      {/* form */}
      {/* collab  */}
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
          {t("collaborator-add-phone")}
        </Text>
        <TextInput
          value={phone}
          onChangeText={(text) => {setPhone(text)}}
          keyboardType="numeric"
          style={{
            fontSize: 16,
            fontFamily: "Acumin",
            backgroundColor: COLORS.WHITE,
            borderBottomWidth: 2,
            borderColor: COLORS.GREY,
            width: "100%",
          }}
        />
        { !validPhone &&
          <Text style={{
            fontFamily: "Acumin",
            fontSize: 14,
            color: COLORS.RED
          }}>
            {t("collaborator-add-phone-empty")}
          </Text>
        }
      </View>
      {/* end collab phone */}
      {/* collab name */}
      { name.length > 0 &&
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
          {t("collaborator-add-name")}
        </Text>
        <Text style={{
          fontSize: 16,
          fontFamily: "Acumin",
          backgroundColor: COLORS.WHITE,
          borderBottomWidth: 2,
          borderColor: COLORS.GREY,
          width: "100%",
        }}>
          {name}
        </Text>
      </View>
      }
      {/* end collab name */}
      {/* button Confirm */}
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
        onPress={() => {setLoading(true); findCollab()}}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          {t("collaborator-add-confirm")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}


export default CollaboratorAddingScreen;