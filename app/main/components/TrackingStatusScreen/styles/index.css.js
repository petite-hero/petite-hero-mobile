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
    width: wp("13.33%"),
    height: wp("13.33%"),
    borderRadius: wp("10%"),
    top: hp("5%"),
    left: wp("10%"),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ec546b",
    shadowOpacity: 0.2,
    elevation: 5
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
    marginTop: 10,
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
    height: wp("13.33%"),
    width: wp("13.33%"),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp("13.33%"),
    backgroundColor: "white",
    marginBottom: 10
  },
  settingBtnAnimatedContainer: {
    position: "relative",
    borderRadius: wp("13.33%"),
    marginBottom: 10,
    backgroundColor: "white"
  },
  txtSettingBtnGuideContainer: {
    position: "absolute",
    right: 55,
    height: 24,
    overflow: "hidden"
  },
  txtSettingBtnGuide: {
    alignSelf: "flex-start",
    textAlign: "right",
    width: 220,
    color: "#9edbfa",
    fontFamily: "Acumin",
    fontSize: 17,
  },
  calendarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: hp("18%"),
    paddingLeft: wp("5%"),
    paddingRight: wp("5%"),
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
    bottom: 2,
    width: 30,
    height: 30,
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