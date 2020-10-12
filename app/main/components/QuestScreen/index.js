import React, { useContext, useState } from 'react';
import { SafeAreaView, View, Text, Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import styles from './styles/index.css';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../../../const/const';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const DATA = [
  {
    id: "3",
    title: "Get 8 points at Math",
    time: "13:00 - 17:00",
    status: "Undone",
    date: "2020/10/12"
  },
  {
    id: "4",
    title: "Get 8 points at Math",
    time: "13:00 - 17:00",
    status: "Undone",
    date: "2020/10/12"
  },
  {
    id: "5",
    title: "Get 8 points at Math",
    time: "13:00 - 17:00",
    status: "Undone",
    date: "2020/10/11"
  },
  {
    id: "6",
    title: "Get 8 points at Math",
    time: "13:00 - 17:00",
    status: "Undone",
    date: "2020/10/11"
  }
]

const DATA_1 = [
  {
    id: "1",
    title: "Get 8 points at Math",
    time: "13:00 - 17:00",
    status: "Coming",
    date: "2020/10/14"
  },
  {
    id: "2",
    title: "Get 8 points at Math",
    time: "13:00 - 17:00",
    status: "Coming",
    date: "2020/10/14"
  }
]

const QuestBoard = () => {
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
          data={tabs[0].active ? DATA_1 : DATA}
          renderItem={QuestItem}
          keyExtractor={item => item.id}
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
      fontWeight: "bold"
    }}>
      {item.title}
    </Text>
  </TouchableOpacity>
)

const QuestScreen = (props) => {
  const { t } = useContext(props.route.params.locale);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
            <Image
              style={[styles.avatar, {backgroundColor: COLORS.WHITE}]}
              // source={{uri: "https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.15752-9/118881393_430697914571214_4949863648741553269_n.jpg?_nc_cat=107&_nc_sid=ae9488&_nc_ohc=CRL20t0CXSoAX-UGsNg&_nc_ht=scontent.fsgn2-3.fna&oh=8a78db6a5556a3e8d4039464250d0c91&oe=5F91B50E"}}
            />
            <Text style={styles.title}>
              Quests
            </Text>
        </View>
        <View style={{alignItems: "flex-end"}}>
          <TouchableOpacity style={styles.btnAddQuest}>
            <Text style={styles.txtAddQuest}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <QuestBoard/>
    </SafeAreaView>
  );
};


export default QuestScreen;