import React, { useContext, useEffect, useRef, useState } from "react";
import NumberFormat from "react-number-format";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, Image, AsyncStorage } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS, PORT } from "../../../const/const";
import Animated, { Easing } from "react-native-reanimated";
import styles from "./styles/index.css";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";
import AvatarContainer from "../AvatarContainer";

const Stack = createStackNavigator();

const SettingItem = ({ title, icon, action, subItems }) => {
  const [isDropdown, setDropdown] = useState(false);
  const animDropdown = useRef(new Animated.Value(0)).current;

  const dropdownSubItems = (numOfSubItems) => {
    setDropdown(!isDropdown);
    if (!isDropdown) {
      Animated.timing(animDropdown, {
        toValue: numOfSubItems * hp("10%"),
        duration: 400,
        easing: Easing.ease,
      }).start();
    } else {
      Animated.timing(animDropdown, {
        toValue: 0,
        duration: 400,
        easing: Easing.ease,
      }).start();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          marginLeft: "10%",
          marginRight: "10%",
          marginBottom: hp("2.5%"),
          paddingTop: hp("1%"),
          paddingBottom: hp("1%"),
          borderRadius: hp("4%"),
          backgroundColor: COLORS.WHITE,
          alignItems: "center",
        }}
        onPress={() => {
          action ? action() : dropdownSubItems(subItems.length);
        }}
      >
        <Icon
          name={icon}
          type="material"
          color={COLORS.STRONG_CYAN}
          style={{
            width: hp("5%"),
            height: hp("5%"),
            marginRight: wp("1%"),
            marginLeft: wp("1%"),
            justifyContent: "center",
          }}
        />
        <View style={styles.settingItem}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Acumin",
              color: COLORS.STRONG_CYAN,
            }}
          >
            {title}
          </Text>
          {subItems && (
            <Icon
              name={isDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              type="material"
              color={COLORS.GREY}
            />
          )}
        </View>
      </TouchableOpacity>
      {subItems && (
        <Animated.View
          style={{
            paddingLeft: wp("25%"),
            paddingRight: wp("12%"),
            backgroundColor: COLORS.LIGHT_CYAN,
            height: animDropdown,
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
                        fontSize: hp("2.5%"),
                        fontFamily: "AcuminBold",
                      }}
                    >
                      {value.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: hp("2.5%"),
                        fontFamily: "Acumin",
                        color: COLORS.GREY,
                      }}
                    >
                      {value.text}
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={{
                      fontSize: hp("2.5%"),
                      fontFamily: "AcuminBold",
                    }}
                  >
                    {value.title}
                  </Text>
                )}
                <Icon
                  name="keyboard-arrow-right"
                  type="material"
                  color={COLORS.GREY}
                />
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}
    </>
  );
};

const ProfileScreen = ({ route }) => (
  <Stack.Navigator
    initialRouteName="ProfileScreenContent"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="ProfileScreenContent"
      component={ProfileScreenContent}
      initialParams={{
        authContext: route.params.authContext,
        localizationContext: route.params.localizationContext,
        children: route.params.children
      }}
    />
  </Stack.Navigator>
);

