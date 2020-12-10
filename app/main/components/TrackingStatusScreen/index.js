import React, { Children, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing, AppState, Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Notifications from 'expo-notifications';

import TaskScreen from '../TaskScreen';
import QuestScreen from '../QuestScreen';
import ProfileScreen from '../ProfileScreen';

import styles from './styles/index.css';
import { COLORS, PORT, NOTI } from '../../../const/const';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { showMessage } from '../../../utils/showMessage';
import { Loader } from '../../../utils/loader';
import LocationStatus from './location-status';
import { ConfirmationModal } from "../../../utils/modal";
import { t } from 'i18n-js';



{/* ===================== SCREEN NAVIGATION SECTION ===================== */}
const Tab = createMaterialTopTabNavigator();
const TrackingStatusScreen = ({route}) => {
  const { t } = useContext(route.params.localizationContext);
  const [loading, setLoading]   = React.useState(true);
  const [children, setChildren] = React.useState([]);

  React.useEffect(() => {
    (async() => {
      try {
        const ip = await AsyncStorage.getItem('IP');
        const id = await AsyncStorage.getItem('user_id');
        const childId = await AsyncStorage.getItem('child_id');
        const response = await fetch("http://" + ip + PORT + "/parent/" + id + "/children");
        const result = await response.json();
        if (result.code === 200) {
          setChildren(result.data);
          if (!childId) await AsyncStorage.setItem('child_id', result.data[0].childId + "");
          else {
            let isInChildren = false;
            result.data.map((child, index) => {
              if (childId == child.childId) isInChildren = true;
            });
            if (!isInChildren) await AsyncStorage.setItem('child_id', result.data[0].childId + "");
          }
        } else {
          showMessage(result.msg);
        }
      } catch (error) {
        showMessage(error.message);
      } finally {
        setLoading(false);
      }
    })()
  }, [loading]);

  if (loading) return (
    <Loader loading={true}/>
  )

  return (
    <Tab.Navigator
      screenOptions = {({route}) => ({
        tabBarIcon: ({ focused, color }) => {
          let icon;
          if (route.name == 'Tracking') {
            icon = focused
              ? require('../../../../assets/nav-bar/tracking-active.png')
              : require('../../../../assets/nav-bar/tracking.png')
          } else if (route.name == 'Tasks') {
            icon = focused
              ? require('../../../../assets/nav-bar/task-active.png')
              : require('../../../../assets/nav-bar/task.png')
          } else if (route.name == 'Quests') {
            icon = focused
              ? require('../../../../assets/nav-bar/quest-active.png')
              : require('../../../../assets/nav-bar/quest.png')
          } else if (route.name == 'Profile') {
            icon = focused
              ? require('../../../../assets/nav-bar/profile-active.png')
              : require('../../../../assets/nav-bar/profile.png')
          }
          return (
            <Image style={styles.tabIcon} source={icon}/>
          )
        }
      })}
      tabBarOptions={{
        labelStyle: {
          fontSize: 10,
          bottom: 4,
          fontWeight: "bold",
          textTransform: "none"
        },
        style: styles.bottomTab,
        tabStyle: styles.tabItem,
        indicatorStyle: styles.indicator,
        showIcon: true,
        activeTintColor: COLORS.STRONG_CYAN,
        inactiveTintColor: COLORS.GREY
      }}
      tabBarPosition="bottom"
      backBehavior="initialRoute"
    >
      <Tab.Screen 
        name="Tracking" 
        component={TrackingStatusScreenContent}
        options={{
          tabBarLabel: t("navigation-tracking")
        }}
        initialParams={{ 
          authContext: route.params.authContext, 
          localizationContext: route.params.localizationContext,
          children: children,
          setChildren: setChildren
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TaskScreen}
        options={{
          tabBarLabel: t("navigation-task")
        }}
        initialParams={{ 
          authContext: route.params.authContext, 
          localizationContext: route.params.localizationContext
        }}
      />
      <Tab.Screen 
        name="Quests" 
        component={QuestScreen}
        options={{
          tabBarLabel: t("navigation-quest")
        }}
        initialParams={{ 
          authContext: route.params.authContext, 
          localizationContext: route.params.localizationContext
        }}
      />
      <Tab.Screen name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: t("navigation-profile")
        }}
        initialParams={{ 
          authContext: route.params.authContext, 
          localizationContext: route.params.localizationContext
        }}
      />
    </Tab.Navigator>
  )
}
{/* ===================== END OF SCREEN NAVIGATION SECTION ===================== */}


