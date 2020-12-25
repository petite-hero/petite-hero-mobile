import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import LoginScreen from '../LoginScreen';
import RegisterScreen from '../RegisterScreen';
import styles from './styles/index.css';
import ForgotPasswordScreen from '../ForgotPasswordScreen';
import ForgotPasswordCodeEnteringScreen from '../ForgotPasswordCodeEnteringScreen';
import RegisterEnteringInformationScreen from '../RegisterEnteringInformationScreen';
import RegisterCodeEnteringScreen from '../RegisterCodeEnteringScreen';
import ForgotPasswordNewPasswordEnteringScreen from '../ForgotPasswordNewPasswordEnteringScreen';
import ProfileShowingSubscriptionScreen from '../ProfileShowingSubscriptionScreen'
import { COLORS, PORT } from '../../../const/const';
import { showMessage } from '../../../utils/showMessage';
import { fetchWithTimeout } from '../../../utils/fetch';
import LicenseShowingScreen from '../LicenseShowingScreen';

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
        name="RegisterEnteringInformation" 
        component={RegisterEnteringInformationScreen}
        initialParams={{
          authContext: props.route.params.authContext,
          localizationContext: props.route.params.localizationContext
        }}
      />
      <Stack.Screen 
        name="RegisterCodeEntering" 
        component={RegisterCodeEnteringScreen}
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
      <Stack.Screen 
        name="NewPassword" 
        component={ForgotPasswordNewPasswordEnteringScreen}
        initialParams={{
          authContext: props.route.params.authContext,
          localizationContext: props.route.params.localizationContext
        }}
      />
      <Stack.Screen 
        name="LicenseShowing" 
        component={LicenseShowingScreen}
        initialParams={{
          authContext: props.route.params.authContext,
          localizationContext: props.route.params.localizationContext
        }}
      />
      <Stack.Screen 
        name="ProfileShowingSubscription" 
        component={ProfileShowingSubscriptionScreen}
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
  const [page, setPage] = React.useState("");

  return (
    <ImageBackground 
      style={styles.container}
      source={require("../../../../assets/gif/welcome_1.gif")}
    >
      <Image style={styles.circle}/>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")} onLongPress={() => setIsScanning(true)}>
        <Text style={styles.textButton}>{t("welcome-signup")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {marginTop: "7%", marginBottom: 15}]} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.textButton}>{t("welcome-signin")}</Text>
      </TouchableOpacity>
      <Text style={{
        fontSize: 14,
        fontFamily: "AcuminBold",
        color: COLORS.STRONG_CYAN,
        textDecorationLine: "underline"
      }}
        onPress={() => {navigation.navigate("LicenseShowing")}}
      >
        License &amp; Policy
      </Text>
      {isScanning ?
        <BarCodeScanner
          onBarCodeScanned={({data}) => {
            setIsScanning(false);
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