import React, { useContext } from 'react';
import { SafeAreaView, View, Text, Image } from 'react-native';
import styles from './styles/index.css';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
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
]

const Date = ({ title }) => (
  title.date === "12" ? (
    <TouchableOpacity style={[styles.dateContainer, styles.dateActive]}>
      <Text style={[styles.dateText, styles.dateTextActive]}>{title.date}</Text>
      <Text style={[styles.dateText, styles.dateTextActive]}>{title.dayOfWeek}</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.dateContainer}>
      <Text style={styles.dateText}>{title.date}</Text>
      <Text style={styles.dateText}>{title.dayOfWeek}</Text>
    </TouchableOpacity>
  )
);

const QuestScreen = (props) => {
  const { t } = useContext(props.route.params.locale);

  const renderItem = ({ item }) => (
    <Date title={item.title} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={[styles.avatar, {backgroundColor: COLORS.STRONG_ORANGE}]}
          // source={{uri: "https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.15752-9/118881393_430697914571214_4949863648741553269_n.jpg?_nc_cat=107&_nc_sid=ae9488&_nc_ohc=CRL20t0CXSoAX-UGsNg&_nc_ht=scontent.fsgn2-3.fna&oh=8a78db6a5556a3e8d4039464250d0c91&oe=5F91B50E"}}
        />
        <TouchableOpacity style={styles.monthPicker}>
          <Text>September</Text>
          <Text style={{fontWeight: "bold"}}>2020</Text>
        </TouchableOpacity>
        <View style={styles.dateList}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Quests
        </Text>
        <TouchableOpacity style={styles.btnAddQuest}>
          <Text style={styles.txtAddQuest}>
            +
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.questBoard}>
        {/* <Image
            style={styles.questItem}
            source={{uri: "https://jooinn.com/images/white-11.jpg"}}
        />
        <Image 
            style={styles.questItem}
            source={{uri: "https://jooinn.com/images/white-11.jpg"}}
        />
        <Image 
            style={styles.questItem}
            source={{uri: "https://jooinn.com/images/white-11.jpg"}}
        />
        <Image 
            style={styles.questItem}
            source={{uri: "https://jooinn.com/images/white-11.jpg"}}
        /> */}
      </View>
    </SafeAreaView>
  );
};


export default QuestScreen;