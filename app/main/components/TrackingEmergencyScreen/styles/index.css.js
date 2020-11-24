import {StyleSheet} from 'react-native';
import { COLORS, changeOpac } from "../../../../const/const"; 
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

  avatar : {
    position: "absolute",
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("12%"),
    top: hp("6%"),
    right: wp("10%"),
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
    shadowOpacity: 0.2,
    elevation: 5
  },

  // gg maps
  safeLoc: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: 'green',
  },
  realLocContainer: {
    height: 24,
    width: 24,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: changeOpac(COLORS.RED, 0.5)
  },
  realLoc: {
    height: 16,
    width: 16,
    borderRadius: 16,
    backgroundColor: COLORS.RED
  }

});

export default styles;