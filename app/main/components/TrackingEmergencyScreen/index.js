import React, {useRef} from 'react';
import { SafeAreaView, View, StyleSheet, Dimensions, Image, FlatList, Text } from 'react-native';
import MapView, { Marker, Polyline }  from 'react-native-maps';
import { Icon } from 'react-native-elements';
import Drawer from './drawer';
import styles from './styles/index.css';
import { AsyncStorage } from 'react-native';
import { COLORS, IP, PORT } from '../../../const/const';

import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    let noti = notification.request.content;
    if (noti.title == null) {
      console.log("Do not show notification")
      // return {
      //   shouldShowAlert: false,
      //   shouldPlaySound: false,
      //   shouldSetBadge: false,
      //   priority: Notifications.AndroidNotificationPriority.MIN
      // }
    } else {
      console.log("Show notification")
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        priority: Notifications.AndroidNotificationPriority.MAX
      }
    }
  }
})

const TrackingEmergencyScreen = ({navigation}) => {

  // map positioning & zooming
  [mapLoc, setMapLoc] = React.useState(Drawer.LOC_FPT);  // FPT University location
  [latitudeDelta, setLatitudeDelta] = React.useState(Drawer.LOCATION_ZOOM.latitudeDelta);
  [longitudeDelta, setLongitudeDelta] = React.useState(Drawer.LOCATION_ZOOM.longitudeDelta);

  // reported location list
  // [realLocList, setRealLocList] = React.useState([]);
  [realLocList, setRealLocList] = React.useState(Drawer.realLocList);
  [locList, setLocList] = React.useState([Drawer.locFPT, Drawer.locLandmark]);
  [currentLoc, setCurrentLoc] = React.useState(null);

  // get user location
  // navigator.geolocation.getCurrentPosition(
  //     (data) => {
  //       setLatitude(data.coords.latitude);
  //       this.setState({longitude: data.coords.longitude});
  //     }
  // );

  // [mapLoc, setMapLoc] = React.useState({
  //   latitude: realLocList[realLocList.length-1].latitude,
  //   longitude: realLocList[realLocList.length-1].longitude});  // test
  // setMapLoc({latitude: realLocList[realLocList.length-1].latitude, longitude: realLocList[realLocList.length-1].longitude});

  // const updateLoc = async() => {
  //   const ip = await AsyncStorage.getItem('IP');
  //   const child_id = await AsyncStorage.getItem('child_id');
  //   const response = await fetch('http://' + ip + PORT + '/location/latest/' + child_id);
  //   const result = await response.json();
  //   // setCurrentLoc(result.data);
  //   let realLocListTmp = [...realLocList];
  //   realLocListTmp.push(result.data);
  //   setRealLocList(realLocListTmp);
  //   setMapLoc(result.data);
  // }
  // React.useEffect(() => {
  //   this.timer = setInterval(()=> updateLoc(), 5000);
  // }, []);

  // const getInitialLoc = async() => {
  //   const ip = await AsyncStorage.getItem('IP');
  //   const child_id = await AsyncStorage.getItem('child_id');
  //   const response = await fetch('http://' + ip + PORT + '/location/latest/' + child_id);
  //   const result = await response.json();
  //   setCurrentLoc(result.data);
  //   setMapLoc(result.data);
  // }
  // React.useEffect(() => {
  //   getInitialLoc();
  // }, []);

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
      
      if (notification.request.content.title === null && notification.request.content.body === null) { // Silent noti for updating child loc
        let realLocListTmp = [...realLocList];
        realLocListTmp.push(notification.request.content.data);
        setRealLocList(realLocListTmp);
        // setCurrentLoc(notification.request.content.data);
        setMapLoc(notification.request.content.data);
        console.log("Foreground noti listener: ");
        console.log(notification.request.content.data)
      } else {
        // insert codes to handle something else here
        console.log("Foreground noti listener: ");
        console.log(notification.request.content.data)
      }
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { 
      console.log("Background noti listener: ");
      console.log(response.request.content.data)
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

    // if (Platform.OS === 'android') {
    //   Notifications.createChannelAndroidAsync('sound-noti', {
    //     name: 'Sound Notifcation',
    //     sound: true,
    //     vibrate: [0, 250, 500, 250]
    //   });
      
    //   Notifications.createChannelAndroidAsync('silent-noti', {
    //     name: 'Silent Notifcation',
    //     vibrate: false,
    //     sound: false,
    //   });
    // }
    return token;
  }

  // request emergency mode
  const requestEmergencyModeStop = async () => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const response = await fetch('http://' + ip + PORT + '/location/emergency/' + childId + '/false');
    const result = await response.json();
    if (result.code !== 200) {
      console.log("Error while requesting emergency mode. Server response: " + JSON.stringify(result));
    }
  }

  return (

    <SafeAreaView style={styles.container}>

      {/* ===================== MAP SECTION ===================== */}

      {/* maps */}
      <View style={{...StyleSheet.absoluteFillObject}}>

        <MapView
          style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
          region={{latitude: mapLoc.latitude, longitude: mapLoc.longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta}}
          showsUserLocation={true}
          showsMyLocationButton={false}>

          {/* {currentLoc == null ? null :
            <Marker coordinate={{latitude: currentLoc.latitude, longitude: currentLoc.longitude}} anchor={{x: 0.5, y: 0.5}}>
              <View style={styles.realLoc}/>
            </Marker>
          } */}

          {/* {locList.map((loc, index) => {
            return (
              <Marker key={index} coordinate={{latitude: loc.latitude, longitude: loc.longitude}} anchor={{x: 0.5, y: 0.5}}>
                <View style={styles.safeLoc}/>
              </Marker>
            )
          })} */}

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

          {realLocList.map((loc, index) => {
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
          })}

          {/* <FlatList
            data={realLocList}
            renderItem={({ item, index }) => 
              <Marker key={index} coordinate={{latitude: item.latitude, longitude: item.longitude}} anchor={{x: 0.5, y: 0.5}}/>
                <View style={[styles.realLoc, {height: 12*(index+1)/realLocList.length, width: 12*(index+1)/realLocList.length}]}/>
              </Marker>
            }
            keyExtractor={item => item.time+""}
          /> */}
          
        </MapView>

      </View>

      {/* ===================== END MAP SECTION ===================== */}

      <View>
        <Text>123</Text>
        <FlatList
            data={realLocList}
            renderItem={({ item, index }) => 
              <Text key={index}>{item.time}</Text>
            }
            keyExtractor={item => item.time+""}
          />
      </View>

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
            requestEmergencyModeStop();
          }}/>
      </View>

    </SafeAreaView>

  );
};

export default TrackingEmergencyScreen;