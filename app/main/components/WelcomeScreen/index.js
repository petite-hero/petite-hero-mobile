import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../const/color';
import styles from './styles/index.css';

const WelcomeScreen = ({ navigation }) => {
  navigation.navigate("Main");  // hung - test
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
      <TouchableOpacity style={styles.btnRegister}>
        <Text style={styles.txtButton}>Create an Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnLogin} onPress={() => navigation.navigate("Main")}>
        <Text style={styles.txtButton}>Sign in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WelcomeScreen;