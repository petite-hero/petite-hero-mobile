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
          {state.userToken == null ? (
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
          )}
        </NavigationContainer>
      </LocalizationContext.Provider>
    </AuthContext.Provider>
  )
};

export default App;