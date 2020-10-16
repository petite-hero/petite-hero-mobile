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

  // warning button
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
  
  // status animation
  statusContainer: {
    position: "absolute",
    top: 80,
    height: wp('100%'),
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusWave: {
    position: "absolute",
    borderRadius: wp('100%'),
    backgroundColor: "rgb(0, 154, 34)"
  },
  locationStatus: {
    color: 'white',
    fontSize: 24
  },

  // setting buttons
  settingBtnsContainer: {
    position: "absolute",
    right: wp("10%"),
    bottom: 80,
    // borderWidth: 1
  },
  settingBtnContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: "white",
    marginBottom: 10
  },
  txtSettingBtnGuide: {
    position: "absolute",
    right: 55,
    width: 200,
    textAlign: "right",
    color: "rgb(140, 140, 140)",
  },

  // nav bar
  bottomTab : {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    height: 56,
    borderRadius: 20,
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  tabItem : {
    alignSelf: "center"
  },
  tabIcon : {
    width: 24,
    height: 24,
    alignSelf: "center"
  },
  indicator : {
    position: "absolute",
    top: 0,
    width: wp('10%'),
    height: 3,
    borderRadius: 3,
    marginLeft: wp("6.25%"),
    backgroundColor: COLORS.STRONG_ORANGE,
  }

});

export default styles;