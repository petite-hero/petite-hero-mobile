import React from 'react';
import { View, Text, TextInput, Animated } from 'react-native';
import { Icon } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';

import styles from './styles/index.css';
import { COLORS } from "../../../const/const";

import Util from './util';


const TrackingSettingLocation = (props) => {

  const RADIUS_MIN = 40;
  const RADIUS_MAX = 1000;
  
  [showFromTimePicker, setShowFromTimePicker] = React.useState(false);
  [showToTimePicker, setShowToTimePicker] = React.useState(false);

  return (

    <Animated.View style={[styles.locSettingPanel, {left: props.animLeft}]}>

      {/* field: name */}
      <TextInput
        onChangeText={props.onNameChange}
        defaultValue={props.name}
        style={styles.txtInputLocName}
      />

      {/* field: type */}
      <View style={{flexDirection: "row", marginTop: 15}}>
        <Text style={{flex: 4}}>Marked as</Text>
        <Text style={{flex: 7, textAlign: "right", color: COLORS.STRONG_CYAN}} onPress={props.onTypeSelecting}>
          {props.type}
        </Text>
        <Icon style={{flex: 1}} containerStyle={{position: "relative", left: 6}} name='keyboard-arrow-right' type='material' color={COLORS.STRONG_CYAN}/>
      </View>

      {/* field: radius */}
      <View style={{flexDirection: "row", marginTop: 15}}>
        <Text style={{flex: 3}}>Radius</Text>
        <Slider
          style={{flex: 8, height: 20}}
          minimumTrackTintColor={COLORS.STRONG_CYAN}
          thumbTintColor={COLORS.STRONG_CYAN}
          minimumValue={RADIUS_MIN} maximumValue={RADIUS_MAX}
          value={props.initialRadius} initial
          onValueChange={props.onRadiusChange}
        />
        <Text style={{flex: 3, textAlign: "right", color: COLORS.STRONG_CYAN}}>{Math.round(props.radius)} m</Text>
      </View>

      {/* field: from time */}
      {props.type === "Home" ? null :
        <View style={{flexDirection: "row", marginTop: 15}}>
          <Text style={{flex: 3}}>From</Text>
          <Text style={{flex: 2, textAlign: "right", color: COLORS.STRONG_CYAN}} onPress={() => setShowFromTimePicker(true)}>
            {props.fromTime == "None" || props.fromTime == null ? "None" : props.fromTime.slice(0, -3)}
          </Text>
          {showFromTimePicker ?
            <DateTimePicker value={new Date()} mode={"time"} onChange={(event, time) => {
              setShowFromTimePicker(false);
              props.onFromTimeSelected(null, time);
            }}/>
          : null}
        </View>
      }

      {/* field: to time */}
      {props.type === "Home" ? null :
        <View style={{flexDirection: "row", marginTop: 15}}>
          <Text style={{flex: 3}}>To</Text>
          <Text style={{flex: 2, textAlign: "right", color: COLORS.STRONG_CYAN}} onPress={() => setShowToTimePicker(true)}>
            {props.ttoTime == "None" || props.ttoTime == null ? "None" : props.ttoTime.slice(0, -3)}
          </Text>
          {showToTimePicker ?
            <DateTimePicker value={new Date()} mode={"time"} onChange={(event, time) => {
              setShowToTimePicker(false);
              props.onToTimeSelected(null, time);
            }}/>
          : null}
        </View>
      }

      {/* field: repeat */}
      {props.type === "Home" ? null :
        <View style={{flexDirection: "row", marginTop: 15}}>
          <Text style={{flex: 3}}>Repeat on</Text>
          <Text style={{flex: 7, textAlign: "right", color: COLORS.STRONG_CYAN}} onPress={props.onRepeatSelecting}>
            {Util.repeatArrToShowStr(props.repeat)}
          </Text>
          <Icon style={{flex: 1}} containerStyle={{position: "relative", left: 6}} name='keyboard-arrow-right' type='material' color={COLORS.STRONG_CYAN}/>
        </View>
      }

    </Animated.View>

  )
}

export default TrackingSettingLocation;