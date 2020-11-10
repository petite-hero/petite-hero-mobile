import React, { useContext, useEffect, useRef, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles/index.css';
import DateItem from './DateItem';
import TaskBoard from './TaskBoard';
import { View, Text, Image, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import { Icon } from 'react-native-elements';
import { Loader } from '../../../utils/loader';
import { handleError } from '../../../utils/handleError';
import { fetchWithTimeout } from '../../../utils/fetch';

{/*
  function getDaysInMonth
  description: load dates in a specific month
  parameters:
    + month: specify a month in a year, type "number", range from 0 to 11 (0 is January, 11 is December)
    + year : specify a full year, type "number", e.g. 2020
  return: list of dates in a specific month
*/}
const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 1);
  const dates = [];
  while (date.getMonth() === month) {
    const tmp = new Date(date).toDateString().split(" ");
    const dateString = new Date(date).toDateString();
    dates.push({
      dayOfWeek: tmp[0],
      month: tmp[1],
      monthNum: date.getMonth(),
      day: tmp[2],
      year: tmp[3],
      numOfHandedTasks: 0,
      date: new Date(dateString).getTime()
    });
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

{/*
  function getDateIndex
  description: get index of a specific date in date list
  parameters:
    + dates: array of dates of a specific month 
    + date : date whose index is needed to be found, date must be converted to date string i.e. "Fri Nov 06 2020"
  return: index of giving date
*/}
const getDateIndex = (dates, date = new Date().toDateString()) => {
  const month = date.split(" ")[1];
  const day = date.split(" ")[2];
  const year = date.split(" ")[3];
  const index = dates.findIndex(date => date.year === year && date.month === month && date.day === day);
  return index > (dates.length - 1) ? dates.length - 5 : index - 2;
}

{/*
  function groupTasksByStatus
  description: group tasks in list by status, giving statuses are: ASSIGNED, HANDED, DONE, FAILED
  parameters:
    + list: list of tasks
  return: array of tasks grouped into two statuses: in progress and finished
*/}
const groupTasksByStatus = (list) => {
  const tmp = list.reduce((r, a) => {
    r[a.status] = [...r[a.status] || [], a];
    return r;
  }, {})
  const assigned = tmp.ASSIGNED ? tmp.ASSIGNED : [];
  const handed = tmp.HANDED ? tmp.HANDED : [];
  const done = tmp.DONE ? tmp.DONE : [];
  const failed = tmp.FAILED ? tmp.FAILED : [];
  const inProgress = [handed, assigned].reduce((accumulator, currentValue) => {
    return accumulator.concat(currentValue);
  }, []);
  const finished = [done, failed].reduce((accumulator, currentValue) => {
    return accumulator.concat(currentValue);
  }, []);
  return [inProgress, finished];
};

{/*
  function getHandedTasks
  description: get 
  parameters:
    + list: list of tasks
  return: array of tasks grouped into two statuses: in progress and finished
*/}
const getHandedTasks = async(date, setDates) => {
  try {
    const ip = await AsyncStorage.getItem('IP');
    const childId = await AsyncStorage.getItem('child_id');
    const response = await fetchWithTimeout("http://" + ip + PORT + "/task/list/" + childId + "/handed?date=" + date);
    const result = await response.json();
    if (result.code === 200) {
      const tmp = getDaysInMonth(new Date(date).getMonth(), new Date(date).getFullYear());
      tmp.forEach(date => {
        result.data.forEach(object => {
          date.date === object.date ? date.numOfHandedTasks = object.count : null;
        })
      });
      setDates(tmp);
    } else {
      handleError(result.msg);
    }
  } catch (error) {
    handleError(error.message);
  }
};


{/* 
  variable currentDateIndex
  description: this variable is used to store index of current date 
*/}
const currentDateIndex = getDateIndex(getDaysInMonth(new Date().getMonth(), new Date().getFullYear())) + 2;

{/* 
  React component TaskScreen
  description: presentational component of TaskScreen
*/}
const TaskScreen = (props) => {
  const { t }                               = useContext(props.route.params.localizationContext);
  const [date, setDate]                     = useState(new Date(new Date().toDateString()).getTime());
  const [list, setList]                     = useState([]);
  const [modalVisible, setModalVisible]     = useState(false);
  const [loading, setLoading]               = useState(false);
  const [isShowed, setShow]                 = useState(false);
  const [dates, setDates]                   = useState(getDaysInMonth(new Date().getMonth(), new Date().getFullYear()));
  const currentDate                         = new Date(new Date().toDateString()).getTime();
  const [currentIndex, setCurrentIndex]     = useState(currentDateIndex);
  const refDateFlatlist                     = useRef(null);

  useEffect(() => {
    (async() => {
      try {
        const ip = await AsyncStorage.getItem('IP');
        const childId = await AsyncStorage.getItem('child_id');
        const response = await fetchWithTimeout("http://" + ip + PORT + "/task/list/" + childId + "?date=" + date);
        const result = await response.json();
        if (result.code === 200) {
          setList(groupTasksByStatus(result.data));
          getHandedTasks(date, setDates);
        } else {
          handleError(result.msg);
        }
        setLoading(false);
      } catch (error) {
        handleError(error.message);
      }
    })()
  }, [loading]);

  return (
    <View style={styles.container}>

      {/* LOADER */}
      <Loader loading={loading}/>
      {/* END LOADER */}

      {/* DATE TIME PICKER */}
      {isShowed &&
        <DateTimePicker
          mode="date"
          value={date}
          onChange={(event, newDate) => {
            setShow(false);
            if (newDate == null) return;
            if (event.nativeEvent.type === "set" || new Date(newDate.toDateString()).getTime() !== date) {
              setLoading(true);
              const daysInMonth = getDaysInMonth(newDate.getMonth(), newDate.getFullYear());
              setDate(new Date((new Date(newDate).toDateString())).getTime());
              setCurrentIndex(getDateIndex(daysInMonth, newDate.toDateString()) + 2);
              refDateFlatlist.current.scrollToIndex({index: getDateIndex(getDaysInMonth(newDate.getMonth(), newDate.getFullYear()), newDate.toDateString()) - 2 > 0 ? getDateIndex(getDaysInMonth(newDate.getMonth(), newDate.getFullYear()), newDate.toDateString()) : 0})
            }
          }}
        />
      }
      {/* END DATE TIME PICKER */}

      {/* HEADER */}
      <View style={styles.header}>
        {/* TITLE CONTAINER */}
        <View style={styles.titleContainer}>
          {/* TITLE */}
          <Text style={styles.title}>
            Tasks
          </Text>
          {/* END TITLE */}
          {/* AVATAR */}
          <Image
            style={[styles.avatar, {backgroundColor: COLORS.WHITE}]}
            source={require('../../../../assets/kid-avatar.png')}
          />
          {/* END AVATAR */}
        </View>
        {/* END TITLE CONTAINER */}
        {/* DATE TIME PICKER SHOWER */}
        <View style={styles.dateTimePickerShower}>
          <TouchableOpacity 
            style={styles.monthPicker}
            onPress={() => {setShow(true)}}
          >
            <Text style={styles.dateNum}>
              {new Date(date).toDateString().split(" ")[1] + " " + new Date(date).toDateString().split(" ")[3]}
            </Text>
            <Icon
              name="keyboard-arrow-down"
              type="material"
              color={COLORS.BLACK}
            />
          </TouchableOpacity>
        </View>
        {/* END DATE TIME PICKER SHOWER */}
        {/* DATE LIST */}
        <View style={styles.dateList}>
          {/* DATE FLAT LIST */}
          <FlatList
            data={dates}
            renderItem={({item, index}) => DateItem(item, index, currentIndex, refDateFlatlist, setCurrentIndex, setDate, setLoading)}
            keyExtractor={item => item.year + item.month + item.day}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <Text style={styles["mr-2"]}></Text>}
            ref={refDateFlatlist}
            initialNumToRender={31}
            onLayout={() => {
              refDateFlatlist.current.scrollToIndex({index: currentDateIndex - 2 > 0 ? currentDateIndex - 2 : 0});
            }}
          />
          {/* END DATE FLAT LIST */}
          {/* BUTTON BACK TO CURRENT DATE */}
          <TouchableOpacity
            style={[styles.btnBack, {display: date > currentDate ? "flex" : "none"}]}
            onPress={() => {
              setLoading(true);
              setDate(currentDate);
              setCurrentIndex(getDateIndex(getDaysInMonth(new Date(currentDate).getMonth(), new Date(currentDate).getFullYear()), new Date(currentDate).toDateString()) + 2);
              refDateFlatlist.current.scrollToIndex({index: currentDateIndex - 2 > 0 ? currentDateIndex - 2 : 0});
            }}
            activeOpacity={1}
          >
            <Icon
              name="keyboard-arrow-left"
              type="material"
              color={COLORS.BLACK}
            />
          </TouchableOpacity>
          {/* END BUTTON BACK TO CURRENT DATE */}
          {/* BUTTON FORWARD TO CURRENT DATE */}
          <TouchableOpacity
            style={[styles.btnForth, {display: date < currentDate ? "flex" : "none"}]}
            onPress={() => {
              setLoading(true);
              setDate(currentDate);
              setCurrentIndex(getDateIndex(getDaysInMonth(new Date(currentDate).getMonth(), new Date(currentDate).getFullYear()), new Date(currentDate).toDateString()) + 2);
              refDateFlatlist.current.scrollToIndex({index: currentDateIndex - 2 > 0 ? currentDateIndex - 2 : 0});
            }}
            activeOpacity={1}
          >
            <Icon
              name="keyboard-arrow-right"
              type="material"
              color={COLORS.BLACK}
            />
          </TouchableOpacity>
          {/* END BUTTON FORWARD TO CURRENT DATE */}
        </View>
        {/* END DATE LIST */}
      </View>
      {/* END HEADER */}

      {/* TASK BOARD */}
      <TaskBoard 
        list={list} 
        refresh={setLoading} 
        confirm={setModalVisible} 
        navigation={props.navigation}
      />
      {/* END TASK BOARD */}

      {/* BUTTON ADD TASK */}
      <TouchableOpacity
        style={styles.btnAddTask}
        onPress={() => {props.navigation.navigate("CreateTask", {date: date, onGoBack: () => {setLoading(true)}})}}
      >
        <Icon
          name="add"
          type="material"
          color={COLORS.WHITE}
        />
      </TouchableOpacity>
      {/* END BUTTON ADD TASK */}

    </View>
  );
};


export default TaskScreen;