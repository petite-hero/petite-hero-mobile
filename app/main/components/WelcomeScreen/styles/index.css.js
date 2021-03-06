import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS } from "../../../../const/const"; 

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button : {
    marginTop: hp('10%'),
    width: wp('55%'),
    height: hp('7%'),
    borderRadius: hp('3.5%'),
    backgroundColor: COLORS.STRONG_CYAN,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton : {
    fontSize: 16,
    fontFamily: "Acumin",
    color: COLORS.WHITE
  },
  title : {
    fontSize: 52,
    fontFamily: "AcuminBold",
    color: COLORS.WHITE
  },
  circle : {
    backgroundColor: "transparent",
    marginTop: hp('20%'),
    width: hp('45%'),
    height: hp('45%'),
  }
});

export default styles;