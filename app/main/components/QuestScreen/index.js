import React, { useContext, useEffect, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  View,
  Text,
  Image,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { badgesList, COLORS, PORT } from "../../../const/const";
import { Icon } from "react-native-elements";
import styles from "./styles/index.css";
import { Loader } from "../../../utils/loader";
import { handleError } from "../../../utils/handleError";
import { fetchWithTimeout } from "../../../utils/fetch";
import AvatarContainer from "../AvatarContainer";

const categories = [
  {
    title: "Housework",
    name: "broom",
    type: "material-community",
    color: COLORS.YELLOW,
  },
  {
    title: "Education",
    name: "school",
    type: "material",
    color: COLORS.STRONG_CYAN,
  },
  { title: "Skills", name: "toys", type: "material", color: COLORS.GREEN },
];

const handleShowTime = (time) => {
  const tmp = time ? time.split(":") : "00:00:00".split(":");
  return tmp[0] + ":" + tmp[1];
};

const handleShowCategory = (category) => {
  return categories.find((item) => item.title === category);
};

const QuestBoard = ({ list, setLoading, navigation }) => {
  const [tabs, setTabs] = useState([
    { title: "In Progress", active: true },
    { title: "Finished", active: false },
  ]);

  const toggleTab = (tabIndex) => {
    let tmp = [...tabs];
    tmp.map((value, index) => {
      index === tabIndex ? (value.active = true) : (value.active = false);
    });
    setTabs(tmp);
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: hp("2%"),
        }}
      >
        {tabs.map((value, index) => {
          return value.active ? (
            <TouchableOpacity key={index} style={styles.tabActive}>
              <Text style={[styles.tabText, styles.tabTextActive]}>
                {value.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={index}
              onPress={() => {
                toggleTab(index);
              }}
            >
              <Text style={styles.tabText}>{value.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.questBoard}>
        {(tabs[0].active && list[0] && list[0].length == 2) ||
        (tabs[1].active && list[1] && list[1].length == 2) ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "80%",
            }}
          >
            <Text
              style={{
                fontFamily: "Acumin",
                fontSize: 16,
                color: COLORS.STRONG_CYAN,
              }}
            >
              Current quest list is empty.
            </Text>
          </View>
        ) : (
          <FlatList
            data={tabs[0].active ? list[0] : list[1]}
            renderItem={({ item, index }) =>
              QuestItem(item, index, setLoading, navigation)
            }
            ItemSeparatorComponent={() => (
              <View style={{ margin: "2%" }}></View>
            )}
            keyExtractor={(item) => item.questId + ""}
            showsVerticalScrollIndicator={false}
            numColumns={2}
          />
        )}
      </View>
    </>
  );
};

// represent an item in task list
const QuestItem = (item, index, setLoading, navigation) => {
  return (
    item.questId ? (
      <TouchableOpacity
        style={[styles.questItem, { 
          borderColor: item.status === "DONE" ? COLORS.GREEN :
                       item.status === "FAILED" ? COLORS.RED :
                       "black",
          width: item.status !== "DONE" && item.status !== "FAILED" && index === 0 ? wp("85%") : wp("40%")
        }]}
        onPress={() => {
          navigation.navigate("QuestDetails", {
            questId: item.questId,
            onGoBack: () => setLoading(true),
          });
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            margin: wp("3%"),
            height: "90%"
          }}
        >
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <View style={{maxWidth: "80%"}}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "AcuminBold",
                  color: COLORS.BLACK,
                }}
              >
                {item.name}
              </Text>
            </View>
            { 
              item.status === "DONE" &&
              <Icon
                name="check-circle"
                type="material"
                color={COLORS.GREEN}
              />
            }
            {
              item.status === "FAILED" &&
              <Icon
                name="cancel"
                type="material"
                color={COLORS.RED}
              />
            }
          </View>
          <Image
            source={badgesList[item.reward - 1].image}
            style={{
              width: wp("21%"),
              height: wp("21%"),
              marginLeft: -wp("2%")
            }}
          />
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={[styles.questItem, {borderWidth: 0, backgroundColor: "transparent"}]}/>
    )
  );
};

const QuestScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [children, setChildren] = useState(props.route.params.children);
  const [currentChild, setCurrentChild] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // group quests by status
  const groupQuestsByStatus = (list) => {
    const tmp = list.reduce((r, a) => {
      r[a.status] = [...(r[a.status] || []), a];
      return r;
    }, {});
    const assigned = tmp.ASSIGNED ? tmp.ASSIGNED : [];
    const handed = tmp.HANDED ? tmp.HANDED : [];
    const done = tmp.DONE ? tmp.DONE : [];
    const failed = tmp.FAILED ? tmp.FAILED : [];
    const inProgress = [assigned, handed].reduce(
      (accumulator, currentValue) => {
        return accumulator.concat(currentValue);
    }, []);
    const finished = [done, failed].reduce((accumulator, currentValue) => {
      return accumulator.concat(currentValue);
    }, []);
    inProgress.splice(1, 0, {}); // for the first quest to be bigger, not losing the 2nd quest
    inProgress.push({}, {}); // for better UI
    finished.push({}, {}); // for better UI
    return [inProgress, finished];
  };

  useEffect(() => {
    (async () => {
      try {
        const ip = await AsyncStorage.getItem("IP");
        const childId = await AsyncStorage.getItem('child_id');
        const response = await fetchWithTimeout(
          "http://" + ip + PORT + "/quest/list/" + childId
        );
        const result = await response.json();
        if (result.code === 200) {
          setList(groupQuestsByStatus(result.data));
          setChildren(children);
          setCurrentChild(childId);
        } else {
          // do something later
        }
      } catch (error) {
        handleError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [loading]);

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Quests</Text>
        </View>
      </View>
      <View style={styles.circle}/>
      <QuestBoard
        list={list}
        setLoading={setLoading}
        navigation={props.navigation}
      />
      <TouchableOpacity
        style={styles.btnAddQuest}
        onPress={() => {
          props.navigation.navigate("QuestCreating", {
            onGoBack: () => {
              setLoading(true);
            },
          });
        }}
      >
        <Icon name="add" type="material" color={COLORS.WHITE} />
      </TouchableOpacity>
      <AvatarContainer children={children} setChildren={setChildren} setLoading={setLoading}/>
    </View>
  );
};

export default QuestScreen;
