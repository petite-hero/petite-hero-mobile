import React from 'react';
import { Text, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';

const LinesComponent = (props) => {
  let lines = [];

  for (let i = 0; i < props.numOfLines; i++) {
    lines.push(
      <View key={i + ""} style={styles.lineContainer}>
        {
          i % 2 == 0 &&
          <Text style={[styles.numStyle, {bottom: heightPercentageToDP("4%") * i}]}>
            {10 * i}
          </Text>
        }
        <View style={[styles.lineStyle, {bottom: heightPercentageToDP("4%") * i}]}/>
      </View>
    );
  }

  return (
    <>
      {lines}
    </>
  )
}

export default LinesComponent;