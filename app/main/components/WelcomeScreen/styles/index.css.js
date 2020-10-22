import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS } from "../../../../const/const"; 

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingLeft: wp('10%'),
    paddingRight: wp('10%'),
  },
  btnRegister : {
    marginTop: hp('7%'),
    width: wp('55%'),
    height: hp('7%'),
    borderRadius: hp('3.5%'),
    backgroundColor: COLORS.STRONG_ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },
  btnLogin : {
    marginTop: hp('1%'),
    width: wp('55%'),
    height: hp('7%'),
    borderRadius: hp('3.5%'),
    backgroundColor: COLORS.STRONG_ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },
  txtHello : {
    fontSize: hp('7%'),
    fontWeight: "bold",
  },
  txtMessage : {
    fontSize: hp('2%'),
  },
  txtButton : {
    fontSize: hp('2%'),
    color: "#ffffff"
  },
  circle : {
    marginTop: hp('7%'),
    width: hp('40%'),
    height: hp('40%'),
    borderRadius: hp('20%')
  }
});

export default styles;