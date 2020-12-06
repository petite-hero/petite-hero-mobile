import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, AsyncStorage, ScrollView, Image } from 'react-native';
import { COLORS, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import { Loader } from "../../../utils/loader";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";
import Header from "../../../base/components/Header";
import InputField from "../../../base/components/InputField";
import ButtonSave from "../../../base/components/ButtonSave";

const CollaboratorDetailsScreen = (props) => {
  const { t }                       = useContext(props.route.params.localizationContext);
  const [name, setName]             = useState("");
  const [children, setChildren]     = useState([]);
  const [phone, setPhone]           = useState("");
  const [message, setMessage]       = useState("");
  const [loading, setLoading]       = useState(false);

  const validate = () => {
    let isValidated = true;
    if (phone.length === 0) {setValidPhone(false); isValidated = false};
    return isValidated;
  }

  const getChildrenList = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + id + "/children");
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        const tmp = result.data.filter(child => child.isCollaboratorChild === false).map((child, index) => {
          return {...child, active: false}
        });
        setChildren(tmp);
      } else {
        handleError(result.msg);
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const findCollab = async() => {
    if (!validate()) {
      setLoading(false);
      return null;
    }
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + phone);
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        setName(result.data)
      } else {
        setMessage("Cannot found any account using the inputted phone number in the system.")
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getChildrenList();
  }, [])

  return (
    <ScrollView style={styles.container}>
      <Loader loading={loading}/>
      <Header navigation={props.navigation} title={t("collaborator-add-title")}/>
      {/* form */}
      {/* collab phone */}
      <InputField title={t("collaborator-add-phone")} value={phone} setValue={setPhone} valid={validPhone} setValid={setValidPhone} keyboardType="numeric" invalidMessage={t("collaborator-add-phone-empty")} maxLength={11} actionsOnTyping={() => {setName(""); setMessage("")}}/>
      <View style={{
        marginLeft: "10%",
        marginRight: "10%"
      }}>
        { message.length > 0 &&
          <Text style={{
            fontFamily: "Acumin",
            fontSize: 14,
            color: COLORS.RED
          }}>
            {message}
          </Text>
        }
      </View>
      {/* end collab phone */}
      {/* collab name */}
      { name.length > 0 &&
      <>
      <InputField title={t("collaborator-add-name")} value={name} editable={false} />
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
          {t("collaborator-add-choose-child")}
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
                }}
              >
                <Image
                  source={{uri: "data:image/png;base64," + child.photo}}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 25
                  }}
                />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      </>
      }
      {/* end collab name */}
      {/* button Confirm */}
      <ButtonSave 
        title={name.length <= 0 ? t("collaborator-add-confirm") : t("collaborator-add-button-text")}
        action={name.length <= 0 ? () => {setLoading(true); findCollab()} : () => {setLoading(true); addCollab()}}
        style={{marginBottom: 50}}
      />
      {/* end button Confirm */}
    </ScrollView>
  )
}


export default CollaboratorDetailsScreen;