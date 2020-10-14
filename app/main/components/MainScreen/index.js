import React from 'react';
import TrackingStatusScreen from '../TrackingStatusScreen';
import { createStackNavigator } from '@react-navigation/stack';
import TrackingSettingsScreen from '../TrackingSettingsScreen';
import TrackingEmergencyScreen from '../TrackingEmergencyScreen';

const Stack = createStackNavigator();

const MainScreen = ({route}) => {
  return(
    <Stack.Navigator 
      initialRouteName="TrackingStatus"
      screenOptions={{
        headerShown: false
      }}
      >
      <Stack.Screen 
        name="TrackingStatus"
        component={TrackingStatusScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="TrackingSettings"
        component={TrackingSettingsScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="TrackingEmergency"
        component={TrackingEmergencyScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
    </Stack.Navigator>
  );
}

export default MainScreen;