import { StyleSheet } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { COLORS } from '../../../../const/const';

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  cell : {
    width: widthPercentageToDP("12%"),
    height: widthPercentageToDP("12%"),
    lineHeight: 45,
    fontSize: 24,
    textAlign: 'center',
    borderRadius: 15,
    backgroundColor: COLORS.LIGHT_GREY_2
  },
  focusCell: {
    borderWidth: 1,
    borderColor: COLORS.STRONG_CYAN,
  },
});

export default styles;