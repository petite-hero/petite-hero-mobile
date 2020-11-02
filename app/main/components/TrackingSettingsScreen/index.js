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
  [map, setMap] = React.useState(null);
  
  // location list
  [locList, setLocList] = React.useState([]);

  // attributes for setting a location
  [settingLocMap, setSettingLocMap] = React.useState({});
  [settingLocDetail, setSettingLocDetail] = React.useState({});
  [lName, setLName] = React.useState("");
  [lType, setLType] = React.useState("None");  // None, Home, Education
  [lTypeTmp, setLTypeTmp] = React.useState("None");
  [lRadius, setLRadius] = React.useState(0);
  [lInitialRadius, setLInitialRadius] = React.useState(0);
  [lFromTime, setLFromTime] = React.useState("None");  [lFromTimeDate, setLFromTimeDate] = React.useState(null);
  [lToTime, setLToTime] = React.useState("None");  [lToTimeDate, setLToTimeDate] = React.useState(null);
  [lIndex, setLIndex] = React.useState(0);
  [lRepeat, setLRepeat] = React.useState([false, false, false, false, false, false, false]);
  [lRepeatTmp, setLRepeatTmp] = React.useState([false, false, false, false, false, false, false]);
  [lRepeatAll, setLRepeatAll] = React.useState(false);
  [searchBar, setSearchBar] = React.useState(null);

  // animation
  const MAP_DURATION = 700;
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
    if (result.code === 200) setLocList(result.data);
    else console.log("Error while fetching tracking status. Server response: " + JSON.stringify(result));
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
      fromTime: lFromTimeDate,
      latitude: settingLocDetail.latitude,
      longitude: settingLocDetail.longitude,
      name: lName,
      radius: lRadius,
      repeatOn: "",
      toTime: lToTimeDate,
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
      fromTime: lFromTimeDate,
      latitude: settingLocDetail.latitude,
      longitude: settingLocDetail.longitude,
      name: lName,
      radius: lRadius,
      repeatOn: "",
      toTime: lToTimeDate,
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
        locList={locList}
        
        settingLoc={settingLocMap}
        lRadius={lRadius}
        
        setMap={setMap}
        onRegionChangeComplete={(region) => {
          if (status === "PINNING") setSettingLocMap({latitude: region.latitude, longitude: region.longitude});
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
            setSettingLocMap({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng});
            setLName(details.name);
            map.animateToRegion({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng,
              latitudeDelta: Util.MAP_ZOOM.latitudeDelta, longitudeDelta: Util.MAP_ZOOM.longitudeDelta}, MAP_DURATION);
            setSubstatus("");
            setStatus("PINNING");
          }}
          onBackIconPress={() => {
            setSubstatus("");
            Keyboard.dismiss();
          }}

          onLocationItemPress={(loc, index) => {
            map.animateToRegion({latitude: loc.latitude-Util.MAP_ZOOM.latitudeDelta/4, longitude: loc.longitude,
              latitudeDelta: Util.MAP_ZOOM.latitudeDelta, longitudeDelta: Util.MAP_ZOOM.longitudeDelta}, MAP_DURATION);
            setSettingLocMap(loc);
            setSettingLocDetail(loc);
            setLName(loc.name);
            setLRadius(loc.radius);
            setLInitialRadius(loc.radius);
            setLFromTime(loc.fromTime);
            setLToTime(loc.toTime);
            setLType(loc.type)
            setLIndex(index);
            setStatus("SETTING_LOC");
            animSettingLoc.setValue(0);
            Animated.timing(animSettingLoc, {toValue: 1, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false}).start();
          }}

        />

        {/* location setting attributes */}
        <TrackingSettingLocation

          animLeft={animSettingLocLeft}

          settingLoc={settingLocDetail}
          name={lName}
          type={lType}
          radius={lRadius}
          fromTime={lFromTime}
          ttoTime={lToTime}
          repeat={lRepeat}
          initialRadius={lInitialRadius}

          onNameChange={(text) => setLName(text)}
          onRadiusChange={(value) => setLRadius(value)}
          onFromTimeSelected={(event, time) => {
            if (time == null) return;
            setLFromTime(Util.numberTo2Digits(time.getHours()) + ":" + Util.numberTo2Digits(time.getMinutes()) + ":00");
            setLFromTimeDate(time);
          }}
          onToTimeSelected={(event, time) => {
            if (time == null) return;
            setLToTime(Util.numberTo2Digits(time.getHours()) + ":" + Util.numberTo2Digits(time.getMinutes()) + ":00");
            setLToTimeDate(time);
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
            let isRepeatAll = true;  // check repeat all
            lRepeat.map((day, index) => { if(!day) isRepeatAll = false; });
            if (isRepeatAll != lRepeatAll) setLRepeatAll(isRepeatAll);
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
            let isRepeatAll = true;  // check repeat all
            newLRepeat.map((day, index) => { if(!day) isRepeatAll = false; });
            if (isRepeatAll != lRepeatAll) setLRepeatAll(isRepeatAll);
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
          setSettingLocDetail(Object.assign({}, settingLocMap));
          map.animateToRegion({latitude: settingLocMap.latitude-Util.MAP_ZOOM.latitudeDelta/4, longitude: settingLocMap.longitude,
            latitudeDelta: Util.MAP_ZOOM.latitudeDelta, longitudeDelta: Util.MAP_ZOOM.longitudeDelta}, 700);
          setLType("None");
          setLRadius(RADIUS_MIN);
          setLFromTime("None");
          setLToTime("None");
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
            // validation
            let validation = "";
            if (lName == "") validation = "Please specify location name";
            if (lType != "Home"){
              if (!lFromTime || lFromTime === "None") validation = "Please specify the time at 'From'";
              else if (!lToTime || lToTime === "None") validation = "Please specify the time at 'To'";
              else if (lFromTime >= lToTime) validation = "'From' time shall be before 'To'";
            }
            if (validation != ""){
              Alert.alert(null, validation, [{text: 'OK'}], {cancelable: true});
              return;
            }
            // save & load loc list
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
            [
              {text: 'Cancel'},
              {text: 'OK', onPress: async() => {
                setIsLoading(true);
                await deleteLocation();
                await fetchLocList();
                setIsLoading(false);
                animSettingLoc.setValue(1);
                Animated.timing(animSettingLoc, {toValue: 0, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false}).start();
                setStatus("VIEWING");
              }}
            ],
            {cancelable: true}
          );
        }}

      />
      
      {/* ===================== END CONTROL PANEL SECTION ===================== */}

    </View>

  );
};

export default TrackingSettingsScreen;