import React, { useContext, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import { Loader } from '../../../utils/loader';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import styles from './styles/index.css';

const CELLS = 6;

const ForgotPasswordCodeEnteringScreen = (props) => {
  const { t }                              = useContext(props.route.params.localizationContext);
  const [value, setValue]                  = useState("");
  const [loading, setLoading]              = useState(false);
  const ref                                = useBlurOnFulfill({value, cellCount: CELLS});
  const [property, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

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
        onPress={() => {props.navigation.navigate("Login")}}
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
          {t("forgot-enter-otp-title")}
        </Text>
        <View style={{
          width: "80%"
        }}>
          <CodeField
            ref={ref}
            {...property}
            value={value}
            onChangeText={setValue}
            cellCount={CELLS}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}> 
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
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
            // setLoading(true)
          }}
        >
          <Text style={{
            fontSize: 16, 
            fontFamily: "Acumin", 
            color: COLORS.WHITE
          }}>
            {t("forgot-enter-otp-next")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ForgotPasswordCodeEnteringScreen;