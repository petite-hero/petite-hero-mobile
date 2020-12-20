import {StyleSheet} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { COLORS } from "../../../../const/const"; 

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  avatar : {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
  },
  header : {
    width: "100%",
    height: hp("16%"),
    marginBottom: hp("1%")
  },
  circle : {
    position: "absolute",
    top: -hp("45%"),
    left: -wp("25%"),
    width: wp("150%"),
    height: wp("150%"),
    borderRadius: wp("100%"),
    backgroundColor: COLORS.LIGHT_CYAN,
    elevation: -1
  },
  monthPicker : {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp("10%"),
    fontSize: hp("2%"),
    fontFamily: "Acumin"
  },
  dateList : {
    marginTop: hp("2%"),
    marginLeft: wp("10%"),
    marginRight: wp("10%")
  },
  badgeContainer : {
    width: wp("14.3%"),
    height: hp("10%"),
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: wp("6%"),
    backgroundColor: COLORS.LIGHT_CYAN
  },
  titleContainer : {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("5%"),
    marginLeft: wp("10%"),
    marginBottom: hp("2%"),
    marginRight: wp("10%")
  },
  title : {
    fontSize: 30,
    fontFamily: "AcuminBold",
    color: COLORS.BLACK
  },
  btnAddQuest : {
    position: "absolute",
    bottom: "10%",
    right: "10%",
    width: wp("13.33%"),
    height: wp("13.33%"),
    borderRadius: wp("6.665%"),
    backgroundColor: COLORS.STRONG_CYAN,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10
  },
  tabActive : {
    borderBottomWidth: 2, 
    borderColor: COLORS.BLACK
  },
  tabText : {
    color: COLORS.BLACK,
    fontSize: hp("2%"),
  },
  tabTextActive : {
    color: COLORS.BLACK,
    paddingBottom: hp("1%")
  },
  questBoard : {
    marginTop: hp("3%"),
    height: hp("75%"),
    marginLeft: "5%",
    marginRight: "5%"
  },
  questItem : {
    height: wp("40%"),
    borderWidth: 2,
    borderRadius: 25,
    marginLeft: wp("2.5%"),
    marginRight: wp("2.5%"),
    marginBottom: hp("2%"),
    backgroundColor: COLORS.WHITE
  }
});

export default styles;