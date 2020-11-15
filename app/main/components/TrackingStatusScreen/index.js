import React, { Children } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing, AppState, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Notifications from 'expo-notifications';

import TaskScreen from '../TaskScreen';
import QuestScreen from '../QuestScreen';
import ProfileScreen from '../ProfileScreen';

import styles from './styles/index.css';
import { COLORS, PORT } from '../../../const/const';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { handleError } from '../../../utils/handleError';
import { Loader } from '../../../utils/loader';
import LocationStatus from './location-status';



{/* ===================== SCREEN NAVIGATION SECTION ===================== */}
const Tab = createMaterialTopTabNavigator();
const TrackingStatusScreen = ({route}) => {

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
        } else {
          handleError(result.msg);
        }
      } catch (error) {
        handleError(error.message);
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
          fontWeight: "bold",
          textTransform: "none"
        },
        style: styles.bottomTab,
        tabStyle: styles.tabItem,
        indicatorStyle: styles.indicator,
        showIcon: true,
        activeTintColor: COLORS.STRONG_CYAN,
        inactiveTintColor: COLORS.GREY,
      }}
      tabBarPosition="bottom"
      backBehavior="initialRoute"
    >
      <Tab.Screen 
        name="Tracking" 
        component={TrackingStatusScreenContent}
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
        initialParams={{ 
          authContext: route.params.authContext, 
          localizationContext: route.params.localizationContext,
          children: children,
          setChildren: setChildren
        }}
      />
      <Tab.Screen name="Quests" 
        component={QuestScreen}
        initialParams={{ 
          authContext: route.params.authContext, 
          localizationContext: route.params.localizationContext,
          children: children,
          setChildren: setChildren
        }}
      />
      <Tab.Screen name="Profile" 
        component={ProfileScreen}
        initialParams={{ 
          authContext: route.params.authContext, 
          localizationContext: route.params.localizationContext,
          children: children,
          setChildren: setChildren
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

  const [loading, setLoading] = React.useState(false);

  // child information
  const [childIndex, setChildIndex] = React.useState(0);
  const [children, setChildren] = React.useState(route.params.children);
  const childrenRef = React.useRef(children);
  const setChildrenRef = (newChildren) => {
    childrenRef.current = newChildren;
    setChildren(newChildren);
  }

  // date picker for setting zone
  const [isPickingDate, setIsPickingDate] = React.useState(false);

  // set safe zone animation
  const FLY_TIME = 400;
  const [flied, setFlied] = React.useState(false);
  const animSetZoneBtn = React.useRef(new Animated.Value(0)).current;
  const animSetZoneBtnTopNav = animSetZoneBtn.interpolate({inputRange: [0, 1], outputRange: [100, 0]});
  const animSetZoneBtnTopDay = animSetZoneBtn.interpolate({inputRange: [0, 1], outputRange: [100, 0]});
  const animSetZoneBtnTopTomorrow = animSetZoneBtn.interpolate({inputRange: [0, 1/2, 1], outputRange: [50, 50, 0]});
  const animSetZoneBtnElevation = animSetZoneBtn.interpolate({inputRange: [0, 1], outputRange: [0, 5]});
  const animSetZoneBtnTextWidth = animSetZoneBtn.interpolate({inputRange: [0, 1], outputRange: [0, 180]});

  {/* ===================== END OF VARIABLE SECTION ===================== */}

  {/* ===================== LOCATION UPDATE HANDLING SECTION ===================== */}

  // listen to location updates
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const listenLocationUpdate = () => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Silent noti for updating child loc
      const notiData = notification.request.content.data;
      let currentChildIndex = -1;
      childrenRef.current.map((child, index) => {
        if (child.childId === notiData.child) currentChildIndex = index;
      });
      const currentStatus = childrenRef.current[currentChildIndex].status;
      if (notiData.status && currentStatus !== "SAFE" && currentStatus !== "INACTIVE"){
        let childrenTmp = [...childrenRef.current];
        childrenTmp[currentChildIndex].status = "SAFE";
        setChildrenRef(childrenTmp);
      }
      else if (!notiData.status && currentStatus !== "NOT SAFE" && currentStatus !== "INACTIVE"){
        let childrenTmp = [...childrenRef.current];
        childrenTmp[currentChildIndex].status = "NOT SAFE";
        setChildrenRef(childrenTmp);
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
    if (result.code !== 200) console.log("Error while requesting smartwatch tracking '" + isTracking + "'. Server response: " + JSON.stringify(result));
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
    setChildrenRef(childrenTmp);

    // listen to location update from server
    listenLocationUpdate();

    // handle screen & app states
    navigation.addListener('focus', () => { requestEmergencyModeList(true) });
    navigation.addListener('blur', () => { requestEmergencyModeList(false); });
    AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") requestEmergencyModeList(true);
      else requestEmergencyModeList(false);
    });

  }, []);

  {/* ===================== END OF API SECTION ===================== */}

  
  {/* ==================================================================================================== */}
  {/* ========================================== USER INTERFACE ========================================== */}
  return (

    <View style={styles.container}>

      <Loader loading={loading}/>

      {/* ===================== AVATAR & EMERGENCY BUTTON SECTION ===================== */}

      {/* emergency button */}
      <TouchableOpacity style={styles.warningBtn} onPress={() => navigation.navigate("TrackingEmergency")}>
        <Icon name='priority-high' type='material' color='white' size={20}/>
      </TouchableOpacity>

      {/* ===================== END OF AVATAR & EMERGENCY BUTTON SECTION ===================== */}

      {/* ===================== LOCATION STATUS SECTION ===================== */}

      {/* status container */}
      <View style={styles.statusContainer}>
        <LocationStatus
          diameter={wp("70%")}
          margin={0}
          trackingStatus={children[childIndex].status}
          photo={children[0].photo}/>
      </View>

      <View style={styles.statusListContainer}>
        {children.map((child, index) => {
          if (index != childIndex)
            return (
              <LocationStatus key={index}
                diameter={50}
                margin={10}
                trackingStatus={child.status}
                photo={child.photo}/>
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
                                   {backgroundColor: children[childIndex].status === "INACTIVE" ? "white" : COLORS.STRONG_CYAN, shadowOpacity: 0.2, elevation: 5}]}
            onPress={() => {
              if (children[childIndex].status === "INACTIVE"){
                requestSmartwatchTracking(true);
                let childrenTmp = [...childrenRef.current];
                childrenTmp[childIndex].status = "LOADING";
                setChildrenRef(childrenTmp);
              }
              else{
                requestSmartwatchTracking(false);
                let childrenTmp = [...childrenRef.current];
                childrenTmp[childIndex].status = "INACTIVE";
                setChildrenRef(childrenTmp);
              }
            }}
          >
            <Icon name={children[childIndex].status === "INACTIVE" ? "explore" : "explore"} type="material" size={20}
                  color={children[childIndex].status === "INACTIVE" ? "rgb(140, 140, 140)" : "white"}/>
          </TouchableOpacity>
        </Animated.View>

        {/* choose date for setting button */}
        <Animated.View style={[styles.settingBtnAnimatedContainer, {top: animSetZoneBtnTopDay, opacity: animSetZoneBtn, elevation: animSetZoneBtnElevation}]}>
          <TouchableOpacity style={[styles.settingBtnContainer, {marginBottom: 0}]} onPress={() => setIsPickingDate(true)}>
            <Icon name="date-range" type="material" size={20} color={COLORS.STRONG_CYAN}/>
          </TouchableOpacity>
        </Animated.View>

        {/* setting for tomorrow button */}
        <Animated.View style={[styles.settingBtnAnimatedContainer, {top: animSetZoneBtnTopTomorrow, opacity: animSetZoneBtn, elevation: animSetZoneBtnElevation}]}>
          <TouchableOpacity style={[styles.settingBtnContainer, {marginBottom: 0}]} onPress={() => {
              navigation.navigate("TrackingSettings", {date: (() => {
                let today = new Date();
                today.setDate(today.getDate()+1);
                return today;
              })()});
              animSetZoneBtn.setValue(0);
              setFlied(false);
            }}>
            <Icon name="today" type="material" size={20} color={COLORS.STRONG_CYAN}/>
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
          <Icon name="add-location" type="material" size={20} color="white"/>
        </TouchableOpacity>

        {/* explaination texts */}
        <Animated.View style={[styles.txtSettingBtnGuideContainer, {top: 60, width: animSetZoneBtnTextWidth, opacity: animSetZoneBtn}]}>
          <Text style={styles.txtSettingBtnGuide}>Safe Zone for Selected Day</Text>
        </Animated.View>
        <Animated.View style={[styles.txtSettingBtnGuideContainer, {top: 110, width: animSetZoneBtnTextWidth, opacity: animSetZoneBtn}]}>
          <Text style={styles.txtSettingBtnGuide}>Safe Zone for Tomorrow</Text>
        </Animated.View>

      </View>

      {/* select day calendar */}
      {isPickingDate ?
        <TouchableOpacity style={styles.calendarContainer} onPress={() => setIsPickingDate(false)}>
          <Calendar
            minDate={new Date()}
            onDayPress={(day) => {
              setIsPickingDate(false);
              navigation.navigate("TrackingSettings", {date: new Date(day.timestamp)});
              animSetZoneBtn.setValue(0);
              setFlied(false);
            }}
            // monthFormat={'yyyy MM'}  // TODO: change depending on language
            hideExtraDays={true}
          />
        </TouchableOpacity>
      : null}

      {/* ===================== END OF SETTING BUTTONS SECTION ===================== */}

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