import {StyleSheet} from "react-native"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { COLORS } from "../../../../const/color"; 

const styles = StyleSheet.create({
  container : {
    flex: 1
  },
  avatar : {
    width: wp("12%"),
    height: wp("12%"),
    marginTop: hp("7%"),
    marginLeft: wp("10%"),
    borderRadius: wp("6%"),
    marginBottom: hp("1%"),
  },
  header : {
    width: "100%",
    height: hp("34%"),
    backgroundColor: COLORS.LIGHT_ORANGE,
    borderBottomLeftRadius: wp("50%"),
    borderBottomRightRadius: wp("50%"),
  },
  monthPicker : {
    width: wp("30%"),
    marginLeft: wp("10%"),
    fontSize: hp("2%")
  },
  dateList : {
    marginTop: hp("4%"),
    marginLeft: wp("10%"),
    marginRight: wp("10%")
  },
  dateContainer : {
    width: wp("18%"),
    height: wp("28%"),
    marginRight: wp("2%"),
    borderRadius: wp("5%"),
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE
  },
  dateActive : {
    backgroundColor: COLORS.STRONG_ORANGE
  },
  dateText : {
    fontSize: wp("7%"),
    fontWeight: "bold",
    color: "#bbc0c4"
  },
  dateTextActive : {
    color: COLORS.WHITE
  },
  titleContainer : {
    marginLeft: wp("10%"),
    marginRight: wp("10%"),
    marginBottom: hp("2%"),
    marginTop: hp("5%"),
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title : {
    fontSize: hp("5%"),
    fontWeight: "bold"
  },
  btnAddQuest : {
    width: hp("7%"),
    height: hp("7%"),
    borderRadius: hp("3.5%"),
    backgroundColor: COLORS.STRONG_ORANGE,
    alignItems: "center",
    justifyContent: "center"
  },
  txtAddQuest : {
    fontSize: hp("7%"),
    color: "white",
    marginBottom: hp("0.8%")
  },
  questItem : {
    width: wp("74%"),
    height: hp("6.5%"),
    borderRadius: hp("3.25%"),
    marginBottom: hp("2%"),
    marginLeft: hp("4%")
  },
  questBoard : {
    width: wp("90%"),
    height: hp("50%"),
    alignSelf: "center",
    borderTopRightRadius: hp("6%"),
    borderTopLeftRadius: hp("6%"),
    backgroundColor: COLORS.STRONG_ORANGE
  },
});

export default styles;