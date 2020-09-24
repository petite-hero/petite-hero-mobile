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
    borderRadius: hp('3%'),
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    paddingLeft: wp('5%'),
    paddingRight: wp('5%'),
    backgroundColor: "#ffffff",
  },
  tabItem : {
    // paddingBottom: hp('1%')
  },
  tabIcon : {
    width: hp('6%'),
    height: hp('6%'),
    borderRadius: hp('3%')
  }
});

export default styles;