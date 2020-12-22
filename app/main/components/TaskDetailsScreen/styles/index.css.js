import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from '../../../../const/const';

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  header: {
    width: "100%",
    height: wp("100%"),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden"
  },
  body : {
    marginTop: "10%",
    marginLeft: "10%",
    marginRight: "10%",
  },
  dateTimeContainer : {
    flexDirection: "row",
    marginTop: "3%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.WHITE
  },
  dateTimeItem : {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "50%",
    borderLeftWidth: 2,
    borderColor: COLORS.LIGHT_GREY
  },
  date : {
    fontFamily: "Acumin",
    fontSize: 16,
    color: COLORS.LIGHT_GREY,
    marginLeft: 10
  },
  backContainer : {
    position: "absolute",
    left: "10%",
    top: "15%",
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10
  },
  categoryContainer : {
    position: "absolute",
    right: "10%",
    top: wp("92%"),
    width: "15%",
    height: wp("15%"),
    borderRadius: wp("7.5%"),
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
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
  buttonTitle : {
    fontFamily: "Acumin",
    fontSize: 16,
    color: COLORS.BLACK
  },
  changeStatusButton : {
    width: "48%",
    paddingTop: "5%",
    paddingBottom: "5%",
    marginTop: "10%",
    borderWidth: 2,
    borderRadius: hp("5%"),
    borderColor: COLORS.YELLOW,
    alignItems: "center",
    justifyContent: "center"
  },
  OKButton : {
    width: "100%",
    paddingTop: "5%",
    paddingBottom: "5%",
    marginTop: "10%",
    marginBottom: "10%",
    backgroundColor: COLORS.YELLOW,
    borderRadius: hp("5%"),
    alignItems: "center",
    justifyContent: "center"
  }
});

export default styles;