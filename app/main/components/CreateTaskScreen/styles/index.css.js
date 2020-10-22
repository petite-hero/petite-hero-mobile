import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { COLORS } from '../../../../const/const';

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  header: {
    width: "100%",
    height: hp("20%"),
    marginBottom: hp("1%"),
    backgroundColor: COLORS.STRONG_ORANGE,
    borderBottomLeftRadius: wp("5%"),
    borderBottomRightRadius: wp("5%"),
    elevation: 10
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("5%"),
    marginLeft: wp("10%"),
    marginBottom: hp("1%"),
    marginRight: wp("10%")
  },
  avatar: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
  },
  title : {
    fontSize: hp("5%"),
    fontFamily: "AcuminBold",
    color: COLORS.WHITE
  },
});

export default styles;