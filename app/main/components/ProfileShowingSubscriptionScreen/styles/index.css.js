import {StyleSheet} from 'react-native';
import { COLORS } from '../../../../const/const';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  subscriptionContainer : {
    marginLeft: "7%",
    marginRight: "7%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  subscriptionTitle : {
    fontFamily: "AcuminBold",
    fontSize: 16,
    color: COLORS.STRONG_CYAN
  },
  subscriptionPrice : {
    fontFamily: "Acumin",
    fontSize: 10,
    color: COLORS.STRONG_CYAN
  },
  number : {
    fontFamily: "AcuminBold",
    fontSize: 40,
    color: COLORS.STRONG_CYAN
  },
  text : {
    fontFamily: "Acumin",
    fontSize: 10,
    color: COLORS.STRONG_CYAN
  },
  buttonSelect: {
    width: "80%",
    backgroundColor: COLORS.STRONG_CYAN,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  column : {
    flexDirection: "column",
    width: wp("26.67%")
  },
  smallBox : {
    width: "100%",
    height: hp("8%"),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    elevation: 10
  },
  largeBox : {
    width: "100%",
    height: hp("22%"),
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    elevation: 10
  }
})

export default styles;