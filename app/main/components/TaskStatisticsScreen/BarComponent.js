import React from 'react';
import { Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import styles from './styles/index.css';

const BarComponent = ({maxTasks, name, title, barColor, barHeight, textColor, amount, position}) => {
  let lineValue = maxTasks > 8 ? 1 : (() => {
    return Math.ceil(
      maxTasks / 5) * 5 < 8 ? 10 : 5
  })();

  return (
    <>
    <View style={[styles.barContainer, {left: wp("10%") * position}]}>
      <Text style={[styles.barNumStyle, {color: textColor}]}>
        {amount}
      </Text>
      <View 
        style={[styles.barStyle, {
          borderColor: barColor,
          backgroundColor: barColor,
          height: barHeight / lineValue * hp("4%")
        }]}
      />
    </View>
    <Text style={[styles.barNumStyle, {
      position: "absolute",
      bottom: -20,
      left: wp("10%") * position,
      width: wp("10%"),
      textAlign: "center",
      color: textColor,
      fontSize: 12
    }]}>
      {name}
    </Text>
    <Text style={[styles.barNumStyle, {
      position: "absolute",
      bottom: -35,
      left: wp("10%") * position,
      width: wp("20%"),
      textAlign: "center",
      color: textColor
    }]}>
      {title}
    </Text>
    </>
  );
}

export default BarComponent;