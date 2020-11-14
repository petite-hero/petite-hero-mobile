import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS } from '../../../const/const';
import LoginScreen from '../LoginScreen';
import RegisterScreen from '../RegisterScreen';
import styles from './styles/index.css';
import ForgotPasswordScreen from '../ForgotPasswordScreen';
import ForgotPasswordCodeEnteringScreen from '../ForgotPasswordCodeEnteringScreen';

export const Stack = createStackNavigator();

const WelcomeScreen = (props) => {
  return (
    <Stack.Navigator 
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false
      }}
      >
      <Stack.Screen 
        name="Welcome" 
        component={Welcome}
        initialParams={{
          authContext: props.route.params.authContext,
          localizationContext: props.route.params.localizationContext
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        initialParams={{
          authContext: props.route.params.authContext,
          localizationContext: props.route.params.localizationContext
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        initialParams={{
          authContext: props.route.params.authContext,
          localizationContext: props.route.params.localizationContext
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        initialParams={{
          authContext: props.route.params.authContext,
          localizationContext: props.route.params.localizationContext
        }}
      />
      <Stack.Screen 
        name="CodeEntering" 
        component={ForgotPasswordCodeEnteringScreen}
        initialParams={{
          authContext: props.route.params.authContext,
          localizationContext: props.route.params.localizationContext
        }}
      />
    </Stack.Navigator>
  );
};

const Welcome = ({ navigation }) => {

  const [isScanning, setIsScanning] = React.useState(false);

  return (
    <View style={styles.container}>
      <Image
        style={[styles.circle, {backgroundColor: COLORS.WHITE}]}
      />
      <Text style={styles.title}>Welcome!</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")} onLongPress={() => setIsScanning(true)}>
        <Text style={styles.textButton}>Create an Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {marginTop: "7%"}]} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.textButton}>Sign in</Text>
      </TouchableOpacity>
      {isScanning ?
        <BarCodeScanner
          onBarCodeScanned={({data}) => {
            setIsScanning(false);
            console.log(data);
            AsyncStorage.setItem('IP', data);
          }}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}
        />
      : null}

    </View>
  )
}

export default WelcomeScreen;