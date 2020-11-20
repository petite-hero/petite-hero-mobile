import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Circle }  from 'react-native-maps';
import { Icon } from 'react-native-elements';

import styles from './styles/index.css';
import { COLORS, changeOpac } from "../../../const/const";

import Util from "./util";
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';


const TrackingSettingMap = (props) => {
  
  return ([

    // map
    <View key={0} style={{...StyleSheet.absoluteFillObject}}>
      <MapView
        ref={(instance) => { props.setMap(instance) }}
        style={{width: Dimensions.get("screen").width, height: Dimensions.get("screen").height}}
        initialRegion={Util.REGION_FPT}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChangeComplete={props.onRegionChangeComplete}>

        {/* viewing state | showing location markers */}
        {props.status === "VIEWING" ? props.locList.map((loc, index) => {
          return (
            <Marker key={index} coordinate={{latitude: loc.latitude, longitude: loc.longitude}} anchor={{x: 0.5, y: 0.5}}>
              <View style={styles.safeLoc}/>
            </Marker>
          )
        })
        : null}

        {/* single location marker & circle when setting location */}
        {props.status === "SETTING_LOC_NEW" || props.status === "SETTING_LOC" ? [
          <Marker key={0} coordinate={{latitude: props.settingLoc.latitude, longitude: props.settingLoc.longitude}} anchor={{x: 0.5, y: 0.5}}>
            <View style={styles.safeLoc}/>
          </Marker>,
          <Circle key={1} center={{latitude: props.settingLoc.latitude, longitude: props.settingLoc.longitude}}
                  radius={props.lRadius} fillColor={changeOpac(COLORS.STRONG_CYAN, 0.4)} strokeWidth={0}/>
          ]
          : null}

      </MapView>

    </View>,

    // fixed pin
    props.status === "PINNING" ?
      <View key={1} style={styles.fixedPin}>
        <Icon name='location-on' type='material' color={COLORS.STRONG_CYAN} size={50}/>
      </View>
    : null

  ])
}

export default TrackingSettingMap;