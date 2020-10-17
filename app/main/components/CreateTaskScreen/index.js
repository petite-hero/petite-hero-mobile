import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Image, SafeAreaView, Text, View, TextInput } from 'react-native';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';

const CreateTaskScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [photo, setPhoto] = useState("");
  const [repeatOn, setRepeatOn] = useState([]);

  return(
    <SafeAreaView style={styles.container}>
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
        <View>
          <TextInput
            value={title}
            onChangeText={(text) => {setTitle(text)}}
            placeholder="Title"
          />
        </View>
        {/* end title */}
        {/* description */}
        <View>
          <TextInput
            value={description}
            onChangeText={(text) => {setDescription(text)}}
          />
        </View>
        {/* end description */}
        {/* time setting */}
        <View>
          {/* from */}
          <TouchableOpacity>

          </TouchableOpacity>
          {/* end from */}
          {/* to */}
          <TouchableOpacity>

          </TouchableOpacity>
          {/* end to */}
        </View>
        {/* end time setting */}
        {/* photo */}
        <View>
          <TouchableOpacity>

          </TouchableOpacity>
        </View>
        {/* end photo */}
        {/* repeat on */}
        <View>
          <TouchableOpacity>

          </TouchableOpacity>
        </View>
        {/* end repeat on */}
        <View>
          <TouchableOpacity></TouchableOpacity>
          <TouchableOpacity></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CreateTaskScreen;