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
          } else if (route.name == 'Task') {
            iconName = focused
              ? 'tasks'
              : 'tasks'
          } else if (route.name == 'Quest') {
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
              style={styles.tabIcon}
              source={{uri: "https://i.kym-cdn.com/photos/images/newsfeed/001/880/651/374.png"}}
            />
          )
        }
      })}
      tabBarOptions={{
        showLabel: false,
        style: styles.bottomTab,
        tabStyle: styles.tabItem,
        indicatorStyle: styles.indicator,
        showIcon: true
      }}
      tabBarPosition="bottom"
    >
      <Tab.Screen 
        name="Tracking" 
        component={LoginScreen}
        initialParams={{ locale: route.params.locale }}
      />
      <Tab.Screen 
        name="Task" 
        component={RegisterScreen}
        initialParams={{ locale: route.params.locale }}
      />
      <Tab.Screen name="Quest" 
        component={QuestScreen}
        initialParams={{ locale: route.params.locale }}
      />
      <Tab.Screen name="Profile" 
        component={ProfileScreen}
        initialParams={{ locale: route.params.locale }}
      />
    </Tab.Navigator>
  );
}

export default MainScreen;