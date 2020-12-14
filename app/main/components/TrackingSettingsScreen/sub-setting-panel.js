import React from 'react';
import { Text, TouchableOpacity, Animated, Image, View, Switch } from 'react-native';

import styles from './styles/index.css';
import { COLORS } from "../../../const/const";

import Util from './util';


const TrackingSettingLocationSubProps = (props) => {
  
  const ICONS = [require("../../../../assets/icons/home.png"), require("../../../../assets/icons/school.png")];
  const TYPE_COLORS = [COLORS.YELLOW, COLORS.STRONG_CYAN];

  return ([

    // SETTING LOCATION TYPE
    props.substatus === "TYPE" ?
      <Animated.View key={0} style={[styles.locSettingPanel, {left: props.animLeft}]}>
        <Text style={{marginTop: 30, marginLeft: 10, marginBottom: 10, fontFamily: "AcuminBold", color: COLORS.BLACK, fontSize: 15}}>Mark as</Text>
        {["Home", "Education"].map((type, index) => {
          return (
            <TouchableOpacity key={index} style={styles.txtTypeContainer} onPress={() => props.onTypeEntrySelected(type)}>
              <Image source={ICONS[index]} style={{width: 30, height: 25}} />
              <Text style={{flex: 8, fontFamily: "Acumin", fontSize: 16, color: COLORS.STRONG_GREY}}>{type}</Text>
              <View style={{flex: 2, alignItems: "flex-end"}}>
                <View style={[styles.selectIcon, {borderColor: TYPE_COLORS[index]}]}>
                  {props.lTypeTmp === type ?
                    <View style={[styles.selectIconCenter, {backgroundColor: TYPE_COLORS[index]}]}/>
                  : null}
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </Animated.View>
    : null,

    // SETTING LOCATION REPEAT DAYS
    props.substatus === "REPEAT" ?
      <Animated.View key={1} style={[styles.locSettingPanel, {left: props.animLeft}]}>
        <Text style={{marginTop: 30, marginLeft: 10, marginBottom: 10, fontFamily: "AcuminBold", color: COLORS.BLACK, fontSize: 15}}>Repeat on</Text>
        <View style={{flexDirection: "row"}} onPress={props.onRepeatEntryAllSelected}>
          <Text style={{flex: 8, fontFamily: "Acumin", fontSize: 16, color: COLORS.STRONG_GREY, marginLeft: 10}}>All week</Text>
          <Switch
            trackColor={{ false: COLORS.GREY, true: COLORS.LIGHT_CYAN }}
            thumbColor={props.lRepeatAll ? COLORS.STRONG_CYAN : COLORS.STRONG_GREY}
            onValueChange={props.onRepeatEntryAllSelected}
            value={props.lRepeatAll}
            style={{
              flex: 3,
              transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
              marginRight: 5
            }}
          />
        </View>
        <View style={{flexDirection: "row", justifyContent: "center", marginTop: 15}}>
          {Util.WEEKDAYS_ABB.map((day, index) => {
            if (index <= 2)
              return (
                <TouchableOpacity key={index} style={[styles.txtRepeatDayContainer, {borderColor: props.lRepeatTmp[index] ? COLORS.STRONG_CYAN : COLORS.MEDIUM_GREY}]}
                                  onPress={() => props.onRepeatEntrySelected(index)}>
                  <Text style={{fontFamily: "AcuminBold", fontSize: 16, color: props.lRepeatTmp[index] ? COLORS.STRONG_CYAN : COLORS.MEDIUM_GREY}}>{day}</Text>
                </TouchableOpacity>
              )
          })}
        </View>
        <View style={{flexDirection: "row", justifyContent: "center", marginTop: 10}}>
          {Util.WEEKDAYS_ABB.map((day, index) => {
            if (index > 2)
              return (
                <TouchableOpacity key={index} style={[styles.txtRepeatDayContainer, {borderColor: props.lRepeatTmp[index] ? COLORS.STRONG_CYAN : COLORS.MEDIUM_GREY}]}
                                  onPress={() => props.onRepeatEntrySelected(index)}>
                  <Text style={{fontFamily: "AcuminBold", fontSize: 16, color: props.lRepeatTmp[index] ? COLORS.STRONG_CYAN : COLORS.MEDIUM_GREY}}>{day}</Text>
                </TouchableOpacity>
              )
          })}
        </View>
      </Animated.View>
    : null,

  ])

}

export default TrackingSettingLocationSubProps;