const ProfileScreenContent = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const { signOut } = React.useContext(props.route.params.authContext);
  const [children, setChildren] = useState(props.route.params.children);
  const [parentProfile, setParentProfile] = React.useState("");
  const [listSubscriptionType, setListSubscriptionType] = React.useState("");
  const [listChildren, setListChildren] = React.useState("");
  const [listCollaborator, setListCollaborator] = React.useState("");

  const getListChildren = async () => {
    const ip = await AsyncStorage.getItem("IP");
    const username = await AsyncStorage.getItem("user_id");
    const response = await fetchWithTimeout(
      "http://" + ip + PORT + "/parent/" + username + "/children",
      {
        method: "GET",
      }
    );
    const result = await response.json();
    if (result.code === 200 && result.msg === "OK") {
      setListChildren(
        result.data.map((childData) => {
          return {
            title: childData.firstName + " " + childData.lastName,
            action: () => {
              props.navigation.navigate("Add Child");
            },
          };
        })
      );
    } else {
      handleError(error.msg);
    }
  };

  const getCollaboratorList = async () => {
    const ip = await AsyncStorage.getItem("IP");
    const username = await AsyncStorage.getItem("user_id");
    const response = await fetchWithTimeout(
      "http://" + ip + PORT + "/parent/" + username + "/collaborator",
      {
        method: "GET",
      }
    );
    const result = await response.json();
    if (result.code === 200 && result.msg === "OK") {
      setListCollaborator(
        result.data.map((collaborator, index) => {
          return {
            title: "Collaborator " + (index + 1),
            text: collaborator.firstName + " " + collaborator.lastName,
            action: null,
          };
        })
      );
    } else {
      handleError(error.msg);
    }
  };

  const getProfileDetail = async () => {
    const ip = await AsyncStorage.getItem("IP");
    const username = await AsyncStorage.getItem("user_id");
    const response = await fetchWithTimeout(
      "http://" + ip + PORT + "/account/" + username,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    if (result.code === 200 && result.msg === "OK") {
      setParentProfile(result.data);
    } else {
      handleError(error.msg);
    }
  };

  const getAllSubscriptionType = async () => {
    const ip = await AsyncStorage.getItem("IP");
    const response = await fetchWithTimeout(
      "http://" + ip + PORT + "/subscription/type/list",
      {
        method: "GET",
      }
    );
    const result = await response.json();
    if (result.code === 200 && result.msg === "OK") {
      setListSubscriptionType(
        result.data.map((subscriptionData) => {
          if (subscriptionData.name !== "Free Trial")
            return {
              title: subscriptionData.name,
              text: (
                <NumberFormat
                  value={subscriptionData.price}
                  displayType={"text"}
                  suffix={"VNĐ"}
                  thousandSeparator={true}
                  defaultValue={0}
                  renderText={(value) => <Text>{value}</Text>}
                />
              ),
            };
          return <> </>;
        })
      );
    } else {
      handleError(error.msg);
    }
  };

  React.useEffect(() => {
    getListChildren();
    getProfileDetail();
    getCollaboratorList();
    getAllSubscriptionType();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            marginTop: hp("10%"),
          }}
        >
          <View>
            <Text style={styles.name}>
              {parentProfile.firstName} {parentProfile.lastName}
            </Text>
            <View
              style={{
                width: wp("35%"),
                height: hp("3.5%"),
                backgroundColor: COLORS.STRONG_CYAN,
                borderRadius: hp("1.75%"),
                marginTop: hp("1%"),
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "AcuminBold",
                  alignSelf: "center",
                  color: COLORS.WHITE,
                }}
              >
                {parentProfile.subscriptionType}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView>
        <SettingItem
          key="1"
          title="Personal Profile"
          icon="face"
          subItems={[
            {
              title: "First name",
              text: parentProfile.firstName,
              action: () =>
                props.navigation.navigate("ProfileChanging", {
                  screenName: "First name",
                  value: parentProfile.firstName,
                }),
            },
            {
              title: "Last Name",
              text: parentProfile.lastName,
              action: () =>
                props.navigation.navigate("ProfileChanging", {
                  screenName: "Last name",
                  value: parentProfile.lastName,
                }),
            },
            {
              title: "Phone",
              text: parentProfile.phoneNumber,
            },
            {
              title: "Email",
              text: parentProfile.email,
              action: () =>
                props.navigation.navigate("ProfileChanging", {
                  screenName: "Email",
                  value: parentProfile.email,
                }),
            },
          ]}
        />
        <SettingItem
          key="2"
          title="Collaborators"
          icon="group-add"
          subItems={[
            ...listCollaborator,
            {
              title: "Add collaborator",
              action: null,
            },
          ]}
        />
        <SettingItem
          key="3"
          title="Children"
          icon="child-care"
          subItems={[
            ...listChildren,
            {
              title: "Add child",
              action: () => {
                props.navigation.navigate("ChildAdding");
              },
            },
          ]}
        />
        <SettingItem
          key="4"
          title="Subscription"
          icon="payment"
          subItems={[
            ...listSubscriptionType,
            {
              title: "History Payment",
            },
          ]}
        />
        <SettingItem
          key="5"
          title="Setting"
          icon="settings"
          subItems={[
            {
              title: "Change Password",
              action: () =>
                props.navigation.navigate("ProfileChanging", {
                  screenName: "Change Password",
                }),
            },
          ]}
        />
        <SettingItem
          key="6"
          title="Logout"
          icon="exit-to-app"
          action={() => {
            (async() => {
              await AsyncStorage.removeItem("child_id");
              await AsyncStorage.removeItem("user_id");
              signOut();
            })()
          }}
        />
      </ScrollView>
      <AvatarContainer children={children}/>
    </View>
  );
};

export default ProfileScreen;
