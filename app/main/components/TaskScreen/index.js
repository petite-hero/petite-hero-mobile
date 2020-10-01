import React, { useContext, useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { SafeAreaView, View, Text, Image } from 'react-native';
import styles from './styles/index.css';
import { FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { COLORS } from '../../../const/color';

const DATA = [
  {
    id: "1",
    title: {
      date: "12",
      dayOfWeek: "Mon", 
    }
  },
  {
    id: "2",
    title: {
      date: "13",
      dayOfWeek: "Tue", 
    }
  },
  {
    id: "3",
    title: {
      date: "14",
      dayOfWeek: "Wed", 
    }
  },
  {
    id: "4",
    title: {
      date: "15",
      dayOfWeek: "Thu", 
    }
  },
  {
    id: "5",
    title: {
      date: "16",
      dayOfWeek: "Fri", 
    }
  },
  {
    id: "6",
    title: {
      date: "17",
      dayOfWeek: "Sat", 
    }
  },
  {
    id: "7",
    title: {
      date: "18",
      dayOfWeek: "Sun", 
    }
  }
];

const CalendarPicker = ({ isShowed }) => (
  isShowed ? (
  <Calendar
    firstDay={1}
    style={{
      position: "absolute", 
      top: -hp("28%"), 
      alignSelf: "center",
      width: wp("90%"),
      elevation: 10,
      // backgroundColor: COLORS.LIGHT_ORANGE
    }}
  />
  ) : (true)
)

const Date = ({ title }) => (
  title.date === "12" ? (
    <TouchableOpacity style={[styles.dateContainer, styles.dateActive]}>
      <Text style={[styles.dateText, styles.dateTextActive]}>{title.date}</Text>
      <Text style={[styles.dateText, styles.dateTextActive]}>{title.dayOfWeek}</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.dateContainer}>
      <Text style={styles.dateText}>{title.date}</Text>
      <Text style={styles.dateText}>{title.dayOfWeek}</Text>
    </TouchableOpacity>
  )
);

const Task = ({ title }) => (
  <TouchableOpacity style={styles.taskItem}>
    {/* <Text>{title.date}</Text>
    <Text>{title.dayOfWeek}</Text> */}
  </TouchableOpacity>
);

const TaskScreen = (props) => {
  const { t } = useContext(props.route.params.locale);
  const [isDragged, setDragged] = useState(false);
  const [isShowed, setShowed] = useState(false);

  const heightIncrease = useRef(new Animated.Value(hp("47.5%"))).current;

  const changeHeight = () => {
    setDragged(!isDragged)
    if (isDragged) {
      Animated.timing(
        heightIncrease,
        {
          toValue: hp("82%"),
          duration: 400,
          easing: Easing.ease
        }
      ).start();
    } else {
      Animated.timing(
        heightIncrease,
        {
          toValue: hp("47.5%"),
          duration: 400,
          easing: Easing.ease
        }
      ).start();
    }
  }

  const DateItem = ({ item }) => (
    <Date title={item.title} />
  );

  const TaskItem = ({ item }) => (
    <Task title={item.title}/>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={[styles.avatar, {backgroundColor: COLORS.STRONG_ORANGE}]}
          // source={{uri: "https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.15752-9/118881393_430697914571214_4949863648741553269_n.jpg?_nc_cat=107&_nc_sid=ae9488&_nc_ohc=CRL20t0CXSoAX-UGsNg&_nc_ht=scontent.fsgn2-3.fna&oh=8a78db6a5556a3e8d4039464250d0c91&oe=5F91B50E"}}
        />
        <TouchableOpacity 
          style={styles.monthPicker}
          onPress={() => {setShowed(!isShowed)}}
        >
          <Text>September</Text>
          <Text style={{fontWeight: "bold"}}>2020</Text>
        </TouchableOpacity>
        <View style={styles.dateList}>
          <FlatList
            data={DATA}
            renderItem={DateItem}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Tasks
        </Text>
        <TouchableOpacity style={styles.btnAddTask}>
          <Text style={styles.txtAddTask}>
            +
          </Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.taskBoard, {height: heightIncrease}]}>
        <View
          style={styles.separatorContainer}
          onTouchEnd={(e) => {
            changeHeight();
          }}
        >
          <View style={styles.separator}/>
        </View>
        <FlatList
          data={DATA}
          renderItem={TaskItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
      <CalendarPicker isShowed={isShowed}/>
    </SafeAreaView>
  );
};


export default TaskScreen;