import React, { useEffect, useRef, useState } from 'react';
import { AsyncStorage, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';

const AvatarContainer = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const [currentChild, setCurrentChild] = useState({});
  const [otherChildren, setOtherChildren] = useState([]);
  const animAvatar = useRef(new Animated.Value(0)).current;
  const avatarHeight = widthPercentageToDP("14.3%");
  const animAvatarPositions = [];
  const children = props.children;
  props.children.map((child, index) => {
    animAvatarPositions.push(animAvatar.interpolate({inputRange: [0, 1], outputRange: [0, avatarHeight * (index + 1)]}));
  })
  
  const changeChild = async(childId) => {
    await AsyncStorage.setItem("child_id", childId + "");
    setDropdown(false);
    props.setLoading(true);
    props.setChildren();
  }

  useEffect(() => {
    (async() => {
      const id = await AsyncStorage.getItem("child_id");
      setCurrentChild(children.find(child => child.childId == id));
      setOtherChildren(children.filter(child => child.childId != id));
    })();
  }, [children]);

  if (!currentChild || !otherChildren) return null;

  return (
    <>
      {dropdown && 
      <TouchableOpacity style={{
        position: "absolute",
        width: widthPercentageToDP("100%"),
        height: heightPercentageToDP("110%"),
        backgroundColor: COLORS.BLACK,
        opacity: 0.4,
        elevation: 10
      }}
        onPressIn={() => {
          if (!dropdown) {
            animAvatar.setValue(0);
            Animated.timing(animAvatar, {
              toValue: 1,
              duration: 400,
              easing: Easing.linear
            }).start(); 
          }
          else {
            animAvatar.setValue(1);
            Animated.timing(animAvatar, {
              toValue: 0,
              duration: 400,
              easing: Easing.linear
            }).start(); 
          }
          setDropdown(!dropdown);
        }}
      />}
      {otherChildren.length > 0 && otherChildren.map((child, index) => (
        <Animated.View 
          key={child.childId + ""}
          style={{
            position: "absolute",
            top: "5%",
            right: "10%",
            elevation: 10,
            opacity: animAvatar,
            transform: [{translateY: animAvatarPositions[index]}]
          }}
        >
          <TouchableOpacity onPress={() => {
            animAvatar.setValue(0);
            Animated.timing(animAvatar, {
              toValue: 0,
              duration: 400,
              easing: Easing.linear
            }).start(); 
            changeChild(child.childId);
          }}>
            <Image
              source={{uri: "data:image/png;base64," + child.photo}}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </Animated.View>
    ))}
    {props.children.length > 0 ?
      <Animated.View
        style={{
          position: "absolute",
          top: "5%",
          right: "10%",
          elevation: 20
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (!dropdown) {
              animAvatar.setValue(0);
              Animated.timing(animAvatar, {
                toValue: 1,
                duration: 400,
                easing: Easing.linear
              }).start(); 
            }
            else {
              animAvatar.setValue(1);
              Animated.timing(animAvatar, {
                toValue: 0,
                duration: 400,
                easing: Easing.linear
              }).start(); 
            }
            setDropdown(!dropdown);
          }}
        >
          <Image
            source={{uri: "data:image/png;base64," + currentChild.photo}}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </Animated.View>
    : 
      <Image
        style={styles.avatar}
        source={require("../../../../assets/kid-avatar.png")}
      />
    }
    </>
  )
}

export default AvatarContainer;