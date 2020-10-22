import React from 'react';
import { SafeAreaView, View, StyleSheet, Dimensions, Image, AppState } from 'react-native';
import MapView, { Marker, Polyline }  from 'react-native-maps';
import { Icon } from 'react-native-elements';
import Drawer from './drawer';
import styles from './styles/index.css';
import { AsyncStorage } from 'react-native';
import { COLORS, PORT } from '../../../const/const';

import * as Notifications from 'expo-notifications';

// silent notification for updating location
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    let noti = notification.request.content;
    if (noti.title == null) {
      // console.log("Do not show notification");
    } else {
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

const TrackingEmergencyScreen = ({navigation}) => {

  // map positioning & zooming
  [mapLoc, setMapLoc] = React.useState(Drawer.LOC_FPT);  // FPT University location
  [latitudeDelta, setLatitudeDelta] = React.useState(Drawer.LOCATION_ZOOM.latitudeDelta);
  [longitudeDelta, setLongitudeDelta] = React.useState(Drawer.LOCATION_ZOOM.longitudeDelta);

  // reported location list
  [realLocList, setRealLocList] = React.useState([]);
  // [realLocList, setRealLocList] = React.useState(Drawer.realLocList);
  [locList, setLocList] = React.useState([Drawer.locFPT, Drawer.locLandmark]);

  // get user location
  // navigator.geolocation.getCurrentPosition(
  //     (data) => {
  //       setLatitude(data.coords.latitude);
  //       this.setState({longitude: data.coords.longitude});
  //     }
  // );

  // listen to location updates
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const listenLocationUpdate = () => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Silent noti for updating child loc
      if (notification.request.content.title === null && notification.request.content.body === null) { 
        const newLoc = notification.request.content.data;
        let realLocListTmp = [...realLocList];
        realLocListTmp.push(newLoc);
        setRealLocList(realLocListTmp);
        setMapLoc(newLoc);
      }
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
    // listen to location update from server
    listenLocationUpdate();
    // handle screen & app states
    navigation.addListener('focus', () => { requestEmergencyMode(true); });
    navigation.addListener('blur', () => { requestEmergencyMode(false); });
    AppState.addEventListener("change", (nextState) => {
      if (nextState === "active")  requestEmergencyMode(true);
      else requestEmergencyMode(false);
    });
  }, []);


  // MAIN INTERFACE
  return (

    <SafeAreaView style={styles.container}>

      {/* ===================== MAP SECTION ===================== */}

      {/* maps */}
      <View style={{...StyleSheet.absoluteFillObject}}>

        <MapView
          style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
          region={{latitude: mapLoc.latitude, longitude: mapLoc.longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta}}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onRegionChangeComplete={(region) => {
            setMapLoc({name: mapLoc.name, latitude: region.latitude, longitude: region.longitude});
            setLatitudeDelta(region.latitudeDelta);
            setLongitudeDelta(region.longitudeDelta);
          }}>

          {locList.map((loc, index) => {
            return (
              <Marker key={index} coordinate={{latitude: loc.latitude, longitude: loc.longitude}} anchor={{x: 0.5, y: 0.5}}>
                <View style={styles.safeLoc}/>
              </Marker>
            )
          })}

          {/* {realLocList.map((loc, index) => {
            return (
              [
                <Marker key={-index} coordinate={{latitude: loc.latitude, longitude: loc.longitude}} anchor={{x: 0.5, y: 0.5}}>
                  <View style={[styles.realLoc, {height: 12*(index+1)/realLocList.length, width: 12*(index+1)/realLocList.length}]}/>
                </Marker>,
                index != 0 ?
                  <Polyline key={index+realLocList.length}
                            coordinates={[loc, realLocList[index-1]]}
                            strokeWidth={6*(index+1)/realLocList.length}
                            strokeColor="rgba(244, 126, 62, 0.5)"/>
                : null
              ]
            )
          })} */}
          {realLocList.length >= 1 ?
            <Marker coordinate={{latitude: realLocList[realLocList.length-1].latitude, longitude: realLocList[realLocList.length-1].longitude}} anchor={{x: 0.5, y: 0.5}}>
              <View style={[styles.realLoc, {height: 14, width: 14}]}/>
            </Marker>
          : null}
          {realLocList.map((loc, index) => {
            return (
              index != 0 ?
                <Polyline key={index} coordinates={[loc, realLocList[index-1]]}
                          strokeWidth={10*(index+1)/realLocList.length} strokeColor="rgba(244, 126, 62, 0.5)"/>
              : null
            )
          })}
          
        </MapView>

      </View>

      {/* ===================== END MAP SECTION ===================== */}

      {/* child avatar */}
      <Image
        style={[styles.avatar, {backgroundColor: COLORS.STRONG_ORANGE}]}
        source={require('../../../../assets/kid-avatar.png')}
      />

      {/* back btn */}
      <View style={styles.backBtn}>
        <Icon name='arrow-back' type='material' size={34}
          onPress={() => {
            navigation.goBack();
          }}/>
      </View>

    </SafeAreaView>

  );
};

export default TrackingEmergencyScreen;


  // Tuan
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