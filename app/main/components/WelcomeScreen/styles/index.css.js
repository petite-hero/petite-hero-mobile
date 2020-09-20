import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingLeft: 50,
    paddingRight: 50,
  },
  btnRegister : {
    marginTop: 50,
    width: 220,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00c4fa",
    justifyContent: "center",
    alignItems: "center",
  },
  btnLogin : {
    marginTop: 10,
    width: 220,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00c4fa",
    justifyContent: "center",
    alignItems: "center",
  },
  txtHello : {
    fontSize: 55,
    fontWeight: "bold",
  },
  txtMessage : {
    fontSize: 15
  },
  txtButton : {
    fontSize: 15
  },
  circle : {
    marginTop: 50,
    width: 300,
    height: 300,
    borderRadius: 150
  }
});

export default styles;