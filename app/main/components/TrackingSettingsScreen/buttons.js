import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Icon } from 'react-native-elements';

import styles from './styles/index.css';
import { COLORS } from "../../../const/const";


const TrackingSettingButtons = (props) => {

  return ([

    // SET LOCATION BUTTONS
    props.status === "PINNING" ?
      <View key={0} style={styles.setLocBtnsContainer}>
        <TouchableOpacity style={[styles.btnSetLoc, styles.btnSetLocCancel]} onPress={props.onPinningCancel}>
          <Icon name='clear' type='material' color={COLORS.STRONG_CYAN}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnSetLoc, styles.btnSetLocCheck]} onPress={props.onPinningConfirm}>
          <Icon name='check' type='material' color='white'/>
        </TouchableOpacity>
      </View>
    : null,

    // DELETE SAVE CANCEL BUTTONS
    props.status === "SETTING_LOC_NEW" || props.status === "SETTING_LOC" ?
      <Animated.View key={1} style={[styles.saveLocBtnsContainer, {opacity: props.animOpac}]}>
        {props.status === "SETTING_LOC" ?
          <TouchableOpacity style={[styles.btnSaveLoc, styles.btnSaveLocDelete]} onPress={props.onSettingDelete}>
            <Icon name='delete' type='material' color="white"/>
          </TouchableOpacity>
        : null}
        <TouchableOpacity style={[styles.btnSaveLoc, styles.btnSaveLocCancel]} onPress={props.onSettingCancel}>
          <Icon name='clear' type='material' color={COLORS.STRONG_CYAN}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnSaveLoc, styles.btnSaveLocCheck]} onPress={props.onSettingSave}>
          <Icon name='check' type='material' color='white'/>
        </TouchableOpacity>
      </Animated.View>
    : null

  ])

}

export default TrackingSettingButtons;