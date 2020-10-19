import React from 'react';
import { SafeAreaView, View, StyleSheet, Keyboard, Dimensions,
  Image, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import MapView, { Marker, Circle, Polygon }  from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Icon } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import Drawer from './drawer';
import { AsyncStorage } from 'react-native';
import styles from './styles/index.css';
import { COLORS, PORT } from "../../../const/const"; 

const TrackingSettingsScreen = ({ route }) => {

  [status, setStatus] = React.useState("VIEWING");  // VIEWING, PINNING, SETTING_LOC_NEW, SETTING_LOC
  [substatus, setSubstatus] = React.useState("");  // "", TYPE, REPEAT, SEARCH

  // map positioning & zooming
  [mapLoc, setMapLoc] = React.useState(Drawer.LOC_FPT);  // FPT University location
  [latitudeDelta, setLatitudeDelta] = React.useState(Drawer.LOCATION_ZOOM.latitudeDelta);
  [longitudeDelta, setLongitudeDelta] = React.useState(Drawer.LOCATION_ZOOM.longitudeDelta);
  
  // location list
  // [locList, setLocList] = React.useState([]);
  [locList, setLocList] = React.useState([Drawer.locFPT, Drawer.locLandmark]);  // testing

  // attributes for setting a location
  [settingLoc, setSettingLoc] = React.useState({});
  [lName, setLName] = React.useState("");
  [lType, setLType] = React.useState("None");  // None, Home, Education
  [lTypeTmp, setLTypeTmp] = React.useState("None");
  [lRadius, setLRadius] = React.useState(0);
  [lInitialRadius, setLInitialRadius] = React.useState(0);
  [lInTime, setLInTime] = React.useState({hour: 0, minute: 0});
  [lOutTime, setLOutTime] = React.useState({hour: 0, minute: 0});
  [lShowInTimePicker, setLShowInTimePicker] = React.useState(false);
  [lShowOutTimePicker, setLShowOutTimePicker] = React.useState(false);
  [lIndex, setLIndex] = React.useState(0);
  [lRepeat, setLRepeat] = React.useState([false, false, false, false, false, false, false]);
  [lRepeatTmp, setLRepeatTmp] = React.useState([false, false, false, false, false, false, false]);
  [lRepeatAll, setLRepeatAll] = React.useState(false);
  
  const dateToHour0 = (date) => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
  const currentDate = dateToHour0(route.params.date);

  // get user location
  // navigator.geolocation.getCurrentPosition(
  //     (data) => {
  //       setLatitude(data.coords.latitude);
  //       this.setState({longitude: data.coords.longitude});
  //     }
  // );

  // handling inputs
  const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const WEEKDAYS_ABB = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const lRepeatToWeekdays = () => {
    let result = "";
    let count = 0;
    WEEKDAYS_ABB.map((day, index) => {
      if (lRepeat[index]){
        if (count === 0) result += day;
        else if (count < 3) result += ", " + day;
        else if (count === 3) result += "...";
        count++;
      }
    });
    return count === 0 ? "None" : result;
  }
  const numberTo2Digits = (num) => {
    return num < 10 ? "0"+num : num;
  }
  
  // current date section
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateToStr = (date) => {
    return MONTHS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
  }


  // fetching data
  const fetchLocList = async () => {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const response = await fetch('http://' + ip + PORT + '/location/list/' + childId + '/' + currentDate.getTime());
    const result = await response.json();  // {"latitude": 1, "longitude": 1, "status": true}
    if (result.code === 200) {
      setLocList(result.data);
    } else {
      console.log("Error while fetching tracking status. Server response: " + JSON.stringify(result));
    }
  }

  React.useEffect(() => {
    fetchLocList()
  }, []);
  

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

          {/* viewing state | showing location markers */}
          {status === "VIEWING" ? locList.map((loc, index) => {
            return (
              <Marker key={index} coordinate={{latitude: loc.latitude, longitude: loc.longitude}} anchor={{x: 0.5, y: 0.5}}>
                <View style={styles.safeLoc}/>
              </Marker>
            )
          })
          : null}

          {/* single location marker & circle when setting location */}
          {status === "SETTING_LOC_NEW" || status === "SETTING_LOC" ? [
            <Marker key={0} coordinate={{latitude: settingLoc.latitude, longitude: settingLoc.longitude}} anchor={{x: 0.5, y: 0.5}}>
              <View style={styles.safeLoc}/>
            </Marker>,
            <Circle key={1} center={{latitude: settingLoc.latitude, longitude: settingLoc.longitude}}
                    radius={lRadius} fillColor={"rgba(244, 126, 62, 0.4)"} strokeWidth={0}/>
            ]
            : null}

        </MapView>
      </View>

      {/* map fixed pin */}
      {status === "PINNING" ?
        <View style={styles.fixedPin}>
          <Icon name='location-on' type='material' color={COLORS.STRONG_ORANGE} size={50}/>
        </View>
      : null}

      {/* ===================== END MAP SECTION ===================== */}

      {/* child avatar */}
      {substatus === "SEARCH" ? null : [
        <Image key={0}
          style={[styles.avatar, {backgroundColor: COLORS.STRONG_ORANGE}]}
          source={require('../../../../assets/kid-avatar.png')}
        />,
        <Text key={1} style={styles.date}>{dateToStr(route.params.date)}</Text>]
      }

      {/* ===================== CONTROL PANEL SECTION ===================== */}

      {/* control panel with search bar and location list */}
      {status === "VIEWING" ?
        <View style={substatus === "SEARCH" ? styles.controlPanelFocused : styles.controlPanel}>

          {/* search bar */}
          <View style={substatus === "SEARCH" ? styles.searchBarContainerFocused : styles.searchBarContainer}>
            <GooglePlacesAutocomplete
              // ref={(instance) => { setSearchBar(instance) }}
              styles={substatus === "SEARCH" ?
                {textInputContainer: styles.textInputContainerFocused, textInput: styles.textInputFocused, listView: styles.listView} :
                {textInputContainer: styles.textInputContainer, textInput: styles.textInput}}
              placeholder='Choose location...'
              fetchDetails={true}
              autoFocus={false}
              onPress={(data, details = null) => {
                setMapLoc({
                  name: details.name,
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng});
                setSubstatus("");
                // searchBar.setAddressText("");
                setLatitudeDelta(Drawer.LOCATION_ZOOM.latitudeDelta);
                setLongitudeDelta(Drawer.LOCATION_ZOOM.longitudeDelta);
                setStatus("PINNING");
              }}
              textInputProps={{ onFocus: () => setSubstatus("SEARCH") }}
              query={{key: 'AIzaSyBvfVumttk96MLwUy-oLqaz3OqtGSIAejk', components: 'country:vn',}}
              debounce={150}
            />
          </View>
          <View style={substatus === "SEARCH" ? styles.searchBackBtnFocused : styles.searchBackBtn}>
            <Icon name='arrow-back' type='material' size={34}
              onPress={() => {
                setSubstatus("");
                Keyboard.dismiss();
              }}/>
          </View>

          {/* panel content */}
          <ScrollView style={substatus === "SEARCH" ? styles.panelContentFocused : styles.panelContent}>
            <View style={{flexDirection: "row"}}>

              {/* location list */}
              <View style={{flex: 8}}>
                {status === "VIEWING" ? locList.map((loc, index) => {
                  return (
                    <TouchableOpacity key={index} style={styles.locationContainer}
                      onPress={() => {
                        setSettingLoc(loc);
                        setMapLoc({latitude: loc.latitude-latitudeDelta/4, longitude: loc.longitude});
                        setLName(loc.name);
                        setLRadius(loc.radius);
                        setLInitialRadius(loc.radius);
                        setLInTime(loc.fromTime);
                        setLOutTime(loc.toTime);
                        setLType(loc.type)
                        setLIndex(index);
                        setLatitudeDelta(Drawer.LOCATION_ZOOM.latitudeDelta);
                        setLongitudeDelta(Drawer.LOCATION_ZOOM.longitudeDelta);
                        setStatus("SETTING_LOC");
                      }}>
                      <Text style={styles.locationName}>{loc.name}</Text>
                      <Text style={styles.locationTime}>
                        {loc.fromTime} - {loc.toTime}
                      </Text>
                      <View style={styles.rightIcon}>
                        <Icon name='keyboard-arrow-right' type='material'/>
                      </View>
                    </TouchableOpacity>
                  )
                })
                : null}
              </View>

            </View>
          </ScrollView>

        </View>
      : null}

      {/* ===================== END CONTROL PANEL SECTION ===================== */}

      {/* ===================== LOCATION SETTING SECTION ===================== */}

      {/* set location buttons */}
      {status === "PINNING" ?
        <View style={styles.setLocBtnsContainer}>
          <TouchableOpacity style={[styles.btnSetLoc, styles.btnSetLocCancel]} onPress={() => setStatus("VIEWING")}>
            <Icon name='clear' type='material' color={COLORS.STRONG_ORANGE}/>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnSetLoc, styles.btnSetLocCheck]} onPress={() => {
            setSettingLoc(mapLoc);
            setLName(mapLoc.name);
            setMapLoc({latitude: mapLoc.latitude-latitudeDelta/4, longitude: mapLoc.longitude});
            setStatus("SETTING_LOC_NEW");
          }}>
            <Icon name='check' type='material' color='white'/>
          </TouchableOpacity>
        </View>
      : null}

      {/* setting location */}
      {status === "SETTING_LOC_NEW" || status === "SETTING_LOC" ?
        <View style={[styles.controlPanel, {paddingLeft: 15, paddingRight: 15}]}>

          <TextInput
            onChangeText={(text) => setLName(text)}
            defaultValue={settingLoc.name}
            style={styles.txtInputLocName}
          />

          <View style={{flexDirection: "row", marginTop: 15}}>
            <Text style={{flex: 4}}>Marked as</Text>
            <Text style={{flex: 7, textAlign: "right", color: COLORS.STRONG_ORANGE}} onPress={() => {setSubstatus("TYPE"); setLTypeTmp(lType);}}>
              {lType}
            </Text>
            <Icon style={{flex: 1}} name='keyboard-arrow-right' type='material' color={COLORS.STRONG_ORANGE}/>
          </View>

          <View style={{flexDirection: "row", marginTop: 15}}>
            <Text style={{flex: 3}}>Radius</Text>
            <Slider
              style={{flex: 8, height: 20}}
              minimumTrackTintColor={COLORS.STRONG_ORANGE}
              thumbTintColor={COLORS.STRONG_ORANGE}
              minimumValue={40}
              maximumValue={1000}
              value={lInitialRadius}
              initial
              onValueChange={(value) => setLRadius(value)}
            />
            <Text style={{flex: 3, textAlign: "right", color: COLORS.STRONG_ORANGE}}>{Math.round(lRadius)} m</Text>
          </View>

          <View style={{flexDirection: "row", marginTop: 15}}>
            <Text style={{flex: 3}}>From</Text>
            <Text style={{flex: 2, textAlign: "right", color: COLORS.STRONG_ORANGE}} onPress={() => setLShowInTimePicker(true)}>
              {numberTo2Digits(lInTime.hour)}:{numberTo2Digits(lInTime.minute)}
            </Text>
            {lShowInTimePicker ?
              <DateTimePicker
                value={new Date()}
                mode={"time"}
                onChange={(event, time) => {
                  setLShowInTimePicker(false);
                  if (time == null) return;
                  setLInTime({hour: time.getHours(), minute: time.getMinutes()});
                }}
              />
            : null}
          </View>

          <View style={{flexDirection: "row", marginTop: 15}}>
            <Text style={{flex: 3}}>To</Text>
            <Text style={{flex: 2, textAlign: "right", color: COLORS.STRONG_ORANGE}} onPress={() => setLShowOutTimePicker(true)}>
              {numberTo2Digits(lOutTime.hour)}:{numberTo2Digits(lOutTime.minute)}
            </Text>
            {lShowOutTimePicker ?
              <DateTimePicker
                value={new Date()}
                mode={"time"}
                onChange={(event, time) => {
                  setLShowOutTimePicker(false);
                  if (time == null) return;
                  setLOutTime({hour: time.getHours(), minute: time.getMinutes()});
                }}
              />
            : null}
          </View>

          <View style={{flexDirection: "row", marginTop: 15}}>
            <Text style={{flex: 3}}>Repeat on</Text>
            <Text style={{flex: 7, textAlign: "right", color: COLORS.STRONG_ORANGE}} onPress={() => {setSubstatus("REPEAT"); setLRepeatTmp([...lRepeat])}}>
              {lRepeatToWeekdays()}
            </Text>
            <Icon style={{flex: 1}} name='keyboard-arrow-right' type='material' color={COLORS.STRONG_ORANGE}/>
          </View>

        </View>
      : null}

      {/* setting location type */}
      {(status === "SETTING_LOC_NEW" || status === "SETTING_LOC") && substatus === "TYPE" ?
        <View style={[styles.controlPanel, {paddingLeft: 15, paddingRight: 15}]}>
          <Text style={{marginTop: 20, marginLeft: 10, marginBottom: 10, fontWeight: "bold", fontSize: 16}}>
            Marked as
          </Text>
          {["Home", "Education"].map((type, index) => {
            return (
              <TouchableOpacity key={index} style={styles.txtTypeContainer}
                onPress={() => {
                  if (lTypeTmp !== type) setLTypeTmp(type);
                  else setLTypeTmp("None");
                }}>
                <Text style={{flex: 8, fontWeight: lTypeTmp === type ? "bold" : "normal", color: lTypeTmp === type ? COLORS.STRONG_ORANGE : "black"}}>{type}</Text>
                {lTypeTmp === type ? <Icon style={{flex: 1}} name='check' type='material' color={COLORS.STRONG_ORANGE}/> : null}
              </TouchableOpacity>
            )
          })}
        </View>
      : null}

      {/* setting location repeat days */}
      {(status === "SETTING_LOC_NEW" || status === "SETTING_LOC") && substatus === "REPEAT" ?
        <View style={[styles.controlPanel, {paddingLeft: 15, paddingRight: 15}]}>
          <Text style={{marginTop: 20, marginLeft: 10, marginBottom: 10, fontWeight: "bold", fontSize: 16}}>
            Repeat on
          </Text>
          {WEEKDAYS.map((day, index) => {
            return (
              <TouchableOpacity key={index}
                style={styles.txtRepeatDayContainer}
                onPress={() => {
                  let newLRepeat = [...lRepeatTmp];
                  newLRepeat[index] = !newLRepeat[index];
                  setLRepeatTmp(newLRepeat);
                }}>
                <Text style={{flex: 8, fontWeight: lRepeatTmp[index] ? "bold" : "normal", color: lRepeatTmp[index] ? COLORS.STRONG_ORANGE : "black"}}>
                  Every {day}
                </Text>
                {lRepeatTmp[index] ? <Icon style={{flex: 1}} name='check' type='material' color={COLORS.STRONG_ORANGE}/> : null}
              </TouchableOpacity>
            )
          })}
          <TouchableOpacity
            style={styles.txtRepeatDayContainer}
            onPress={() => {
              let newLRepeat = [...lRepeatTmp];
              newLRepeat.map((day, index) => {newLRepeat[index] = !lRepeatAll});
              setLRepeatTmp(newLRepeat);
              setLRepeatAll(!lRepeatAll);
            }}>
            <Text style={{flex: 8, fontWeight: lRepeatAll ? "bold" : "normal", color: lRepeatAll ? COLORS.STRONG_ORANGE : "black"}}>All</Text>
            {lRepeatAll ? <Icon style={{flex: 1}} name='check' type='material' color={COLORS.STRONG_ORANGE}/> : null}
          </TouchableOpacity>
        </View>
      : null}

      {/* delete save cancel buttons */}
      {status === "SETTING_LOC_NEW" || status === "SETTING_LOC" ?
        <View style={styles.saveLocBtnsContainer}>

          {/* cancel button */}
          <TouchableOpacity style={[styles.btnSaveLoc, styles.btnSaveLocCancel]} onPress={() => {
            if (substatus === "") setStatus("VIEWING");
            else if (substatus === "TYPE" || substatus === "REPEAT") setSubstatus("");
          }}>
            <Icon name='clear' type='material' color={COLORS.STRONG_ORANGE}/>
          </TouchableOpacity>

          {/* save button */}
          <TouchableOpacity style={[styles.btnSaveLoc, styles.btnSaveLocCheck]} onPress={() => {
            if (substatus === ""){
              const tmpLoc = {name: lName, latitude: settingLoc.latitude, longitude: settingLoc.longitude,
                              radius: lRadius, inTime: lInTime, outTime: lOutTime};
              let newLocList = [...locList];
              if (status === "SETTING_LOC_NEW") newLocList.push(tmpLoc);
              else newLocList[lIndex] = tmpLoc;
              setLocList(newLocList);
              setStatus("VIEWING");
            }
            else if (substatus === "TYPE"){
              setLType(lTypeTmp);
              setSubstatus("");
            }
            else if (substatus === "REPEAT"){
              setLRepeat(lRepeatTmp);
              setSubstatus("");
            }
          }}>
            <Icon name='check' type='material' color='white'/>
          </TouchableOpacity>

        </View>
      : null}

      {/* ===================== END LOCATION SETTING SECTION ===================== */}

    </SafeAreaView>

  );
};

export default TrackingSettingsScreen;