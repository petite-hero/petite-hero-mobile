import React, { useMemo, useReducer, useState } from 'react';
import { View, Text } from 'react-native';
import { YellowBox } from 'react-native';
import * as Localization from 'expo-localization';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import i18n from 'i18n-js';
import { translationMessages } from './app/i18n';
import WelcomeScreen from "./app/main/components/WelcomeScreen/index";
import LoginScreen from "./app/main/components/LoginScreen/index";
import RegisterScreen from "./app/main/components/RegisterScreen/index";
import MainScreen from './app/main/components/MainScreen';
import ProfileScreen from './app/main/components/ProfileScreen';
import TrackingSettingsScreen from './app/main/components/TrackingSettingsScreen';
import TrackingEmergencyScreen from './app/main/components/TrackingEmergencyScreen';

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

  return (
    <AuthContext.Provider value={authContext}>
      <LocalizationContext.Provider value={localizationContext}>
        <NavigationContainer>
          {/* hung - test */}
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
          {/* {state.userToken == null ? (
            <Stack.Navigator 
              initialRouteName="Welcome"
              screenOptions={{
                headerShown: false
              }}
              >
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
          )} */}
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

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: false,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//     // This listener is fired whenever a notification is received while the app is foregrounded
//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);

//       if (notification.request.content.title === null) {
//         console.log("Update child's location on Tracking screen please!");
//         // insert codes to update child's location here

//         // access location data by notification.request.content.data
//       } else {
//         // insert codes to handle something else here
//       }
//     });

//     // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { 
//     //   console.log(response);
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
//       <Button
//         title="Press to Send Notification"
//         onPress={async () => {
//           await sendPushNotification(expoPushToken);
//         }}
//       />
//     </View>
//   );
// }

// async function sendPushNotification(expoPushToken) {
//   const message = {
//     to: expoPushToken,
//     sound: 'default',
//     title: 'This is Title',
//     body: 'And this is the body!',
//     // android: {
//     //   channelId: 'chat-messages'
//     // },
//     data: { name: 'Enri is struggling' },
//   };

//   await fetch('https://exp.host/--/api/v2/push/send', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Accept-encoding': 'gzip, deflate',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(message),
//   });
// }

// async function registerForPushNotificationsAsync() {
//   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//   if (status !== 'granted') {
//     alert('You need to grant permission to receive Notifications!');
//     return;
//   }
//   let token = (await Notifications.getExpoPushTokenAsync()).data;
//   console.log("Your device token: ", token);
//   return token;
// }