import React from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { translationMessages } from './app/i18n';
import WelcomeScreen from "./app/main/components/WelcomeScreen/index";
import { View, Text } from 'react-native';


i18n.translations = translationMessages;

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
i18n.fallbacks = true;

const HomeScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text category='h1'>
      {i18n.t('welcome-test')},&nbsp;
      {i18n.t('hero-test')}
    </Text>
  </View>
);

export default () => (
  <WelcomeScreen />
);