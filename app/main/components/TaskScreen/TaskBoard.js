import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';
import TaskItem from './TaskItem';

const TaskBoard = ({ t, date, list, refresh, navigation, onDelete }) => {
  const [tabs, setTabs] = useState(
    [
      {title: t("task-status-in-progress"), active : true},
      {title: t("task-status-finished"), active : false}
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
        { (tabs[0].active && list[0] && list[0].length == 1) || (tabs[1].active && list[1] && list[1].length == 1) || (!list || list.length == 0) ?
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "10%",
              height: "80%"
            }}>
              {(!list || list.length == 0) ?
                <Text style={[styles.fontAcumin, styles["fs-16"], {color: COLORS.MEDIUM_CYAN, textAlign: "center"}]}>
                  {t("no-child-info")}
                </Text>
              :
                <Text style={[styles.fontAcumin, styles["fs-16"], {color: COLORS.MEDIUM_CYAN, textAlign: "center"}]}>
                  {t("task-empty-1")} {tabs[0].active ? tabs[0].title.toLowerCase() : tabs[1].title.toLowerCase()} {t("task-empty-2")}
                </Text>
              }
            </View>
          :
            <View style={{
              borderRadius: 20,
              overflow: "hidden"
            }}>
              <FlatList
                data={tabs[0].active ? list[0] : list[1]}
                renderItem={({item, index}) => <TaskItem t={t} date={date} item={item} index={index} refresh={refresh} navigation={navigation} onDelete={onDelete}/>}
                keyExtractor={item => item.taskId + ""}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              />
            </View>
        }
      </View>
    </>
  );
};

export default TaskBoard;