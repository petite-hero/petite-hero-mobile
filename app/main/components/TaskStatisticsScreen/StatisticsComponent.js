import React, { useState } from 'react';
import { View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from '../../../const/const';
import BarComponent from './BarComponent';
import LinesComponent from './LinesComponent';

const StatisticsComponent = ({ data }) => {
  return (
    <View style={{
      marginTop: hp("40%"),
      marginLeft: wp("10%"),
      marginRight: wp("10%")
    }}>
      <LinesComponent numOfLines={9}/>
      <BarComponent title={"Housework"} barColor={COLORS.YELLOW} barHeight={data[0]} textColor={COLORS.YELLOW} amount={data[0]} position={1}/>
      <BarComponent barColor={COLORS.MEDIUM_GREY} barHeight={data[1]} textColor={COLORS.MEDIUM_GREY} amount={data[1]} position={2}/>
      <BarComponent title={"Education"} barColor={COLORS.STRONG_CYAN} barHeight={data[2]} textColor={COLORS.STRONG_CYAN} amount={data[2]} position={3.25}/>
      <BarComponent barColor={COLORS.MEDIUM_GREY} barHeight={data[3]} textColor={COLORS.MEDIUM_GREY} amount={data[3]} position={4.25}/>
      <BarComponent title={"Skills"} barColor={COLORS.GREEN} barHeight={data[4]} textColor={COLORS.GREEN} amount={data[4]} position={5.5}/>
      <BarComponent barColor={COLORS.MEDIUM_GREY} barHeight={data[5]} textColor={COLORS.MEDIUM_GREY} amount={data[5]} position={6.5}/>
    </View>
  );
}

export default StatisticsComponent;