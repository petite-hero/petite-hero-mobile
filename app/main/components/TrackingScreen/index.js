import React from 'react';
import { SafeAreaView, View, StyleSheet, Keyboard, Dimensions,
  Image, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import MapView, { Marker, Circle, Polygon }  from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Icon } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import Drawer from './drawer'
import styles from './styles/index.css';

const LoginScreen = (props) => {

  [searchBarFocused, setSearchBarFocused] = React.useState(false);
  [status, setStatus] = React.useState("VIEWING");  // VIEWING, PINNING, SETTING_LOC_NEW, SETTING_LOC

  // map positioning & zooming
  [mapLoc, setMapLoc] = React.useState({latitude: 10.8414846, longitude: 106.8100464});  // FPT University location
  [latitudeDelta, setLatitudeDelta] = React.useState(0.008);
  [longitudeDelta, setLongitudeDelta] = React.useState(0.004);
  
  // location list
  // [locList, setLocList] = React.useState([]);
  [locList, setLocList] = React.useState([Drawer.locFPT, Drawer.locLandmark]);  // testing

  // attributes for setting a location
  [settingLoc, setSettingLoc] = React.useState({});
  [lName, setLName] = React.useState("");
  [lRadius, setLRadius] = React.useState(5);
  [lInTime, setLInTime] = React.useState({hour: 0, minute: 0});
  [lInPadding, setLInPadding] = React.useState(20);
  [lOutTime, setLOutTime] = React.useState({hour: 0, minute: 0});
  [lOutPadding, setLOutPadding] = React.useState(20);
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
              onPress={(data, details = null) => {
                setMapLoc({
                  name: details.name,
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng});
                setSearchBarFocused(false);
                // searchBar.setAddressText("");
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
                    <Text
                      key={index}
                      style={{marginTop: 10}}
                      onPress={() => {
                        setSettingLoc(loc);
                        setMapLoc({latitude: loc.latitude-latitudeDelta/4, longitude: loc.longitude});
                        setLName(loc.name);
                        setLRadius(loc.radius);
                        setLInTime(loc.inTime);
                        setLInPadding(loc.inPadding);
                        setLOutTime(loc.outTime);
                        setLOutPadding(loc.outPadding);
                        setLIndex(index);
                        setStatus("SETTING_LOC");
                      }}
                    >{index+1}. {loc.name}</Text>
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
          <TouchableOpacity style={styles.btnSetLoc} onPress={() => {
            setSettingLoc(mapLoc);
            setLName(mapLoc.name);
            setMapLoc({latitude: mapLoc.latitude-latitudeDelta/4, longitude: mapLoc.longitude});
            setStatus("SETTING_LOC_NEW");
          }}>
            <Text>SET LOCATION</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSetLoc} onPress={() => setStatus("VIEWING")}>
            <Text>CANCEL</Text>
          </TouchableOpacity>
        </View>
      : null}

      {/* setting location */}
      {status === "SETTING_LOC_NEW" || status === "SETTING_LOC" ?
        <View style={styles.locSettingPanel}>

          <TextInput
            onChangeText={(text) => setLName(text)}
            defaultValue={settingLoc.name}
            style={{paddingLeft: 10, marginTop: 10, borderRadius: 20, backgroundColor: "white"}}
          />

          <View style={{flexDirection: "row", marginTop: 10, borderWidth: 1}}>
            <Text style={{flex: 2}}>Radius: </Text>
            <Slider
              style={{flex: 6, height: 20}}
              minimumValue={20}
              maximumValue={200}
              value={lRadius}
              onValueChange={(value) => setLRadius(value)}
            />
            <Text style={{flex: 2}}>{Math.round(lRadius)} m</Text>
          </View>

          <View style={{flexDirection: "row", marginTop: 10,  borderWidth: 1}}>
            <Text style={{flex: 3}}>In Time: </Text>
            <Text style={{flex: 2}} onPress={() => setLShowInTimePicker(true)}>{lInTime.hour}:{lInTime.minute}</Text>
            {lShowInTimePicker ?
              <DateTimePicker
                value={new Date()}
                mode={"time"}
                onChange={(event, time) => {
                  setLShowInTimePicker(false);
                  setLInTime({hour: time.getHours(), minute: time.getMinutes()});
                }}
              />
            : null}
          </View>

          <View style={{flexDirection: "row", marginTop: 10,  borderWidth: 1}}>
            <Text style={{flex: 3}}>Out Time: </Text>
            <Text style={{flex: 2}} onPress={() => setLShowOutTimePicker(true)}>{lOutTime.hour}:{lOutTime.minute}</Text>
            {lShowOutTimePicker ?
              <DateTimePicker
                value={new Date()}
                mode={"time"}
                onChange={(event, time) => {
                  setLShowOutTimePicker(false);
                  setLOutTime({hour: time.getHours(), minute: time.getMinutes()});
                }}
              />
            : null}
          </View>

          <TouchableOpacity style={styles.btnSaveLoc} onPress={() => {
            const tmpLoc = {name: lName, latitude: settingLoc.latitude, longitude: settingLoc.longitude,
                            radius: lRadius, inTime: lInTime, outTime: lOutTime};
            let newLocList = [...locList];
            if (status === "SETTING_LOC_NEW") newLocList.push(tmpLoc);
            else newLocList[lIndex] = tmpLoc;
            setLocList(newLocList);
            setStatus("VIEWING");
          }}>
            <Text>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSaveLoc} onPress={() => setStatus("VIEWING")}>
        <Text>DISCARD</Text>
          </TouchableOpacity>

        </View>
      : null}

      {/* ===================== END LOCATION SETTING SECTION ===================== */}

    </SafeAreaView>

  );
};

export default LoginScreen;