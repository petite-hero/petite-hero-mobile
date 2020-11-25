import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { YellowBox, AsyncStorage } from 'react-native';
import { IP, NOTI } from './app/const/const';

import * as Localization from 'expo-localization';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import i18n from 'i18n-js';
import { translationMessages } from './app/utils/i18n';

import WelcomeScreen from "./app/main/components/WelcomeScreen/index";
import MainScreen from './app/main/components/MainScreen';
import { useFonts } from 'expo-font';

import * as Notifications from 'expo-notifications';
import OpeningScreen from './app/main/components/OpeningScreen';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

const LocalizationContext = React.createContext();
const AuthContext = React.createContext();
const Stack = createStackNavigator();

// Set the locale once at the beginning of your app.
i18n.fallbacks = true;
i18n.translations = translationMessages;

const App = () => {

  const [fontLoaded] = useFonts({
    Montserrat:       require("./assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold:   require("./assets/fonts/Montserrat-Bold.ttf"),
    MontserratItalic: require("./assets/fonts/Montserrat-Italic.ttf"),
    Acumin:           require("./assets/fonts/Acumin-RPro.otf"),
    AcuminBold:       require("./assets/fonts/Acumin-BdPro.otf"),
    AcuminItalic:     require("./assets/fonts/Acumin-ItPro.otf"),
  });
  const [locale, setLocale] = useState(Localization.locale);
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userToken: null,
          };
      }
    },
    {
      userToken: null,
    }
  );

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        dispatch({ type: 'SIGN_IN', token: data });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    []
  );

  const localizationContext = useMemo(
    () => ({
      t: (scope, options) => i18n.t(scope, { locale, ...options }),
      locale,
      setLocale,
    }),
    [locale]
  );

  const checkApplicationSettings = async () => {
    try {
      const value = await AsyncStorage.getItem('IP');
      if (value === null) {
        await AsyncStorage.setItem('IP', IP);
      }
    } catch (error) {
      console.log("Error while checking application settings");
    }
  }
  useEffect(() => {checkApplicationSettings()}, []);
  
  const testSetApplicationSettings = async () => {
    try {
      await AsyncStorage.setItem('IP', IP);
      // await AsyncStorage.setItem('user_id', '0987654321');
      await AsyncStorage.setItem('user_id', '0938194701');  // Duong
      // await AsyncStorage.setItem('child_id', '3');
    } catch (error) {
      console.log("Error while testing application settings");
    }
  }
  useEffect(() => {
    testSetApplicationSettings();
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        let noti = notification.request.content;
        if (noti.title === NOTI.SILENT_NOTI) {
          console.log("Do not show notification");
        } else if (noti.title === NOTI.PETITE_HERO) {
          console.log("Show notification")
          return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            priority: Notifications.AndroidNotificationPriority.MAX
          }
        }
      }
    });
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <LocalizationContext.Provider value={localizationContext}>
        <NavigationContainer>
          {/* hung - test */}
          {/* <Stack.Navigator 
            initialRouteName="Main"
            screenOptions={{
              headerShown: false
            }}>
            <Stack.Screen
              name="Main"
              component={MainScreen}
              initialParams={{ authContext: AuthContext, localizationContext: LocalizationContext}}
            />
          </Stack.Navigator> */}

          {state.userToken == null ? (
            <Stack.Navigator 
              initialRouteName="Opening"
              screenOptions={{
                headerShown: false
              }}
              >
              <Stack.Screen
                name="Opening"
                component={OpeningScreen}
                initialParams={{ authContext: AuthContext, localizationContext: LocalizationContext}}
              />
              <Stack.Screen 
                name="Welcome"
                component={WelcomeScreen}
                initialParams={{ authContext: AuthContext, localizationContext: LocalizationContext }}
              />
            </Stack.Navigator>
            ) : (
            <Stack.Navigator 
              initialRouteName="Main"
              screenOptions={{
                headerShown: false
              }}>
              <Stack.Screen
                name="Main"
                component={MainScreen}
                initialParams={{ authContext: AuthContext, localizationContext: LocalizationContext}}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </LocalizationContext.Provider>
    </AuthContext.Provider>
  )
};

export default App;

// import * as Permissions from 'expo-permissions';
// import * as Notifications from 'expo-notifications';
// import React, { useState, useEffect, useRef } from 'react';
// import { Text, View, Button, Platform } from 'react-native';

// // Notifications.setNotificationHandler({
// //   handleNotification: async () => ({
// //     shouldShowAlert: false,
// //     shouldPlaySound: false,
// //     shouldSetBadge: false,
// //   }),
// // });

// Notifications.setNotificationHandler({
//   handleNotification: async (notification) => {
//     let body = notification.request.content;

//     if (body.title == null && body.body == null) {
//       console.log("Do not show notification")
//       // return {
//       //   shouldShowAlert: false,
//       //   shouldPlaySound: false,
//       //   shouldSetBadge: false,
//       //   priority: Notifications.AndroidNotificationPriority.MIN
//       // }
//     } else {
//       console.log("Show notification")
//       return {
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: false,
//         priority: Notifications.AndroidNotificationPriority.MAX
//       }
//     }
//   }
// })

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//     // This listener is fired whenever a notification is received while the app is foregrounded
//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);

//       console.log("Foreground event");
//       if (notification.request.content.title === null) {
//         // insert codes to update child's location here
//         // access location data by notification.request.content.data
//       } else {
//         // insert codes to handle something else here
//       }
//     });

//     // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { 
//       console.log("Background event");
//     });

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener);
//       Notifications.removeNotificationSubscription(responseListener);
//     };
//   }, []);

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'space-around',
//       }}>
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Title: {notification && notification.request.content.title} </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//       </View>
//     </View>
//   );
// }

// async function registerForPushNotificationsAsync() {
//   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//   if (status !== 'granted') {
//     alert('You need to grant permission to receive Notifications!');
//     return;
//   }
//   let token = (await Notifications.getExpoPushTokenAsync()).data;
//   console.log("Your device token: ", token);

//   // if (Platform.OS === 'android') {
//   //   Notifications.createChannelAndroidAsync('sound-noti', {
//   //     name: 'Sound Notifcation',
//   //     sound: true,
//   //     vibrate: [0, 250, 500, 250]
//   //   });
    
//   //   Notifications.createChannelAndroidAsync('silent-noti', {
//   //     name: 'Silent Notifcation',
//   //     vibrate: false,
//   //     sound: false,
//   //   });
//   // }

//   return token;
// }