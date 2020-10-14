import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './styles/index.css';
import { COLORS, IP, PORT } from '../../../const/const';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TaskScreen from '../TaskScreen';
import QuestScreen from '../QuestScreen';
import ProfileScreen from '../ProfileScreen';

const Tab = createMaterialTopTabNavigator();

const TrackingStatusScreen = ({route}) => {
  return (
    <Tab.Navigator
      screenOptions = {({route}) => ({
        tabBarIcon: ({ focused, color }) => {
          let icon;
          if (route.name == 'Tracking') {
            icon = focused
              ? require('../../../../assets/nav-bar/tracking-active.png')
              : require('../../../../assets/nav-bar/tracking.png')
          } else if (route.name == 'Tasks') {
            icon = focused
              ? require('../../../../assets/nav-bar/task-active.png')
              : require('../../../../assets/nav-bar/task.png')
          } else if (route.name == 'Quests') {
            icon = focused
              ? require('../../../../assets/nav-bar/quest-active.png')
              : require('../../../../assets/nav-bar/quest.png')
          } else if (route.name == 'Profile') {
            icon = focused
              ? require('../../../../assets/nav-bar/profile-active.png')
              : require('../../../../assets/nav-bar/profile.png')
          }
          return (
            <Image style={styles.tabIcon} source={icon}/>
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
        component={TrackingStatusScreenContent}
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
        source={{uri: "https://scontent-xsp1-2.xx.fbcdn.net/v/t1.15752-9/121241278_368219414303513_7668923031172678740_n.png?_nc_cat=109&_nc_sid=ae9488&_nc_ohc=vS8Yc-D_9NgAX_tVxWf&_nc_ht=scontent-xsp1-2.xx&oh=9f6d2cbef1346442fccb1eedad3ef1f0&oe=5FADE0B3"}}
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