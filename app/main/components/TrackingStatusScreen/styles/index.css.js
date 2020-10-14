import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { COLORS } from "../../../../const/const"; 
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({

  // original
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingLeft: wp('10%'),
    paddingRight: wp('10%'),
  },
  avatar : {
    position: "absolute",
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("12%"),
    top: hp("5%"),
    left: wp("10%"),
  },

  warningBtn : {
    position: "absolute",
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("10%"),
    top: hp("5%"),
    right: wp("5%"),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.5)'
  },
  
  statusContainer: {
    height: wp('100%'),
    width: wp('100%'),
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusWave: {
    position: "absolute",
    borderRadius: wp('100%'),
    backgroundColor: "#31ae1f"
  },
  locationStatus: {
    color: 'white',
    fontSize: 24
  },

  datePickerContainer: {
    marginTop: 30
  },

  btnSettings: {
    width: 200,
    height: 40,
    marginTop: 20,
    backgroundColor: COLORS.STRONG_ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },

});

export default styles;