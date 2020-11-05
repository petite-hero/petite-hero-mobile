import React, { useContext, useEffect, useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { View, Text, Image, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import { badgesList, COLORS, PORT } from '../../../const/const';
import { Icon } from 'react-native-elements';
import styles from './styles/index.css';
import { Loader } from '../../../utils/loader';
import { handleError } from '../../../utils/handleError';
import { fetchWithTimeout } from '../../../utils/fetch';

const categories = [
  {title: "Housework", name: "broom", type: "material-community", color: COLORS.YELLOW},
  {title: "Education", name: "school", type: "material", color: COLORS.STRONG_CYAN},
  {title: "Skills", name: "toys", type: "material", color: COLORS.GREEN}
];

const handleShowTime = (time) => {
  const tmp = time ? time.split(":") : "00:00:00".split(":");
  return tmp[0] + ":" + tmp[1];
}

const handleShowCategory = (category) => {
  return categories.find(item => item.title === category);
}

const QuestBoard = ({ list, setLoading, navigation }) => {
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
        marginTop: hp("2%")}}
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
      <View style={styles.questBoard}>
        { (tabs[0].active && list[0] && list[0].length == 0) || (tabs[1].active && list[1] && list[1].length == 0) ?
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              height: "80%"
            }}>
              <Text style={{
                fontFamily: "Acumin",
                fontSize: 16,
                color: COLORS.STRONG_CYAN
              }}>
                Current quest list is empty.
              </Text>
            </View>
          :
            <FlatList
              data={tabs[0].active ? list[0] : list[1]}
              renderItem={({item, index}) => QuestItem(item, index, setLoading, navigation)}
              ItemSeparatorComponent={() => <View style={{margin: "2%"}}></View>}
              keyExtractor={item => item.questId + ""}
              showsVerticalScrollIndicator={false}
              numColumns={2}
            />
        }
      </View>
    </>
  );
};

// represent an item in task list
const QuestItem = (item, index, setLoading, navigation) => {
  return (
    item &&
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between"
      }}
    >
      <TouchableOpacity 
        style={styles.questItem}
        onPress={() => {navigation.navigate("QuestDetails", {questId: item.questId, onGoBack: () => setLoading(true)})}}
      >
        <View style={{
          marginTop: "10%",
          marginLeft: "10%",
          marginRight: "10%"
        }}>
          <Image
            source={badgesList[item.questBadgeId - 1].image}
            style={{
              width: wp("15%"),
              height: wp("15%")
            }}
          />
          <Text style={{
            fontSize: 20,
            fontFamily: "AcuminBold", 
            color: COLORS.BLACK
          }}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// represent an item in date list
const BadgeItem = (item, index) => {
  return (
    <View key={index}>
      <TouchableOpacity style={styles.badgeContainer}>
        <Text style={styles.dateText}>{item.dayOfWeek}</Text>
        <Text style={styles.dateNum}>{item.day}</Text>
      </TouchableOpacity>
    </View>
  )
};

const QuestScreen = (props) => {
  const { t }                       = useContext(props.route.params.localizationContext);
  const [list, setList]             = useState([]);
  const [loading, setLoading]       = useState(false);

  // group quests by status
  const groupQuestsByStatus = (list) => {
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
        const response = await fetchWithTimeout("http://" + ip + PORT + "/quest/list/1");
        const result = await response.json();
        if (result.code === 200) {
          setList(groupQuestsByStatus(result.data));
        } else {
          // do something later
        }
      } catch (error) {
        handleError(error.message);
      } finally {
        setLoading(false);
      }
    })()
  }, [loading]);

  return (
    <View style={styles.container}>
      {/* <ConfirmationModal visible={modalVisible} message="Are you sure you want to delete?" setVisible={setModalVisible}/> */}
      <Loader loading={loading}/>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Quests
          </Text>
          <Image
            style={[styles.avatar, {backgroundColor: COLORS.WHITE}]}
            source={require('../../../../assets/kid-avatar.png')}
          />
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <TouchableOpacity 
            style={styles.monthPicker}
          >
            <Text style={{fontSize: 20, fontFamily: "AcuminBold", color: COLORS.BLACK}}>
              Badge Library
            </Text>
            <Icon
              name="keyboard-arrow-down"
              type="material"
              color={COLORS.BLACK}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="add"
              type="material"
              color={COLORS.WHITE}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.dateList}>
          {/* <FlatList
            data={dates}
            renderItem={({item, index}) => BadgeItem(item, index)}
            keyExtractor={item => item.year + item.month + item.day}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <Text style={{marginRight: wp("2%")}}></Text>}
            initialNumToRender={6}
          /> */}
        </View>
      </View>
      <QuestBoard list={list} setLoading={setLoading} navigation={props.navigation}/>
      <TouchableOpacity
        style={styles.btnAddQuest}
        onPress={() => {props.navigation.navigate("CreateQuest", {onGoBack: () => {setLoading(true)}})}}
      >
        <Icon
          name="add"
          type="material"
          color={COLORS.WHITE}
        />
      </TouchableOpacity>
    </View>
  );
};


export default QuestScreen;