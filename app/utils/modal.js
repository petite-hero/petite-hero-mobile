import { t } from 'i18n-js';
import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from '../const/const';

export const ConfirmationModal = (props) => {
  return (
    <Modal
      transparent={true}
      visible={props.visible}
      animationType="fade"
      onRequestClose={() => {props.onClose()}}
    >
      <TouchableOpacity style={styles.modalBackground} activeOpacity={1}
        // onPress={() => {props.onClose()}}
      >
        <TouchableOpacity style={styles.modalWrapper} activeOpacity={1}>
          <Text style={styles.title}>{props.message}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        {props.option === "info" ?
        <View style={{
          width: "90%",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.YELLOW}]} onPress={() => {props.onConfirm()}}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
        :
        <>
          <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.YELLOW}]} onPress={() => {props.onConfirm()}}>
              <Text style={styles.buttonText}>{props.t("common-button-yes")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.YELLOW}]} onPress={() => {props.onClose()}}>
            <Text style={styles.buttonText}>{props.t("common-button-no")}</Text>
          </TouchableOpacity>
        </>
        }
      </View>
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
    height: "20%",
    width: "90%",
    borderRadius: 20,
    alignItems: 'center'
  },
  buttonContainer : {
    position: "absolute",
    top: "56.5%",
    left: "9%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button : {
    height: hp("7%"),
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 50,
    width: wp("40%"),
    alignItems: "center",
    justifyContent: "center",
    elevation: 10
  },
  title : {
    textAlign: "center",
    fontFamily: "Acumin",
    fontSize: 20,
    marginTop: 25,
    marginLeft: 50,
    marginRight: 50
  },
  buttonText : {
    fontFamily: "Acumin",
    fontSize: 15
  }
});