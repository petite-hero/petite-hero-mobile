import React from "react";
import { TouchableOpacity, Text } from 'react-native';
import styles from "./styles/index.css"

const ButtonSave = ({title, action, style, textStyle}) => {
  return (
    <TouchableOpacity style={[styles.container, {...style}]}
      onPress={() => action()}
    >
      <Text style={[styles.buttonText, {...textStyle}]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default ButtonSave;