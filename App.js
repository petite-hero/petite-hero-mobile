import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { translationMessages } from './app/i18n';

i18n.translations = translationMessages;

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
i18n.fallbacks = true;

const HomeScreen = () => (
  <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text category='h1'>
      {i18n.t('welcome-test')},&nbsp;
      {i18n.t('hero-test')}
    </Text>
  </Layout>
);

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <HomeScreen />
  </ApplicationProvider>
);