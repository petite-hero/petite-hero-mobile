import React from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing, AppState, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Notifications from 'expo-notifications';

import styles from './styles/index.css';
import { COLORS, PORT, NOTI } from '../../../const/const';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import TaskScreen from '../TaskScreen';
import QuestScreen from '../QuestScreen';
import ProfileScreen from '../ProfileScreen';


// silent notification for updating location
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    let noti = notification.request.content;
    if (noti.title == NOTI.SILENT_NOTI) {
      // console.log("Do not show notification");
    } else if (noti.title == NOTI.PETITE_HERO) {
      // console.log("Show notification")
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.MAX
      }
    }
  }
});

// screen navigation
const Tab = createMaterialTopTabNavigator();
const TrackingStatusScreen = ({route}) => {
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
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TaskScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Tab.Screen name="Quests" 
        component={QuestScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Tab.Screen name="Profile" 
        component={ProfileScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
    </Tab.Navigator>
  )
}


// screen content
const TrackingStatusScreenContent = ({ navigation }) => {

  // tracking status
  [trackingStatus, setTrackingStatus] = React.useState("INACTIVE");  // LOADING, INACTIVE, SAFE, NOT SAFE
  const STATUS_COLORS = {"LOADING": "rgb(140, 140, 140)", "INACTIVE": "rgb(140, 140, 140)", "SAFE": "rgb(0, 154, 34)", "NOT SAFE": "red"};
  // [isDismissed, setIsDismissed] = React.useState(false);

  // date picker for setting zone
  [isPickingDate, setIsPickingDate] = React.useState(false);

  // tracking status animation
  const CENTER_RATIO = 0.6;
  const DIAMETER = wp("70%");
  const STATUS_DURATION = 3000;
  const animTrackingStatus = React.useRef(new Animated.Value(0)).current;
  let animTrackingStatusScales = [];
  animTrackingStatusScales.push(animTrackingStatus.interpolate({inputRange: [0, 1], outputRange: [CENTER_RATIO, 1]}));
  animTrackingStatusScales.push(animTrackingStatus.interpolate({inputRange: [0, 1/3, 1/3+0.001, 1], outputRange: [CENTER_RATIO+2/3*(1-CENTER_RATIO), 1, CENTER_RATIO, CENTER_RATIO+2/3*(1-CENTER_RATIO)]}));
  animTrackingStatusScales.push(animTrackingStatus.interpolate({inputRange: [0, 2/3, 2/3+0.001, 1], outputRange: [CENTER_RATIO+1/3*(1-CENTER_RATIO), 1, CENTER_RATIO, CENTER_RATIO+1/3*(1-CENTER_RATIO)]}));
  let animTrackingStatusOpacs = [];
  animTrackingStatusOpacs.push(animTrackingStatus.interpolate({inputRange: [0, 1], outputRange: [1, 0]}));
  animTrackingStatusOpacs.push(animTrackingStatus.interpolate({inputRange: [0, 1/3, 1/3+0.001, 1], outputRange: [1/3, 0, 1, 1/3]}));
  animTrackingStatusOpacs.push(animTrackingStatus.interpolate({inputRange: [0, 2/3, 2/3+0.001, 1], outputRange: [2/3, 0, 1, 2/3]}));

  // set safe zone animation
  const FLY_TIME = 400;
  [flied, setFlied] = React.useState(false);
  const animSetZoneBtn = React.useRef(new Animated.Value(0)).current;
  const animSetZoneBtnTopNav = animSetZoneBtn.interpolate({inputRange: [0, 1], outputRange: [100, 0]});
  const animSetZoneBtnTopDay = animSetZoneBtn.interpolate({inputRange: [0, 1], outputRange: [100, 0]});
  const animSetZoneBtnTopTomorrow = animSetZoneBtn.interpolate({inputRange: [0, 1/2, 1], outputRange: [50, 50, 0]});
  const animSetZoneBtnTextWidth = animSetZoneBtn.interpolate({inputRange: [0, 1], outputRange: [0, 200]});

  // listen to location updates
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const listenLocationUpdate = () => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Silent noti for updating child loc
      // if (notification.request.content.title == NOTI.SILENT_NOTI) {
        if (notification.request.content.data.status && trackingStatus !== "SAFE" && trackingStatus !== "INACTIVE"){
          animTrackingStatus.setValue(0);
          Animated.loop(Animated.timing(animTrackingStatus, {toValue: 1, duration: STATUS_DURATION, easing: Easing.linear, useNativeDriver: true})).start();
          setTrackingStatus("SAFE");
        }
        else if (!notification.request.content.data.status && trackingStatus !== "NOT SAFE" && trackingStatus !== "INACTIVE"){
          animTrackingStatus.setValue(0);
          Animated.loop(Animated.timing(animTrackingStatus, {toValue: 1, duration: STATUS_DURATION/2, easing: Easing.linear, useNativeDriver: true})).start();
          setTrackingStatus("NOT SAFE");
        }
      // }
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

  // request emergency mode
  const requestEmergencyMode = async (isEmergency) => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const response = await fetch('http://' + ip + PORT + '/location/emergency/' + childId + '/' + isEmergency);
    const result = await response.json();
    if (result.code !== 200) {
      console.log("Error while requesting emergency mode '" + isEmergency + "'. Server response: " + JSON.stringify(result));
    }
  }

  // start on screen load
  React.useEffect(() => {
    // get tracking setting
    (async () => {
      const isTracking = await AsyncStorage.getItem('is_tracking');
      if (isTracking === "true"){
        setTrackingStatus("LOADING");
        Animated.loop(Animated.timing(animTrackingStatus, {toValue: 1, duration: STATUS_DURATION, easing: Easing.linear, useNativeDriver: true})).start();
      }
    })();
    // listen to location update from server
    listenLocationUpdate();
    // handle screen & app states
    navigation.addListener('focus', () => { requestEmergencyMode(true); });
    navigation.addListener('blur', () => { requestEmergencyMode(false); });
    AppState.addEventListener("change", (nextState) => {
      if (nextState === "active")  requestEmergencyMode(true);
      else  requestEmergencyMode(false);
    });
  }, []);

  
  // MAIN INTERFACE
  return (

    <View style={styles.container}>

      <Image
        style={[styles.avatar, {backgroundColor: COLORS.STRONG_CYAN}]}
        source={require('../../../../assets/kid-avatar.png')}
      />

      {/* view map button */}
      <TouchableOpacity style={[styles.warningBtn, {backgroundColor: trackingStatus === "NOT SAFE" ? "red" : "rgba(255, 0, 0, 0.7)"}]}
                        onPress={() => navigation.navigate("TrackingEmergency")}>
        <Icon name='priority-high' type='material' color='white' size={20}/>
      </TouchableOpacity>

      {/* status container */}
      <View style={styles.statusContainer}>
        {animTrackingStatusScales.map((animScale, index) => {
            return (
              <Animated.View key={index} style={[styles.statusWave, {backgroundColor: STATUS_COLORS[trackingStatus],
                             transform: [{scaleX: animScale}, {scaleY: animScale}],
                             width: DIAMETER, height: DIAMETER, opacity: animTrackingStatusOpacs[index]}]}/>
            )
        })}
        <View style={[styles.statusWave, {backgroundColor: STATUS_COLORS[trackingStatus]},
                      {width: DIAMETER*CENTER_RATIO, height: DIAMETER*CENTER_RATIO}]}/>
        <Text style={styles.locationStatus}>{trackingStatus}</Text>
      </View>

      {/* setting buttons */}
      <View style={styles.settingBtnsContainer}>

        <Animated.View style={{position: "relative", top: animSetZoneBtnTopNav}}>
          {/* activate tracking button */}
          <TouchableOpacity style={[styles.settingBtnContainer, {backgroundColor: trackingStatus === "INACTIVE" ? "white" : COLORS.STRONG_CYAN}]}
            onPress={() => {
              if (trackingStatus === "INACTIVE"){
                animTrackingStatus.setValue(0);
                Animated.loop(Animated.timing(animTrackingStatus, {toValue: 1, duration: STATUS_DURATION, easing: Easing.linear, useNativeDriver: true})).start();
                setTrackingStatus("LOADING");
              }
              else{
                setTrackingStatus("INACTIVE");
                animTrackingStatus.stopAnimation();
              }
            }}
          >
            <Icon name={trackingStatus === "INACTIVE" ? "explore" : "explore"} type="material" size={20} color={trackingStatus === "INACTIVE" ? "rgb(140, 140, 140)" : "white"}/>
          </TouchableOpacity>
        </Animated.View>
        {/* choose date for setting button */}
        <Animated.View style={{position: "relative", top: animSetZoneBtnTopDay, opacity: animSetZoneBtn}}>
          <TouchableOpacity style={styles.settingBtnContainer} onPress={() => setIsPickingDate(true)}>
            <Icon name="date-range" type="material" size={20} color={COLORS.STRONG_CYAN}/>
          </TouchableOpacity>
        </Animated.View>
        {/* setting for tomorrow button */}
        <Animated.View style={{position: "relative", top: animSetZoneBtnTopTomorrow, opacity: animSetZoneBtn}}>
          <TouchableOpacity style={styles.settingBtnContainer} onPress={() => {
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
        <TouchableOpacity style={[styles.settingBtnContainer, {backgroundColor: COLORS.STRONG_CYAN}]} onPressIn={() => {
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