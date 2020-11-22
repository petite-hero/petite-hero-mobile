import React, { useContext, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import { Loader } from '../../../utils/loader';
import styles from './styles/index.css';

const ForgotPasswordScreen = (props) => {
  const { t }                 = useContext(props.route.params.localizationContext);
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Loader loading={loading}/>
      <Icon
        name="keyboard-arrow-left"
        type="material"
        color={COLORS.BLACK}
        containerStyle={{
          position: "absolute",
          left: "10%",
          top: "15%",
          width: widthPercentageToDP("10%"),
          height: widthPercentageToDP("10%"),
          borderRadius: widthPercentageToDP("5%"),
          backgroundColor: COLORS.WHITE,
          alignItems: "center",
          justifyContent: "center",
          elevation: 10
        }}
        onPress={() => {props.navigation.goBack()}}
      />
      <View style={{
        position: "absolute",
        backgroundColor: COLORS.WHITE,
        width: "100%",
        height: "74%",
        top: "26%",
        alignItems: "center",
        borderTopRightRadius: 30,
        borderTopLeftRadius:  30,
      }}>
        <Text style={{
          marginTop: "10%",
          marginBottom: "10%",
          marginLeft: "10%",
          fontSize: 20,
          fontFamily: "MontserratBold",
          alignSelf: "baseline",
          color: COLORS.BLACK
        }}>
          {t("forgot-title")}
        </Text>
        <View style={{
          width: "80%"
        }}>
          <TextInput
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            placeholder={t("forgot-phone")}
            placeholderTextColor={COLORS.MEDIUM_CYAN}
            style={{
              fontSize: 16,
              fontFamily: "MontserratBold",
              height: 50,
              backgroundColor: COLORS.WHITE,
              borderBottomWidth: 1,
              borderColor: COLORS.STRONG_CYAN,
              marginBottom: "5%",
            }}
          />
        </View>
        <TouchableOpacity style={{
          width: "80%",
          height: 50,
          borderRadius: 25,
          marginTop: "10%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.STRONG_CYAN
        }}
          onPress={() => {
            // setLoading(true);
            props.navigation.navigate("CodeEntering")
          }}
        >
          <Text style={{
            fontSize: 16, 
            fontFamily: "Acumin", 
            color: COLORS.WHITE
          }}>
            {t("forgot-next")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ForgotPasswordScreen;