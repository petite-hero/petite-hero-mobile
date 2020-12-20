import React from 'react';
import { Text, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import styles from './styles/index.css';

const LinesComponent = (props) => {
  let lines = [];
  let lineValue = props.maxTasks > 8 ? 1 : (() => {
    return Math.ceil(props.maxTasks / 5) * 5 < 8 ? 10 : 5
  })();

  for (let i = 0; i < props.numOfLines; i++) {
    lines.push(
      <View key={i + ""} style={styles.lineContainer}>
        {
          i % 2 == 0 &&
          <Text style={[styles.numStyle, {bottom: heightPercentageToDP("4%") * i}]}>
            {lineValue * i}
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