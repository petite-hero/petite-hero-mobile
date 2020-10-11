import {StyleSheet} from "react-native"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { COLORS } from "../../../../const/const"; 

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: COLORS.NUDE
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
    backgroundColor: COLORS.STRONG_ORANGE,
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
    fontWeight: "bold",
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
    color: COLORS.STRONG_ORANGE,
    marginBottom: hp("0.8%")
  },
  tabActive : {
    borderBottomWidth: 2, 
    borderColor: COLORS.STRONG_ORANGE
  },
  tabText : {
    fontSize: hp("2%"),
  },
  tabTextActive : {
    color: COLORS.STRONG_ORANGE,
    paddingBottom: hp("1%")
  },
  questItem : {
    width: wp("74%"),
    height: hp("6.5%"),
    borderRadius: hp("3.25%"),
    marginBottom: hp("2%"),
    marginLeft: hp("4%")
  },
  questBoard : {
    position: "absolute",
    bottom: hp("4%"),
    width: wp("90%"),
    alignSelf: "center",
    borderTopRightRadius: hp("6%"),
    borderTopLeftRadius: hp("6%"),
    backgroundColor: COLORS.STRONG_ORANGE,
  }
});

export default styles;