{/* ==================================================================================================== */}
{/* ========================================== SCREEN CONTENT ========================================== */}
const TrackingStatusScreenContent = ({ navigation, route }) => {

  {/* ===================== VARIABLE SECTION ===================== */}

  const WEEKDAYS_ABB = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [loading, setLoading] = React.useState(false);
  const [isCannotConnect, setIsCannotConnect] = React.useState(false);

  // child information
  const [children, setChildrenUseState] = React.useState(route.params.children);
  const childrenRef = React.useRef(children);
  const setChildren = (newChildren) => {
    childrenRef.current = newChildren;
    setChildrenUseState(newChildren);
  }

  // date picker for setting zone
  const [isPickingDate, setIsPickingDate] = React.useState(false);
  
  // validation popup
  const [isValidation, setIsValidation] = React.useState(false);

  // set safe zone animation
  const FLY_TIME = 400;
  const [flied, setFlied] = React.useState(false);
  const animSetZoneBtn = React.useRef(new Animated.Value(0)).current;
  const animSetZoneBtnTopNav = animSetZoneBtn.interpolate({inputRange: [0, 1], outputRange: [115, 0]});
  const animSetZoneBtnTopDay = animSetZoneBtn.interpolate({inputRange: [0, 1], outputRange: [100, 0]});
  const animSetZoneBtnTopTomorrow = animSetZoneBtn.interpolate({inputRange: [0, 1/2, 1], outputRange: [50, 50, 0]});
  const animSetZoneBtnElevation = animSetZoneBtn.interpolate({inputRange: [0, 1], outputRange: [0, 5]});
  const animSetZoneBtnTextWidth = animSetZoneBtn.interpolate({inputRange: [0, 1], outputRange: [0, 230]});

  {/* ===================== END OF VARIABLE SECTION ===================== */}

  {/* ===================== LOCATION UPDATE HANDLING SECTION ===================== */}

  // listen to location updates
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const listenLocationUpdate = () => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Silent noti for updating child loc
      if (notification.request.content.title === NOTI.SILENT_NOTI){
        const notiData = notification.request.content.data;
        let currentChildIndex = -1;
        childrenRef.current.map((child, index) => {
          if (child.childId === notiData.child) currentChildIndex = index;
        });
        const currentStatus = childrenRef.current[currentChildIndex].status;
        if (notiData.status && currentStatus !== "SAFE" && currentStatus !== "INACTIVE"){
          let childrenTmp = [...childrenRef.current];
          childrenTmp[currentChildIndex].status = "SAFE";
          setChildren(childrenTmp);
        }
        else if (!notiData.status && currentStatus !== "NOT SAFE" && currentStatus !== "INACTIVE"){
          let childrenTmp = [...childrenRef.current];
          childrenTmp[currentChildIndex].status = "NOT SAFE";
          setChildren(childrenTmp);
        }
      }
    });
    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(notification => { 
      console.log("Background noti listener");
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  };

  {/* ===================== END OF LOCATION UPDATE HANDLING SECTION ===================== */}

  {/* ===================== CHILD ID CHANGE HANDLING SECTION ===================== */}

  const handleChildIdChanged = async () => {
    const childIdTmp = await AsyncStorage.getItem('child_id');
    if (childIdTmp != children[0].childId){
      let isFound = false;
      children.map((child, index) => {
        if (child.childId == childIdTmp){
          let tmpChildren = [...children];
          let tmpChild = tmpChildren[0];
          tmpChildren[0] = tmpChildren[index];
          tmpChildren[index] = tmpChild;
          setChildren(tmpChildren);
          isFound = true;
        }
      });
      if (!isFound) await AsyncStorage.setItem('child_id', children[0].childId+"");
    }
  }

  {/* ===================== END OF CHILD ID CHANGE HANDLING SECTION ===================== */}

  {/* ===================== API SECTION ===================== */}

  // request emergency mode
  const requestEmergencyMode = async (isEmergency, childId) => {
    const ip = await AsyncStorage.getItem('IP');
    const response = await fetch('http://' + ip + PORT + '/location/emergency/' + childId + '/' + isEmergency);
    const result = await response.json();
    if (result.code !== 200) console.log("Error while requesting emergency mode '" + isEmergency + "'. Server response: " + JSON.stringify(result));
  }

  // request emergency mode for tracking-active child
  const requestEmergencyModeList = (isEmergency) => {
    children.map((child, index) => {
      if (child.isTrackingActive) {
        requestEmergencyMode(isEmergency, child.childId);
      }
    });
  }

  // request smartwatch tracking
  const requestSmartwatchTracking = async (isTracking) => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const response = await fetch('http://' + ip + PORT + '/location/toggle/' + childId + '/' + isTracking);
    const result = await response.json();
    if (result.code !== 200){
      console.log("Error while requesting smartwatch tracking '" + isTracking + "'. Server response: " + JSON.stringify(result));
    }
    if (isTracking){
      await new Promise(resolve => setTimeout(resolve, 10000));
      if (children[0].status == "LOADING"){
        setIsCannotConnect(true);
      }
    }
  }

  // start on screen load
  React.useEffect(() => {

    // handle location status list
    let childrenTmp = [...children];
    childrenTmp.map((child, index) => {
      if (!child.isTrackingActive) child.status = "INACTIVE";
      else{
        child.status = "LOADING";
        requestEmergencyMode(true, child.childId);
      }
    });
    setChildren(childrenTmp);

    // listen to location update from server
    listenLocationUpdate();

    // handle screen & app states
    requestEmergencyModeList(true)
    navigation.addListener('focus', async () => {
      requestEmergencyModeList(true);
      handleChildIdChanged();
    });
    navigation.addListener('blur', () => { requestEmergencyModeList(false); });
    AppState.addEventListener("change", (nextState) => {
      if (nextState === "active"){
        requestEmergencyModeList(true);
        handleChildIdChanged();
      }
      else requestEmergencyModeList(false);
    });

  }, []);

  {/* ===================== END OF API SECTION ===================== */}

  
  {/* ==================================================================================================== */}
  {/* ========================================== USER INTERFACE ========================================== */}
  return (

    <View style={styles.container}>

      <Loader loading={loading}/>

      {/* ===================== EMERGENCY BUTTON SECTION ===================== */}

      {/* emergency button */}
      {/* <TouchableOpacity style={styles.warningBtn} onPress={() => navigation.navigate("TrackingEmergency", {children: children})}>
        <Image source={require("../../../../assets/icons/exclamation-mark.png")} style={{width: 30, height: 30}} />
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.warningBtn} onPress={() => navigation.navigate("TrackingEmergency", {children: children})}>
        <Text style={styles.warningBtnText}>Emergency!</Text>
      </TouchableOpacity>

      {children[0].status === "NOT SAFE" ?
        <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:`)}>
          <Icon name="phone-in-talk" type="material" color="white"/>
        </TouchableOpacity>
      : null}

      {/* ===================== END OF AVATAR & EMERGENCY BUTTON SECTION ===================== */}

      {/* ===================== LOCATION STATUS SECTION ===================== */}

      {/* status container */}
      <View style={styles.statusContainer}>
        <LocationStatus
          diameter={wp("70%")}
          margin={0}
          trackingStatus={children[0].status}
          photo={children[0].photo}/>
      </View>

      <View style={styles.statusListContainer}>
        {children.map((child, index) => {
          if (index != 0)
            return (
              <LocationStatus key={index}
                diameter={wp("16%")}
                margin={10}
                trackingStatus={child.status}
                photo={child.photo}
                onPress={async () => {
                  let tmpChildren = [...children];
                  let tmpChild = tmpChildren[0];
                  tmpChildren[0] = tmpChildren[index];
                  tmpChildren[index] = tmpChild;
                  setChildren(tmpChildren);
                  await AsyncStorage.setItem('child_id', tmpChildren[0].childId+"");
                }}/>
            )
        })}
      </View>

      {/* ===================== END OF LOCATION STATUS SECTION ===================== */}

      {/* ===================== SETTING BUTTONS SECTION ===================== */}

      {/* setting buttons */}
      <View style={styles.settingBtnsContainer}>

        <Animated.View style={{position: "relative", top: animSetZoneBtnTopNav}}>

          {/* activate tracking button */}
          <TouchableOpacity style={[styles.settingBtnContainer,
                                    {backgroundColor: children[0].status === "INACTIVE" ? "white" : COLORS.STRONG_CYAN, shadowOpacity: 0.2, elevation: 5}]}
            onPress={() => {
              if (children[0].status === "INACTIVE"){
                requestSmartwatchTracking(true);
                requestEmergencyMode(true, children[0].childId);
                let childrenTmp = [...childrenRef.current];
                childrenTmp[0].status = "LOADING";
                childrenTmp[0].isTrackingActive = true;
                setChildren(childrenTmp);
              }
              else{
                requestSmartwatchTracking(false);
                let childrenTmp = [...childrenRef.current];
                childrenTmp[0].status = "INACTIVE";
                childrenTmp[0].isTrackingActive = false;
                setChildren(childrenTmp);
              }
            }}
          >
            <Image source={children[0].status === "INACTIVE" ? require("../../../../assets/icons/location-off.png") : require("../../../../assets/icons/location-on.png")}
                   style={{width: 30, height: 30}}/>
          </TouchableOpacity>
        </Animated.View>

        {/* choose date for setting button */}
        <Animated.View style={[styles.settingBtnAnimatedContainer, {top: animSetZoneBtnTopDay, opacity: animSetZoneBtn, elevation: animSetZoneBtnElevation}]}>
          <TouchableOpacity style={[styles.settingBtnContainer, {marginBottom: 0}]} onPress={() => setIsPickingDate(true)}>
            <Image source={require("../../../../assets/icons/calendar.png")} style={{width: 30, height: 30}} />
          </TouchableOpacity>
        </Animated.View>

        {/* setting for tomorrow button */}
        <Animated.View style={[styles.settingBtnAnimatedContainer, {top: animSetZoneBtnTopTomorrow, opacity: animSetZoneBtn, elevation: animSetZoneBtnElevation}]}>
          <TouchableOpacity style={[styles.settingBtnContainer, {marginBottom: 0}]} onPress={() => {
              navigation.navigate("TrackingSettings", {children: children, date: (() => {
                let today = new Date();
                today.setDate(today.getDate()+1);
                return today;
              })()});
              animSetZoneBtn.setValue(0);
              setFlied(false);
            }}>
            <Image source={require("../../../../assets/icons/tomorrow.png")} style={{width: 30, height: 30}} />
          </TouchableOpacity>
        </Animated.View>

        {/* setting animation button */}
        <TouchableOpacity style={[styles.settingBtnContainer, {backgroundColor: COLORS.STRONG_CYAN, shadowOpacity: 0.2, elevation: 5}]}
                          onPressIn={() => {
          if (!flied){
            animSetZoneBtn.setValue(0);
            Animated.timing(animSetZoneBtn, {toValue: 1, duration: FLY_TIME, useNativeDriver: false}).start();
          }
          else{
            animSetZoneBtn.setValue(1);
            Animated.timing(animSetZoneBtn, {toValue: 0, duration: FLY_TIME, useNativeDriver: false}).start();
          }
          setFlied(!flied);
        }}>
          <Image source={require("../../../../assets/icons/add-location.png")} style={{width: 30, height: 30}} />
        </TouchableOpacity>

        {/* explaination texts */}
        <Animated.View style={[styles.txtSettingBtnGuideContainer, {top: 78, width: animSetZoneBtnTextWidth, opacity: animSetZoneBtn}]}>
          <Text style={styles.txtSettingBtnGuide}>Safe Zone for Selected Day</Text>
        </Animated.View>
        <Animated.View style={[styles.txtSettingBtnGuideContainer, {top: 135, width: animSetZoneBtnTextWidth, opacity: animSetZoneBtn}]}>
          <Text style={styles.txtSettingBtnGuide}>Safe Zone for Tomorrow</Text>
        </Animated.View>

      </View>

      {/* select day calendar */}
      {isPickingDate ?
        <TouchableOpacity style={styles.calendarContainer} onPress={() => setIsPickingDate(false)}>
          <View style={styles.calendar}>
            <Text style={{fontSize: 20, fontFamily: "Acumin"}}>Select the day</Text>
            <View style={{flexDirection: "row", marginTop: 10}}>
              {[0, 1, 2, 3, 4, 5, 6].map((count, index) => {
                let date = new Date();
                date.setDate(date.getDate() + count);
                return (
                  <TouchableOpacity key={index} style={[styles.dateContainer, index == 0 ? {borderColor: COLORS.STRONG_CYAN} : {}]} onPress={() => {
                    setIsPickingDate(false);
                    // check if the selected day is today
                    if (index === 0 && children[0].status !== "INACTIVE"){
                      setIsValidation(true);
                      return;
                    }
                    navigation.navigate("TrackingSettings", {children: children, date: date});
                    animSetZoneBtn.setValue(0);
                    setFlied(false);
                  }}>
                    <Text style={{fontFamily: "Acumin", color: index == 0 ? COLORS.STRONG_CYAN : "black"}}>
                      {WEEKDAYS_ABB[date.getDay()]}
                    </Text>
                    <Text style={{fontFamily: "AcuminBold", color: index == 0 ? COLORS.STRONG_CYAN : "black"}}>
                      {(date.getDate() < 10 ? "0" : "") + date.getDate()}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </TouchableOpacity>
      : null}

      {/* validation popup */}
      <ConfirmationModal 
        visible={isValidation} 
        message={"Location tracking should be turned off before setting for today."}
        option="info"
        onConfirm={() => setIsValidation(false)}
      />

      {/* ===================== END OF SETTING BUTTONS SECTION ===================== */}

      {/* cannot connect child popup */}
      <ConfirmationModal 
        visible={isCannotConnect} 
        message={"Cannot connect to child's device. Please try again later."}
        option="info"
        onConfirm={() => {
          setIsCannotConnect(false);
          requestSmartwatchTracking(false);
          requestEmergencyMode(false, children[0].childId);
          let childrenTmp = [...childrenRef.current];
          childrenTmp[0].status = "INACTIVE";
          childrenTmp[0].isTrackingActive = false;
          setChildren(childrenTmp);
        }}
      />

    </View>

  );
};

export default TrackingStatusScreen;



// fcmService.registerAppWithFCM();
// fcmService.register(onRegister, onNotification, onOpenNotification);
// localNotificationService.configure(onOpenNotification);

// function onRegister(token) {
//   console.log("[Status] onRegister: ", token);
// }

// function onNotification(notify) {
//   console.log("[Status] onNotification: ", notify);
//   const options = {
//     soundName: 'default',
//     playSound: true
//   }
// }
// localNotificationService.showNotification(
//   0,
//   notify.title,
//   notify.body,
//   notify,
//   option
// )

// function onOpenNotification(notify) {
//   console.log("[Status] onOpenNotification: ", notify);
//   alert("Open Notification: " + notify.body);
// }

// return () => {
//   console.log("[Status] unRegister");
//   fcmService.unRegister();
//   localNotificationService.unRegister();
// }