import React from "react";
import { View, Text, TextInput } from 'react-native';
import { COLORS } from "../../../const/const";
import styles from "./styles/index.css"

const InputField = ({title, value, setValue, valid = true, setValid, invalidMessage, keyboardType = "default"}) => {
  return (
    <View style={styles.container}>
      <Text style={{
        fontFamily: "AcuminBold",
        fontSize: 16
      }}>
        {title}
      </Text>
      <TextInput
        value={value}
        onChangeText={(text) => {setValue(text); setValid && setValid(true)}}
        keyboardType={keyboardType}
        style={{
          fontSize: 16,
          fontFamily: "Acumin",
          backgroundColor: COLORS.WHITE,
          borderBottomWidth: 2,
          borderColor: COLORS.GREY,
          width: "100%",
        }}
      />
      { !valid &&
        <Text style={{
          fontFamily: "Acumin",
          fontSize: 14,
          color: COLORS.RED
        }}>
          {invalidMessage}
        </Text>
      }
    </View>
  )
}

export default InputField;