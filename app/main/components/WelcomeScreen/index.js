import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, AsyncStorage, ImageBackground } from 'react-native';
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

const Welcome = ({ navigation, route }) => {

  const { t } = useContext(route.params.localizationContext);
  const [isScanning, setIsScanning] = React.useState(false);

  return (
    <ImageBackground 
      style={styles.container}
      source={require("../../../../assets/gif/welcome_1.gif")}
    >
      <Image style={styles.circle}/>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")} onLongPress={() => setIsScanning(true)}>
        <Text style={styles.textButton}>{t("welcome-signup")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {marginTop: "7%"}]} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.textButton}>{t("welcome-signin")}</Text>
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
    </ImageBackground>
  )
}

export default WelcomeScreen;