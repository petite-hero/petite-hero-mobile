import React from 'react';
import { View, Keyboard, Image, Text, AsyncStorage, Animated, Easing, Alert } from 'react-native';

import styles from './styles/index.css';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS, PORT } from "../../../const/const";

import Util from './util';
import { Loader } from '../../../utils/loader';
import TrackingSettingMap from './map';
import TrackingSettingControlPanel from './control-panel';
import TrackingSettingLocation from './setting-panel';
import TrackingSettingLocationSubProps from './sub-setting-panel';
import TrackingSettingButtons from './buttons';


const TrackingSettingsScreen = ({ route }) => {

  {/* ===================== VARIABLE SECTION ===================== */}

  // states
  [isLoading, setIsLoading] = React.useState(false);
  [status, setStatus] = React.useState("VIEWING");  // VIEWING, PINNING, SETTING_LOC_NEW, SETTING_LOC
  [substatus, setSubstatus] = React.useState("");  // "", TYPE, REPEAT, SEARCH
  const CURRENT_DATE = Util.dateToHour0(route.params.date);
  const RADIUS_MIN = 40;

  // map positioning & zooming
  [mapLoc, setMapLoc] = React.useState(Util.LOC_FPT);  // FPT University location
  [latitudeDelta, setLatitudeDelta] = React.useState(Util.LOCATION_ZOOM.latitudeDelta);
  [longitudeDelta, setLongitudeDelta] = React.useState(Util.LOCATION_ZOOM.longitudeDelta);
  
  // location list
  [locList, setLocList] = React.useState([]);

  // attributes for setting a location
  [settingLoc, setSettingLoc] = React.useState({});
  [settingLocMap, setSettingLocMap] = React.useState({});
  [settingLocDetail, setSettingLocDetail] = React.useState({});
  [lName, setLName] = React.useState("");
  [lType, setLType] = React.useState("None");  // None, Home, Education
  [lTypeTmp, setLTypeTmp] = React.useState("None");
  [lRadius, setLRadius] = React.useState(0);
  [lInitialRadius, setLInitialRadius] = React.useState(0);
  [lInTime, setLInTime] = React.useState("None");  [lInTimeDate, setLInTimeDate] = React.useState(null);
  [lOutTime, setLOutTime] = React.useState("None");  [lOutTimeDate, setLOutTimeDate] = React.useState(null);
  [lIndex, setLIndex] = React.useState(0);
  [lRepeat, setLRepeat] = React.useState([false, false, false, false, false, false, false]);
  [lRepeatTmp, setLRepeatTmp] = React.useState([false, false, false, false, false, false, false]);
  [lRepeatAll, setLRepeatAll] = React.useState(false);
  [searchBar, setSearchBar] = React.useState(null);

  // animation
  const FLY_DURATION = 300;
  const animSettingLoc = React.useRef(new Animated.Value(0)).current;
  const animSettingLocLeft = animSettingLoc.interpolate({inputRange: [0, 1], outputRange: [wp("100%"), 0]});
  const animSettingLocProps = React.useRef(new Animated.Value(0)).current;
  const animSettingLocPropsLeft = animSettingLocProps.interpolate({inputRange: [0, 1], outputRange: [wp("100%"), 0]});

  {/* ===================== END OF VARIABLE SECTION ===================== */}

  {/* ===================== API SECTION ===================== */}

  // fetch location list
  const fetchLocList = async () => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const response = await fetch('http://' + ip + PORT + '/location/list/' + childId + '/' + CURRENT_DATE.getTime());
    const result = await response.json();
    if (result.code === 200) {
      setLocList(result.data);
    } else {
      console.log("Error while fetching tracking status. Server response: " + JSON.stringify(result));
    }
  }
  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchLocList();
      setIsLoading(false);
    })();
  }, []);

  // add location
  const addLocation = async () => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const userId = await AsyncStorage.getItem('user_id');
    const body = JSON.stringify({
      childId: childId,
      creator: userId,
      date: CURRENT_DATE.getTime(),
      fromTime: lInTimeDate,
      latitude: settingLocDetail.latitude,
      longitude: settingLocDetail.longitude,
      name: lName,
      radius: lRadius,
      repeatOn: "",
      toTime: lOutTimeDate,
      type: lType
    });
    const response = await fetch('http://' + ip + PORT + '/location/safezone',
      {method: 'POST', headers: {'Content-Type': 'application/json'}, body: body});
    const result = await response.json();
    if (result.code !== 200) console.log("Error while adding location. Server response: " + JSON.stringify(result));
  }

  // edit location
  const editLocation = async () => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const userId = await AsyncStorage.getItem('user_id');
    const body = JSON.stringify({
      childId: childId,
      creator: userId,
      date: CURRENT_DATE.getTime(),
      safezoneId: settingLocDetail.safezoneId,
      fromTime: lInTimeDate,
      latitude: settingLocDetail.latitude,
      longitude: settingLocDetail.longitude,
      name: lName,
      radius: lRadius,
      repeatOn: "",
      toTime: lOutTimeDate,
      type: lType
    });
    const response = await fetch('http://' + ip + PORT + '/location/safezone',
      {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: body});
    const result = await response.json();
    if (result.code !== 200) console.log("Error while updating location. Server response: " + JSON.stringify(result));
  }

  // delete location
  const deleteLocation = async () => {
    const ip = await AsyncStorage.getItem('IP');
    const safeZoneId = settingLocDetail.safezoneId;
    const response = await fetch('http://' + ip + PORT + '/location/safezone/' + safeZoneId, {method: 'DELETE'});
    const result = await response.json();
    if (result.code !== 200) console.log("Error while deleting location. Server response: " + JSON.stringify(result));
  }

  {/* ===================== END OF API SECTION ===================== */}
  

  {/* ==================================================================================================== */}
  {/* ========================================== USER INTERFACE ========================================== */}
  return (

    <View style={styles.container}>

      <Loader loading={isLoading}/>

      {/* ===================== MAP SECTION ===================== */}

      <TrackingSettingMap

        status={status}
        mapLoc={mapLoc}
        latitudeDelta={latitudeDelta}
        longitudeDelta={longitudeDelta}
        locList={locList}
        
        settingLoc={settingLocMap}
        lRadius={lRadius}
        
        onRegionChangeComplete={(region) => {
          setMapLoc({name: mapLoc.name, latitude: region.latitude, longitude: region.longitude});
          setLatitudeDelta(region.latitudeDelta);
          setLongitudeDelta(region.longitudeDelta);
        }}

      />

      {/* ===================== END MAP SECTION ===================== */}

      {/* child avatar & date */}
      {substatus === "SEARCH" ? null : [
        <Image key={0}
          style={[styles.avatar, {backgroundColor: COLORS.STRONG_ORANGE}]}
          source={require('../../../../assets/kid-avatar.png')}
        />,
        <Text key={1} style={styles.date}>{Util.dateToStr(route.params.date)}</Text>]
      }

      {/* ===================== CONTROL PANEL SECTION ===================== */}

      <View style={[substatus === "SEARCH" ? styles.controlPanelContainerFocused : styles.controlPanelContainer,
                    status === "PINNING" ? {height: 0, width: 0, opacity: 0} : {}]}>

        {/* control panel with search bar and location list */}
        <TrackingSettingControlPanel

          status={status}
          substatus={substatus}
          locList={locList}

          setIsLoading={setIsLoading}
          setSearchBar={setSearchBar}
          onSearchBarPress={() => setSubstatus("SEARCH")}
          onSearchResultPress={(data, details = null) => {
            setMapLoc({name: details.name, latitude: details.geometry.location.lat, longitude: details.geometry.location.lng});
            setSubstatus("");
            setLatitudeDelta(Util.LOCATION_ZOOM.latitudeDelta);
            setLongitudeDelta(Util.LOCATION_ZOOM.longitudeDelta);
            setStatus("PINNING");
          }}
          onBackIconPress={() => {
            setSubstatus("");
            Keyboard.dismiss();
          }}

          onLocationItemPress={(loc, index) => {
            setSettingLocMap(loc);
            setSettingLocDetail(loc);
            setMapLoc({latitude: loc.latitude-latitudeDelta/4, longitude: loc.longitude});
            setLName(loc.name);
            setLRadius(loc.radius);
            setLInitialRadius(loc.radius);
            setLInTime(loc.fromTime);
            setLOutTime(loc.toTime);
            setLType(loc.type)
            setLIndex(index);
            setLatitudeDelta(Util.LOCATION_ZOOM.latitudeDelta);
            setLongitudeDelta(Util.LOCATION_ZOOM.longitudeDelta);
            setStatus("SETTING_LOC");
            animSettingLoc.setValue(0);
            Animated.timing(animSettingLoc, {toValue: 1, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false}).start();
          }}

        />

        {/* location setting attributes */}
        <TrackingSettingLocation

          animLeft={animSettingLocLeft}

          settingLoc={settingLocDetail}
          type={lType}
          radius={lRadius}
          fromTime={lInTime}
          ttoTime={lOutTime}
          repeat={lRepeat}
          initialRadius={lInitialRadius}

          onNameChange={(text) => setLName(text)}
          onRadiusChange={(value) => setLRadius(value)}
          onFromTimeSelected={(event, time) => {
            if (time == null) return;
            setLInTime(Util.numberTo2Digits(time.getHours()) + ":" + Util.numberTo2Digits(time.getMinutes()) + ":00");
            setLInTimeDate(time);
          }}
          onToTimeSelected={(event, time) => {
            if (time == null) return;
            setLOutTime(Util.numberTo2Digits(time.getHours()) + ":" + Util.numberTo2Digits(time.getMinutes()) + ":00");
            setLOutTimeDate(time);
          }}

          onTypeSelecting={() => {
            setSubstatus("TYPE");
            setLTypeTmp(lType);
            animSettingLocProps.setValue(0);
            Animated.timing(animSettingLocProps, {toValue: 1, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false}).start();
          }}
          onRepeatSelecting={() => {
            setSubstatus("REPEAT");
            setLRepeatTmp([...lRepeat]);
            animSettingLocProps.setValue(0);
            Animated.timing(animSettingLocProps, {toValue: 1, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false}).start();
          }}

        />

        {/* location setting sub-attributes */}
        <TrackingSettingLocationSubProps

          animLeft={animSettingLocPropsLeft}
          substatus={substatus}

          lTypeTmp={lTypeTmp}
          lRepeatTmp={lRepeatTmp}
          lRepeatAll={lRepeatAll}

          onTypeEntrySelected={(type) => {
            if (lTypeTmp !== type) setLTypeTmp(type);
            else setLTypeTmp("None");
          }}
          onRepeatEntrySelected={(index) => {
            let newLRepeat = [...lRepeatTmp];
            newLRepeat[index] = !newLRepeat[index];
            setLRepeatTmp(newLRepeat);
          }}
          onRepeatEntryAllSelected={() => {
            let newLRepeat = [...lRepeatTmp];
            newLRepeat.map((day, index) => {newLRepeat[index] = !lRepeatAll});
            setLRepeatTmp(newLRepeat);
            setLRepeatAll(!lRepeatAll);
          }}

        />

      </View>

      {/* action buttons */}
      <TrackingSettingButtons

        status={status}

        onPinningCancel={() => {
          setStatus("VIEWING");
          searchBar.setAddressText("");
        }}
        onPinningConfirm={() => {
          setSettingLocMap(mapLoc);
          setSettingLocDetail(mapLoc);
          setLName(mapLoc.name);
          setMapLoc({latitude: mapLoc.latitude-latitudeDelta/4, longitude: mapLoc.longitude});

          setLType("None");
          setLRadius(RADIUS_MIN);
          setLInTime("None");
          setLOutTime("None");
          setLRepeat([false, false, false, false, false, false, false]);
          setLInitialRadius(RADIUS_MIN);
          
          setStatus("SETTING_LOC_NEW");
          searchBar.setAddressText("");
          animSettingLoc.setValue(1);
        }}

        onSettingCancel={() => {
          if (substatus === ""){
            animSettingLoc.setValue(1);
            Animated.timing(animSettingLoc, {toValue: 0, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false}).start();
            setStatus("VIEWING");
          }
          else if (substatus === "TYPE" || substatus === "REPEAT"){
            animSettingLocProps.setValue(1);
            Animated.timing(animSettingLocProps, {toValue: 0, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false})
              .start(() => setSubstatus(""));
          }
        }}
        onSettingSave={() => {
          if (substatus === ""){
            (async() => {
              setIsLoading(true);
              if (status === "SETTING_LOC_NEW") await addLocation();
              else if (status === "SETTING_LOC") await editLocation();
              await fetchLocList();
              setIsLoading(false);
              animSettingLoc.setValue(1);
              Animated.timing(animSettingLoc, {toValue: 0, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false}).start();
              setStatus("VIEWING");
            })();
          }
          else if (substatus === "TYPE"){
            setLType(lTypeTmp);
            animSettingLocProps.setValue(1);
            Animated.timing(animSettingLocProps, {toValue: 0, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false})
              .start(() => setSubstatus(""));
          }
          else if (substatus === "REPEAT"){
            setLRepeat(lRepeatTmp);
            animSettingLocProps.setValue(1);
            Animated.timing(animSettingLocProps, {toValue: 0, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false})
              .start(() => setSubstatus(""));
          }
        }}
        onSettingDelete={() => {
          Alert.alert(null, 'Delete this location?',
            [{text: 'OK', onPress: async() => {
                setIsLoading(true);
                await deleteLocation();
                await fetchLocList();
                setIsLoading(false);
                animSettingLoc.setValue(1);
                Animated.timing(animSettingLoc, {toValue: 0, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false}).start();
                setStatus("VIEWING");
            }},
            {text: 'Cancel'}]
          );
        }}

      />
      
      {/* ===================== END CONTROL PANEL SECTION ===================== */}

    </View>

  );
};

export default TrackingSettingsScreen;