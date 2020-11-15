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
    backgroundColor: "white"
  },

  // warning
  warningBtn : {
    position: "absolute",
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("10%"),
    top: hp("5%"),
    left: wp("10%"),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ec546b",
    shadowOpacity: 0.6,
    elevation: 10
  },
  
  // status animation
  statusContainer: {
    position: "absolute",
    top: 50,
    height: wp('100%'),
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusItemContainer: {
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
  // status list animation
  statusListContainer: {
    flexDirection: "row",
    marginTop: 20,
    width: wp("70%"),
    justifyContent: "flex-end"
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
  settingBtnAnimatedContainer: {
    position: "relative",
    borderRadius: 40,
    shadowOpacity: 0.2,
    marginBottom: 10
  },
  txtSettingBtnGuideContainer: {
    position: "absolute",
    right: 55,
    height: 20,
    overflow: "hidden"
  },
  txtSettingBtnGuide: {
    alignSelf: "flex-start",
    textAlign: "right",
    width: 180,
    color: "rgb(140, 140, 140)",
  },
  calendarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: hp("20%"),
    paddingLeft: wp("5%"),
    paddingRight: wp("5%"),
    // bottom: "auto",
    borderWidth: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)"
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
    backgroundColor: COLORS.STRONG_CYAN,
  }

});

export default styles;