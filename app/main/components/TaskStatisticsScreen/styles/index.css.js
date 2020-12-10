import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../const/const'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor: COLORS.WHITE
  },
  lineContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  lineStyle: {
    height: 0,
    width: "93%",
    alignSelf: "flex-end", 
    borderBottomWidth: 0.5
  },
  numStyle : {
    width: "7%",
    textAlign: "left",
    fontFamily: "Acumin",
    fontSize: 14,
    color: COLORS.LIGHT_GREY,
    marginBottom: -8
  },
  barContainer: {
    position: "absolute",
    bottom: 0,
    width: wp("10%"),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  barNumStyle : {
    fontFamily: "Acumin",
    fontSize: 14
  },
  barStyle : {
    width: "100%",
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  }
});

export default styles;