import React from 'react';
import { View, Keyboard, Image, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles/index.css';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { PORT, COLORS } from "../../../const/const";

import Util from './util';
import { Loader } from '../../../utils/loader';
import TrackingSettingMap from './map';
import TrackingSettingControlPanel from './control-panel';
import TrackingSettingLocation from './setting-panel';
import TrackingSettingLocationSubProps from './sub-setting-panel';
import TrackingSettingButtons from './buttons';
import AvatarContainer from '../AvatarContainer';


const TrackingSettingsScreen = ({ route, navigation }) => {

  {/* ===================== VARIABLE SECTION ===================== */}

  // states
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState("VIEWING");  // VIEWING, PINNING, SETTING_LOC_NEW, SETTING_LOC
  const [substatus, setSubstatus] = React.useState("");  // "", TYPE, REPEAT, SEARCH
  const CURRENT_DATE = Util.dateToHour0(route.params.date);
  const RADIUS_MIN = 40;

  // children information
  const [children, setChildren] = React.useState(route.params.children);

  // map positioning & zooming
  const [map, setMap] = React.useState(null);
  
  // location list
  const [locList, setLocList] = React.useState([]);

  // attributes for setting a location
  const [settingLocMap, setSettingLocMap] = React.useState({});
  const [settingLocDetail, setSettingLocDetail] = React.useState({});
  const [lName, setLName] = React.useState("");
  const [lType, setLType] = React.useState("None");  // None, Home, Education
  const [lTypeTmp, setLTypeTmp] = React.useState("None");
  const [lAllTime, setLAllTime] = React.useState(false);
  const [lRadius, setLRadius] = React.useState(0);
  const [lQuad, setLQuad] = React.useState([Util.LOC_FPT, Util.LOC_FPT, Util.LOC_FPT, Util.LOC_FPT]);
  const [lInitialRadius, setLInitialRadius] = React.useState(0);
  const [lFromTime, setLFromTime] = React.useState("None");  const [lFromTimeDate, setLFromTimeDate] = React.useState(null);
  const [lToTime, setLToTime] = React.useState("None");  const [lToTimeDate, setLToTimeDate] = React.useState(null);
  const [lRepeat, setLRepeat] = React.useState([false, false, false, false, false, false, false]);
  const [lRepeatTmp, setLRepeatTmp] = React.useState([false, false, false, false, false, false, false]);
  const [lRepeatAll, setLRepeatAll] = React.useState(false);
  const [searchBar, setSearchBar] = React.useState(null);

  // popup modals
  const [isValidation, setIsValidation] = React.useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = React.useState(false);
  const [validationStr, setValidationStr] = React.useState("");

  // animation
  const MAP_DURATION = 700;
  const FLY_DURATION = 300;
  const animSettingLoc = React.useRef(new Animated.Value(0)).current;
  const animSettingLocLeft = animSettingLoc.interpolate({inputRange: [0, 0.001, 1], outputRange: [wp("100%"), 0, 0]});
  const animSettingLocProps = React.useRef(new Animated.Value(0)).current;
  const animSettingLocPropsLeft = animSettingLocProps.interpolate({inputRange: [0, 1], outputRange: [wp("100%"), 0]});

  // const animSettingLocOpacMain = animSettingLoc.interpolate({inputRange: [0, 1], outputRange: [1, 0]});
  const [animSettingLocHeight, setAnimSettingLocHeight] = React.useState(null);
  const animSettingLocElevation = animSettingLoc.interpolate({inputRange: [0, 0.8, 1], outputRange: [0, 0, 5]});

  {/* ===================== END OF VARIABLE SECTION ===================== */}

  {/* ===================== API SECTION ===================== */}

  // fetch location list
  const fetchLocList = async () => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const response = await fetch('http://' + ip + PORT + '/location/list/' + childId + '/' + CURRENT_DATE.getTime());
    const result = await response.json();
    if (result.code === 200){
      setLocList(result.data);
      setAnimSettingLocHeight(animSettingLoc.interpolate(
        {inputRange: [0, 1], outputRange: [Util.calLocSettingContainerHeight(result.data.length), hp('38%')]}
      ));
    }
    else console.log("Error while fetching tracking status. Server response: " + JSON.stringify(result));
  }

  // add location
  const addLocation = async () => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const userId = await AsyncStorage.getItem('user_id');
    let settingFromTimeDate = lFromTimeDate;
    let settingToTimeDate = lToTimeDate;
    if (lType == "Home" && lAllTime){
      settingFromTimeDate = Util.dateToHour0(new Date());
      settingToTimeDate = settingFromTimeDate;
    }
    const body = JSON.stringify({
      childId: childId,
      creator: userId,
      date: CURRENT_DATE.getTime(),
      fromTime: settingFromTimeDate,
      latitude: settingLocDetail.latitude,
      longitude: settingLocDetail.longitude,
      name: lName,
      radius: lRadius,
      repeatOn: Util.repeatArrToStr(lRepeat),
      toTime: settingToTimeDate,
      type: lType,
      latA: lQuad[0].latitude,
      lngA: lQuad[0].longitude,
      latB: lQuad[1].latitude,
      lngB: lQuad[1].longitude,
      latC: lQuad[2].latitude,
      lngC: lQuad[2].longitude,
      latD: lQuad[3].latitude,
      lngD: lQuad[3].longitude,
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
    let settingFromTimeDate = lFromTimeDate;
    let settingToTimeDate = lToTimeDate;
    if (lType == "Home" && lAllTime){
      settingFromTimeDate = Util.dateToHour0(new Date());
      settingToTimeDate = settingFromTimeDate;
    }
    const body = JSON.stringify({
      childId: childId,
      creator: userId,
      date: CURRENT_DATE.getTime(),
      safezoneId: settingLocDetail.safezoneId,
      fromTime: settingFromTimeDate,
      latitude: settingLocDetail.latitude,
      longitude: settingLocDetail.longitude,
      name: lName,
      radius: lRadius,
      repeatOn: Util.repeatArrToStr(lRepeat),
      toTime: settingToTimeDate,
      type: lType,
      latA: lQuad[0].latitude,
      lngA: lQuad[0].longitude,
      latB: lQuad[1].latitude,
      lngB: lQuad[1].longitude,
      latC: lQuad[2].latitude,
      lngC: lQuad[2].longitude,
      latD: lQuad[3].latitude,
      lngD: lQuad[3].longitude,
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

  // load location list on screen loaded
  React.useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchLocList();
      setLoading(false);
    })();
  }, []);

  {/* ===================== END OF API SECTION ===================== */}
  

  {/* ==================================================================================================== */}
  {/* ========================================== USER INTERFACE ========================================== */}
  return (

    <View style={styles.container}>

      <Loader loading={loading}/>

      {/* ===================== MAP SECTION ===================== */}

      <TrackingSettingMap

        status={status}
        locList={locList}
        
        settingLoc={settingLocMap}
        lType={lType}
        lRadius={lRadius}
        lQuad={lQuad}
        
        setMap={setMap}
        setLQuad={setLQuad}
        onRegionChangeComplete={(region) => {
          if (status === "PINNING") setSettingLocMap({latitude: region.latitude, longitude: region.longitude});
        }}

      />

      {/* ===================== END MAP SECTION ===================== */}

      {/* back button, data & avatar */}
      {substatus === "SEARCH" ? null : [
        <TouchableOpacity key={0} style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image source={require("../../../../assets/icons/back.png")} style={{width: 30, height: 30}} />
        </TouchableOpacity>,
        <Text key={1} style={styles.date}>{Util.dateToStr(route.params.date)}</Text>,
        <AvatarContainer key={2} children={children} setChildren={setChildren} setLoading={setLoading}/>
      ]}
      

      {/* ===================== CONTROL PANEL SECTION ===================== */}

      <Animated.View style={[substatus === "SEARCH" ? styles.controlPanelContainerFocused : styles.controlPanelContainer,
                    substatus === "SEARCH" ? {} : {height: animSettingLocHeight},
                    status === "PINNING" ? {height: 0, width: 0, opacity: 0} : {}]}>

        {/* control panel with search bar and location list */}
        <TrackingSettingControlPanel

          status={status}
          substatus={substatus}
          locList={locList}

          setIsLoading={setLoading}
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
            setLFromTime(loc.fromTime); setLFromTimeDate(Util.strToDate(loc.fromTime));
            setLToTime(loc.toTime); const toTimeDate = Util.strToDate(loc.toTime); setLToTimeDate(toTimeDate);
            setLType(loc.type);
            setLQuad([{latitude: loc.latA, longitude: loc.lngA}, {latitude: loc.latB, longitude: loc.lngB}, {latitude: loc.latC, longitude: loc.lngC}, {latitude: loc.latD, longitude: loc.lngD}]);
            if (loc.type == "Home" && toTimeDate.getTime() == Util.dateToHour0(toTimeDate).getTime()) setLAllTime(true);
            else setLAllTime(false);
            setStatus("SETTING_LOC");
            animSettingLoc.setValue(0);
            Animated.timing(animSettingLoc, {toValue: 1, duration: FLY_DURATION, easing: Easing.ease, useNativeDriver: false}).start();
          }}

        />

        {/* location setting attributes */}
        <TrackingSettingLocation

          isValidation={isValidation}
          isConfirmDelete={isConfirmDelete}
          setIsValidation={setIsValidation}
          setIsConfirmDelete={setIsConfirmDelete}
          validationStr={validationStr}

          animOpac={animSettingLoc}
          animLeft={animSettingLocLeft}
          animElevation={animSettingLocElevation}

          settingLoc={settingLocDetail}
          name={lName}
          type={lType}
          allTime={lAllTime}
          radius={lRadius}
          fromTime={lFromTime}
          fromTimeDate={lFromTimeDate}
          ttoTimeDate={lToTimeDate}
          ttoTime={lToTime}
          repeat={lRepeat}
          initialRadius={lInitialRadius}

          onNameChange={(text) => setLName(text)}
          onAllTimeSelected={() => setLAllTime(!lAllTime)}
          onRadiusChange={(value) => setLRadius(value)}
          onFromTimeSelected={(event, time) => {
            if (time == null) return;
            time.setSeconds(0);
            time.setMilliseconds(0);
            setLFromTime(Util.numberTo2Digits(time.getHours()) + ":" + Util.numberTo2Digits(time.getMinutes()) + ":00");
            setLFromTimeDate(time);
          }}
          onToTimeSelected={(event, time) => {
            if (time == null) return;
            time.setSeconds(0);
            time.setMilliseconds(0);
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

          onDelete={async() => {
            setLoading(true);
            await deleteLocation();
            await fetchLocList();
            setLoading(false);
            animSettingLoc.setValue(1);
            Animated.timing(animSettingLoc, {toValue: 0, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false}).start();
            setStatus("VIEWING");
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

      </Animated.View>

      {/* action buttons */}
      <TrackingSettingButtons

        status={status}
        substatus={substatus}
        animOpac={animSettingLoc}
        animElevation={animSettingLocElevation}

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
          const quadCal = Util.getQuadFromLoc(settingLocMap.latitude, settingLocMap.longitude);
          setLQuad(quadCal);
          setLFromTime("None"); setLFromTimeDate(new Date());
          setLToTime("None"); setLToTimeDate(new Date());
          setLRepeat([false, false, false, false, false, false, false]);
          setLInitialRadius(RADIUS_MIN);
          setLAllTime(false);
          
          setStatus("SETTING_LOC_NEW");
          searchBar.setAddressText("");
          animSettingLoc.setValue(1);
        }}

        onSettingCancel={() => {
          if (substatus === ""){
            animSettingLoc.setValue(1);
            Animated.timing(animSettingLoc, {toValue: 0, duration: FLY_DURATION, easing: Easing.ease, useNativeDriver: false}).start();
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
            else if (!(lType == "Home" && lAllTime)){
              if (!lFromTime || lFromTime === "None") validation = "Please specify the time at 'From'";
              else if (!lToTime || lToTime === "None") validation = "Please specify the time at 'To'";
              else if (lFromTimeDate >= lToTimeDate) validation = "'To' time should be after 'From'";
            }
            if (validation == "" && Util.isOverlap(locList, lFromTimeDate, lToTimeDate, settingLocDetail.safezoneId)) validation = "The time schedule of this location is overlapping another";
            if (validation != ""){
              setValidationStr(validation);
              setIsValidation(true);
              return;
            }
            // save & load loc list
            (async() => {
              setLoading(true);
              if (status === "SETTING_LOC_NEW") await addLocation();
              else if (status === "SETTING_LOC") await editLocation();
              await fetchLocList();
              setLoading(false);
              animSettingLoc.setValue(1);
              Animated.timing(animSettingLoc, {toValue: 0, duration: FLY_DURATION, easing: Easing.linear, useNativeDriver: false}).start();
              setStatus("VIEWING");
            })();
          }
          else if (substatus === "TYPE"){
            setLType(lTypeTmp);
            if (lTypeTmp != "Home") setLAllTime(false);
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
        onSettingDelete={() => setIsConfirmDelete(true)}
      />
      
      {/* ===================== END CONTROL PANEL SECTION ===================== */}

    </View>

  );
};

export default TrackingSettingsScreen;