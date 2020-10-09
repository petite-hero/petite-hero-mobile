import React, { useContext, useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { SafeAreaView, View, Text, Image, Animated } from 'react-native';
import styles from './styles/index.css';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-calendars';
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
      elevation: 10
    }}
  />
  ) : (true)
)

const Date = ({ title, index, scrollX }) => {
  const width = wp("13%");
  const inputRange = [(index - 2) * width, (index - 1) * width, index * width, (index + 1) * width, (index + 2) * width];
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0, 0, 1, 0, 0]
  })

  return (
  <Animated.View>
    {title.date === "14" ? (
      <TouchableOpacity style={[styles.dateContainer, styles.dateActiveContainer]}>
        <View style={styles.dateActive}>
          <Text style={[styles.dateText, styles.dateTextActive]}>{title.date}</Text>
        </View>
        <Text style={styles.dateText}>{title.dayOfWeek}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={styles.dateContainer}>
        <Text style={styles.dateText}>{title.date}</Text>
      </TouchableOpacity>
    )}
  </Animated.View>
  );
};

const Task = ({ title }) => (
  <TouchableOpacity style={styles.taskItem}>
  </TouchableOpacity>
);

const Tabs = () => {
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
    tabs.map((value, index) => {
      return (
        value.active ? (
          <TouchableOpacity key={index} style={styles.tabActive}>
            <Text style={[styles.tabText, styles.tabTextActive]}>{value.title}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity key={index} onPress={() => toggleTab(index)}>
            <Text style={styles.tabText}>{value.title}</Text>
          </TouchableOpacity>
        ));
    })
  );
};

const TaskScreen = (props) => {
  const { t } = useContext(props.route.params.locale);
  const [isShowed, setShowed] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;


  const DateItem = ({ item, index }) => {
    return (
      <Date title={item.title} index={index} scrollX={scrollX}/>
    )
  };

  const TaskItem = ({ item }) => (
    <Task title={item.title}/>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image
            style={[styles.avatar, {backgroundColor: COLORS.WHITE}]}
            // source={{uri: "https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.15752-9/118881393_430697914571214_4949863648741553269_n.jpg?_nc_cat=107&_nc_sid=ae9488&_nc_ohc=CRL20t0CXSoAX-UGsNg&_nc_ht=scontent.fsgn2-3.fna&oh=8a78db6a5556a3e8d4039464250d0c91&oe=5F91B50E"}}
          />
          <Text style={styles.title}>
            Tasks
          </Text>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <TouchableOpacity 
            style={styles.monthPicker}
            onPress={() => {setShowed(!isShowed)}}
          >
            <Text style={{fontSize: wp("6%"), fontWeight: "bold", color: COLORS.WHITE}}>Dec 2020</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{fontSize: wp("6%"), fontWeight: "bold", color: COLORS.WHITE, marginRight: wp("10%")}}>
              {`Today`}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateList}>
          <Animated.FlatList
            data={DATA}
            renderItem={DateItem}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{nativeEvent: { contentOffset: { x: scrollX }}}],
              { useNativeDriver: true}
            )}
          />
        </View>
        <View style={{alignItems: "flex-end"}}>
          <TouchableOpacity style={styles.btnAddTask}>
            <Text style={styles.txtAddTask}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: hp("3%")}}>
        <Tabs/>
      </View>
      <View style={styles.taskBoard}>
        <FlatList
          data={DATA}
          renderItem={TaskItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <CalendarPicker isShowed={isShowed}/>
    </SafeAreaView>
  );
};


export default TaskScreen;