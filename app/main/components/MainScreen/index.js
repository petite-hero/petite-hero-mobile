import React from 'react';
import { Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import FontAwesome from "react-native-vector-icons/FontAwesome";
import LoginScreen from "../LoginScreen/index";
import RegisterScreen from "../RegisterScreen/index";
import styles from './styles/index.css';
import ProfileScreen from '../ProfileScreen';
import WelcomeScreen from '../WelcomeScreen';
import QuestScreen from '../QuestScreen';
import TaskScreen from '../TaskScreen';
import TrackingStatusScreen from '../TrackingStatusScreen';
import { COLORS } from '../../../const/const';

const Tab = createMaterialTopTabNavigator();

const MainScreen = ({route}) => {
  return(
    <Tab.Navigator
      screenOptions = {({route}) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name == 'Tracking') {
            iconName = focused
              ? 'list-ul'
              : 'list-alt'
          } else if (route.name == 'Tasks') {
            iconName = focused
              ? 'tasks'
              : 'tasks'
          } else if (route.name == 'Quests') {
            iconName = focused
              ? 'user-circle'
              : 'user-circle-o'
          } else if (route.name == 'Profile') {
            iconName = focused
              ? 'gears'
              : 'gear'
          }
          // return <FontAwesome name={iconName} size={25} color={color}/>
          return (
            <Image
              style={[styles.tabIcon, {backgroundColor: COLORS.STRONG_ORANGE}]}
              // source={{uri: "https://i.kym-cdn.com/photos/images/newsfeed/001/880/651/374.png"}}
            />
          )
        }
      })}
      tabBarOptions={{
        labelStyle: {
          fontSize: 10,
          fontWeight: "bold",
          textTransform: "none"
        },
        style: styles.bottomTab,
        tabStyle: styles.tabItem,
        indicatorStyle: styles.indicator,
        showIcon: true,
        activeTintColor: COLORS.STRONG_ORANGE,
        inactiveTintColor: COLORS.GREY,
      }}
      tabBarPosition="bottom"
    >
      <Tab.Screen 
        name="Tracking" 
        component={TrackingStatusScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TaskScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Tab.Screen name="Quests" 
        component={QuestScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
      <Tab.Screen name="Profile" 
        component={ProfileScreen}
        initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
      />
    </Tab.Navigator>
  );
}

export default MainScreen;