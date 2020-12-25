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
  const [children, setChildrenUseState]     = React.useState([]);
  const childrenRef                         = React.useRef(children);  // use reference for listeners to use
  const setChildren = (newChildren) => {childrenRef.current = newChildren; setChildrenUseState(newChildren);}
  const [childId, setChildIdUseState]       = React.useState(null);
  const childIdRef                          = React.useRef(childId);  // use reference for listeners to use
  const setChildId = (newChildId) => {childIdRef.current = newChildId; setChildIdUseState(newChildId);}

  // map positioning & zooming
  const [map, setMap] = React.useState(null);
  const mapRef = React.useRef(map);
  const setMapRef = (mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
  }
  const [latitudeDelta, setLatitudeDeltaUseState] = React.useState(REGION_FPT.latitudeDelta);
  const latitudeDeltaRef = React.useRef(latitudeDelta);
  const setLatitudeDelta = (newLatitudeDelta) => {latitudeDeltaRef.current = newLatitudeDelta; setLatitudeDeltaUseState(newLatitudeDelta);};
  const [longitudeDelta, setLongitudeDeltaUseState] = React.useState(REGION_FPT.longitudeDelta);
  const longitudeDeltaRef = React.useRef(longitudeDelta);
  const setLongitudeDelta = (newLongitudeDelta) => {longitudeDeltaRef.current = newLongitudeDelta; setLongitudeDeltaUseState(newLongitudeDelta);};

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
      if (mapRef.current != null) mapRef.current.animateToRegion({latitude: newLoc.latitude, longitude: newLoc.longitude, latitudeDelta: latitudeDeltaRef.current, longitudeDelta: longitudeDeltaRef.current}, MAP_DURATION);
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
    // const to =   1608638191396;
    // const from = 1608636208408;
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

  const getListOfChildren = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const childId = await AsyncStorage.getItem('child_id');
      const response = await fetch("http://" + ip + PORT + "/parent/" + id + "/children");
      const result = await response.json();
      if (result.code === 200) {
        const tmp = result.data.filter( child => child.isCollaboratorChild === false || (child.isCollaboratorChild === true && child.isConfirm === true));
        if (tmp.length == 0){
          AsyncStorage.removeItem("child_id");
          setChildren([]);
        }
        else{
          setChildren(tmp);
          if (!childId || tmp.filter(child => child.childId == childId).length == 0) await AsyncStorage.setItem('child_id', tmp[0].childId + "");
        }
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChildIdChanged = async () => {
    const childIdTmp = await AsyncStorage.getItem('child_id');
    if (childIdTmp != childIdRef.current) {
      setLoading(true);
      setChildId(childIdTmp);
      setChildren([...childrenRef.current]);
    }
  }

  // load children list
  React.useEffect(() => {
    getListOfChildren();
    // request last locations in 10 minutes
    requestLocationList();
    // listen to location update from server
    listenLocationUpdate();
    // handle screen & app states
    props.navigation.addListener('focus', async () => { await new Promise(resolve => setTimeout(resolve, 1000)); requestEmergencyMode(true); });
    props.navigation.addListener('blur', () => { requestEmergencyMode(false); });
    AppState.addEventListener("change", async (nextState) => {
      if (nextState === "active"){await new Promise(resolve => setTimeout(resolve, 1000)); requestEmergencyMode(true); }
      else requestEmergencyMode(false);
    });
  }, [loading]);

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
      <AvatarContainer children={children} setChildren={handleChildIdChanged} setLoading={setLoading}/>

      {/* back btn */}
      <TouchableOpacity style={styles.backBtn} onPress={() => props.navigation.goBack()}>
        <Image source={require("../../../../assets/icons/back.png")} style={{width: 30, height: 30}} />
      </TouchableOpacity>

      {/* no data popup */}
      <ConfirmationModal 
        t={t}
        visible={isNoData} 
        message={t("tracking-no-reported-location")}
        option="info"
        onConfirm={() => props.navigation.goBack()}
      />

    </View>

  );
};

export default TrackingEmergencyScreen;