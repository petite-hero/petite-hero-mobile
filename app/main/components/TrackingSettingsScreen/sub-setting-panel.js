import React from 'react';
import { Text, TouchableOpacity, Animated } from 'react-native';
import { Icon } from 'react-native-elements';

import styles from './styles/index.css';
import { COLORS } from "../../../const/const";


const TrackingSettingLocationSubProps = (props) => {
  
  const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return ([

    // SETTING LOCATION TYPE
    props.substatus === "TYPE" ?
      <Animated.View key={0} style={[styles.locSettingPanel, {left: props.animLeft}]}>
        <Text style={{marginTop: 30, marginLeft: 10, marginBottom: 10, fontWeight: "bold", fontSize: 16}}>Marked as</Text>
        {["Home", "Education"].map((type, index) => {
          return (
            <TouchableOpacity key={index} style={styles.txtTypeContainer} onPress={() => props.onTypeEntrySelected(type)}>
              <Text style={{flex: 8, fontWeight: props.lTypeTmp === type ? "bold" : "normal", color: props.lTypeTmp === type ? COLORS.STRONG_CYAN : "black"}}>{type}</Text>
              {props.lTypeTmp === type ?
                <Icon style={{flex: 1}} name='check' type='material' color={COLORS.STRONG_CYAN}/>
              : null}
            </TouchableOpacity>
          )
        })}
      </Animated.View>
    : null,

    // SETTING LOCATION REPEAT DAYS
    props.substatus === "REPEAT" ?
      <Animated.View key={1} style={[styles.locSettingPanel, {left: props.animLeft}]}>
        <Text style={{marginTop: 30, marginLeft: 10, marginBottom: 10, fontWeight: "bold", fontSize: 16}}>Repeat on</Text>
        <TouchableOpacity style={styles.txtRepeatDayContainer} onPress={props.onRepeatEntryAllSelected}>
          <Text style={{flex: 8, fontWeight: props.lRepeatAll ? "bold" : "normal", color: props.lRepeatAll ? COLORS.STRONG_CYAN : "black"}}>All</Text>
          {props.lRepeatAll ?
            <Icon style={{flex: 1}} name='check' type='material' color={COLORS.STRONG_CYAN}/>
          : null}
        </TouchableOpacity>
        {WEEKDAYS.map((day, index) => {
          return (
            <TouchableOpacity key={index} style={styles.txtRepeatDayContainer} onPress={() => props.onRepeatEntrySelected(index)}>
              <Text style={{flex: 8, fontWeight: props.lRepeatTmp[index] ? "bold" : "normal", color: props.lRepeatTmp[index] ? COLORS.STRONG_CYAN : "black"}}>
                Every {day}
              </Text>
              {props.lRepeatTmp[index] ?
                <Icon style={{flex: 1}} name='check' type='material' color={COLORS.STRONG_CYAN}/>
              : null}
            </TouchableOpacity>
          )
        })}
      </Animated.View>
    : null,

  ])

}

export default TrackingSettingLocationSubProps;