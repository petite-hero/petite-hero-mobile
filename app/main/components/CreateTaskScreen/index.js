import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Image, View, Text, TextInput } from 'react-native';
import { COLORS } from '../../../const/const';
import { Icon } from 'react-native-elements';
import styles from './styles/index.css';

const CreateTaskScreen = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [photo, setPhoto] = useState("");
  const [repeatOn, setRepeatOn] = useState([]);

  return(
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image
            style={[styles.avatar, {backgroundColor: COLORS.WHITE}]}
            source={require('../../../../assets/kid-avatar.png')}
          />
          <Text style={styles.title}>Tasks</Text>
        </View>
      </View>
      {/* body */}
      <View>
        {/* title */}
        <View style={{
          width: "100%",
          height: 50,
          justifyContent: "center",
          marginTop: 30,
          paddingLeft: 30,
          backgroundColor: COLORS.LIGHT_ORANGE
        }}>
          <TextInput
            value={title}
            onChangeText={(text) => {setTitle(text)}}
            placeholder="Title"
          />
        </View>
        {/* end title */}
        {/* description */}
        <View style={{
          width: "100%",
          height: 100,
          marginTop: 30,
          paddingLeft: 30,
          backgroundColor: COLORS.LIGHT_ORANGE
        }}>
          <TextInput
            value={description}
            onChangeText={(text) => {setDescription(text)}}
            placeholder="Description..."
          />
        </View>
        {/* end description */}
        {/* time setting */}
        <View style={{
          width: "100%",
          height: 80,
          justifyContent: "center",
          marginTop: 30,
          paddingLeft: 30,
          paddingRight: 30,
          backgroundColor: COLORS.LIGHT_ORANGE
        }}>
          {/* from */}
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20
          }}>
            <Text>From</Text>
            <TouchableOpacity>
              <Text>13:00</Text>
            </TouchableOpacity>
          </View>
          {/* end from */}
          {/* to */}
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <Text>To</Text>
            <TouchableOpacity>
              <Text>17:00</Text>
            </TouchableOpacity>
          </View>
          {/* end to */}
        </View>
        {/* end time setting */}
        {/* repeat on */}
        <View style={{
          width: "100%",
          height: 50,
          justifyContent: "center",
          marginTop: 30,
          paddingLeft: 30,
          paddingRight: 30,
          backgroundColor: COLORS.LIGHT_ORANGE
        }}>
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}> 
            <Text>Repeat on</Text>
            <TouchableOpacity>
              <Text>Mon, Tue, Thu</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* end repeat on */}
        <View style={{
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            flexDirection: "row",
            marginTop: 10
          }}>
            <TouchableOpacity style={{
              alignItems: "center",
              justifyContent: "center",
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: COLORS.WHITE,
              marginRight: 50,
              elevation: 10
            }}
              onPress={() => {props.navigation.goBack()}}
            >
              <Icon name='clear' type='material' color={COLORS.STRONG_ORANGE}/>
            </TouchableOpacity>
            <TouchableOpacity style={{
              alignItems: "center",
              justifyContent: "center",
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: COLORS.STRONG_ORANGE,
              elevation: 10
            }}>
              <Icon name='check' type='material' color={COLORS.WHITE}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CreateTaskScreen;