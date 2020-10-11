import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import { COLORS } from "../../../../const/color"; 
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
  
  btnSettings : {
    width: 200,
    height: 40,
    marginTop: 20,
    backgroundColor: COLORS.STRONG_ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },

});

export default styles;