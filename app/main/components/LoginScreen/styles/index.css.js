import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingLeft: wp('10%'),
    paddingRight: wp('10%'),
  },
  searchBarContainer: {
    position: "absolute",
    top: 0,
    bottom: "auto",
    left: 0,
    right: 0,
    height: 74,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  searchBarContainerFocused:{
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: "auto",
    backgroundColor: 'white'
  },
  textInputContainer: {
    marginLeft: 50,
    marginRight: 0,
    marginTop: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: 74,
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  textInputContainerFocused: {
    marginLeft: 50,
    marginRight: 0,
    marginTop: 0,
    backgroundColor: 'white',
    height: 74,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    marginLeft: 0,
    marginRight: 10,
    marginTop: 30,
    marginBottom: 0,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 20,
    height: 44,
    fontSize: 18,
  },
  listView: {
    backgroundColor: 'white'
  },
  searchBackBtn: {
    display: "none"
  },
  searchBackBtnFocused: {
    position: "absolute",
    top: 40,
    left: 10,
    height: 25,
    width: 25
  }
});

export default styles;