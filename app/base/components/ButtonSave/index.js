import React from "react";
import { TouchableOpacity, Text } from 'react-native';
import styles from "./styles/index.css"

const ButtonSave = ({title, action, style}) => {
  return (
    <TouchableOpacity style={[styles.container, {...style}]}
      onPress={() => action()}
    >
      <Text style={styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default ButtonSave;