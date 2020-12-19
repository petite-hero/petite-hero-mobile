import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions, AppState, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, { Marker, Polyline }  from 'react-native-maps';
import * as Notifications from 'expo-notifications';

import styles from './styles/index.css';
import { PORT, COLORS, changeOpac } from '../../../const/const';

import { Loader } from '../../../utils/loader';
import AvatarContainer from '../AvatarContainer';
import { ConfirmationModal } from "../../../utils/modal";


const TrackingEmergencyScreen = (props) => {
const { t } = useContext(props.route.params.localizationContext);
  {/* ===================== VARIABLE SECTION ===================== */}

  // constances
  const REGION_FPT = {latitude: 10.8414846, longitude: 106.8100464, latitudeDelta: 0.032, longitudeDelta: 0.016};
  const MAP_DURATION = 200;

  const [loading, setLoading] = React.useState(true);
  const [isNoData, setIsNoData] = React.useState(false);

  // children information
  const [children, setChildren] = React.useState(props.route.params.children);

  // map positioning & zooming
  const [map, setMap] = React.useState(null);
  const mapRef = React.useRef(map);
  const setMapRef = (mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
  }
  const [latitudeDelta, setLatitudeDelta] = React.useState(REGION_FPT.latitudeDelta);
  const [longitudeDelta, setLongitudeDelta] = React.useState(REGION_FPT.longitudeDelta);

  // reported location list
  const [realLocList, setRealLocList] = React.useState([]);
  const [locList, setLocList] = React.useState([]);

  {/* ===================== END OF VARIABLE SECTION ===================== */}

  {/* ===================== LOCATION UPDATE HANDLING SECTION ===================== */}

  // listen to location updates
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const listenLocationUpdate = () => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Silent noti for updating child loc
      const newLoc = notification.request.content.data;
      setRealLocList(realLocList => [...realLocList, newLoc]);
      if (mapRef.current != null) mapRef.current.animateToRegion({latitude: newLoc.latitude, longitude: newLoc.longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta}, MAP_DURATION);
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
  const requestEmergencyMode = async (isEmergency) => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const response = await fetch('http://' + ip + PORT + '/location/emergency/' + childId + '/' + isEmergency);
    const result = await response.json();
    if (result.code !== 200) {
      console.log("Error while requesting emergency mode '" + isEmergency + "'. Server response: " + JSON.stringify(result));
    }
  }

  // request location list
  const requestLocationList = async () => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const to = Date.now();
    const from = to - 10*60000; 
    const response = await fetch('http://' + ip + PORT + '/location/list/' + childId + '/' + from + '/' + to);
    const result = await response.json();
    setLoading(false);
    if (result.code == 200){
      if (result.data.length == 0){
        setIsNoData(true);
        return;
      }
      setRealLocList(result.data);
      const newLoc = result.data[result.data.length - 1];
      if (mapRef.current != null) mapRef.current.animateToRegion({latitude: newLoc.latitude, longitude: newLoc.longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta}, MAP_DURATION);
    }
    else{
      console.log("Error while requesting emergency mode '" + isEmergency + "'. Server response: " + JSON.stringify(result));
      props.navigation.goBack();
    }
  }

  // start on screen load
  React.useEffect(() => {

    // request last locations in 10 minutes
    requestLocationList();

    // listen to location update from server
    listenLocationUpdate();

    // handle screen & app states
    props.navigation.addListener('focus', () => { requestEmergencyMode(true); });
    props.navigation.addListener('blur', () => { requestEmergencyMode(false); });
    AppState.addEventListener("change", (nextState) => {
      if (nextState === "active")  requestEmergencyMode(true);
      else requestEmergencyMode(false);
    });

  }, []);

  {/* ===================== END OF API SECTION ===================== */}

  {/* ==================================================================================================== */}
  {/* ========================================== USER INTERFACE ========================================== */}
  return (

    <View style={styles.container}>

      <Loader loading={loading}/>

      {/* ===================== MAP SECTION ===================== */}

      {/* maps */}
      <View style={{...StyleSheet.absoluteFillObject}}>

        <MapView
          ref={(instance) => {setMapRef(instance)}}
          style={{width: Dimensions.get("screen").width, height: Dimensions.get("screen").height}}
          initialRegion={REGION_FPT}
          // showsUserLocation={true}
          showsMyLocationButton={false}
          onRegionChangeComplete={(region) => {
            setLatitudeDelta(region.latitudeDelta);
            setLongitudeDelta(region.longitudeDelta);
          }}>

          {/* safe zone list */}
          {/* {locList.map((loc, index) => {
            return (
              <Marker key={index} coordinate={{latitude: loc.latitude, longitude: loc.longitude}} anchor={{x: 0.5, y: 0.5}}>
                <View style={styles.safeLoc}/>
              </Marker>
            )
          })} */}

          {/* reported location list */}
          {realLocList.length >= 1 ?
            <Marker coordinate={{latitude: realLocList[realLocList.length-1].latitude, longitude: realLocList[realLocList.length-1].longitude}} anchor={{x: 0.5, y: 0.5}}>
              <View style={styles.realLocContainer}>
                <View style={styles.realLoc}/>
              </View>
            </Marker>
          : null}
          {realLocList.map((loc, index) => {
            return (
              index != 0 ?
                <Polyline key={index} coordinates={[loc, realLocList[index-1]]}
                          strokeWidth={10*(index+1)/realLocList.length} strokeColor={changeOpac(COLORS.RED, 0.5)}/>
              : null
            )
          })}
          
        </MapView>

      </View>

      {/* ===================== END MAP SECTION ===================== */}

      {/* child avatar */}
      <AvatarContainer children={children} setChildren={setChildren} setLoading={setLoading}/>

      {/* back btn */}
      <TouchableOpacity style={styles.backBtn} onPress={() => props.navigation.goBack()}>
        <Image source={require("../../../../assets/icons/back.png")} style={{width: 30, height: 30}} />
      </TouchableOpacity>

      {/* no data popup */}
      <ConfirmationModal 
        t={t}
        visible={isNoData} 
        message={"Child has no recently reported location."}
        option="info"
        onConfirm={() => props.navigation.goBack()}
      />

    </View>

  );
};

