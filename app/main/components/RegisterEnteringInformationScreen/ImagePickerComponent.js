import React  from "react";
import { View, TouchableOpacity, Image } from 'react-native';
import { COLORS } from "../../../const/const";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';


const ImagePickerComponent = (props) => {
  const getPermission = async() => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  }
  
  const pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    });

    if (!result.cancelled) {
      const localUri = result.uri;
      const fileName = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName);
      const type = match ? `image/${match[1]}` : `image`;
      props.setPhoto({ uri: localUri, name: fileName, type });
    }
  }

  return (
    <View style={{
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "10%"
    }}>
      <TouchableOpacity
        title="Choose file"
        onPress={async() => {await getPermission(); await pickImage()}}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.MEDIUM_GREY
        }}
        activeOpacity={0.8}
      >
      {props.photo ?
        <Image
          source={{uri: props.photo.uri}}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 60
          }}
        />
      :
        <Image
          source={require("../../../../assets/icons/camera.png")}
          style={{
            width: 70,
            height: 70
          }}
        />
      }
      </TouchableOpacity>
    </View>
  )
};

export default ImagePickerComponent;