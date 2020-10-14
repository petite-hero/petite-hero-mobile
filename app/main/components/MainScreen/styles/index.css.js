import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS } from '../../../../const/const';

const styles = StyleSheet.create({
  bottomTab : {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    height: hp('8%'),
    borderRadius: hp('4%'),
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  tabItem : {
    alignSelf: "center",
  },
  tabIcon : {
    width: hp('4%'),
    height: hp('4%'),
    borderRadius: hp('2%'),
    alignSelf: "center",
  },
  indicator : {
    position: "absolute",
    top: 0,
    width: wp('10%'),
    height: 3,
    marginLeft: wp("6.25%"),
    backgroundColor: COLORS.STRONG_ORANGE,
  }
});

export default styles;