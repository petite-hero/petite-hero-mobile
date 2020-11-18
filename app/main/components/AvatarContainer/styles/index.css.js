import {StyleSheet} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const styles = StyleSheet.create({
  avatar : {
    width: wp("13.33%"),
    height: wp("13.33%"),
    borderRadius: wp("6%")
  },
});

export default styles;