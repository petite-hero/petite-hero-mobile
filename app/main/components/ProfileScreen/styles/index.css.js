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
    marginTop: hp("7%"),
    width: hp("25%"),
    height: hp("25%"),
    borderRadius: hp("12.5%"),
    marginBottom: hp("1%")
  },
  avatarContainer : {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#ffe3c1",
    borderBottomLeftRadius: wp("50%"),
    borderBottomRightRadius: wp("50%"),
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