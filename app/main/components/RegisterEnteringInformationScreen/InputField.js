import React from 'react';
import { Text, TextInput } from 'react-native';
import { COLORS } from '../../../const/const';

const InputField = ({title, value, setValue, placeholder, invalidMessage, setInvalidMessage}) => {
  return (
    <>
      <Text style={{
        marginTop: "5%",
        fontFamily: "MontserratBold",
        fontSize: 20,
        color: COLORS.BLACK
      }}>
        {title}
      </Text>
      <TextInput
        value={value}
        onChangeText={(text) => {setValue(text); setInvalidMessage("")}}
        placeholder={placeholder}
        placeholderTextColor={COLORS.MEDIUM_CYAN}
        maxLength={50}
        style={{
          height: 40,
          marginTop: "5%",
          fontFamily: "MontserratBold",
          fontSize: 16,
          color: COLORS.BLACK,
          borderBottomWidth: 1,
          borderColor: COLORS.STRONG_CYAN
        }}
      />
      {invalidMessage ?
      <Text style={{
        fontFamily: "Montserrat",
        fontSize: 14,
        color: COLORS.RED
      }}>
        {invalidMessage}
      </Text> : <></>}
    </>
  )
}

export default InputField;