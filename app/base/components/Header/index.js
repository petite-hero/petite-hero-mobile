import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import styles from './styles/index.css';

const Header = ({navigation, title, subTitle}) => {
  return (
    <View style={styles.container}>
      {/* icon back */}
      <TouchableOpacity 
        style={styles.iconBackContainer}
        onPress={() => {navigation.goBack()}}
      >
        <Image
          source={require("../../../../assets/icons/back.png")}
          style={styles.iconBack}
        />
      </TouchableOpacity>
      {/* end icon back */}
      {/* title of the screen */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {title}
        </Text>
        {subTitle &&
          <Text style={styles.subTitle}>
            {subTitle}
          </Text>
        }
      </View>
      {/* end title of the screen */}
      {/* create this View for center title purpose */}
      <View style={{marginRight: "10%"}}></View>
      {/* end View */}
    </View>
  )
}

export default Header;