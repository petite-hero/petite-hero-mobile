import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  bottomTab : {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
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
    width: hp('4%'),
    height: hp('4%'),
    borderRadius: hp('2%'),
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