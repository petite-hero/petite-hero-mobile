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
  bottomTab : {
    height: hp('8%'),
    borderRadius: hp('4%'),
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  tabItem : {
    alignSelf: "center",
    marginBottom: hp('2%'),
  },
  tabIcon : {
    width: hp('5%'),
    height: hp('5%'),
    
    borderRadius: hp('2.5%'),
    alignSelf: "center",
  },
  indicator : {
    width: wp('10%'),
    height: 3,
    marginLeft: wp("6.25%"),
    marginBottom: hp('0.5%'),
    backgroundColor: "#e5834c",
  }
});

export default styles;