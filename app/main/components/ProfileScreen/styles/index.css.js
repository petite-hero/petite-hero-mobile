import {StyleSheet} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { COLORS } from "../../../../const/const"; 

const styles = StyleSheet.create({
  container : {
    flex: 1
  },
  avatar : {
    marginTop: hp("8%"),
    width: hp("25%"),
    height: hp("25%"),
    borderRadius: hp("12.5%")
  },
  header : {
    width: "100%",
    height: hp("34%"),
    alignItems: "center",
    backgroundColor: COLORS.LIGHT_ORANGE,
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
    alignSelf: "center",
    borderTopRightRadius: hp("6%"),
    borderTopLeftRadius: hp("6%"),
    backgroundColor: COLORS.STRONG_ORANGE
  },
});

export default styles;