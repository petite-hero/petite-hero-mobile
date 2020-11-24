import React from 'react';
import { View, TouchableOpacity, Animated, Image } from 'react-native';

import styles from './styles/index.css';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const TrackingSettingButtons = (props) => {

  return ([

    // SET LOCATION BUTTONS
    props.status === "PINNING" ?
      <View key={0} style={styles.setLocBtnsContainer}>
        <TouchableOpacity style={[styles.btnSetLoc, styles.btnSetLocCancel]} onPress={props.onPinningCancel}>
          <Image source={require("../../../../assets/icons/cross.png")} style={{width: 30, height: 30}} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnSetLoc, styles.btnSetLocCheck]} onPress={props.onPinningConfirm}>
          <Image source={require("../../../../assets/icons/check.png")} style={{width: 30, height: 30}} />
        </TouchableOpacity>
      </View>
    : null,

    // DELETE SAVE CANCEL BUTTONS
    props.status === "SETTING_LOC_NEW" || props.status === "SETTING_LOC" ?
      <Animated.View key={1} style={[styles.saveLocBtnsContainer, {opacity: props.animOpac}]}>
        {/* delete button */}
        {props.status === "SETTING_LOC" && props.substatus === "" ?
          <Animated.View style={[styles.btnSaveLocContainer, {marginRight: wp("90%") - 20*2-44*3-7*5, elevation: props.animElevation}]}>
            <TouchableOpacity style={[styles.btnSaveLoc, styles.btnSaveLocDelete]} onPress={props.onSettingDelete}>
              <Image source={require("../../../../assets/icons/delete.png")} style={{width: 30, height: 30}} />
            </TouchableOpacity>
          </Animated.View>
        : null}
        {/* cancel button */}
        <Animated.View style={[styles.btnSaveLocContainer, {elevation: props.animElevation}]}>
          <TouchableOpacity style={[styles.btnSaveLoc, styles.btnSaveLocCancel]} onPress={props.onSettingCancel}>
            <Image source={require("../../../../assets/icons/cross.png")} style={{width: 30, height: 30}} />
          </TouchableOpacity>
        </Animated.View>
        {/* check button */}
        <Animated.View style={[styles.btnSaveLocContainer, {elevation: props.animElevation}]}>
          <TouchableOpacity style={[styles.btnSaveLoc, styles.btnSaveLocCheck]} onPress={props.onSettingSave}>
            <Image source={require("../../../../assets/icons/check.png")} style={{width: 30, height: 30}} />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    : null

  ])

}

export default TrackingSettingButtons;