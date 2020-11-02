import React, { useContext, useEffect, useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { View, Text, Image, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import { Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles/index.css';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { fetchWithTimeout } from '../../../utils/fetch';
import { Loader } from '../../../utils/loader';
import { handleError } from '../../../utils/handleError';
import { ConfirmationModal } from '../../../utils/modal';

const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 1);
  const dates = [];
  while (date.getMonth() === month) {
    const tmp = new Date(date).toDateString().split(" ");
    dates.push({
      dayOfWeek: tmp[0],
      month: tmp[1],
      monthNum: date.getMonth(),
      day: tmp[2],
      year: tmp[3]
    });
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

const getDateIndex = (dates, date = new Date().toDateString()) => {
  const month = date.split(" ")[1];
  const day = date.split(" ")[2];
  const year = date.split(" ")[3];
  const index = dates.findIndex(date => date.year === year && date.month === month && date.day === day);
  return index > (dates.length - 1) ? dates.length - 5 : index - 2;
}

const TaskBoard = ({ list, refresh, confirm }) => {
  const [tabs, setTabs] = useState(
    [
      {title: "In Progress", active : true},
      {title: "Finished", active : false}
    ]
  );

  const toggleTab = (tabIndex) => {
    let tmp = [...tabs];
    tmp.map((value, index) => {
      index === tabIndex ? value.active = true : value.active = false;
    });
    setTabs(tmp);
  }

  return (
    <>
      <View style={{
        flexDirection: "row", 
        justifyContent: "space-evenly",
        marginTop: hp("1%")}}
      >
        {tabs.map((value, index) => {
          return (
            value.active ? (
              <TouchableOpacity key={index} style={styles.tabActive}>
                <Text style={[styles.tabText, styles.tabTextActive]}>{value.title}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity key={index} onPress={() => {toggleTab(index)}}>
                <Text style={styles.tabText}>{value.title}</Text>
              </TouchableOpacity>
            )
          )
        })}
      </View>
      <View style={styles.taskBoard}>
        <FlatList
          data={tabs[0].active ? list[0] : list[1]}
          renderItem={(item) => TaskItem(item, refresh, confirm)}
          keyExtractor={item => item.taskId + ""}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center"
          }}
        />
      </View>
    </>
  );
};

// represent an item in task list
const TaskItem = ({ item }, refresh, confirm) => {
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
      renderRightActions={() => (
        <TouchableOpacity style={{
          width: hp("10%"),
          height: hp("11.5%"),
          borderRadius: hp("3%"),
          backgroundColor: COLORS.RED,
          marginLeft: 20,
          alignItems: "center",
          justifyContent: "center"
        }}
          onPress={() => {refresh(true); deleteTask()}}
          // onPress={() => {confirm(true);}}
        >
          <Icon
            type="material"
            name="delete"
            color={COLORS.WHITE}
          />
        </TouchableOpacity>
      )}
    >
      <View style={{
        flexDirection: "row",
        alignItems: "center",
      }}>
        <View style={{
          width: wp("12%"),
          height: wp("12%"),
          borderRadius: wp("6%"),
          backgroundColor: COLORS.YELLOW,
          marginRight: -23,
          elevation: 8,
          marginTop: -hp("2%")
        }}/>
        <TouchableOpacity style={styles.taskItem}>
          <View style={{
            flexDirection: "row", 
            justifyContent: "space-between",
            marginLeft: wp("5%"),
            marginRight: wp("5%")
          }}>
            <View style={{
              width: "75%",
              flexShrink: 1
            }}>
              <Text style={{
                fontSize: hp("2.5%"),
                fontFamily: "AcuminBold", 
                marginLeft: wp("2.5%"),
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
          <View style={{marginLeft: wp("5%"), fontSize: hp("2.5%"), fontFamily: "Acumin", marginTop: 10}}>
            <Text>{item.time}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

// represent an item in date list
const DateItem = (item, index, currentIndex, refDateFlatlist, setCurrentIndex, setDate, refresh) => {
  return (
    <>
      {index !== currentIndex ?
      (
        <TouchableOpacity style={styles.dateContainer}
          onPress={() => {
            refDateFlatlist.current.scrollToIndex({index: index - 2 > 0 ? index - 2 : 0})
            setCurrentIndex(index);
            refresh(true);
            const tmp = item.year + "-" + (item.monthNum + 1 >= 10 ? item.monthNum + 1 : "0" + (item.monthNum + 1)) + "-" + item.day;
            setDate(new Date((new Date(tmp).toDateString())).getTime());
          }}>
          <Text style={styles.dateText}>{item.dayOfWeek}</Text>
          <Text style={styles.dateNum}>{item.day}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.dateContainer, styles.dateActiveContainer]}>
          <Text style={[styles.dateText, styles.dateTextActive]}>{item.dayOfWeek}</Text>
          <Text style={[styles.dateNum, styles.dateTextActive]}>{item.day}</Text>
        </TouchableOpacity>
      )}
    </>
  )
};

const TaskScreen = (props) => {
  const { t }                           = useContext(props.route.params.localizationContext);
  const [date, setDate]                 = useState(new Date().getTime());
  const [list, setList]                 = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [isShowed, setShow]             = useState(false);
  const [dates, setDates]               = useState(getDaysInMonth(new Date().getMonth(), new Date().getFullYear()));
  const refDateFlatlist                 = useRef(null);
  //
  const currentDateIndex = getDateIndex(dates) + 2;
  const [currentIndex, setCurrentIndex] = useState(currentDateIndex);
  // check valid index
  const isValidIndex = (index, length) => {
    return !(index < 0 || index >= length);
  }
  // handle scroll event of date list
  const handleScroll = (contentOffset) => {
    setLoading(true);
    if(refDateFlatlist.current) {
      const width = wp("16%"); // item width + margin
      const nextIndex = Math.round(contentOffset / width);
      if (isValidIndex(nextIndex, dates.length)) {
        refDateFlatlist.current.scrollToIndex({ animated: true, index: nextIndex });
        setCurrentIndex(nextIndex + 2);
        // setDate(new Date((new Date(tmp).toDateString())).getTime());
      } else {
        // do nothing
      }
    }
  };

  // group tasks by status
  const groupTasksByStatus = (list) => {
    const tmp = list.reduce((r, a) => {
      r[a.status] = [...r[a.status] || [], a];
      return r;
    }, {})
    const assigned = tmp.ASSIGNED ? tmp.ASSIGNED : [];
    const handed = tmp.HANDED ? tmp.HANDED : [];
    const done = tmp.DONE ? tmp.DONE : [];
    const failed = tmp.FAILED ? tmp.FAILED : [];
    const inProgress = [assigned, handed].reduce((accumulator, currentValue) => {
      return accumulator.concat(currentValue);
    }, []);
    const finished = [done, failed].reduce((accumulator, currentValue) => {
      return accumulator.concat(currentValue);
    }, []);
    return [inProgress, finished];
  }
  
  useEffect(() => {
    (async() => {
      try {
        const ip = await AsyncStorage.getItem('IP');
        const response = await fetchWithTimeout('http://' + ip + PORT + '/task/list/1?date=' + date);
        const result = await response.json();
        if (result.code === 200) {
          setList(groupTasksByStatus(result.data));
        } else {
          // do something later
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    })()
  }, [date, loading]);

  return (
    <View style={styles.container}>
      <ConfirmationModal visible={modalVisible} message="Are you sure you want to delete?" setVisible={setModalVisible}/>
      <Loader loading={loading}/>
      {isShowed &&
        <DateTimePicker
          mode="date"
          value={date}
          onChange={(event, date) => {
            setShow(false);
            if (date == null) return;
            setDate(new Date((new Date(date).toDateString())).getTime());
            setDates(getDaysInMonth(date.getMonth(), date.getFullYear()));
            setCurrentIndex(getDateIndex(getDaysInMonth(date.getMonth(), date.getFullYear()), date.toDateString()) + 2);
            refDateFlatlist.current.scrollToIndex({index: getDateIndex(getDaysInMonth(date.getMonth(), date.getFullYear()), date.toDateString()) - 2 > 0 ? getDateIndex(getDaysInMonth(date.getMonth(), date.getFullYear()), date.toDateString()) : 0})
          }}
        />
      }
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Tasks
          </Text>
          <Image
            style={[styles.avatar, {backgroundColor: COLORS.WHITE}]}
            source={require('../../../../assets/kid-avatar.png')}
          />
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <TouchableOpacity 
            style={styles.monthPicker}
            onPress={() => {setShow(true)}}
          >
            <Text style={{fontSize: wp("6%"), fontFamily: "AcuminBold", color: COLORS.BLACK}}>
              {new Date(date).toDateString().split(" ")[1] + " " + new Date(date).toDateString().split(" ")[3]}
            </Text>
            <Icon
              name="keyboard-arrow-down"
              type="material"
              color={COLORS.BLACK}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnAddTask}
            onPress={() => {props.navigation.navigate("CreateTask", {date: date})}}
          >
            <Icon
              name="add"
              type="material"
              color={COLORS.WHITE}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.dateList}>
          <FlatList
            data={dates}
            renderItem={({item, index}) => DateItem(item, index, currentIndex, refDateFlatlist, setCurrentIndex, setDate, setLoading)}
            keyExtractor={item => item.year + item.month + item.day}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <Text style={{marginRight: wp("2%")}}></Text>}
            ref={refDateFlatlist}
            initialNumToRender={31}
            onLayout={() => {
              refDateFlatlist.current.scrollToIndex({index: currentDateIndex - 2 > 0 ? currentDateIndex - 2 : 0});
            }}
            // onMomentumScrollEnd={({nativeEvent}) => {
            //   handleScroll(nativeEvent.contentOffset.x);
            // }}
          />
        </View>
      </View>
      <TaskBoard list={list} refresh={setLoading} confirm={setModalVisible}/>
    </View>
  );
};


export default TaskScreen;