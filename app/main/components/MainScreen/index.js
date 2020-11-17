import React, { useEffect, useState } from 'react';
import TrackingStatusScreen from '../TrackingStatusScreen';
import { createStackNavigator } from '@react-navigation/stack';
import TrackingSettingsScreen from '../TrackingSettingsScreen';
import TrackingEmergencyScreen from '../TrackingEmergencyScreen';
import TaskCreatingScreen from '../TaskCreatingScreen';
import TaskDetailsScreen from '../TaskDetailsScreen';
import ProfileChangingScreen from '../ProfileChangingScreen';
import ChildAddingScreen from '../ChildAddingScreen';
import QuestDetailsScreen from '../QuestDetailsScreen';
import QuestCreatingScreen from '../QuestCreatingScreen';
import QuestChoosingBadgeScreen from '../QuestChoosingBadgeScreen';
import ChildAddingShowingQrScreen from '../ChildAddingShowingQrScreen';
import ProfilePasswordChangingScreen from '../ProfilePasswordChangingScreen';

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
        initialParams={{ 
          authContext: route.params.authContext,
          localizationContext: route.params.localizationContext
        }}
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
      <Stack.Screen
        name="TaskCreating"
        component={TaskCreatingScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="QuestCreating"
        component={QuestCreatingScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="QuestDetails"
        component={QuestDetailsScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="QuestChoosingBadge"
        component={QuestChoosingBadgeScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="ProfileChanging"
        component={ProfileChangingScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="ProfilePasswordChanging"
        component={ProfilePasswordChangingScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="ChildAdding"
        component={ChildAddingScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="ChildAddingShowingQr"
        component={ChildAddingShowingQrScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
    </Stack.Navigator>
  );
}

export default MainScreen;