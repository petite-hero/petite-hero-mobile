import React, {useRef} from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Image, Animated, Easing } from 'react-native';
import { Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles/index.css';
import { COLORS, PORT } from '../../../const/const';
import { AsyncStorage } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TaskScreen from '../TaskScreen';
import QuestScreen from '../QuestScreen';
import ProfileScreen from '../ProfileScreen';
import { fetchUpdateAsync } from 'expo-updates';

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


// screen content
const TrackingStatusScreenContent = ({ navigation }) => {

  // tracking status
  [trackingStatus, setTrackingStatus] = React.useState("LOADING");  // LOADING, INACTIVE, SAFE, NOT SAFE
  const STATUS_COLORS = {"LOADING": "rgb(140, 140, 140)", "INACTIVE": "rgb(140, 140, 140)", "SAFE": "rgb(0, 154, 34)", "NOT SAFE": "red"};

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

  // fetching data
  const fetchTrackingStatus = async () => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const response = await fetch('http://' + ip + PORT + '/location/latest/' + childId);
    const result = await response.json();  // {"latitude": 1, "longitude": 1, "status": true}
    if (result.code === 200) {
      if (result.data.status){
        setTrackingStatus("SAFE");
        Animated.loop(Animated.timing(animTrackingStatus, {toValue: 1, duration: STATUS_DURATION, easing: Easing.linear, useNativeDriver: true})).start();
      }
      else{
        setTrackingStatus("NOT SAFE");
        Animated.loop(Animated.timing(animTrackingStatus, {toValue: 1, duration: STATUS_DURATION/2, easing: Easing.linear, useNativeDriver: true})).start();
      }
    } else {
      console.log("Error while fetching tracking status. Server response: " + JSON.stringify(result));
    }
  }

  React.useEffect(() => {fetchTrackingStatus()}, []);

  return (

    <SafeAreaView style={styles.container}>

      <Image
        style={[styles.avatar, {backgroundColor: COLORS.STRONG_ORANGE}]}
        source={require('../../../../assets/kid-avatar.png')}
      />

      <TouchableOpacity style={styles.warningBtn} onPress={() => navigation.navigate("TrackingEmergency")}>
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
          <TouchableOpacity style={[styles.settingBtnContainer, {backgroundColor: trackingStatus === "INACTIVE" ? "white" : COLORS.STRONG_ORANGE}]}
            onPress={() => {
              if (trackingStatus === "INACTIVE"){
                setTrackingStatus("LOADING");
                animTrackingStatus.setValue(0);
                fetchTrackingStatus();
              }
              else{
                setTrackingStatus("INACTIVE");
                animTrackingStatus.stopAnimation();
              }
            }}
          >
            <Icon name="near-me" type="material" size={20} color={trackingStatus === "INACTIVE" ? "rgb(140, 140, 140)" : "white"}/>
          </TouchableOpacity>
        </Animated.View>
        {/* choose date for setting button */}
        <Animated.View style={{position: "relative", top: animSetZoneBtnTopDay, opacity: animSetZoneBtn}}>
          <TouchableOpacity style={styles.settingBtnContainer} onPress={() => setIsPickingDate(true)}>
            <Icon name="date-range" type="material" size={20} color={COLORS.STRONG_ORANGE}/>
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
            <Icon name="today" type="material" size={20} color={COLORS.STRONG_ORANGE}/>
          </TouchableOpacity>
        </Animated.View>
        {/* setting animation button */}
        <TouchableOpacity style={[styles.settingBtnContainer, {backgroundColor: COLORS.STRONG_ORANGE}]} onPressIn={() => {
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

        {isPickingDate ?
          <DateTimePicker
            value={(() => {let today = new Date(); today.setDate(today.getDate()+1); return today;})()}
            minimumDate={new Date()}
            mode={"date"}
            onChange={(event, date) => {
              setIsPickingDate(false);
              if (date === null) return;
              navigation.navigate("TrackingSettings", {date: date});
              animSetZoneBtn.setValue(0);
              setFlied(false);
            }}
          />
        : null}

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