import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS } from '../../../const/const';
import LoginScreen from '../LoginScreen';
import RegisterScreen from '../RegisterScreen';
import styles from './styles/index.css';

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
      />
    </Stack.Navigator>
  );
};

const Welcome = ({ navigation }) => {

  [isScanning, setIsScanning] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.txtHello}>Hello!</Text>
        <Text style={styles.txtMessage}>
          Lorem ipsum dolor sit amet, consectetur adipiscing
          elit, sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat
        </Text>
      </View>
      <Image
        style={[styles.circle, {backgroundColor: COLORS.STRONG_ORANGE}]}
        // source={{uri: "https://media.thethao247.vn/upload/cuongnm/2020/04/28/guc-nga-truoc-nhan-sac-cua-hot-girl-bong-ro-xinh-dep-nhat-trung-quoc1588047165.jpg"}}
      />
      <TouchableOpacity style={styles.btnRegister} onPress={() => navigation.navigate("Register")} onLongPress={() => setIsScanning(true)}>
        <Text style={styles.txtButton}>Create an Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnLogin} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.txtButton}>Sign in</Text>
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

    </SafeAreaView>
  )
}

export default WelcomeScreen;