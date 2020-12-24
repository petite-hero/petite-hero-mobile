import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import { Loader } from "../../../utils/loader";
import { fetchWithTimeout } from "../../../utils/fetch";
import { showMessage } from "../../../utils/showMessage";
import Header from "../../../base/components/Header";
import InputField from "../../../base/components/InputField";
import ButtonSave from "../../../base/components/ButtonSave";
import { ConfirmationModal } from "../../../utils/modal";

const CollaboratorDetailsScreen = (props) => {
  const { t }                       = useContext(props.route.params.localizationContext);
  const [children, setChildren]     = useState([]);
  const [name, setName]             = useState("");
  const [phone, setPhone]           = useState("");
  const [avatar, setAvatar]         = useState("");
  const [message, setMessage]       = useState("");
  const [loading, setLoading]       = useState(true);
  const [deleteAction, setDeleteAction] = useState(false);

  const getCollboratingChildren = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + id + "?collaboratorPhone=" + props.route.params.collabId);
      const result = await response.json();
      if (result.code === 200) {
        const tmp = result.data.childInformationList.map((child, index) => {
          return {...child, active: false};
        })
        setChildren(tmp);
      }
    } catch (error) {
      showMessage(error.message);
    }
  }

  const getCollboratorInfo = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/account/" + props.route.params.collabId);
      const result = await response.json();
      if (result.code === 200) {
        setName(result.data.name);
        setPhone(result.data.phoneNumber);
        setAvatar(result.data.avatar);
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const getDeletedChild = () => {
    return children.filter((child) => (child.active === true));
  }

  const deleteCollaborator = async() => {
    try {
      let deletedChild = getDeletedChild();
      if (deletedChild.length === 0) {
        setLoading(false);
        setMessage(t("collaborator-details-delete-invalid"));
        return null;
      }
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const listChildId = [];
      deletedChild.forEach(child => listChildId.push(child.childId));
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + id + "/collaborator", {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collaboratorPhoneNumber: phone,
          isConfirm: true,
          listChildId: listChildId
        })
      });
      const result = await response.json();
      if (result.code === 200) {
        showMessage(t("collaborator-details-delete-success"));
        props.route.params.goBack();
        props.navigation.goBack()
      }
    } catch (error) {
      console.log(error);
      showMessage(t("common-error"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCollboratingChildren();
    getCollboratorInfo();
  }, [])

  return (
    loading ? <Loader loading={true}/> :
    <ScrollView style={styles.container}>
      <ConfirmationModal t={t} message={t("collaborator-details-delete-message")} visible={deleteAction} onConfirm={() => {setLoading(true); setDeleteAction(false); deleteCollaborator()}} onClose={() => {setDeleteAction(false)}}/>
      <Header navigation={props.navigation} title={name}/>
      <View style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: -20,
        marginBottom: "10%"
      }}>
        <TouchableOpacity
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.MEDIUM_GREY
          }}
          activeOpacity={0.8}
        >
          <Image
            source={avatar ? {uri: "data:image/png;base64," + avatar} : require("../../../../assets/avatar-parent.png")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 60
            }}
          />
        </TouchableOpacity>
      </View>
      {/* form */}
      {/* collab phone */}
      <InputField title={t("collaborator-details-phone")} value={phone} editable={false}/>
      {/* end collab phone */}
      {/* collab name */}
      <InputField title={t("collaborator-details-name")} value={name} editable={false}/>
      {/* end collab name */}
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
          {t("collaborator-details-children")}
        </Text>
        <View style={{
          flexDirection: "row"
        }}>
          {children.map((child, index) => {
            return (
              <TouchableOpacity key={index} style={{
                width: 50,
                height: 50,
                padding: 3,
                marginTop: 5,
                marginRight: 10,
                borderRadius: 25,
                borderWidth: 2,
                borderColor: child.active ? COLORS.STRONG_CYAN : COLORS.WHITE,
              }}
                onPressOut={() => {
                  const newArray = [...children];
                  const index = newArray.indexOf(child);
                  newArray[index].active = !newArray[index].active;
                  setChildren(newArray);
                  setMessage("");
                }}
              >
                {child.photo ?
                  <Image
                    source={{uri: "data:image/png;base64," + child.photo}}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 25
                    }}
                  />
                :
                  <Image
                    source={child.gender === "Male" ? require("../../../../assets/avatar-son.png") : require("../../../../assets/avatar-daughter.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 25
                    }}
                  />
                }
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      { message.length > 0 &&
        <View style={{
          marginLeft: "10%",
          marginRight: "10%"
        }}>
          <Text style={{
            fontFamily: "Acumin",
            fontSize: 14,
            color: COLORS.RED
          }}>
            {message}
          </Text>
        </View>
      }
      {/* button Confirm */}
      <ButtonSave
        title={t("collaborator-details-delete")}
        action={() => {setDeleteAction(true)}}
        style={{
          marginBottom: 50, 
          backgroundColor: COLORS.WHITE,
          borderWidth: 1,
          borderColor: COLORS.RED
        }}
        textStyle={{
          color: COLORS.RED
        }}
      />
      {/* end button Confirm */}
    </ScrollView>
  )
}


export default CollaboratorDetailsScreen;