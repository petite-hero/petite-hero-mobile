import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS } from '../../../../const/const';

const styles = StyleSheet.create({
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
    width: 24,
    height: 24,
    alignSelf: "center"
  },
  indicator : {
    position: "absolute",
    top: 0,
    width: wp('10%'),
    height: 3,
    borderRadius: 3,
    marginLeft: wp("6.25%"),
    backgroundColor: COLORS.STRONG_ORANGE,
  }
});

export default styles;