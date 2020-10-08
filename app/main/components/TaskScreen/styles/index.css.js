import {StyleSheet} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { COLORS } from "../../../../const/color"; 

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
    height: hp("35%"),
    marginBottom: hp("1%"),
    backgroundColor: COLORS.STRONG_ORANGE,
    borderBottomLeftRadius: wp("5%"),
    borderBottomRightRadius: wp("5%"),
    elevation: 10
  },
  monthPicker : {
    width: wp("30%"),
    marginLeft: wp("10%"),
    fontSize: hp("2%")
  },
  dateList : {
    marginTop: hp("3%"),
    marginLeft: wp("10%"),
    marginRight: wp("10%"),
  },
  dateContainer : {
    width: wp("13%"),
    height: wp("13%"),
    marginRight: wp("3.75%"),
    borderRadius: wp("6.5%"),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE
  },
  dateActiveContainer : {
    width: wp("13%"),
    height: wp("23%"),
    justifyContent: "flex-start",
    backgroundColor: COLORS.WHITE
  },
  dateActive : {
    width: wp("11%"),
    height: wp("11%"),
    marginTop: wp("1%"),
    borderRadius: wp("5.5%"),
    backgroundColor: COLORS.STRONG_ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText : {
    fontSize: hp("2%"),
    fontWeight: "bold",
    color: COLORS.STRONG_ORANGE
  },
  dateTextActive : {
    color: COLORS.WHITE
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
  btnAddTask : {
    width: hp("7%"),
    height: hp("7%"),
    marginRight: wp("10%"),
    borderRadius: hp("3.5%"),
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center"
  },
  txtAddTask : {
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
  taskBoard : {
    position: "absolute",
    bottom: hp("7%"),
    width: wp("90%"),
    height: hp("50%"),
    alignSelf: "center"
  },
  taskItem : {
    width: wp("82%"),
    height: hp("13%"),
    borderRadius: hp("3%"),
    marginLeft: hp("2%"),
    marginBottom: hp("2%"),
    elevation: 6,
    backgroundColor: COLORS.WHITE
  },
  
});

export default styles;