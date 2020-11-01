import React from 'react';
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native';
import { COLORS } from '../const/const';

export const Loader = (props) => {
  return (
    <Modal
      transparent={true}
      visible={props.loading}
      animationType="none"
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={props.loading}
            size="large"
            color={COLORS.STRONG_CYAN}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: COLORS.WHITE,
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});