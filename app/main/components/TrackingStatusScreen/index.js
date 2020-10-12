import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import styles from './styles/index.css';

const TrackingStatusScreen = ({ navigation }) => {

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.statusContainer}>
        <Text style={styles.locationStatus}>SAFE</Text>
      </View>

      <View style={styles.datePickerContainer}>
        <Text>*Date Picker goes here*</Text>
      </View>

      <TouchableOpacity style={styles.btnSettings} onPress={() => {
          navigation.navigate("TrackingSettings");
        }}
        >
        <Text style={{color: 'white'}}>SETTINGS</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btnSettings, {backgroundColor: "rgba(244, 126, 62, 0.5)"}]} onPress={() => {
          navigation.navigate("TrackingEmergency");
        }}
        >
        <Text style={{color: 'white'}}>EMERGENCY</Text>
      </TouchableOpacity>

    </SafeAreaView>

  );
};

export default TrackingStatusScreen;