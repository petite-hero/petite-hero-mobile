import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Image } from 'react-native';
import { Icon } from 'react-native-elements';

import { createStackNavigator } from '@react-navigation/stack';
import TrackingSettingsScreen from '../TrackingSettingsScreen/index';
import TrackingEmergencyScreen from '../TrackingEmergencyScreen/index';

import styles from './styles/index.css';
import { COLORS, IP, PORT } from '../../../const/const';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Stack = createStackNavigator();

const TrackingStatusScreen = () => {
  return (
    <Stack.Navigator 
      initialRouteName="TrackingStatus"
      screenOptions={{
        headerShown: false
      }}
      >
      <Stack.Screen 
        name="TrackingStatus"
        component={TrackingStatusScreenContent}
      />
      <Stack.Screen
        name="TrackingSettings"
        component={TrackingSettingsScreen}
      />
      <Stack.Screen
        name="TrackingEmergency"
        component={TrackingEmergencyScreen}
      />
    </Stack.Navigator>
  )
}

const TrackingStatusScreenContent = ({ navigation }) => {

  [elapsedPercent, setElapsedPercent] = React.useState(0);
  const CENTER_RATIO = 0.6;

  React.useEffect(() => {
    this.waveTimer = setInterval( () => {
      if (elapsedPercent >= 100) setElapsedPercent(0);
      setElapsedPercent(elapsedPercent+0.5);
    }, 30);  // calls every set milisecs
  }, []);

  return (

    <SafeAreaView style={styles.container}>

      <Image
        style={[styles.avatar, {backgroundColor: COLORS.STRONG_ORANGE}]}
        source={require('../../../../assets/kid-avatar.png')}
      />

      <View style={styles.statusContainer}>
        {[1, 2, 3].map((el, index) => {
          let ratio = CENTER_RATIO + ((elapsedPercent+33*index)%100)/100*(1-CENTER_RATIO);
          return (
            <View key={index} style={[styles.statusWave, {width: wp("100%")*ratio, height: wp("100%")*ratio, opacity: 1-(ratio-CENTER_RATIO)/(1-CENTER_RATIO)}]}/>
          )
        })}
        <View style={[styles.statusWave, {width: wp("100%")*CENTER_RATIO, height: wp("100%")*CENTER_RATIO}]}/>
        <Text style={styles.locationStatus}>SAFE</Text>
      </View>

      <TouchableOpacity style={styles.warningBtn} onPress={() => navigation.navigate("TrackingEmergency")}>
        <Icon name='priority-high' type='material' color='white' size={20}/>
      </TouchableOpacity>

      <View style={styles.datePickerContainer}>
        <Text>*Date Picker goes here*</Text>
      </View>

      <TouchableOpacity style={styles.btnSettings} onPress={() => {
          navigation.navigate("TrackingSettings");
        }}
        >
        <Text style={{color: 'white'}}>SETTINGS</Text>
      </TouchableOpacity>

    </SafeAreaView>

  );
};

export default TrackingStatusScreen;