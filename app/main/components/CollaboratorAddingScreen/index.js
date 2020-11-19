import React, { useState } from "react";
import { View, TouchableOpacity, Text, TextInput, AsyncStorage, Switch, ScrollView, Image } from 'react-native';
import { COLORS, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { Loader } from "../../../utils/loader";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";

const CollaboratorAddingScreen = (props) => {
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);

  // const addCollab = async() => {
  //   try {
  //     const ip = await AsyncStorage.getItem('IP');
  //     const id = await AsyncStorage.getItem('user_id');
  //     const gender = genders.find(gender => gender.active).title;
  //     const data = new FormData();
  //     data.append("name", name);
  //     data.append("nickName", nickName);
  //     data.append("language", language);
  //     data.append("gender", gender);
  //     data.append("childAvatar", photo);
  //     data.append("yob", yob);
  //     const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + id + "/children", {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'multipart/form-data;'
  //       },
  //       body: data
  //     });
  //     const result = await response.json();
  //     if (result.code === 200 && result.msg === "OK") {
  //       const childId = result.data.childId.toString();
  //       props.navigation.navigate("ChildAddingShowingQr", {qr: childId});
  //       // props.navigation.navigate("ChildAddingShowingQr", {qr: "Hello"});
  //     } else {
  //       handleError(result.msg);
  //     }
  //   } catch (error) {
  //     handleError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

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
            Add New Collaborator
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
          Collaborator's Phone Number
        </Text>
        <TextInput
          value={phone}
          onChangeText={(text) => {setPhone(text)}}
          style={{
            fontSize: 16,
            fontFamily: "Acumin",
            backgroundColor: COLORS.WHITE,
            borderBottomWidth: 2,
            borderColor: COLORS.GREY,
            width: "100%",
          }}
        />
      </View>
      {/* end collab phone */}
      {/* collab name */}
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
          Collaborator's Name
        </Text>
        <TextInput
          value={name}
          onChangeText={(text) => {setName(text)}}
          style={{
            fontSize: 16,
            fontFamily: "Acumin",
            backgroundColor: COLORS.WHITE,
            borderBottomWidth: 2,
            borderColor: COLORS.GREY,
            width: "100%",
          }}
        />
      </View>
      {/* end collab name */}
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
        // onPress={() => {setLoading(true); addCollab()}}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          Next
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}


export default CollaboratorAddingScreen;