import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../const/const';

const styles = StyleSheet.create({
  container : {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20%",
    marginLeft: "10%",
    marginRight: "10%",
    marginBottom: "10%",
  },
  iconBackContainer : {
    width: 30,
    height: 30
  },
  iconBack : {
    width: "100%",
    height: "100%"
  },
  titleContainer : {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  title : {
    fontSize: 20,
    fontFamily: "AcuminBold"
  },
  subTitle : {
    fontSize: 20,
    fontFamily: "Acumin",
    color: COLORS.LIGHT_GREY
  }
});

export default styles;