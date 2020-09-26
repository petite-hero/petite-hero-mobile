import {StyleSheet} from "react-native";
import Constants from "expo-constants";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight
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
    backgroundColor: "#ffe3c1",
    borderBottomLeftRadius: wp("50%"),
    borderBottomRightRadius: wp("50%"),
  },
  monthPicker : {
    width: wp("30%"),
    marginLeft: wp("10%"),
    fontSize: hp("2%")
  },
  circle : {
    width: hp("6.5%"),
    height: hp("6.5%"),
    borderRadius: hp("3.25%"),
    marginBottom: hp("2%"),
    marginTop: hp("3%"),
    marginLeft: hp("4%")
  },
  name : {
    fontSize: hp("5%"),
    fontWeight: "bold"
  },
  message : {
    fontSize: hp("1.8%"),
    textAlign: "center"
  },
  informationContainer : {
    paddingLeft: wp("12%"),
    paddingRight: wp("12%"),
    paddingBottom: hp("2%"),
    alignItems: "center",
    justifyContent: "center"
  },
  settingItem : {
    width: wp("74%"),
    height: hp("6.5%"),
    borderRadius: hp("3.25%"),
    marginBottom: hp("2%"),
    marginLeft: hp("4%")
  },
  profileBoard : {
    width: wp("90%"),
    height: hp("50%"),
    borderTopRightRadius: hp("6%"),
    borderTopLeftRadius: hp("6%"),
    backgroundColor: "#e5834c"
  },
});

export default styles;