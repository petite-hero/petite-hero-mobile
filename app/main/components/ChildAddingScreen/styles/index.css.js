import { StyleSheet } from "react-native";
import { COLORS } from "../../../../const/const";

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  textInput : {
    height: 50,
    width: "80%",
    marginBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: "row",
    alignContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: 50,
    elevation: 8
  }
})

export default styles;