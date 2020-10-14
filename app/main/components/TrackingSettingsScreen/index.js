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
import styles from './styles/index.css';
import { COLORS } from "../../../const/const"; 

const TrackingSettingsScreen = (props) => {

  [searchBarFocused, setSearchBarFocused] = React.useState(false);
  [status, setStatus] = React.useState("VIEWING");  // VIEWING, PINNING, SETTING_LOC_NEW, SETTING_LOC

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
  [lRadius, setLRadius] = React.useState(5);
  [lInTime, setLInTime] = React.useState({hour: 0, minute: 0});
  [lOutTime, setLOutTime] = React.useState({hour: 0, minute: 0});
  [lShowInTimePicker, setLShowInTimePicker] = React.useState(false);
  [lShowOutTimePicker, setLShowOutTimePicker] = React.useState(false);
  [lIndex, setLIndex] = React.useState(0);

  // get user location
  // navigator.geolocation.getCurrentPosition(
  //     (data) => {
  //       setLatitude(data.coords.latitude);
  //       this.setState({longitude: data.coords.longitude});
  //     }
  // );

  return (

    <SafeAreaView style={styles.container}>

      {/* child img */}
      {/* <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={{uri: "https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.15752-9/118881393_430697914571214_4949863648741553269_n.jpg?_nc_cat=107&_nc_sid=ae9488&_nc_ohc=CRL20t0CXSoAX-UGsNg&_nc_ht=scontent.fsgn2-3.fna&oh=8a78db6a5556a3e8d4039464250d0c91&oe=5F91B50E"}}
        />
      </View> */}


      {/* ===================== MAP SECTION ===================== */}

      {/* maps */}
      <View style={{...StyleSheet.absoluteFillObject}}>

        <MapView
          style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
          region={{latitude: mapLoc.latitude, longitude: mapLoc.longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta}}
          showsUserLocation={true}
          showsMyLocationButton={false}>

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
                    radius={lRadius} fillColor={"rgba(87, 245, 66, 0.4)"} strokeWidth={0}/>
            ]
            : null}

        </MapView>
      </View>

      {/* map fixed pin */}
      {status === "PINNING" ?
        <Image
          style={styles.fixedPin}
          source={require('../../../../assets/pin.png')}
        />
      : null}

      {/* ===================== END MAP SECTION ===================== */}

      {searchBarFocused ? null :
        <Image
          style={[styles.avatar, {backgroundColor: COLORS.STRONG_ORANGE}]}
          source={{uri: "https://scontent-xsp1-2.xx.fbcdn.net/v/t1.15752-9/121241278_368219414303513_7668923031172678740_n.png?_nc_cat=109&_nc_sid=ae9488&_nc_ohc=vS8Yc-D_9NgAX_tVxWf&_nc_ht=scontent-xsp1-2.xx&oh=9f6d2cbef1346442fccb1eedad3ef1f0&oe=5FADE0B3"}}
        />
      }

      {/* ===================== CONTROL PANEL SECTION ===================== */}

      {/* control panel with search bar and location list */}
      {status === "VIEWING" ?
        <View style={searchBarFocused ? styles.controlPanelFocused : styles.controlPanel}>

          {/* search bar */}
          <View style={searchBarFocused ? styles.searchBarContainerFocused : styles.searchBarContainer}>
            <GooglePlacesAutocomplete
              // ref={(instance) => { setSearchBar(instance) }}
              styles={searchBarFocused ?
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
                setSearchBarFocused(false);
                // searchBar.setAddressText("");
                setLatitudeDelta(Drawer.LOCATION_ZOOM.latitudeDelta);
                setLongitudeDelta(Drawer.LOCATION_ZOOM.longitudeDelta);
                setStatus("PINNING");
              }}
              textInputProps={{
                onFocus: () => setSearchBarFocused(true),
              }}
              query={{key: 'AIzaSyBvfVumttk96MLwUy-oLqaz3OqtGSIAejk', components: 'country:vn',}}
              debounce={150}
            />
          </View>
          <View style={searchBarFocused ? styles.searchBackBtnFocused : styles.searchBackBtn}>
            <Icon name='arrow-left' type='font-awesome'
              onPress={() => {
                setSearchBarFocused(false);
                Keyboard.dismiss();
              }}/>
          </View>

          {/* panel content */}
          <ScrollView style={searchBarFocused ? styles.panelContentFocused : styles.panelContent}>
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
                        setLInTime(loc.inTime);
                        setLOutTime(loc.outTime);
                        setLIndex(index);
                        setLatitudeDelta(Drawer.LOCATION_ZOOM.latitudeDelta);
                        setLongitudeDelta(Drawer.LOCATION_ZOOM.longitudeDelta);
                        setStatus("SETTING_LOC");
                      }}>
                      <Text style={styles.locationName}>{loc.name}</Text>
                      <Text style={styles.locationTime}>
                        {loc.inTime.hour}:{loc.inTime.minute} - {loc.outTime.hour}:{loc.outTime.minute}
                      </Text>
                      <View style={styles.rightIcon}>
                        <Icon name='chevron-right' type='font-awesome' size={12}/>
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
            <Icon name='times' type='font-awesome' color={COLORS.STRONG_ORANGE}/>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnSetLoc, styles.btnSetLocCheck]} onPress={() => {
            setSettingLoc(mapLoc);
            setLName(mapLoc.name);
            setMapLoc({latitude: mapLoc.latitude-latitudeDelta/4, longitude: mapLoc.longitude});
            setStatus("SETTING_LOC_NEW");
          }}>
            <Icon name='check' type='font-awesome' color='white'/>
          </TouchableOpacity>
        </View>
      : null}

      {/* setting location */}
      {status === "SETTING_LOC_NEW" || status === "SETTING_LOC" ?
        <View style={styles.locSettingPanel}>

          <TextInput
            onChangeText={(text) => setLName(text)}
            defaultValue={settingLoc.name}
            style={styles.txtInputLocName}
          />

          <View style={{flexDirection: "row", marginTop: 15}}>
            <Text style={{flex: 3}}>Radius</Text>
            <Slider
              style={{flex: 8, height: 20}}
              minimumTrackTintColor={COLORS.STRONG_ORANGE}
              thumbTintColor={COLORS.STRONG_ORANGE}
              minimumValue={40}
              maximumValue={1000}
              value={lRadius}
              onValueChange={(value) => setLRadius(value)}
            />
            <Text style={{flex: 3, textAlign: "right", color: COLORS.STRONG_ORANGE}}>{Math.round(lRadius)} m</Text>
          </View>

          <View style={{flexDirection: "row", marginTop: 15}}>
            <Text style={{flex: 3}}>From</Text>
            <Text style={{flex: 2, textAlign: "right", color: COLORS.STRONG_ORANGE}} onPress={() => setLShowInTimePicker(true)}>
              {lInTime.hour}:{lInTime.minute}
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
              {lOutTime.hour}:{lOutTime.minute}
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
            <Text style={{flex: 7, textAlign: "right", color: COLORS.STRONG_ORANGE}}>
              Mon, Tue, Fri
            </Text>
            <View style={{flex: 1, width: 10, justifyContent: "center", alignItems: "flex-end"}}>
              <Icon name='chevron-right' type='font-awesome' size={12} color={COLORS.STRONG_ORANGE}/>
            </View>
          </View>

          <View style={styles.saveLocBtnsContainer}>
            <TouchableOpacity style={[styles.btnSaveLoc, styles.btnSaveLocCancel]} onPress={() => setStatus("VIEWING")}>
              <Icon name='times' type='font-awesome' color={COLORS.STRONG_ORANGE}/>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSaveLoc, styles.btnSaveLocCheck]} onPress={() => {
              const tmpLoc = {name: lName, latitude: settingLoc.latitude, longitude: settingLoc.longitude,
                              radius: lRadius, inTime: lInTime, outTime: lOutTime};
              let newLocList = [...locList];
              if (status === "SETTING_LOC_NEW") newLocList.push(tmpLoc);
              else newLocList[lIndex] = tmpLoc;
              setLocList(newLocList);
              setStatus("VIEWING");
            }}>
              <Icon name='check' type='font-awesome' color='white'/>
            </TouchableOpacity>
          </View>

        </View>
      : null}

      {/* ===================== END LOCATION SETTING SECTION ===================== */}

    </SafeAreaView>

  );
};

export default TrackingSettingsScreen;