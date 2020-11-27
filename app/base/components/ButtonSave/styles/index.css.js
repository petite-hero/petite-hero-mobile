import { StyleSheet } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { COLORS } from '../../../../const/const';

const styles = StyleSheet.create({
  container : {
    marginLeft: "10%",
    marginRight: "10%",
    marginTop: "10%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    height: heightPercentageToDP("5%"),
    backgroundColor: COLORS.YELLOW
  },
  buttonText : {
    fontFamily: "AcuminBold",
    fontSize: 16,
    color: COLORS.BLACK
  }
});

export default styles;