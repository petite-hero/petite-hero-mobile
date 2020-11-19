import React, { useContext, useRef, useState } from "react";
import NumberFormat from "react-number-format";
import { View, Text, Image, AsyncStorage } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { COLORS, PORT } from "../../../const/const";
import Animated, { Easing } from "react-native-reanimated";
import styles from "./styles/index.css";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";
import AvatarContainer from "../AvatarContainer";
import { Loader } from "../../../utils/loader";

const SettingItem = ({ title, icon, iconColor, action, subItems, style, isLastItemOfGroup, differentArrow }) => {
  const [isDropdown, setDropdown] = useState(false);
  const animDropdown = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;

  const dropdownSubItems = (numOfSubItems) => {
    setDropdown(!isDropdown);
    if (!isDropdown) {
      Animated.timing(animDropdown, {
        toValue: numOfSubItems * hp("10%"),
        duration: 400,
        easing: Easing.ease,
      }).start();
      Animated.timing(animOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.ease,
      }).start();
    } else {
      Animated.timing(animDropdown, {
        toValue: 0,
        duration: 400,
        easing: Easing.ease,
      }).start();
      Animated.timing(animOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
      }).start();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[{
          ...style,
          flexDirection: "row",
          paddingTop: hp("1%"),
          paddingBottom: hp("1%"),
          borderRadius: hp("4%"),
          backgroundColor: COLORS.LIGHT_GREY_2,
          alignItems: "center"
        }, 
        isLastItemOfGroup ? 
          isDropdown ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0} : {}
        : {}]}
        onPress={() => {
          action ? action() : dropdownSubItems(subItems.length);
        }}
      >
        <Icon
          name={icon}
          type="material"
          color={iconColor}
          style={{
            width: hp("5%"),
            height: hp("5%"),
            marginLeft: wp("1%"),
            marginRight: wp("1%"),
            justifyContent: "center",
          }}
        />
        <View style={styles.settingItem}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Acumin",
              color: COLORS.BLACK ,
            }}
          >
            {title}
          </Text>
          {subItems && (
            <Icon
              name={isDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              type="material"
              color={COLORS.STRONG_GREY}
            />
          )}
          {differentArrow && (
            <Icon
              name={differentArrow.name}
              type="material"
              color={COLORS.STRONG_GREY}
            />
          )}
        </View>
      </TouchableOpacity>
      {subItems && (
        <Animated.View
          style={{
            paddingLeft: "10%",
            height: animDropdown,
            opacity: animOpacity
          }}
        >
          {subItems.map((value, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.settingItem,
                  {
                    width: "100%",
                    height: hp("10%"),
                  },
                ]}
                onPress={value.action}
              >
                {value.text ? (
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Acumin",
                        color: COLORS.MEDIUM_GREY
                      }}
                    >
                      {value.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "AcuminBold",
                        color: COLORS.STRONG_GREY,
                      }}
                    >
                      {value.text}
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Acumin",
                      color: COLORS.MEDIUM_GREY
                    }}
                  >
                    {value.title}
                  </Text>
                )}
                {value.iconName &&
                  <Icon
                    name={value.iconName}
                    type="material"
                    color={COLORS.GREY}
                    style={{
                      marginRight: wp("4%"),
                      justifyContent: "center"
                    }}
                  />
                }
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}
    </>
  );
};

const ProfileScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const { signOut } = React.useContext(props.route.params.authContext);
  const [loading, setLoading] = useState(false);
  const [parentProfile, setParentProfile] = React.useState("");
  const [listSubscriptionType, setListSubscriptionType] = React.useState("");
  const [listChildren, setListChildren] = React.useState("");
  const [listCollaborator, setListCollaborator] = React.useState("");

  const getListChildren = async () => {
    try {
      const ip = await AsyncStorage.getItem("IP");
      const username = await AsyncStorage.getItem("user_id");
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + username + "/children");
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        setListChildren(
          result.data.map((childData, index) => {
            return {
              title: "Child " + (index + 1),
              text: childData.name,
              action: () =>
                props.navigation.navigate("ChildDetails", {
                  screenName: childData.name,
                  childId: childData.childId,
                }),
              iconName: "keyboard-arrow-right"
            };
          })
        );
      } else {
        handleError(error.msg);
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  const getCollaboratorList = async () => {
    try {
      const ip = await AsyncStorage.getItem("IP");
      const username = await AsyncStorage.getItem("user_id");
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + username + "/collaborator");
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        setListCollaborator(
          result.data.map((collaborator, index) => {
            return {
              title: "Collaborator " + (index + 1),
              text: collaborator.name
            };
          })
        );
      } else {
        handleError(error.msg);
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  const getProfileDetail = async () => {
    try {
      const ip = await AsyncStorage.getItem("IP");
      const username = await AsyncStorage.getItem("user_id");
      const response = await fetchWithTimeout("http://" + ip + PORT + "/account/" + username);
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
        setParentProfile(result.data);
      } else {
        handleError(error.msg);
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getListChildren();
    getProfileDetail();
    getCollaboratorList();
  }, [loading]);

  return (
    <View style={styles.container}>
      <Loader loading={loading}/>
      <View style={styles.header}>
        <View style={{marginTop: hp("5%")}}>
          <Text style={styles.name}>
            {parentProfile.name}
          </Text>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start"
          }}>
            <View style={{
              width: wp("10%"),
              height: wp("10%"),
              borderRadius: wp("5%"),
              backgroundColor: COLORS.STRONG_CYAN,
              elevation: 10
            }}/>
            <View style={{
              height: hp("3.5%"),
              marginLeft: -wp("5%"),
              paddingLeft: "10%",
              paddingRight: "5%",
              backgroundColor: COLORS.STRONG_CYAN,
              borderTopRightRadius: hp("1.75%"),
              borderBottomRightRadius: hp("1.75%"),
              justifyContent: "center"
            }}>
              <Text style={{
                fontFamily: "AcuminBold",
                alignSelf: "center",
                color: COLORS.WHITE,
              }}>
                {parentProfile.subscriptionType}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView style={{
        marginTop: "15%",
        marginBottom: "20%"
      }}>
        <View style={{
          marginBottom: "3%", 
          backgroundColor: COLORS.LIGHT_GREY_3,
          borderRadius: hp("4%"),
          marginLeft: "10%",
          marginRight: "10%"
        }}>
          <SettingItem
            key="1"
            title="Personal Profile"
            icon="face"
            iconColor={COLORS.STRONG_CYAN}
            subItems={[
              {
                title: "Your Name",
                text: parentProfile.name ? parentProfile.name : "Add name to your profile"
              },
              {
                title: "Phone Number",
                text: parentProfile.phoneNumber
              },
              {
                title: "Email",
                text: parentProfile.email ? parentProfile.email : "Add email to your profile",
                action: () =>
                  props.navigation.navigate("ProfileChanging", {
                    screenName: "Email",
                    value: {email: parentProfile.email},
                    goBack: () => setLoading(true)
                }),
                iconName: "keyboard-arrow-right"
              },
            ]}
          />
        </View>
        <View style={{
          marginBottom: "3%", 
          backgroundColor: COLORS.LIGHT_GREY_3,
          borderRadius: hp("4%"),
          marginLeft: "10%",
          marginRight: "10%"
        }}>
          <SettingItem
            key="2"
            title="Collaborators"
            icon="group-add"
            iconColor={COLORS.YELLOW}
            subItems={[
              ...listCollaborator,
              {
                title: "Add collaborator",
                action: () => {
                  props.navigation.navigate("CollaboratorAdding")
                },
                iconName: "add"
              },
            ]}
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }}
          />
          <SettingItem
            key="3"
            title="Children"
            icon="child-care"
            iconColor={COLORS.YELLOW}
            subItems={[
              ...listChildren,
              {
                title: "Add child",
                action: () => {
                  props.navigation.navigate("ChildAdding", {
                    goBack: () => setLoading(true)
                  })
                },
                iconName: "add"
              },
            ]}
            style={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0
            }}
            isLastItemOfGroup={true}
          />
        </View>
        <View style={{
          marginBottom: "3%", 
          backgroundColor: COLORS.LIGHT_GREY_3,
          borderRadius: hp("4%"),
          marginLeft: "10%",
          marginRight: "10%"
        }}>
          <SettingItem
            key="4"
            title="Subscription"
            icon="payment"
            iconColor={COLORS.GREEN}
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }}
            differentArrow={{name: "keyboard-arrow-right"}}
            action={() => {

            }}
          />
          <SettingItem
            key="5"
            title="Setting"
            icon="settings"
            iconColor={COLORS.STRONG_GREY}
            subItems={[
              {
                title: "Change Password",
                action: () =>
                  props.navigation.navigate("ProfilePasswordChanging", {
                    screenName: "Change Password",
                    goBack: () => setLoading(true)
                }),
                iconName: "keyboard-arrow-right"
              },
            ]}
            style={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0
            }}
            isLastItemOfGroup={true}
          />
        </View>
        <View style={{
          marginBottom: "3%", 
          backgroundColor: COLORS.LIGHT_GREY_3,
          borderRadius: hp("4%"),
          marginLeft: "10%",
          marginRight: "10%"
        }}>
          <SettingItem
            key="6"
            title="Logout"
            icon="exit-to-app"
            iconColor={COLORS.RED}
            action={() => {
              (async() => {
                await AsyncStorage.removeItem("child_id");
                await AsyncStorage.removeItem("user_id");
                signOut();
              })()
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
