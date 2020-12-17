import React, { useContext, useRef, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { COLORS, PORT } from "../../../const/const";
import Animated, { Easing } from "react-native-reanimated";
import styles from "./styles/index.css";
import { fetchWithTimeout } from "../../../utils/fetch";
import { showMessage } from "../../../utils/showMessage";
import { Loader } from "../../../utils/loader";

const SettingItem = ({ title, image, action, subItems, style, isLastItemOfGroup, iconName }) => {
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
        <Image
          source={image}
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
            <Image
              source={isDropdown ? require("../../../../assets/icons/up.png") : require("../../../../assets/icons/down.png")}
              style={{width: 30, height: 30}}
            />
          )}
          {iconName && (
            <Image
            source={require("../../../../assets/icons/forth.png")}
            style={{width: 30, height: 30}}
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
                  <Image
                    source={value.iconName === "keyboard-arrow-right" ? require("../../../../assets/icons/forth.png") : require("../../../../assets/icons/add-black.png")}
                    style={{
                      marginRight: wp("4%"),
                      justifyContent: "center",
                      width: 30, height: 30
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
  const { t, locale, setLocale } = useContext(props.route.params.localizationContext);
  const { signOut } = useContext(props.route.params.authContext);
  const [loading, setLoading] = useState(false);
  const [parentProfile, setParentProfile] = React.useState("");
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
              title: childData.isCollaboratorChild === true && childData.isConfirm === false ?
                     "Child " + (index + 1) + " (not yet confirmed)"
                     : "Child " + (index + 1),
              text: childData.name,
              action: () => {
                childData.isCollaboratorChild === true && childData.isConfirm === false ?
                props.navigation.navigate("ProfileConfirmCollaborator", {
                  screenName: "Confirm Child",
                  childId: childData.childId,
                  goBack: () => setLoading(true)
                })
                :
                props.navigation.navigate("ChildDetails", {
                  screenName: childData.name,
                  childId: childData.childId,
                  isCollaboratorChild: childData.isCollaboratorChild,
                  goBack: () => setLoading(true)
                })
              },
              iconName: "keyboard-arrow-right",
              confirmed: false
            };
          })
        );
      }
    } catch (error) {
      showMessage(error.message);
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
              text: collaborator.name,
              action: () => {
                props.navigation.navigate("CollaboratorDetails", {
                  screenName: collaborator.name,
                  collabId: collaborator.phoneNumber,
                  goBack: () => setLoading(true)
                })
              }
            };
          })
        );
      } else {
        showMessage(result.msg);
      }
    } catch (error) {
      showMessage(error.message);
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
        showMessage(result.msg);
      }
    } catch (error) {
      showMessage(error.message);
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
      <View style={{
        position: "absolute",
        top: "5%",
        right: "10%",
        width: wp("22%"),
        height: wp("22%"),
        borderRadius: wp("11%"),
        overflow: "hidden"
      }}>
        <Image
          source={{uri: "data:image/png;base64," + parentProfile.avatar}}
          style={{width: "100%", height: "100%"}}
        />
      </View>
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
            title={t("profile-personal-profile-title")}
            image={require("../../../../assets/icons/personal-profile.png")}
            subItems={[
              {
                title: t("profile-personal-profile-name"),
                text: parentProfile.name
              },
              {
                title: t("profile-personal-profile-phone"),
                text: parentProfile.phoneNumber
              },
              {
                title: t("profile-personal-profile-email"),
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
            title={t("profile-collaborators-title") + " (" + listCollaborator.length + ")"}
            image={require("../../../../assets/icons/collaborator.png")}
            subItems={[
              ...listCollaborator,
              {
                title: t("profile-collaborators-add"),
                action: () => {
                  props.navigation.navigate("CollaboratorAdding", {
                    goBack: () => setLoading(true)
                })},
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
            title={t("profile-children-title") + " (" + listChildren.length + ")"}
            image={require("../../../../assets/icons/child.png")}
            subItems={[
              ...listChildren,
              {
                title: t("profile-children-add"),
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
            title={t("profile-subscription-title")}
            image={require("../../../../assets/icons/subscription.png")}
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }}
            subItems={[
              {
                title: t("profile-subscription-history"),
                action: () =>
                props.navigation.navigate("ProfileTransaction", {
                  goBack: () => setLoading(true)
                }),
                iconName: "keyboard-arrow-right"
              },
              {
                title: t("profile-subscription-packs"),
                action: () => {
                  props.navigation.navigate("ProfileShowingSubscription")
                },
                iconName: "keyboard-arrow-right"
              }
            ]}
          />
          <SettingItem
            key="5"
            title={t("profile-setting-title")}
            image={require("../../../../assets/icons/setting.png")}
            subItems={[
              {
                title: t("profile-setting-password"),
                action: () =>
                  props.navigation.navigate("ProfilePasswordChanging", {
                    screenName: "Change Password",
                    goBack: () => setLoading(true)
                }),
                iconName: "keyboard-arrow-right"
              },
              {
                title: t("profile-setting-language"),
                action: () => {
                  props.navigation.navigate("ProfileChangingLanguage", {
                    language: locale
                  });
                },
                iconName: "keyboard-arrow-right"
              }
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
            title={t("profile-logout")}
            image={require("../../../../assets/icons/log-out.png")}
            action={async() => {
              await AsyncStorage.removeItem("child_id");
              await AsyncStorage.removeItem("user_id");
              signOut();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
