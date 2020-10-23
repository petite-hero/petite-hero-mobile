import React, { useContext, useEffect, useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { SafeAreaView, View, Text, Image } from 'react-native';
import styles from './styles/index.css';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { AsyncStorage } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import { Icon } from 'react-native-elements';

const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 1);
  const dates = [];
  while (date.getMonth() === month) {
    const tmp = new Date(date).toDateString().split(" ");
    dates.push({
      dayOfWeek: tmp[0],
      month: tmp[1],
      day: tmp[2],
      year: tmp[3]
    });
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

const getCurrentDateIndex = (dates) => {
  const date = new Date().toDateString()
  const month = date.split(" ")[1];
  const day = date.split(" ")[2];
  const year = date.split(" ")[3];
  const index = dates.findIndex(date => date.year === year && date.month === month && date.day === day);
  return index > (dates.length - 3) ? dates.length - 5 : index - 2;
}

const TaskBoard = (date) => {
  const [tabs, setTabs] = useState(
    [
      {title: "In Progress", active : true},
      {title: "Finished", active : false}
    ]
  );
  const [list, setList] = useState([]);

  const groupTasksByStatus = (list) => {
    let tmp = list.reduce((r, a) => {
      r[a.status] = [...r[a.status] || [], a];
      return r;
    }, {})
    return Object.values(tmp);
  }
  
  useEffect(() => {
    (async() => {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetch('http://' + ip + PORT + '/task/list/3?date=1603375784000');
      const result = await response.json();
      if (result.code === 200) {
        setList(groupTasksByStatus(result.data));
      } else {
        
      }
    })()
  }, []);

  const toggleTab = (tabIndex) => {
    let tmp = [...tabs];
    tmp.map((value, index) => {
      index === tabIndex ? value.active = true : value.active = false;
    });
    setTabs(tmp);
  }

  return (
    <>
      <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: hp("3%")}}>
        {tabs.map((value, index) => {
          return (
            value.active ? (
              <TouchableOpacity key={index} style={styles.tabActive}>
                <Text style={[styles.tabText, styles.tabTextActive]}>{value.title}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity key={index} onPress={() => toggleTab(index)}>
                <Text style={styles.tabText}>{value.title}</Text>
              </TouchableOpacity>
            )
          )
        })}
      </View>
      <View style={styles.taskBoard}>
        <FlatList
          data={tabs[0].active ? list[0] : list[1]}
          renderItem={TaskItem}
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
const TaskItem = ({ item }) => (
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
        <Text style={{fontSize: hp("2.5%"), fontFamily: "AcuminBold"}}>
          {item.name}
        </Text>
      </View>
      <View style={{
        width: wp("20%"),
        height: hp("2.5%"),
        borderRadius: hp("0.5%"),
        backgroundColor: item.status === "Undone" ? COLORS.RED : COLORS.STRONG_ORANGE,
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
    <View style={{marginLeft: wp("5%"), fontSize: hp("2.5%"), fontFamily: "Acumin",marginTop: 10}}>
      <Text>{item.time}</Text>
    </View>
  </TouchableOpacity>
);

// represent an item in date list
const DateItem = (item, index, currentIndex, refDateFlatlist, setCurrentIndex) => {
  return (
    // <Date title={item.title} index={index}/>
    <View style={styles.dateContainer}>
      {index !== currentIndex ?
        (<TouchableOpacity style={styles.dateInactiveContainer}
          onPress={() => {
            refDateFlatlist.current.scrollToIndex({index: index - 2 > 0 ? index - 2 : 0})
            setCurrentIndex(index);
          }}>
          <Text style={styles.dateText}>{item.day}</Text>
        </TouchableOpacity>)
      : (<TouchableOpacity style={styles.dateActiveContainer}>
          <View style={styles.dateActive}>
            <Text style={[styles.dateText, styles.dateTextActive]}>{item.day}</Text>
          </View>
          <Text style={styles.dateText}>{item.dayOfWeek}</Text>
        </TouchableOpacity>)}
    </View>
  )
};

const TaskScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [isShowed, setShowed] = useState(false);
  const [date, setDate] = useState(new Date().toDateString());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const refDateFlatlist = useRef(null);
  const dates = getDaysInMonth(month, year);
  //
  const currentDateIndex = getCurrentDateIndex(dates) + 2;
  const [currentIndex, setCurrentIndex] = useState(currentDateIndex);
  // check valid index
  const isValidIndex = (index, length) => {
    return !(index < 0 || index >= length);
  }

  // handle scroll event of date list
  const handleScroll = (contentOffset) => {
    if(refDateFlatlist.current) {
      const width = wp("16.8%"); // item width + margin
      let nextIndex;
      nextIndex = Math.round(contentOffset / width);
      if (isValidIndex(nextIndex, dates.length)) {
        refDateFlatlist.current.scrollToIndex({ animated: true, index: nextIndex });
        setCurrentIndex(nextIndex + 2);
      } else {
        // do nothing
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image
            style={[styles.avatar, {backgroundColor: COLORS.WHITE}]}
            source={require('../../../../assets/kid-avatar.png')}
          />
          <Text style={styles.title}>
            Tasks
          </Text>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <TouchableOpacity 
            style={styles.monthPicker}
          >
            <Text style={{fontSize: wp("6%"), fontFamily: "AcuminBold", color: COLORS.WHITE}}>
              Oct 2020
            </Text>
          </TouchableOpacity>
          { 
            currentIndex !== (currentDateIndex) &&
            <TouchableOpacity 
              onPress={() => {
                refDateFlatlist.current.scrollToIndex({index: (currentDateIndex - 2)})
                setCurrentIndex(currentDateIndex);
              }}>
              <Text style={{fontSize: wp("6%"), fontFamily: "AcuminBold", color: COLORS.WHITE, marginRight: wp("10%")}}>
                Today
              </Text>
            </TouchableOpacity>
          }
        </View>
        <View style={styles.dateList}>
          <FlatList
            data={dates}
            renderItem={({item, index}) => DateItem(item, index, currentIndex, refDateFlatlist, setCurrentIndex)}
            keyExtractor={item => item.year + item.month + item.day}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <Text style={{marginRight: wp("3.8%")}}></Text>}
            ref={refDateFlatlist}
            initialNumToRender={31}
            onLayout={() => {
              refDateFlatlist.current.scrollToIndex({index: currentDateIndex - 2})
            }}
            onMomentumScrollEnd={({nativeEvent}) => {
              handleScroll(nativeEvent.contentOffset.x);
            }}
          />
        </View>
        <View style={{alignItems: "flex-end"}}>
          <TouchableOpacity
            style={styles.btnAddTask}
            onPress={() => {props.navigation.navigate("CreateTask")}}
          >
            <Icon
              name="add"
              type="material"
              color={COLORS.STRONG_ORANGE}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TaskBoard/>
    </SafeAreaView>
  );
};


export default TaskScreen;