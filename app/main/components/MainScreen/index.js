import React from 'react';
import TrackingStatusScreen from '../TrackingStatusScreen';
import { createStackNavigator } from '@react-navigation/stack';
import TrackingSettingsScreen from '../TrackingSettingsScreen';
import TrackingEmergencyScreen from '../TrackingEmergencyScreen';
import CreateTaskScreen from '../CreateTaskScreen';
import TaskDetailsScreen from '../TaskDetailsScreen';
import ChangeParentProfileScreen from '../ChangeParentProfileScreen';
import AddChildScreen from '../AddChildScreen';
import QuestDetailsScreen from '../QuestDetailsScreen';
import CreateQuestScreen from '../CreateQuestScreen';
import ChooseBadgeScreen from '../ChooseBadgeScreen';

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
      <Stack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="CreateQuest"
        component={CreateQuestScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="QuestDetails"
        component={QuestDetailsScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="ChooseBadge"
        component={ChooseBadgeScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="ChangeParentProfile"
        component={ChangeParentProfileScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Stack.Screen
        name="AddChild"
        component={AddChildScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
    </Stack.Navigator>
  );
}

export default MainScreen;