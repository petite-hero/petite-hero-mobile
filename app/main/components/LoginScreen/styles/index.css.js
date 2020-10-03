import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import { COLORS } from "../../../../const/color"; 
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({

  // copy
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
  // searchBarContainer: {
  //   // height: 74,
  //   flex: 
  //   backgroundColor: 'rgba(0, 0, 0, 0)'
  // },
  // searchBarContainerFocused:{
  //   position: "absolute",
  //   top: 0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   height: "auto",
  //   backgroundColor: 'white'
  // },
  // textInputContainer: {
  //   marginLeft: 0,
  //   marginRight: 0,
  //   marginTop: 0,
  //   backgroundColor: 'rgba(0, 0, 0, 0)',
  //   borderTopWidth: 0,
  //   borderBottomWidth: 0
  // },
  // textInputContainerFocused: {
  //   marginLeft: 50,
  //   marginRight: 0,
  //   marginTop: 0,
  //   backgroundColor: 'white',
  //   height: 74,
  //   borderTopWidth: 0,
  //   borderBottomWidth: 0,
  // },
  // textInput: {
  //   marginLeft: 0,
  //   marginRight: 0,
  //   marginTop: 0,
  //   marginBottom: 0,
  //   paddingLeft: 15,
  //   borderWidth: 1,
  //   borderColor: 'rgb(200, 200, 200)',
  //   borderRadius: 20,
  //   height: 36,
  //   fontSize: 16,
  // },
  // listView: {
  //   backgroundColor: 'white'
  // },
  // searchBackBtn: {
  //   display: "none"
  // },
  // searchBackBtnFocused: {
  //   position: "absolute",
  //   top: 40,
  //   left: 10,
  //   height: 25,
  //   width: 25
  // },

  // control panel
  controlPanel:{
    position: "absolute",
    top: "auto",
    bottom: 0,
    left: wp('5%'),
    right: wp('5%'),
    height: 200,
    borderRadius: 20,
    backgroundColor: COLORS.STRONG_ORANGE
  },
  controlPanelFocused:{
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
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
    backgroundColor: "white"
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
    marginLeft: 50,
    borderTopWidth: 0,
    // borderBottomWidth: 0
  },
  textInput: {
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
    height: 36,  // equals to textInputContainer
    borderRadius: 20
  },
  textInputFocused: {
    marginTop: 0,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 0,
    height: 36,  // equals to textInputContainer
    borderRadius: 20,
    borderColor: "rgb(200, 200, 200)",
    borderWidth: 1
  },
  searchBackBtn: {
    display: "none"
  },
  searchBackBtnFocused: {
    position: "absolute",
    top: 40,
    left: 10,
    height: 36,
    width: 36,
    // borderWidth: 1,
    justifyContent: 'center', 
  },

  locList: {
    borderWidth: 1
  },
  locListFocused: {
    display: "none"
  }

});

export default styles;