import {StyleSheet} from "react-native"
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
    height: hp("20%"),
    marginBottom: hp("1%"),
    backgroundColor: COLORS.STRONG_CYAN,
    borderBottomLeftRadius: wp("5%"),
    borderBottomRightRadius: wp("5%"),
    elevation: 10
  },
  titleContainer : {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("5%"),
    marginLeft: wp("10%"),
    marginBottom: hp("1%"),
    marginRight: wp("10%")
  },
  title : {
    fontSize: hp("5%"),
    fontFamily: "AcuminBold",
    color: COLORS.WHITE
  },
  btnAddQuest : {
    width: hp("7%"),
    height: hp("7%"),
    marginTop: hp("3.5%"),
    marginRight: wp("10%"),
    borderRadius: hp("3.5%"),
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10
  },
  txtAddQuest : {
    fontSize: hp("7%"),
    fontFamily: "Acumin",
    color: COLORS.STRONG_CYAN,
    marginBottom: hp("0.8%")
  },
  tabActive : {
    borderBottomWidth: 2, 
    borderColor: COLORS.STRONG_CYAN
  },
  tabText : {
    fontSize: hp("2%"),
    fontFamily: "Acumin"
  },
  tabTextActive : {
    color: COLORS.STRONG_CYAN,
    paddingBottom: hp("1%")
  },
  questItem : {
    width: wp("40%"),
    height: wp("40%"),
    borderRadius: hp("3%"),
    marginBottom: hp("2%"),
    marginLeft: wp("2%"),
    marginRight: wp("2%"),
    paddingLeft: wp("2%"),
    paddingRight: wp("2%"),
    paddingTop: hp("3%"),
    paddingBottom: hp("3%"),
    alignItems: "center",
    elevation: 8,
    backgroundColor: COLORS.WHITE
  },
  questBoard : {
    width: wp("90%"),
    height: hp("60%"),
    marginTop: hp("5%"),
    alignSelf: "center",
  }
});

export default styles;