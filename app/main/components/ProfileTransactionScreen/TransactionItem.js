import React from 'react';
import { Text, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import NumberFormat from 'react-number-format';
import { COLORS } from '../../../const/const';

const TransactionItem = (props) => {
  return (
    <View style={{
      width: widthPercentageToDP("100%"),
      height: heightPercentageToDP("8%"),
      backgroundColor: props.index % 2 == 0 ? COLORS.LIGHT_CYAN : COLORS.WHITE
    }}>
      <View style={{
        height: "100%",
        flexDirection: "row",
        marginLeft: "10%",
        marginRight: "10%",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <View style={{
          maxWidth: "20%"
        }}>
          <Text style={{
            fontFamily: "AcuminBold",
            fontSize: 16,
            color: COLORS.STRONG_CYAN
          }}>
            {new Date(props.date).getDate() + "/" + (new Date(props.date).getMonth() + 1)}
          </Text>
          <Text style={{
            fontFamily: "AcuminBold",
            fontSize: 16,
            color: COLORS.STRONG_CYAN
          }}>
            {new Date(props.date).getFullYear()}
          </Text>
        </View>
        <Text style={{
          maxWidth: "60%",
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.STRONG_CYAN
        }}>
          {props.title}
        </Text>
        <NumberFormat
          value={props.amount}
          renderText={value => 
            <Text style={{
              maxWidth: "20%",
              fontFamily: "AcuminBold",
              fontSize: 16,
              color: COLORS.STRONG_CYAN
            }}>
              {value}
            </Text>
          }
          displayType="text"
          thousandSeparator={props.locale === "en" ? "," : "."}
          decimalSeparator={props.locale === "en" ? "." : ","}
          suffix="đ"
        />
      </View>
    </View>
  );
}

export default TransactionItem;