export default TrackingEmergencyScreen;



  // const [expoPushToken, setExpoPushToken] = React.useState('');
  // const [notification, setNotification] = React.useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  // [newLoc, setNewLoc] = React.useState(null);

  // React.useEffect(() => {

  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   // This listener is fired whenever a notification is received while the app is foregrounded
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {

  //     setNotification(notification);
      
  //     if (notification.request.content.title === null && notification.request.content.body === null) { // Silent noti for updating child loc
  //       let realLocListTmp = [...realLocList];
  //       realLocListTmp.push(notification.request.content.data);
  //       setRealLocList(realLocListTmp);
  //       // setCurrentLoc(notification.request.content.data);
  //       setMapLoc(notification.request.content.data);
  //       console.log("Foreground noti listener: ");
  //       console.log(notification.request.content.data)
  //     } else {
  //       // insert codes to handle something else here
  //       console.log("Foreground noti listener: ");
  //       console.log(notification.request.content.data)
  //     }
  //   });

  //   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { 
  //     console.log("Background noti listener: ");
  //     console.log(response.request.content.data)
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener);
  //     Notifications.removeNotificationSubscription(responseListener);
  //   };

  // }, []);

  // async function registerForPushNotificationsAsync() {
  //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //   if (status !== 'granted') {
  //     alert('You need to grant permission to receive Notifications!');
  //     return;
  //   }
  //   let token = (await Notifications.getExpoPushTokenAsync()).data;
  //   console.log("Your device token: ", token);

  //   // if (Platform.OS === 'android') {
  //   //   Notifications.createChannelAndroidAsync('sound-noti', {
  //   //     name: 'Sound Notifcation',
  //   //     sound: true,
  //   //     vibrate: [0, 250, 500, 250]
  //   //   });
      
  //   //   Notifications.createChannelAndroidAsync('silent-noti', {
  //   //     name: 'Silent Notifcation',
  //   //     vibrate: false,
  //   //     sound: false,
  //   //   });
  //   // }
  //   return token;
  // }