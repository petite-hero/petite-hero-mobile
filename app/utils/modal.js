import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { COLORS } from '../const/const';

export const ConfirmationModal = (props) => {
  return (
    <Modal
      transparent={true}
      visible={props.visible}
      animationType="none"
      onRequestClose={() => props.setVisible(false)}
    >
      <TouchableOpacity style={styles.modalBackground} onPressOut={() => props.setVisible(false)} activeOpacity={1}>
        <TouchableOpacity style={styles.modalWrapper} activeOpacity={1}>
          <Text style={styles.title}>{props.message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.STRONG_CYAN}]} onPress={() => props.setVisible(false)}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.GREY}]} onPress={() => props.setVisible(false)}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000040',
  },
  modalWrapper: {
    backgroundColor: COLORS.WHITE,
    height: "30%",
    width: "70%",
    borderRadius: 20,
    alignItems: 'center',
    overflow: "hidden"
  },
  buttonContainer : {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button : {
    height: hp("7%"),
    width: "50%",
    alignItems: "center",
    justifyContent: "center"
  },
  title : {
    textAlign: "center",
    fontFamily: "Acumin",
    fontSize: 20,
    marginTop: 20
  },
  buttonText : {
    fontFamily: "Acumin",
    fontSize: 15
  }
});