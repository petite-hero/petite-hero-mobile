import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LoginScreen from "../LoginScreen/index";
import RegisterScreen from "../RegisterScreen/index";
import styles from './styles/index.css';

const Tab = createBottomTabNavigator();

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
        activeTintColor: '#00c4fa',
        inactiveTintColor: 'gray',
        showLabel: false,
        style: styles.bottomTab,
        tabStyle: styles.tabItem
      }}
    >
      <Tab.Screen 
        name="Tracking" 
        component={LoginScreen}
        initialParams={{ locale: route.params.locale }}
      />
      <Tab.Screen 
        name="Task" 
        component={RegisterScreen}
        // initialParams={{ AuthContext: route.params.AuthContext }}
      />
      <Tab.Screen name="Quest" 
        component={RegisterScreen}
        // initialParams={{ role: route.params.role }}
      />
      <Tab.Screen name="Profile" 
        component={RegisterScreen}
        // initialParams={{ role: route.params.role }}
      />
    </Tab.Navigator>
  );
}

export default MainScreen;