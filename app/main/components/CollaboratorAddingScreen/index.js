import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, TextInput, AsyncStorage, Switch, ScrollView, Image } from 'react-native';
import { COLORS, PORT } from "../../../const/const";
import styles from "./styles/index.css"
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Loader } from "../../../utils/loader";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";
import Header from "../../../base/components/Header";

const CollaboratorAddingScreen = (props) => {
  const { t }                       = useContext(props.route.params.localizationContext);
  const [name, setName]             = useState("");
  const [children, setChildren]     = useState([]);
  const [phone, setPhone]           = useState("");
  const [validPhone, setValidPhone] = useState(true);
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

  const addCollab = async() => {
    if (!validate()) {
      setLoading(false);
      return null;
    }
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const listChildId = [];
      children.filter(child => child.active === true).forEach(child => listChildId.push(child.childId));
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + id + "/collaborator", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collaboratorPhoneNumber: phone,
          isConfirm: false,
          listChildId: listChildId
        })
      });
      const result = await response.json();
      console.log(result);
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

  useEffect(() => {
    getChildrenList();
  }, [])

  return (
    <ScrollView style={styles.container}>
      <Loader loading={loading}/>
      <Header navigation={props.navigation} title={t("collaborator-add-title")}/>
      {/* form */}
      {/* collab  */}
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
          {t("collaborator-add-phone")}
        </Text>
        <TextInput
          value={phone}
          onChangeText={(text) => {setPhone(text); setValidPhone(true); setName(""); setMessage("")}}
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
          Collaborate on
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
        onPress={name.length <= 0 ? () => {setLoading(true); findCollab()} : () => {setLoading(true); addCollab()}}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          {name.length <= 0 ? t("collaborator-add-confirm") : "Add Collaborator"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}


export default CollaboratorAddingScreen;