import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import { COLORS } from "../../../../const/const"; 
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({

  // original
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingLeft: wp('10%'),
    paddingRight: wp('10%'),
  },
  header : {
    width: "100%",
    height: hp("34%"),
    backgroundColor: COLORS.LIGHT_ORANGE,
    borderBottomLeftRadius: wp("50%"),
    borderBottomRightRadius: wp("50%"),
  },
  avatar : {
    position: "absolute",
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("12%"),
    top: hp("5%"),
    left: wp("10%"),
  },

  // gg maps
  safeLoc: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: 'green',
  },
  realLoc: {
    height: 20,
    width: 20,
    borderRadius: 20 ,
    backgroundColor: COLORS.STRONG_ORANGE
  }

});

export default styles;