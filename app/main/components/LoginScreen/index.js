import React, { useContext } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import styles from './styles/index.css';

const LoginScreen = (props) => {
  const { t } = useContext(props.route.params.locale);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>This is LoginScreen</Text>
        <Text>{t('welcome-test') + ", " + t('hero-test')}</Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;