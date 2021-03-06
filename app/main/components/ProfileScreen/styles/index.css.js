import {StyleSheet} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { COLORS } from "../../../../const/const"; 

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  avatar : {
    width: hp("12%"),
    height: hp("12%"),
    borderRadius: hp("6%"),
    backgroundColor: COLORS.STRONG_CYAN
  },
  header : {
    marginTop: "5%",
    marginLeft: wp("10%"),
    marginRight: wp("10%")
  },
  name : {
    fontSize: hp("3.5%"),
    fontFamily: "AcuminBold",
    color: COLORS.BLACK
  },
  settings : {
    paddingLeft: wp("12%"),
    paddingRight: wp("12%"),
    paddingBottom: hp("2%"),
    alignItems: "center",
    justifyContent: "center"
  },
  settingItem : {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
});

export default styles;