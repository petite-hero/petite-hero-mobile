import {StyleSheet} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { COLORS } from "../../../../const/const"; 

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: COLORS.LIGHT_CYAN
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
    backgroundColor: COLORS.WHITE,
    borderBottomLeftRadius: wp("5%"),
    borderBottomRightRadius: wp("5%"),
    elevation: 10
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
    borderRadius: wp("6%"),
    backgroundColor: COLORS.LIGHT_CYAN
  },
  dateActiveContainer : {
    backgroundColor: COLORS.STRONG_CYAN
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
    color: COLORS.WHITE
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
  btnAddTask : {
    position: "absolute",
    bottom: "10%",
    right: "10%",
    width: wp("15%"),
    height: wp("15%"),
    borderRadius: wp("7.5%"),
    backgroundColor: COLORS.STRONG_CYAN,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10
  },
  btnBack : {
    right: "50%",
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
    elevation: 20
  },
  btnForth : {
    left: "50%",
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
    elevation: 20
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
    marginTop: hp("3%"),
    height: hp("60%"),
    alignSelf: "center"
  },
  taskItem : {
    width: wp("80%"),
    height: hp("11.5%"),
    borderRadius: hp("3%"),
    marginBottom: hp("2%"),
    justifyContent: "center",
    elevation: 6,
    backgroundColor: COLORS.WHITE
  },
  
});

export default styles;