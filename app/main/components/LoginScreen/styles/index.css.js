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
  header : {
    width: "100%",
    height: hp("34%"),
    backgroundColor: COLORS.LIGHT_ORANGE,
    borderBottomLeftRadius: wp("50%"),
    borderBottomRightRadius: wp("50%"),
  },
  avatar : {
    width: wp("12%"),
    height: wp("12%"),
    marginTop: hp("7%"),
    marginLeft: wp("10%"),
    borderRadius: wp("6%"),
    marginBottom: hp("1%"),
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
    borderColor: "green",
    borderWidth: 5,
  },
  rectPoint: {
    height: 15,
    width: 15,
    borderRadius: 15,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "violet"
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
    backgroundColor: COLORS.STRONG_ORANGE
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
    borderWidth: 1,
    height: 56,  // equals to textInput + margins
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
    height: 36,  // equals to textInput
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  textInputContainerFocused: {
    height: 36,  // equals to textInput
    backgroundColor: "rgba(0, 0, 0, 0)",
    marginTop: 40,
    marginLeft: 45,
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  textInput: {
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
    paddingLeft: 15,
    height: 36,  // equals to textInputContainer
    borderRadius: 20
  },
  textInputFocused: {
    marginTop: 0,
    marginRight: 10,
    marginBottom: 0,
    marginLeft: 0,
    paddingLeft: 15,
    height: 36,  // equals to textInputContainer
    borderRadius: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.6)'
  },

  panelContent: {
    borderWidth: 1
  },
  panelContentFocused: {
    display: "none"
  },

  setLocBtnsContainer: {
    position: "absolute",
    top: "auto",
    bottom: 0,
    left: wp('5%'),
    right: wp('5%'),
    height: hp('30%'),
    borderRadius: hp('4%'),  // same as nav bar
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  btnSetLoc : {
    width: 200,
    height: 40,
    marginTop: 20,
    backgroundColor: COLORS.STRONG_ORANGE,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: COLORS.STRONG_ORANGE
  },
  btnSaveLoc : {
    width: 200,
    height: 40,
    marginTop: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

});

export default styles;