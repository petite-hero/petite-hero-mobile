import React, {useRef} from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Image, Animated } from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './styles/index.css';
import { COLORS, IP, PORT } from '../../../const/const';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TaskScreen from '../TaskScreen';
import QuestScreen from '../QuestScreen';
import ProfileScreen from '../ProfileScreen';

import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

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
        activeTintColor: COLORS.STRONG_ORANGE,
        inactiveTintColor: COLORS.GREY,
      }}
      tabBarPosition="bottom"
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

const TrackingStatusScreenContent = ({ navigation }) => {
 
  // Tuan
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  [newLoc, setNewLoc] = React.useState(null);

  React.useEffect(() => {

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {

      setNotification(notification);
      
      if (notification.request.content.title === null) {
        console.log("Update child's location on Tracking screen please!");
        // insert codes to update child's location here
        let tmpNewLoc = notification.request.content.data;
        if (tmpNewLoc.status === "1" && trackingStatus === "NOT SAFE") setTrackingStatus("SAFE");
        if (tmpNewLoc.status === "0" && trackingStatus === "SAFE") setTrackingStatus("NOT SAFE"); 
        setNewLoc(notification.request.content.data);
        console.log(notification.request.content.data);
        // access location data by notification.request.content.data
      } else {
        // insert codes to handle something else here
      }
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { 
    //   console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      alert('You need to grant permission to receive Notifications!');
      return;
    }
    let token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Your device token: ", token);
    return token;
  }

  // end Tuan


  [trackingStatus, setTrackingStatus] = React.useState("SAFE");  // INACTIVE, SAFE, NOT SAFE
  const STATUS_COLORS = {"INACTIVE": "rgb(140, 140, 140)", "SAFE": "rgb(0, 154, 34)", "NOT SAFE": "red"};

  // [elapsedPercent, setElapsedPercent] = React.useState(0);
  const CENTER_RATIO = 0.6;
  const DIAMETER = wp("70%");
  const DURATION = 1000;

  const scale1 = React.useRef(new Animated.Value(1)).current;
  const opac1 = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    Animated.loop(Animated.timing(scale1, {toValue: 1/CENTER_RATIO, duration: DURATION, useNativeDriver: true})).start();
    Animated.loop(Animated.timing(opac1, {toValue: 0, duration: DURATION, useNativeDriver: true})).start();
  });

  return (

    <SafeAreaView style={styles.container}>

      <Image
        style={[styles.avatar, {backgroundColor: COLORS.STRONG_ORANGE}]}
        source={require('../../../../assets/kid-avatar.png')}
      />

      {/* <Animated.View style={[styles.statusWave, {backgroundColor: STATUS_COLORS[trackingStatus]},
              {width: DIAMETER*CENTER_RATIO, height: DIAMETER*CENTER_RATIO, opacity: fadeAnim}]}/> */}

      <View style={styles.statusContainer}>
        <Animated.View style={[styles.statusWave, {backgroundColor: STATUS_COLORS[trackingStatus],
                       transform: [{scaleX: scale1}, {scaleY: scale1}],
                       width: DIAMETER*CENTER_RATIO, height: DIAMETER*CENTER_RATIO, opacity: opac1}]}/>
        {/* {trackingStatus === "INACTIVE" ?
          [
            <View key={-1} style={[styles.statusWave, {backgroundColor: STATUS_COLORS[trackingStatus]},
                  {width: DIAMETER*0.7333, height: DIAMETER*0.7333, opacity: 0.66675}]}/>,
            <View key={-2} style={[styles.statusWave, {backgroundColor: STATUS_COLORS[trackingStatus]},
                  {width: DIAMETER*0.8667, height: DIAMETER*0.8667, opacity: 0.33325}]}/>
          ]
          :
          [1, 2, 3].map((el, index) => {
            let ratio = CENTER_RATIO + ((elapsedPercent+33*index)%100)/100*(1-CENTER_RATIO);
            return (
              <Animated.View key={index} style={[styles.statusWave, {backgroundColor: STATUS_COLORS[trackingStatus]},
                    {width: DIAMETER*ratio, height: DIAMETER*ratio, opacity: 1-(ratio-CENTER_RATIO)/(1-CENTER_RATIO)}]}/>
            )
          })
        }
        <View style={[styles.statusWave, {backgroundColor: STATUS_COLORS[trackingStatus]},
              {width: DIAMETER*CENTER_RATIO, height: DIAMETER*CENTER_RATIO}]}/>
        <Text style={styles.locationStatus}>{trackingStatus}</Text> */}
      </View>

      <TouchableOpacity style={styles.warningBtn} onPress={() => navigation.navigate("TrackingEmergency")}>
        <Icon name='priority-high' type='material' color='white' size={20}/>
      </TouchableOpacity>

      {/* setting buttons */}
      <View style={styles.settingBtnsContainer}>

        <TouchableOpacity style={[styles.settingBtnContainer, {backgroundColor: trackingStatus === "INACTIVE" ? "white" : COLORS.STRONG_ORANGE}]}
                          onPress={() => {
                            if (trackingStatus === "INACTIVE") setTrackingStatus("SAFE");
                            else (setTrackingStatus("INACTIVE"));
                          }}>
          <Icon name="near-me" type="material" size={20} color={trackingStatus === "INACTIVE" ? "rgb(140, 140, 140)" : "white"}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingBtnContainer} onPress={() => navigation.navigate("TrackingSettings")}>
          <Icon name="date-range" type="material" size={20} color={COLORS.STRONG_ORANGE}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingBtnContainer} onPress={() => navigation.navigate("TrackingSettings")}>
          <Icon name="today" type="material" size={20} color={COLORS.STRONG_ORANGE}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingBtnContainer, {backgroundColor: COLORS.STRONG_ORANGE}]}>
          <Icon name="add-location" type="material" size={20} color="white"/>
        </TouchableOpacity>

        <Text style={[styles.txtSettingBtnGuide, {top: 60}]}>Safe Zone for Selected Day</Text>
        <Text style={[styles.txtSettingBtnGuide, {top: 110}]}>Safe Zone for Tomorrow</Text>
        {/* <Text style={[styles.txtSettingBtnGuide, {top: 110}]}>{newLoc}</Text> */}

      </View>

    </SafeAreaView>

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