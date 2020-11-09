import React, { useRef } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { COLORS, PORT, categories } from '../../../const/const';
import { Icon } from 'react-native-elements';
import styles from './styles/index.css';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { handleError } from '../../../utils/handleError';
import { fetchWithTimeout } from '../../../utils/fetch';
import Animated from 'react-native-reanimated';

// represent an item in task list
const handleShowCategory = (category) => {
  return categories.find(item => item.title === category);
}

const handleShowTime = (time) => {
  const tmp = time ? time.split(":") : "00:00:00".split(":");
  return tmp[0] + ":" + tmp[1];
}

const TaskItem = (item, index, refresh, confirm, navigation) => {
  const category = handleShowCategory(item.type);

  const deleteTask = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/task/" + item.taskId, {
        method: "DELETE"
      });
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
      } else {
        handleError(result.msg);
      }
    } catch (error) {
      handleError(error.message);
    }
  }

  return (
    <Swipeable
      containerStyle={{overflow: "visible", marginLeft: 15, marginRight: 15}}
      renderRightActions={(progress, dragX) => {
        const scales = dragX.interpolate({
          inputRange: [0, 50, 100],
          outputRange: [0, 0.5, 1],
        });
        const trans = dragX.interpolate({
          inputRange: [0, 50, 100, 101],
          outputRange: [-20, 0, 0, 1],
        });
        return(
          <Animated.View style={{
            flexDirection: "row",
            alignItems: "center"
          }}>
            <TouchableOpacity style={{
              width: wp("12%"),
              height: hp("8%"),
              borderRadius: hp("1%"),
              backgroundColor: COLORS.STRONG_CYAN,
              marginLeft: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
              onPress={() => {navigation.navigate("CreateTask", {taskId: item.taskId, date: new Date(new Date().toDateString()).getTime(), onGoBack: () => {refresh(true)}})}}
            >
              <Icon
                type="material"
                name="content-copy"
                color={COLORS.WHITE}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{
              width: wp("12%"),
              height: hp("8%"),
              borderRadius: hp("1%"),
              marginLeft: 5,
              backgroundColor: COLORS.RED,
              alignItems: "center",
              justifyContent: "center"
            }}
              onPress={() => {refresh(true); deleteTask()}}
            >
              <Icon
                type="material"
                name="delete"
                color={COLORS.WHITE}
              />
            </TouchableOpacity>
          </Animated.View>
        )
      }}
    >
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <View style={{
          width: wp("12%"),
          height: wp("12%"),
          borderRadius: wp("6%"),
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: category.color,
          marginRight: -wp("6%"),
          marginTop: -hp("2%"),
          elevation: 8,
        }}>
          <Icon
            name={category.name}
            type={category.type}
            color={COLORS.WHITE}
          />
        </View>
        <TouchableOpacity 
          style={styles.taskItem}
          activeOpacity={1}
          onPress={() => {navigation.navigate("TaskDetails", {taskId: item.taskId, onGoBack: () => {refresh(true)}})}}
        >
          <View style={{
            flexDirection: "row", 
            justifyContent: "space-between",
            alignItems: "center",
            marginLeft: wp("7.5%"),
            marginRight: wp("5%"),
          }}>
            <View style={{
              flexDirection: "column",
              maxWidth: "75%",
              flexShrink: 1,
              justifyContent: "center",
            }}>
              <Text style={{
                fontSize: hp("2.5%"),
                fontFamily: "AcuminBold", 
                color: COLORS.BLACK
              }}>
                {item.name}
              </Text>
            </View>
            <View style={{
              width: wp("20%"),
              height: hp("2.5%"),
              borderRadius: hp("0.5%"),
              backgroundColor: item.status === "DONE" && COLORS.GREEN
                            || item.status === "FAILED" && COLORS.RED
                            || item.status === "HANDED" && COLORS.PURPLE
                            || item.status === "ASSIGNED" && COLORS.STRONG_CYAN,
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Text style={{
                color: COLORS.WHITE,
                textTransform: "capitalize"
              }}>
                {item.status}
              </Text>
            </View>
          </View>
          <View style={{marginLeft: wp("7.5%"), marginTop: 10}}>
            <Text style={{
               fontSize: 14,
               fontFamily: "Acumin",
               color: COLORS.LIGHT_GREY
            }}>
              From: {handleShowTime(item.fromTime)} to {handleShowTime(item.toTime)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

export default TaskItem;