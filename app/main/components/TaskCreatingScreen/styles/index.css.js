import { StyleSheet } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { COLORS } from '../../../../const/const';

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  categoryList : {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: "2.5%",
    paddingLeft: "10%",
    paddingRight: "10%",
    paddingBottom: "2.5%"
  },
  categoryButton : {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 45,
    borderRadius: 22.5,
  },
  categoryText : {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "AcuminBold",
    color: COLORS.WHITE,
    marginLeft: 10,
    marginRight: 10
  },
  invalidTimeMessage : {
    fontFamily: "Acumin",
    fontSize: 14,
    color: COLORS.RED,
    marginTop: -2,
    marginLeft: "10%",
    marginRight: "10%"
  },
  repeatContainer : {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 15,
    marginLeft: "10%",
    marginRight: "10%",
  },
  repeatSwitchContainer : {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5
  },
  repeatText : {
    fontFamily: "Acumin",
    fontSize: 16,
    color: COLORS.LIGHT_GREY
  },
  repeatDateContainer : {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10
  },
  repeatDate : {
    width: widthPercentageToDP("10%"),
    height: heightPercentageToDP("10%"),
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "3%",
    paddingRight: "3%",
    marginTop: 5,
    marginRight: 5,
  },
  dateText : {
    fontSize: 10,
    fontFamily: "Acumin",
    color: COLORS.WHITE
  },
  dateNum : {
    fontSize: 17,
    fontFamily: "AcuminBold",
    color: COLORS.WHITE
  },
  title : {
    fontFamily: "AcuminBold",
    fontSize: 16
  }
})

export default styles;