import React, { useContext, useEffect, useRef, useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { View, Text, Image, FlatList, TouchableOpacity, AppState } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { badgesList, COLORS, PORT } from "../../../const/const";
import styles from "./styles/index.css";
import { Loader } from "../../../utils/loader";
import { showMessage } from "../../../utils/showMessage";
import { fetchWithTimeout } from "../../../utils/fetch";
import AvatarContainer from "../AvatarContainer";
import { ImageBackground } from "react-native";

const QuestBoard = ({ t, list, setLoading, navigation }) => {
  const [tabs, setTabs] = useState([
    { title: t("quest-status-in-progress"), active: true },
    { title: t("quest-status-finished"), active: false },
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
        {(tabs[0].active && list[0] && list[0].length == 3) ||
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
                color: COLORS.BLACK,
              }}
            >
              {t("quest-empty-1")} {tabs[0].active ? t("quest-status-in-progress").toLowerCase() : t("quest-status-finished").toLowerCase()} {t("quest-empty-2")}
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
                       badgesList[item.reward - 1].borderColor,
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
              <Image
                source={require("../../../../assets/icons/done.png")}
                style={{width: 30, height: 30}}
              />
            }
            {
              item.status === "FAILED" &&
              <Image
                source={require("../../../../assets/icons/failed.png")}
                style={{width: 30, height: 30}}
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
  const [children, setChildrenUseState]     = useState([]);
  const childrenRef                         = useRef(children);  // use reference for listeners to use
  const setChildren = (newChildren) => {childrenRef.current = newChildren; setChildrenUseState(newChildren);}
  const [childId, setChildIdUseState]       = useState("");
  const childIdRef                          = useRef(childId);  // use reference for listeners to use
  const setChildId = (newChildId) => {childIdRef.current = newChildId; setChildIdUseState(newChildId);}
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

  const getListOfQuest = async() => {
    try {
      const ip = await AsyncStorage.getItem("IP");
      const childId = await AsyncStorage.getItem('child_id');
      const response = await fetchWithTimeout(
        "http://" + ip + PORT + "/quest/list/" + childId
      );
      const result = await response.json();
      if (result.code === 200) {
        setList(groupQuestsByStatus(result.data));
      } else {
        // do something later
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const getListOfChildren = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem('user_id');
      const childId = await AsyncStorage.getItem('child_id');
      const response = await fetch("http://" + ip + PORT + "/parent/" + id + "/children");
      const result = await response.json();
      if (result.code === 200) {
        const tmp = result.data.filter(child => child.isCollaboratorChild === false || (child.isCollaboratorChild === true && child.isConfirm === true));
        setChildren(tmp);
        if (!childId) await AsyncStorage.setItem('child_id', result.data[0].childId + "");
        else {
          let isInChildren = false;
          result.data.map((child, index) => {
            if (childId == child.childId) isInChildren = true;
          });
          if (!isInChildren) await AsyncStorage.setItem('child_id', result.data[0].childId + "");
        }
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const listenChildIdChanged = () => {
    props.navigation.addListener('focus', handleChildIdChanged);
    AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") handleChildIdChanged();
    });
  }
  
  const handleChildIdChanged = async () => {
    getListOfChildren();
    const childIdTmp = await AsyncStorage.getItem('child_id');
    if (childIdTmp != childIdRef.current) {
      setLoading(true);
      setChildId(childIdTmp);
      setChildren([...childrenRef.current]);
    }
  }

  useEffect(() => {
    listenChildIdChanged();
  }, []);

  useEffect(() => {
    getListOfQuest();
    getListOfChildren();
  }, [loading]);

  return (
    // <View style={styles.container}>
    <ImageBackground source={require("../../../../assets/quest-background/quest.png")} style={{
      width: "100%",
      height: "100%"
    }}>
      <Loader loading={loading} />
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t("quest-title")}</Text>
        </View>
      </View>
      <View style={styles.circle}/>
      <QuestBoard
        t={t}
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
        <Image
          source={require("../../../../assets/icons/add.png")}
          style={{width: 30, height: 30}}
        />
      </TouchableOpacity>
      <AvatarContainer children={children} setChildren={handleChildIdChanged} setLoading={setLoading}/>
    {/* </View> */}
    </ImageBackground>
  );
};

export default QuestScreen;
