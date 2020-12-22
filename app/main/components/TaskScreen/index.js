import React, { useContext, useEffect, useRef, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles/index.css';
import DateItem from './DateItem';
import TaskBoard from './TaskBoard';
import { View, Text, Image, FlatList, TouchableOpacity, AppState } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { PORT } from '../../../const/const';
import { Loader } from '../../../utils/loader';
import { showMessage } from '../../../utils/showMessage';
import { fetchWithTimeout } from '../../../utils/fetch';
import AvatarContainer from '../AvatarContainer';
import * as Notifications from 'expo-notifications';
import { ConfirmationModal } from '../../../utils/modal';

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
  inProgress.push({});
  finished.push({});
  return [inProgress, finished];
};

{/*
  function getHandedTasks
  description: get tasks with status HANDED
  parameters:
    + date: date to get tasks
    + setDates: method to set new list of dates
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
      if (result.data) {
        tmp.forEach(date => {
          result.data.forEach(object => {
            date.date === object.date ? date.numOfHandedTasks = object.count : null;
          })
        });
      } else {
        // do nothing
      }
      setDates(tmp);
    } else {
      showMessage(result.msg);
    }
  } catch (error) {
    showMessage(error.message);
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
  const [children, setChildrenUseState]     = useState([]);
  const childrenRef                         = useRef(children);  // use reference for listeners to use
  const setChildren = (newChildren) => {childrenRef.current = newChildren; setChildrenUseState(newChildren);}
  const [childId, setChildIdUseState]       = useState(null);
  const childIdRef                          = useRef(childId);  // use reference for listeners to use
  const setChildId = (newChildId) => {childIdRef.current = newChildId; setChildIdUseState(newChildId);}
  const [date, setDate]                     = useState(new Date(new Date().toDateString()).getTime());
  const [list, setList]                     = useState([]);
  const [loading, setLoading]               = useState(false);
  const [isShowed, setShow]                 = useState(false);
  const [deletedTaskId, setDeletedTaskId]   = useState("");
  const [dates, setDates]                   = useState(getDaysInMonth(new Date().getMonth(), new Date().getFullYear()));
  const currentDate                         = new Date(new Date().toDateString()).getTime();
  const [currentIndex, setCurrentIndex]     = useState(currentDateIndex);
  const refDateFlatlist                     = useRef(null);
  const notificationListener                = useRef();
  const responseListener                    = useRef();

  const listenChangeTaskStatus = () => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      if (notification.request?.content?.body?.includes("has submitted task")) {
        setLoading(true);
      }
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(notification => { 
      if (notification.request?.content?.body?.includes("has submitted task")) {
        setLoading(true);
      }
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  };

  const getListOfTask = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const childId = await AsyncStorage.getItem('child_id');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/task/list/" + childId + "?date=" + date);
      const result = await response.json();
      if (result.code === 200) {
        setList(groupTasksByStatus(result.data));
        getHandedTasks(date, setDates);
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const getListOfChildren = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const childId = await AsyncStorage.getItem('child_id');
      const response = await fetch("http://" + ip + PORT + "/parent/" + id + "/children");
      const result = await response.json();
      if (result.code === 200) {
        const tmp = result.data.filter( child => child.isCollaboratorChild === false || (child.isCollaboratorChild === true && child.isConfirm === true));
        if (tmp.length == 0){
          AsyncStorage.removeItem("child_id");
          setChildren([]);
        }
        else{
          setChildren(tmp);
          if (!childId || tmp.filter(child => child.childId == childId).length == 0) await AsyncStorage.setItem('child_id', tmp[0].childId + "");
        }
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const deleteTask = async(id) => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/task/" + id, {
        method: "DELETE"
      });
      const result = await response.json();
      if (result.code === 200 && result.msg === "OK") {
      } else {
        showMessage(result.msg);
      }
    } catch (error) {
      showMessage(error.message);
    }
  }

  const listenChildIdChanged = () => {
    props.navigation.addListener('focus', handleChildIdChanged);
    AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") handleChildIdChanged();
    });
  }
  
  const handleChildIdChanged = async () => {
    const childIdTmp = await AsyncStorage.getItem('child_id');
    if (childIdTmp != childIdRef.current) {
      setLoading(true);
      setChildId(childIdTmp);
      setChildren([...childrenRef.current]);
      // setDate(currentDate);
      // setCurrentIndex(getDateIndex(getDaysInMonth(new Date(currentDate).getMonth(), new Date(currentDate).getFullYear()), new Date(currentDate).toDateString()) + 2);
      // refDateFlatlist.current.scrollToIndex({index: currentDateIndex - 2 > 0 ? currentDateIndex - 2 : 0});
    }
  }

  useEffect(() => {
    listenChangeTaskStatus();
    listenChildIdChanged();
  }, []);

  useEffect(() => {
    getListOfChildren();
    getListOfTask();
  }, [loading]);

  return (
    <View style={styles.container}>
      {/* CONFIRMATION MODAL */}
      <ConfirmationModal t={t} message={t("task-delete-message")} visible={deletedTaskId.length !== 0} onConfirm={() => {setLoading(true); setDeletedTaskId(""); deleteTask(deletedTaskId) }} onClose={() => setDeletedTaskId("")}/>
      {/* END CONFIRMATION MODAL */}
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
              setTimeout(() => {refDateFlatlist.current.scrollToIndex({index: getDateIndex(getDaysInMonth(newDate.getMonth(), newDate.getFullYear()), newDate.toDateString()) - 2 > 0 ? getDateIndex(getDaysInMonth(newDate.getMonth(), newDate.getFullYear()), newDate.toDateString()) : 0})}, 1000);
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
            {t("task-title")}
          </Text>
          <View style={styles.bigCircle}/>
          <View style={styles.smallCircle}/>
          {/* END TITLE */}
        </View>
        {/* END TITLE CONTAINER */}
        {/* DATE TIME PICKER SHOWER */}
        <View style={styles.dateTimePickerShower}>
          <TouchableOpacity 
            style={styles.monthPicker}
            disabled={children.length == 0}
            onPress={() => {setShow(true)}}
          >
            <Text style={styles.dateNum}>
              {new Date(date).toDateString().split(" ")[1] + " " + new Date(date).toDateString().split(" ")[3]}
            </Text>
            <Image
              source={require("../../../../assets/icons/down.png")}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        </View>
        {/* END DATE TIME PICKER SHOWER */}
        {/* DATE LIST */}
        <View style={styles.dateList}>
          {/* DATE FLAT LIST */}
          <FlatList
            data={dates}
            renderItem={({item, index}) => <DateItem item={item} index={index} currentIndex={currentIndex} refDateFlatlist={refDateFlatlist} setCurrentIndex={setCurrentIndex} setDate={setDate} setLoading={setLoading} disabled={children.length === 0}/>}
            keyExtractor={item => item.year + item.month + item.day}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <Text style={styles["mr-2"]}></Text>}
            ref={refDateFlatlist}
            initialNumToRender={31}
            scrollEnabled={children.length !== 0}
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
            <Image
              source={require("../../../../assets/icons/back.png")}
              style={{width: 30, height: 30}}
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
            <Image
              source={require("../../../../assets/icons/forth.png")}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
          {/* END BUTTON FORWARD TO CURRENT DATE */}
        </View>
        {/* END DATE LIST */}
      </View>
      {/* END HEADER */}

      {/* TASK BOARD */}
      <TaskBoard
        t={t}
        date={date}
        list={list}
        refresh={setLoading}
        navigation={props.navigation}
        onDelete={setDeletedTaskId}
      />
      {/* END TASK BOARD */}

      {/* BUTTON ADD TASK */}
      { (date >= new Date(new Date().toDateString()).getTime() && new Date(date).getDate() - new Date().getDate() <= 7 && children.length !== 0) &&
        <TouchableOpacity
          style={styles.btnAddTask}
          onPress={() => {props.navigation.navigate("TaskCreating", {date: date, onGoBack: () => {setLoading(true)}})}}
        >
          <Image
            source={require("../../../../assets/icons/add.png")}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      }
      {/* END BUTTON ADD TASK */}
      {/* AVATAR */}
      <AvatarContainer children={children} setChildren={handleChildIdChanged} setLoading={setLoading}/>
      {/* END AVATAR */}
    </View>
  );
};


export default TaskScreen;