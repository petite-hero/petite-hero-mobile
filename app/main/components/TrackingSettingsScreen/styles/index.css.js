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
  fixedPin: {
    position: "absolute",
    top: "auto",
    bottom: hp('50%'),
    left: wp('50%') - 13,
    right: "auto",
    width: 26,
    height: 41
  },
  safeLoc: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: COLORS.STRONG_ORANGE,
  },

  // control panel
  controlPanel:{
    position: "absolute",
    top: "auto",
    bottom: 0,
    left: wp('5%'),
    right: wp('5%'),
    height: hp('45%'),
    borderRadius: hp('4%'),  // same as nav bar
    backgroundColor: COLORS.NUDE
  },
  controlPanelFocused:{
    position: "absolute",
    top: "auto",
    bottom: 0,
    left: 0,
    right: 0,
    height: hp('100%'),
  },
  searchBarContainer: {
    height: 64,  // equals to textInput + margins
    borderWidth: 1
  },
  searchBarContainerFocused:{
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)"
    // backgroundColor: "white"
  },
  textInputContainer: {
    height: 54,  // equals to textInput + margins
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInputContainerFocused: {
    height: 54,  // equals to textInput + margins
    backgroundColor: "rgba(0, 0, 0, 0)",
    marginTop: 38,
    marginLeft: 45,
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  textInput: {
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    paddingLeft: 15,
    paddingTop: 4,
    paddingBottom: 4,
    height: 44,
    borderRadius: 28,
  },
  textInputFocused: {
    marginTop: 0,
    marginRight: 10,
    marginLeft: 0,
    paddingLeft: 15,
    height: 44,
    borderRadius: 28,
    borderColor: "rgb(210, 210, 210)",
    borderWidth: 1
  },
  searchBackBtn: {
    display: "none"
  },
  searchBackBtnFocused: {
    position: "absolute",
    top: 40,
    left: 0,
    height: 36,
    width: 45,
    justifyContent: 'center', 
  },
  listView: {
    backgroundColor: 'rgba(255, 255, 255, 0)'
  },

  panelContent: {
    // borderWidth: 1
  },
  panelContentFocused: {
    display: "none"
  },
  locationContainer: {
    marginTop: 10,
    marginLeft: 20
  },
  locationName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  locationTime: {
    color: "rgb(160, 160, 160)"
  },
  rightIcon: {
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },

  setLocBtnsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: "auto",
    bottom: 0,
    left: wp('5%'),
    right: wp('5%'),
    height: hp('20%'),
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: "center"
  },
  btnSetLoc : {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnSetLocCheck: {
    backgroundColor: COLORS.STRONG_ORANGE,
  },
  btnSetLocCancel: {
    backgroundColor: 'white'
  },

  locSettingPanel:{
    position: "absolute",
    top: "auto",
    bottom: 0,
    left: wp('5%'),
    right: wp('5%'),
    height: hp('45%'),
    borderRadius: hp('4%'),  // same as nav bar
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: COLORS.NUDE
  },
  txtInputLocName: {
    paddingLeft: 14,
    paddingTop: 6,
    paddingBottom: 6,
    marginTop: 30,
    borderRadius: 24,
    backgroundColor: "white"
  },
  saveLocBtnsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: -22,
    bottom: "auto",
    left: "auto",
    right: 20,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: "center",
    zIndex: 100
  },
  btnSaveLoc : {
    width: 44,
    height: 44,
    borderRadius: 44,
    marginLeft: 7,
    marginRight: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  btnSaveLocCheck: {
    backgroundColor: COLORS.STRONG_ORANGE,
  },
  btnSaveLocCancel: {
    backgroundColor: 'white'
  }

});

export default styles;