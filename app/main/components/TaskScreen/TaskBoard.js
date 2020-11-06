import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';
import TaskItem from './TaskItem';

const TaskBoard = ({ list, refresh, confirm, navigation }) => {
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
      <View style={styles.tabs}>
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
        { (tabs[0].active && list[0] && list[0].length == 0) || (tabs[1].active && list[1] && list[1].length == 0) ?
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              height: "80%"
            }}>
              <Text style={[styles.fontAcumin, styles["fs-16"], {color: COLORS.STRONG_CYAN}]}>
                There is no current tasks on this day.
              </Text>
            </View>
          :
            <View style={{
              borderRadius: 40,
              overflow: "hidden"
            }}>
              <FlatList
                data={tabs[0].active ? list[0] : list[1]}
                renderItem={({item, index}) => TaskItem(item, index, refresh, confirm, navigation)}
                keyExtractor={item => item.taskId + ""}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  alignItems: "center"
                }}
              />
            </View>
        }
      </View>
    </>
  );
};

export default TaskBoard;