import React from "react";
import { TouchableOpacity, Text } from 'react-native';
import styles from "./styles/index.css"

const ButtonSave = ({title, action}) => {
  return (
    <TouchableOpacity style={styles.container}
      onPress={() => action()}
    >
      <Text style={styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default ButtonSave;