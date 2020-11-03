import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import styles from './styles/index.css';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { AsyncStorage } from 'react-native';
import { COLORS, IP, PORT } from '../../../const/const';
import { Icon } from 'react-native-elements';

const QuestBoard = () => {
  const [list, setList] = useState([]);
  const [tabs, setTabs] = useState(
    [
      {title: "In Progress", active : true},
      {title: "Finished", active : false}
    ]
  );

  const groupQuestsByStatus = (list) => {
    let tmp = list.reduce((r, a) => {
      r[a.progress == a.criteria] = [...r[a.progress == a.criteria] || [], a];
      return r;
    }, {})
    return Object.values(tmp);
  }

  useEffect(() => {
    (async() => {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetch('http://' + ip + PORT + '/quest/list/3');
      const result = await response.json();
      if (result.code === 200) {
        setList(groupQuestsByStatus(result.data));
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
            ));
        })}
      </View>
      <View style={styles.questBoard}>
        <FlatList
          data={tabs[0].active ? list[0] : list[1]}
          renderItem={QuestItem}
          keyExtractor={item => item.questId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center"
          }}
          numColumns={2}
        />
      </View>
    </>
  );
};

const QuestItem = ({ item }) => (
  <TouchableOpacity style={styles.questItem}>
    <Text style={{
      fontSize: hp("3%"),
      fontFamily: "AcuminBold"
    }}>
      {item.name}
    </Text>
  </TouchableOpacity>
)

const QuestScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
            <Image
              style={[styles.avatar, {backgroundColor: COLORS.WHITE}]}
              source={require('../../../../assets/kid-avatar.png')}
            />
            <Text style={styles.title}>
              Quests
            </Text>
        </View>
        <View style={{alignItems: "flex-end"}}>
          <TouchableOpacity style={styles.btnAddQuest}>
            <Icon
              name="add"
              type="material"
              color={COLORS.STRONG_CYAN}
            />
          </TouchableOpacity>
        </View>
      </View>
      <QuestBoard/>
    </View>
  );
};


export default QuestScreen;