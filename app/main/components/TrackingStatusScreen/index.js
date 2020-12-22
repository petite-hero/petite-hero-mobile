import React, { Children, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing, AppState, Linking, Modal } from 'react-native';
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

  const { t } = React.useContext(route.params.localizationContext);
  const WEEKDAYS_ABB = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [loading, setLoading] = React.useState(false);
  const [isCannotConnect, setIsCannotConnect] = React.useState(false);

  // child information
  const [children, setChildrenUseState] = React.useState([]);
  const childrenRef = React.useRef(children);
  const setChildren = (newChildren) => {
    childrenRef.current = newChildren;
    setChildrenUseState(newChildren);
  }
  const [currentChild, setCurrentChildUseState] = React.useState(undefined);
  const currentChildRef = React.useRef(currentChild);
  const setCurrentChild = (newChild) => {
    currentChildRef.current = newChild;
    setCurrentChildUseState(newChild);
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
        let childrenTmp = [...childrenRef.current];
        let currentChild = childrenTmp.filter(child => child.childId == notiData.child)[0];
        if (currentChild){
          const currentStatus = currentChild.status;
          if (notiData.status && currentStatus !== "SAFE" && currentStatus !== "INACTIVE"){
            currentChild.status = "SAFE";
            setChildren(childrenTmp);
          }
          else if (!notiData.status && currentStatus !== "NOT SAFE" && currentStatus !== "INACTIVE"){
            currentChild.status = "NOT SAFE";
            setChildren(childrenTmp);
          }
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
    try {

      // check if childId changed
      const childId = await AsyncStorage.getItem('child_id');
      if ((childrenRef.current.length == 0 && childId != null) ||
         (childrenRef.current.length > 0 && childId != currentChildRef.current.childId))
        setLoading(true);
      
      // get new list
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const response = await fetch("http://" + ip + PORT + "/parent/" + id + "/children");
      const result = await response.json();
      if (result.code === 200) {
        let tmpChildren = result.data.filter(child => child.isCollaboratorChild === false || (child.isCollaboratorChild === true && child.isConfirm === true));
        // empty list
        if (tmpChildren.length == 0){
          if (childrenRef.current.length != 0){
            AsyncStorage.removeItem("child_id");
            setChildren([]);
            setCurrentChild(undefined);
          }
          return;
        }
        else{
          // check if child list changed
          let isChanged = false;
          if (tmpChildren.length != childrenRef.current.length) isChanged = true;
          else{
            let count = 0;
            tmpChildren.map((child, index) => {
              childrenRef.current.map((child2, index2) => {
                if (child.childId == child2.childId) count++;
              });
            });
            if (count == tmpChildren.length) isChanged = true;
          }
          // init new list & currentChild if list changed
          if (isChanged){
            tmpChildren.map((child, index) => {
              if (!child.isTrackingActive) child.status = "INACTIVE";
              else{
                child.status = "LOADING";
                requestEmergencyMode(true, child.childId);
              }
            });
            if (!childId || tmpChildren.filter(child => child.childId == childId).length == 0){
              await AsyncStorage.setItem('child_id', result.data[0].childId + "");
              setCurrentChild(tmpChildren[0]);
            } else setCurrentChild(tmpChildren.filter(child => child.childId == childId)[0]);
            setChildren(tmpChildren);
          }
        }
      }

    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  {/* ===================== END OF CHILD ID CHANGE HANDLING SECTION ===================== */}

  {/* ===================== API SECTION ===================== */}

  // request emergency mode
  const requestEmergencyMode = async (isEmergency, childId) => {
    const ip = await AsyncStorage.getItem('IP');
    let trueChildId = childId;
    if (childId == null) trueChildId = await AsyncStorage.getItem('child_id');
    const response = await fetch('http://' + ip + PORT + '/location/emergency/' + trueChildId + '/' + isEmergency);
    const result = await response.json();
    if (result.code !== 200) console.log("Error while requesting emergency mode '" + isEmergency + "'. Server response: " + JSON.stringify(result));
  }

  // request emergency mode for tracking-active children
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
      if (currentChild?.status == "LOADING"){
        setIsCannotConnect(true);
      }
    }
  }

  // start on screen load
  React.useEffect(() => {

    // handle location status list
    if (!children || children.length == 0){
      AsyncStorage.removeItem("child_id");
      setChildren([]);
    }
    else{
      let childrenTmp = [...children];
      childrenTmp.map((child, index) => {
        if (!child.isTrackingActive) child.status = "INACTIVE";
        else child.status = "LOADING";
      });
      setChildren(childrenTmp);
    }

    // listen to location update from server
    listenLocationUpdate();

    // handle screen & app states
    requestEmergencyModeList(true);
    handleChildIdChanged();
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
      <TouchableOpacity style={styles.warningBtn} disabled={children.length == 0}
                        onPress={() => navigation.navigate("TrackingEmergency", {children: children})}>
        <Text style={styles.warningBtnText}>{t("tracking-emergency")}!</Text>
      </TouchableOpacity>

      {currentChild?.status === "NOT SAFE" ?
        <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:`)}>
          <Icon name="phone-in-talk" type="material" color="white"/>
        </TouchableOpacity>
      : null}

      {/* ===================== END OF AVATAR & EMERGENCY BUTTON SECTION ===================== */}

      {/* ===================== LOCATION STATUS SECTION ===================== */}

      {/* status container */}
      <View style={styles.statusContainer}>
        {children.length == 0 ? <Text style={styles.noChildInfo}>{t("no-child-info")}</Text> : null}
        <LocationStatus
          diameter={wp("70%")}
          margin={0}
          trackingStatus={currentChild?.status}
          photo={currentChild?.photo}
          gender={currentChild?.gender}/>
      </View>

      <View style={styles.statusListContainer}>
        {children.map((child, index) => {
          if (child.childId != currentChild.childId)
            return (
              <LocationStatus key={index}
                diameter={wp("16%")}
                margin={10}
                trackingStatus={child.status}
                photo={child.photo}
                gender={child.gender}
                onPress={async () => {
                  await AsyncStorage.setItem('child_id', child.childId+"");
                  setChildren([...children]);
                  setCurrentChild(child);
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
                                    {backgroundColor: children.length == 0 || currentChild?.status === "INACTIVE" ? "white" : COLORS.STRONG_CYAN, shadowOpacity: 0.2, elevation: 5}]}
            disabled={children.length == 0}
            onPress={() => {
              const isTurningOn = currentChild.status === "INACTIVE";
              requestSmartwatchTracking(isTurningOn);
              requestEmergencyMode(isTurningOn, null);
              let childrenTmp = [...children];
              let newCurrentChild = childrenTmp.filter(child => child.childId == currentChild.childId)[0];
              newCurrentChild.status = isTurningOn ? "LOADING" : "INACTIVE";
              newCurrentChild.isTrackingActive = isTurningOn;
              setChildren(childrenTmp);
              setCurrentChild(newCurrentChild);
            }}
          >
            <Image source={children.length == 0 || currentChild?.status === "INACTIVE" ? require("../../../../assets/icons/location-off.png") : require("../../../../assets/icons/location-on.png")}
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
              navigation.navigate("TrackingSettings", {t: t, children: children, date: (() => {
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
                          disabled={children.length == 0}
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
          <Text style={styles.txtSettingBtnGuide}>{t("tracking-setting-a-day")}</Text>
        </Animated.View>
        <Animated.View style={[styles.txtSettingBtnGuideContainer, {top: 135, width: animSetZoneBtnTextWidth, opacity: animSetZoneBtn}]}>
          <Text style={styles.txtSettingBtnGuide}>{t("tracking-setting-tomorrow")}</Text>
        </Animated.View>

      </View>

      {/* select day calendar */}
      {isPickingDate ?
        <Modal transparent={true} visible={isPickingDate} animationType="fade">
          <TouchableOpacity style={styles.calendarContainer} onPress={() => setIsPickingDate(false)}>
            <View style={styles.calendar}>
              <Text style={{fontSize: 20, fontFamily: "Acumin", color: COLORS.BLACK}}>{t("tracking-select-day")}</Text>
              <View style={{flexDirection: "row", marginTop: 10}}>
                {[0, 1, 2, 3, 4, 5, 6].map((count, index) => {
                  let date = new Date();
                  date.setDate(date.getDate() + count);
                  return (
                    <TouchableOpacity key={index} style={[styles.dateContainer, index == 0 ? {borderColor: COLORS.STRONG_CYAN} : {}]} onPress={() => {
                      setIsPickingDate(false);
                      // check if the selected day is today
                      if (index === 0 && currentChild?.status !== "INACTIVE"){
                        setIsValidation(true);
                        return;
                      }
                      navigation.navigate("TrackingSettings", {t: t, children: children, date: date});
                      animSetZoneBtn.setValue(0);
                      setFlied(false);
                    }}>
                      <Text style={{fontFamily: "Acumin", color: index == 0 ? COLORS.STRONG_CYAN : COLORS.BLACK}}>
                        {WEEKDAYS_ABB[date.getDay()]}
                      </Text>
                      <Text style={{fontFamily: "AcuminBold", color: index == 0 ? COLORS.STRONG_CYAN : COLORS.BLACK}}>
                        {(date.getDate() < 10 ? "0" : "") + date.getDate()}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      : null}

      {/* validation popup */}
      <ConfirmationModal 
        t={t}
        visible={isValidation} 
        message={t("tracking-setting-today-validation")}
        option="info"
        onConfirm={() => setIsValidation(false)}
      />

      {/* ===================== END OF SETTING BUTTONS SECTION ===================== */}

      {/* cannot connect child popup */}
      <ConfirmationModal 
        t={t}
        visible={isCannotConnect} 
        message={t("tracking-cannot-connect")}
        option="info"
        onConfirm={() => {
          setIsCannotConnect(false);
          requestSmartwatchTracking(false);
          requestEmergencyMode(false, null);
          let childrenTmp = [...children];
          let newCurrentChild = childrenTmp.filter(child => child.childId == currentChild.childId)[0];
          newCurrentChild.status = "INACTIVE";
          newCurrentChild.isTrackingActive = false;
          setChildren(childrenTmp);
          setCurrentChild(newCurrentChild);
        }}
      />

    </View>

  );
};

export default TrackingStatusScreen;