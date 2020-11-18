import React, { useRef } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { View, Text, AsyncStorage, TouchableOpacity, Animated } from 'react-native';
import { COLORS, PORT, categories } from '../../../const/const';
import { Icon } from 'react-native-elements';
import styles from './styles/index.css';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { handleError } from '../../../utils/handleError';
import { fetchWithTimeout } from '../../../utils/fetch';

// represent an item in task list
const handleShowCategory = (category) => {
  return categories.find(item => item.title === category);
}

const handleShowTime = (time) => {
  const tmp = time ? time.split(":") : "00:00:00".split(":");
  return tmp[0] + ":" + tmp[1];
}

const getTime = (time) => {
  const tmp = time.split(":");
  return [parseInt(tmp[0]), parseInt(tmp[1]), parseInt(tmp[2])];
}

const isLate = (date, time) => {
  const tmp = getTime(time);
  const toTime = new Date(new Date(date).setHours(tmp[0], tmp[1], tmp[2])).getTime();
  const currentTime = new Date().getTime();
  return currentTime - toTime > 0;
}

const TaskItem = ({ date, item, refresh, navigation, onDelete }) => {
  const category = handleShowCategory(item.type);

  // const deleteTask = async() => {
  //   try {
  //     const ip = await AsyncStorage.getItem('IP');
  //     const response = await fetchWithTimeout("http://" + ip + PORT + "/task/" + item.taskId, {
  //       method: "DELETE"
  //     });
  //     const result = await response.json();
  //     if (result.code === 200 && result.msg === "OK") {
  //     } else {
  //       handleError(result.msg);
  //     }
  //   } catch (error) {
  //     handleError(error.message);
  //   }
  // }

  return (
    item.taskId ? (
    <Swipeable
      containerStyle={{overflow: "visible", marginLeft: 15}}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      renderRightActions={(progress, dragX) => {
        const trans = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [150, 0],
        });
        return (
          <View style={{ width: 150, flexDirection: 'row' }}>
            <Animated.View 
              style={{ 
                flex: 1,
                height: hp("11.5%"),
                marginLeft: -20,
                borderTopRightRadius: hp("3%"),
                borderBottomRightRadius: hp("3%"),
                flexDirection: "row",
                backgroundColor: COLORS.STRONG_CYAN,
                transform: [{ translateX: trans }] 
              }}>
              <TouchableOpacity
                style={{
                  width: "100%", 
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onPress={() => {navigation.navigate("TaskCreating", {taskId: item.taskId, date: new Date(new Date().toDateString()).getTime(), onGoBack: () => {refresh(true)}})}}
              >
                <Icon
                  type="material"
                  name="content-copy"
                  color={COLORS.WHITE}
                />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View 
              style={{ 
                flex: 1,
                height: hp("11.5%"),
                borderTopRightRadius: hp("3%"),
                borderBottomRightRadius: hp("3%"),
                marginLeft: -20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.RED,
                transform: [{ translateX: trans }],
                elevation: -1
              }}>
              <TouchableOpacity
                style={{
                  width: "100%", 
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onPress={() => {onDelete(item.taskId)}}
              >
                <Icon
                  type="material"
                  name="delete"
                  color={COLORS.WHITE}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        )
      }}
    >
      <View style={{
        flexDirection: "row",
        alignItems: "center"
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
          style={[styles.taskItem, 
            { borderColor:
                item.status === "DONE" ? COLORS.GREEN
              : item.status === "FAILED" ? COLORS.RED
              : item.status === "HANDED" ? COLORS.PURPLE
              : category.title === "Housework" ? COLORS.YELLOW
              : category.title === "Education" ? COLORS.STRONG_CYAN
              : category.title === "Skills" && COLORS.GREEN
            }
          ]}
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
          </View>
          <View style={{marginLeft: wp("7.5%"), marginTop: 10}}>
            { item.status === "DONE" || item.status === "FAILED" ?
              <Text style={{
                color: item.status === "DONE" && COLORS.GREEN
                    || item.status === "FAILED" && COLORS.RED,
                textTransform: "capitalize"
              }}>
                {item.status}
              </Text>
            :
            isLate(date, item.toTime) ?
              <Text style={{
                fontSize: 14,
                fontFamily: "Acumin",
                color: COLORS.YELLOW
              }}>
                Late
              </Text>
            :
            item.status === "ASSIGNED" ?
              <Text style={{
                fontSize: 14,
                fontFamily: "Acumin",
                color: COLORS.LIGHT_GREY
              }}>
                From {handleShowTime(item.fromTime)} to {handleShowTime(item.toTime)}
              </Text>
            :
              <Text style={{
                color: COLORS.PURPLE,
                textTransform: "capitalize"
              }}>
                {item.status}
              </Text>
            }
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
    ) : (
      <View style={[styles.taskItem, {borderWidth: 0, backgroundColor: "transparent"}]}></View>
    )
  );
};

export default TaskItem;