import React from 'react';
import { SafeAreaView, View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline }  from 'react-native-maps';
import Drawer from './drawer';
import styles from './styles/index.css';
import { COLORS, IP, PORT } from '../../../const/const';

const TrackingEmergencyScreen = (props) => {

  // map positioning & zooming
  [mapLoc, setMapLoc] = React.useState(Drawer.LOC_FPT);  // FPT University location
  [latitudeDelta, setLatitudeDelta] = React.useState(Drawer.LOCATION_ZOOM.latitudeDelta);
  [longitudeDelta, setLongitudeDelta] = React.useState(Drawer.LOCATION_ZOOM.longitudeDelta);

  // reported location list
  [realLocList, setRealLocList] = React.useState(Drawer.realLocList);
  [locList, setLocList] = React.useState([Drawer.locFPT, Drawer.locLandmark]);
  [currentLoc, setCurrentLoc] = React.useState(Drawer.locFPT);

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

  // React.useEffect(() => {
  //   // this.timer = setInterval(()=> updateLoc(), 10000);
  // }, []);

  // const updateLoc = async() => {
  //   const response = await fetch('http://' + IP + PORT + '/location/latest/5');
  //   const result = await response.json();
  //   setCurrentLoc(result.data);
  //   setMapLoc(result.data);
  // }

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

          <Marker coordinate={{latitude: currentLoc.latitude, longitude: currentLoc.longitude}} anchor={{x: 0.5, y: 0.5}}>
            <View style={styles.safeLoc}/>
          </Marker>

          {/* {locList.map((loc, index) => {
            return (
              <Marker key={index} coordinate={{latitude: loc.latitude, longitude: loc.longitude}} anchor={{x: 0.5, y: 0.5}}>
                <View style={styles.safeLoc}/>
              </Marker>
            )
          })}

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
          })} */}
          

        </MapView>

      </View>

      {/* ===================== END MAP SECTION ===================== */}

    </SafeAreaView>

  );
};

export default TrackingEmergencyScreen;