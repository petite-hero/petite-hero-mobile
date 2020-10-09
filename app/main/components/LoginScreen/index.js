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
  [status, setStatus] = React.useState("VIEWING");  // VIEWING, PINNING, SETTING_LOC_NEW, SETTING_LOC, SETTING_ZONE

  // map positioning & zooming
  [mapLoc, setMapLoc] = React.useState(Drawer.LOC_FPT);  // FPT University location
  [latitudeDelta, setLatitudeDelta] = React.useState(Drawer.LOCATION_ZOOM.latitudeDelta);
  [longitudeDelta, setLongitudeDelta] = React.useState(Drawer.LOCATION_ZOOM.longitudeDelta);
  
  // location & safe zone list
  // [locList, setLocList] = React.useState([]);
  // [zoneList, setZoneList] = React.useState([]);
  [locList, setLocList] = React.useState([Drawer.locFPT, Drawer.locLandmark]);  // testing
  [zoneList, setZoneList] = React.useState([Drawer.zoneFPTLandmark]);  // testing

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

  // attributes for setting a safe zone
  [zPointC, setzPointC] = React.useState({});
  [zPointD, setzPointD] = React.useState({});
  [zPointE, setzPointE] = React.useState({});
  [zPointF, setzPointF] = React.useState({});

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

          {/* rectangle safe zone area & 2 locations */}
          {status === "SETTING_ZONE" ? [
              // 2 locations
              <Marker key={lIndex-1} coordinate={{latitude: locList[lIndex-1].latitude, longitude: locList[lIndex-1].longitude}} anchor={{x: 0.5, y: 0.5}}>
                <View style={styles.safeLoc}/>
              </Marker>,
              <Marker key={lIndex} coordinate={{latitude: locList[lIndex].latitude, longitude: locList[lIndex].longitude}} anchor={{x: 0.5, y: 0.5}}>
                <View style={styles.safeLoc}/>
              </Marker>,
              // rectangle
              <Polygon key={-1} strokeWidth={0} fillColor={"rgba(87, 245, 66, 0.4)"} coordinates={[zPointC, zPointD, zPointE, zPointF]}/>,
              // rectangle points
              <Marker key={-2} coordinate={zPointC} anchor={{x: 0.5, y: 0.5}} draggable onDrag={(coordinate) => setzPointC(coordinate.nativeEvent.coordinate)}>
                <View style={styles.rectPoint}><Text>C</Text></View>
              </Marker>,
              <Marker key={-3} coordinate={zPointD} anchor={{x: 0.5, y: 0.5}} draggable onDrag={(coordinate) => setzPointD(coordinate.nativeEvent.coordinate)}>
                <View style={styles.rectPoint}><Text>D</Text></View>
              </Marker>,
              <Marker key={-4} coordinate={zPointE} anchor={{x: 0.5, y: 0.5}} draggable onDrag={(coordinate) => setzPointE(coordinate.nativeEvent.coordinate)}>
                <View style={styles.rectPoint}><Text>E</Text></View>
              </Marker>,
              <Marker key={-5} coordinate={zPointF} anchor={{x: 0.5, y: 0.5}} draggable onDrag={(coordinate) => setzPointF(coordinate.nativeEvent.coordinate)}>
                <View style={styles.rectPoint}><Text>F</Text></View>
              </Marker>
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
                        setLatitudeDelta(Drawer.LOCATION_ZOOM.latitudeDelta);
                        setLongitudeDelta(Drawer.LOCATION_ZOOM.longitudeDelta);
                        setStatus("SETTING_LOC");
                      }}
                    >{index+1}. {loc.name}</Text>
                  )
                })
                : null}
              </View>

              {/* zone list */}
              <View style={{flex: 2}}>
                {status === "VIEWING" ? locList.map((loc, index) => {
                  if (index != 0)
                  return (
                    <Text
                      key={index}
                      style={{marginTop: index==1?20:10, backgroundColor: "gray"}}
                      onPress={() => {
                        setMapLoc({latitude: (loc.latitude+locList[index-1].latitude)/2,
                                   longitude: (loc.longitude+locList[index-1].longitude)/2});
                        setLatitudeDelta(Math.abs(loc.latitude-locList[index-1].latitude)*1.8);
                        setLongitudeDelta(Math.abs(loc.longitude-locList[index-1].longitude)*1.8);
                        setLIndex(index);
                        setzPointC(zoneList[index-1][0]);
                        setzPointD(zoneList[index-1][1]);
                        setzPointE(zoneList[index-1][2]);
                        setzPointF(zoneList[index-1][3]);
                        setStatus("SETTING_ZONE");
                      }}
                    >{index}-{">"}{index+1}</Text>
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
            <Text style={{flex: 2.5}}>Padding: </Text>
            <View style={{flex: 3.5}}>
            <Picker
              selectedValue={lInPadding}
              style={{height: 20, width: 100, fontSize: 16, justifyContent: 'center'}}
              onValueChange={(itemValue, itemIndex) => setLInPadding(itemValue)}>
              <Picker.Item label={"5 mins"} value={5} />
              <Picker.Item label={"10 mins"} value={10} />
              <Picker.Item label={"15 mins"} value={15} />
              <Picker.Item label={"20 mins"} value={20} />
              <Picker.Item label={"30 mins"} value={30} />
              <Picker.Item label={"60 mins"} value={60} />
              <Picker.Item label={"120 mins"} value={120} />
            </Picker>
            </View>
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
            <Text style={{flex: 2.5}}>Padding: </Text>
            <View style={{flex: 3.5}}>
            <Picker
              selectedValue={lOutPadding}
              style={{height: 20, width: 100, fontSize: 16, justifyContent: 'center'}}
              onValueChange={(itemValue, itemIndex) => setLOutPadding(itemValue)}>
              <Picker.Item label={"5 mins"} value={5} />
              <Picker.Item label={"10 mins"} value={10} />
              <Picker.Item label={"15 mins"} value={15} />
              <Picker.Item label={"20 mins"} value={20} />
              <Picker.Item label={"30 mins"} value={30} />
              <Picker.Item label={"60 mins"} value={60} />
              <Picker.Item label={"120 mins"} value={120} />
            </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.btnSaveLoc} onPress={() => {
            const tmpLoc = {name: lName, latitude: settingLoc.latitude, longitude: settingLoc.longitude, radius: lRadius,
                            inTime: lInTime, inPadding: lInPadding, outTime: lOutTime, outPadding: lOutPadding};
            let newLocList = [...locList];
            if (status === "SETTING_LOC_NEW") newLocList.push(tmpLoc);
            else newLocList[lIndex] = tmpLoc;
            setLocList(newLocList);
            if (newLocList.length === 1 || status === "SETTING_LOC") setStatus("VIEWING");
            else{  // switch to setting new safe zone
              setLIndex(newLocList.length-1);
              prevLoc = newLocList[newLocList.length-2];
              setMapLoc({latitude: (tmpLoc.latitude+prevLoc.latitude)/2, longitude: (tmpLoc.longitude+prevLoc.longitude)/2});
              setLatitudeDelta(Math.abs(tmpLoc.latitude-prevLoc.latitude)*1.8);
              setLongitudeDelta(Math.abs(tmpLoc.longitude-prevLoc.longitude)*1.8);
              let rectPointArr = Drawer.getZoneFromLoc(prevLoc.latitude, prevLoc.longitude,
                                      tmpLoc.latitude, tmpLoc.longitude, (tmpLoc.latitude+prevLoc.latitude)/2);
              setzPointC(rectPointArr[0]);
              setzPointD(rectPointArr[1]);
              setzPointE(rectPointArr[2]);
              setzPointF(rectPointArr[3]);
              setStatus("SETTING_ZONE");
            }
          }}>
            <Text>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSaveLoc} onPress={() => setStatus("VIEWING")}>
        <Text>DISCARD</Text>
          </TouchableOpacity>

        </View>
      : null}

      {/* ===================== END LOCATION SETTING SECTION ===================== */}

      {/* ===================== ZONE SETTING SECTION ===================== */}

      {/* set zone buttons */}
      {status === "SETTING_ZONE" ?
        <View style={styles.setLocBtnsContainer}>
          <TouchableOpacity style={styles.btnSetLoc} onPress={() => {
            const tmpZone = [zPointC, zPointD, zPointE, zPointF];
            let newZoneList = [...zoneList];
            if (newZoneList.length < lIndex) newZoneList.push(tmpZone);
            else newZoneList[lIndex-1] = tmpZone;
            setZoneList(newZoneList);
            setStatus("VIEWING");
          }}>
            <Text>SAVE</Text>
          </TouchableOpacity>
          {zoneList.length >= lIndex ?
            <TouchableOpacity style={styles.btnSetLoc} onPress={() => setStatus("VIEWING")}>
              <Text>DISCARD</Text>
            </TouchableOpacity>
          : null}
        </View>
      : null}

      {/* ===================== END ZONE SETTING SECTION ===================== */}

    </SafeAreaView>

  );
};

export default LoginScreen;