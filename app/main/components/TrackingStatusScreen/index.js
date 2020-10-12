import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native'
import styles from './styles/index.css';

const TrackingStatusScreen = (props) => {
  return (

    <SafeAreaView style={styles.container}>

      <Text>Hulk</Text>
      <Text>Date Picker</Text>
      <TouchableOpacity style={styles.btnSettings}
        // navigation.navigate("Main");  ??
      >
      <Text>SETTNGS</Text>
      </TouchableOpacity>

    </SafeAreaView>

  );
};

export default TrackingStatusScreen;