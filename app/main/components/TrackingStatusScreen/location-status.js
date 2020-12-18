import React from 'react';
import { View, Image, Animated, Easing } from 'react-native';

import styles from './styles/index.css';
import { TouchableOpacity } from 'react-native-gesture-handler';


const LocationStatus = (props) => {

  const CENTER_RATIO = 0.6;
  const DIAMETER = props.diameter;
  const STATUS_DURATION = 3000;
  const STATUS_COLORS = {"LOADING": "rgb(140, 140, 140)", "INACTIVE": "rgb(140, 140, 140)",
                         "SAFE": "rgb(0, 154, 34)", "NOT SAFE": "red"};
  const CHILD_AVATARS = {"Male": require("../../../../assets/avatar-son.png"), "Female": require("../../../../assets/avatar-daughter.png")};

  const animTrackingStatus = React.useRef(new Animated.Value(0)).current;
  let animTrackingStatusScales = [];
  animTrackingStatusScales.push(animTrackingStatus.interpolate({inputRange: [0, 1], outputRange: [CENTER_RATIO, 1]}));
  animTrackingStatusScales.push(animTrackingStatus.interpolate({inputRange: [0, 1/3, 1/3+0.001, 1], outputRange: [CENTER_RATIO+2/3*(1-CENTER_RATIO), 1, CENTER_RATIO, CENTER_RATIO+2/3*(1-CENTER_RATIO)]}));
  animTrackingStatusScales.push(animTrackingStatus.interpolate({inputRange: [0, 2/3, 2/3+0.001, 1], outputRange: [CENTER_RATIO+1/3*(1-CENTER_RATIO), 1, CENTER_RATIO, CENTER_RATIO+1/3*(1-CENTER_RATIO)]}));
  let animTrackingStatusOpacs = [];
  animTrackingStatusOpacs.push(animTrackingStatus.interpolate({inputRange: [0, 1], outputRange: [1, 0]}));
  animTrackingStatusOpacs.push(animTrackingStatus.interpolate({inputRange: [0, 1/3, 1/3+0.001, 1], outputRange: [1/3, 0, 1, 1/3]}));
  animTrackingStatusOpacs.push(animTrackingStatus.interpolate({inputRange: [0, 2/3, 2/3+0.001, 1], outputRange: [2/3, 0, 1, 2/3]}));

  React.useEffect(() => {
    if (props.trackingStatus === "INACTIVE"){
      animTrackingStatus.stopAnimation();
    }
    else if (props.trackingStatus === "LOADING"){
      animTrackingStatus.setValue(0);
      Animated.loop(Animated.timing(animTrackingStatus, {toValue: 1, duration: STATUS_DURATION, easing: Easing.linear, useNativeDriver: true})).start();
    }
    else if (props.trackingStatus === "SAFE"){
      animTrackingStatus.setValue(0);
      Animated.loop(Animated.timing(animTrackingStatus, {toValue: 1, duration: STATUS_DURATION, easing: Easing.linear, useNativeDriver: true})).start();
    } else if (props.trackingStatus === "NOT SAFE"){
      animTrackingStatus.setValue(0);
      Animated.loop(Animated.timing(animTrackingStatus, {toValue: 1, duration: STATUS_DURATION/2, easing: Easing.linear, useNativeDriver: true})).start();
    }
  }, [props.trackingStatus]);

  return (

    <TouchableOpacity style={[styles.statusItemContainer, {width: props.diameter, height: props.diameter, marginRight: props.margin}]}
                      onPress={props.onPress} activeOpacity={1}>
      {animTrackingStatusScales.map((animScale, index) => {
        return (
          <Animated.View key={index} style={[styles.statusWave, {backgroundColor: STATUS_COLORS[props.trackingStatus],
                          transform: [{scaleX: animScale}, {scaleY: animScale}],
                          width: DIAMETER, height: DIAMETER, opacity: animTrackingStatusOpacs[index]}]}/>
        )
      })}
      <View style={[styles.statusWave, {backgroundColor: STATUS_COLORS[props.trackingStatus]},
                    {width: DIAMETER*CENTER_RATIO, height: DIAMETER*CENTER_RATIO}]}/>
      <Image
        source={props.photo ? {uri: "data:image/png;base64," + props.photo} : CHILD_AVATARS[props.gender]}
        style={{width: DIAMETER*CENTER_RATIO, height: DIAMETER*CENTER_RATIO, borderRadius: DIAMETER}}
      />
    </TouchableOpacity>

  )
}

export default LocationStatus;