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

  // back button & date
  date : {
    position: "absolute",
    borderRadius: wp("12%"),
    top: hp("6%"),
    right: wp("16%"),
    fontSize: 18,
    paddingHorizontal: 30,
    paddingVertical: 5,
    color: COLORS.STRONG_CYAN,
    backgroundColor: "white",
    fontFamily: "Acumin"
  },
  backBtn : {
    position: "absolute",
    width: wp("13.33%"),
    height: wp("13.33%"),
    borderRadius: wp("13.33%"),
    top: hp("5%"),
    left: wp("10%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 5
  },

  // gg maps
  fixedPin: {
    position: "absolute",
    top: "auto",
    bottom: hp('50%'),
    left: wp('50%') - 20,
    right: "auto",
    justifyContent: 'center',
    alignItems: 'center',
    width: 40
  },
  safeLoc: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: COLORS.STRONG_BLUE,
  },

  // control panel
  controlPanelContainer:{
    overflow: "hidden",
    position: "absolute",
    bottom: 10,
    left: wp('5%'),
    right: wp('5%'),
    // height: hp('45%'),
    // borderWidth: 1,
    borderRadius: hp('4%'),  // same as nav bar
    backgroundColor: "white"
  },
  controlPanelContainerFocused:{
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "auto",
    borderRadius: hp('4%'),  // same as nav bar
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  controlPanel:{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 15,
    backgroundColor: "white"
  },
  controlPanelFocused:{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  locSettingPanel:{
    position: "absolute",
    top: 0,
    // left: 0,
    right: "auto",
    bottom: 0,
    width: wp("90%"),
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "white"
  },
  selectIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  selectIconCenter: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  // search bar
  searchBarContainer: {
    height: 54,  // equals to textInput + margins
    marginBottom: 5,
    backgroundColor: "rgba(255, 255, 255, 0)"
  },
  searchBarContainerFocused:{
    height: hp('100%'),
    marginBottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
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
    marginLeft: 10,
    marginRight: 10,
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
    fontFamily: "Acumin",
    color: COLORS.BLACK,
    borderRadius: 28,
    elevation: 3
  },
  textInputFocused: {
    marginTop: 0,
    marginRight: 10,
    marginLeft: 10,
    paddingLeft: 40,
    height: 44,
    borderRadius: 28,
    borderColor: "rgb(210, 210, 210)",
    elevation: 5
  },
  searchBackBtn: {
    display: "none"
  },
  searchBackBtnFocused: {
    position: "absolute",
    top: 46,
    left: 24,
    width: 30,
    height: 30,
    borderRadius: 40,
    justifyContent: 'center', 
  },
  listView: {
    backgroundColor: 'rgba(255, 255, 255, 0)'
  },
  searchRow: {
    marginLeft: 10,
    marginRight: 10
  },

  // control panel content
  panelContent: {
    // borderWidth: 1
  },
  panelContentFocused: {
    display: "none"
  },
  locationPlaceholder: {
    color: COLORS.MEDIUM_CYAN,
    fontFamily: "Acumin",
    fontSize: 16,
    textAlign: "center",
    marginTop: 30
  },
  locationContainer: {
    marginTop: 10,
    marginLeft: 10
  },
  locationName: {
    fontSize: 19,
    marginLeft: 50,
    fontFamily: "AcuminBold",
    color: COLORS.BLACK
  },
  locationTime: {
    marginLeft: 50,
    color: "rgb(160, 160, 160)",
    fontFamily: "Acumin"
  },
  typeIcon: {
    position: "absolute",
    left: 0,
    top: 5,
    bottom: 0,
    height: 40,
    width: 40,
    borderRadius: wp("7%"),
    justifyContent: "center",
    alignItems: "center"
  },
  rightIcon: {
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },

  // set loc buttons
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
    backgroundColor: COLORS.STRONG_CYAN,
  },
  btnSetLocCancel: {
    backgroundColor: 'white'
  },

  // loc setting panel
  txtInputNameContainer: {
    marginTop: 40,
    borderRadius: 24,
  },
  txtInputLocName: {
    paddingLeft: 14,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 24,
    backgroundColor: "white",
    fontFamily: "Acumin",
    fontSize: 16,
    color: COLORS.BLACK
  },
  txtTypeContainer: {
    flexDirection: "row",
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5
  },
  txtRepeatDayContainer: {
    width: 65,
    paddingVertical: 7,
    marginLeft: 4,
    marginRight: 4,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: COLORS.MEDIUM_GREY,
    alignItems: "center",
    justifyContent: "center",
  },

  saveLocBtnsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: "auto",
    bottom: hp('38%')+15-wp("13.33%")/2,
    left: "auto",
    right: wp('5%')+20,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: "center"
  },
  btnSaveLocContainer: {
    marginLeft: 7,
    marginRight: 7,
    width: wp("13.33%"),
    height: wp("13.33%"),
    borderRadius: wp("13.33%"),
    backgroundColor: "white"
  },
  btnSaveLoc : {
    width: wp("13.33%"),
    height: wp("13.33%"),
    borderRadius: wp("13.33%"),
    justifyContent: "center",
    alignItems: "center"
  },
  btnSaveLocCheck: {
    backgroundColor: COLORS.STRONG_CYAN,
  },
  btnSaveLocCancel: {
    backgroundColor: 'white'
  },
  btnSaveLocDelete: {
    backgroundColor: 'red',
  }

});

export default styles;