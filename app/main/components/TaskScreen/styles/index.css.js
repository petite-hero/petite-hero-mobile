import {StyleSheet} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
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
    height: hp("32%"),
    marginBottom: hp("1%"),
    borderBottomLeftRadius: wp("5%"),
    borderBottomRightRadius: wp("5%")
  },
  bigCircle : {
    position: "absolute",
    width: wp("88%"),
    height: wp("88%"),
    borderRadius: wp("44%"),
    top: -hp("23.5%"),
    left: -wp("44%"),
    backgroundColor: COLORS.LIGHT_CYAN,
    elevation: -1
  },
  smallCircle: {
    position: "absolute",
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: wp("15%"),
    top: -hp("4%"),
    right: -wp("23%"),
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
  dateContainer : {
    width: wp("14.3%"),
    height: hp("10%"),
    justifyContent: "center",
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: wp("6%"),
    borderColor: COLORS.MEDIUM_GREY,
    backgroundColor: COLORS.WHITE,
    elevation: 0
  },
  dateActiveContainer : {
    borderColor: COLORS.STRONG_CYAN,
    backgroundColor: COLORS.WHITE
  },
  dateText : {
    fontSize: 15,
    fontFamily: "Acumin",
    color: COLORS.BLACK
  },
  dateNum : {
    fontSize: 20,
    fontFamily: "AcuminBold",
    color: COLORS.BLACK
  },
  dateTextActive : {
    color: COLORS.STRONG_CYAN
  },
  dateTimePickerShower: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  titleContainer : {
    marginTop: hp("5%"),
    marginLeft: wp("10%"),
    marginBottom: hp("2%"),
    marginRight: wp("10%")
  },
  title : {
    fontSize: 30,
    fontFamily: "AcuminBold",
    color: COLORS.STRONG_CYAN
  },
  btnAddTask : {
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
  btnBack : {
    top: -hp("8%"),
    left: "93%",
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
    elevation: 20
  },
  btnForth : {
    top: -hp("8%"),
    right: "9%",
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
    elevation: 20
  },
  tabs : {
    flexDirection: "row", 
    justifyContent: "space-evenly",
    marginTop: hp("2%")
  },
  tabActive : {
    borderBottomWidth: 2, 
    borderColor: COLORS.STRONG_CYAN
  },
  tabText : {
    fontSize: hp("2%"),
  },
  tabTextActive : {
    color: COLORS.STRONG_CYAN,
    paddingBottom: hp("1%")
  },
  taskBoard : {
    width: "100%",
    height: hp("60%"),
    marginTop: hp("3%"),
    paddingRight: wp("10%"),
    alignSelf: "center",
  },
  taskItem : {
    width: wp("80%"),
    height: hp("11.5%"),
    borderRadius: hp("3%"),
    marginBottom: hp("2%"),
    justifyContent: "center",
    backgroundColor: COLORS.WHITE,
    borderWidth: 2
  },
  fontAcumin : {
    fontFamily: "Acumin"
  },
  fontAcuminBold : {
    fontFamily: "AcuminBold"
  },
  "mr-2" : {
    marginRight: wp("2%")
  },
  "fs-16" : {
    fontSize: 16
  },
  "fs-18" : {
    fontSize: 18
  },
  "fs-20" : {
    fontSize: 20
  }
});

export default styles;