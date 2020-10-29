import React, { useContext, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';

const ChangeParentProfileScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [currentName, setCurrentName] = useState(props.route.params.value);
  const [name, setName] = useState(props.route.params.value);

  return (
    <View style={styles.container}>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20%",
        marginLeft: "10%",
        marginRight: "10%",
        marginBottom: "10%",
      }}>
        {/* icon back */}
        <Icon
          name="keyboard-arrow-left"
          type="material"
          color={COLORS.STRONG_ORANGE}
          onPress={() => {props.navigation.goBack()}}
        />
        {/* end icon back */}
        {/* title of the screen */}
        <Text style={{
          fontSize: 20,
          fontFamily: "AcuminBold"
        }}>
          {props.route.params.screenName}
        </Text>
        {/* end title of the screen */}
        {/* button Done */}
        <TouchableOpacity>
          <Text style={{
            fontSize: 20,
            fontFamily: "Acumin",
            color: COLORS.STRONG_ORANGE
          }}>Done</Text>
        </TouchableOpacity>
        {/* end button Done */}
      </View>
      {/* changed field */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "2.5%",
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingBottom: "2.5%",
        backgroundColor: COLORS.LIGHT_ORANGE
      }}>
        <TextInput
          value={name}
          onChangeText={(text) => {setName(text)}}
          style={{
            fontSize: 17,
            fontFamily: "Acumin",
            width: "90%",
          }}
        />
        <TouchableOpacity style={{width: "10%", justifyContent: "flex-end"}}>
          <Icon 
            name="clear"
            type="material"
            color={COLORS.GREY}
            onPress={() => setName(currentName)}
          />
        </TouchableOpacity>
      </View>
      {/* end changed field */}
    </View>
  )
}

export default ChangeParentProfileScreen;