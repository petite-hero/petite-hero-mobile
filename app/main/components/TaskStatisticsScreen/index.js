import AsyncStorage from '@react-native-community/async-storage';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, Animated, TouchableOpacity, Easing, Image } from 'react-native';
import ButtonSave from '../../../base/components/ButtonSave';
import Header from '../../../base/components/Header';
import { COLORS, PORT } from '../../../const/const';
import { fetchWithTimeout } from '../../../utils/fetch';
import { showMessage } from '../../../utils/showMessage';
import { Loader } from '../../../utils/loader';
import StatisticsComponent from './StatisticsComponent';
import styles from './styles/index.css'
import { heightPercentageToDP } from 'react-native-responsive-screen';

const TaskStatisticsScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [data, setData] = useState("");
  const [maxTasks, setMaxTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [daysToGetTask, setDaysToGetTask] = useState(30);

  const animDropdown = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;

  const dropdownSubItems = () => {
    setDropdown(!dropdown);
    if (!dropdown) {
      Animated.timing(animDropdown, {
        toValue: heightPercentageToDP("5%"),
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false
      }).start();
      Animated.timing(animOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(animDropdown, {
        toValue: 0,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false
      }).start();
      Animated.timing(animOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false
      }).start();
    }
  };


  const getData = async() => {
    try {
      const ip = await AsyncStorage.getItem("IP");
      const childId = await AsyncStorage.getItem('child_id');
      const startTime = new Date().setDate(new Date().getDate() - daysToGetTask);
      const endTime = new Date().getTime();
      const response = await fetchWithTimeout("http://" + ip + PORT + "/task/" + childId + "/summary?end=" + endTime + "&start=" + startTime);
      const result = await response.json();
      if (result.code === 200) {
        setData(result.data);
        setMaxTasks(Math.max(...[
          data.houseworkTasks && data.houseworkTasks.taskDone || 0, data.houseworkTasks && data.houseworkTasks.taskFailed || 0, 
          data.educationTasks && data.educationTasks.taskDone || 0, data.educationTasks && data.educationTasks.taskFailed || 0,
          data.skillsTasks && data.skillsTasks.taskDone || 0, data.skillsTasks && data.skillsTasks.taskFailed || 0
        ]));
        setLoading(false);
      } else {
        showMessage(result.msg);
        props.navigation.goBack();  
      }
    } catch (error) {
      showMessage(error);
      props.navigation.goBack();
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    getData();
  }, [daysToGetTask])

  return (
    loading ? <Loader loading={true}/>
    :
    <View style={styles.container}>
      <Loader loading={loadingData}/>
      <Header navigation={props.navigation} title={t("task-statistics-title")}/>
      <TouchableOpacity activeOpacity={1} style={{
        left: "55%",
        width: "35%",
        height: heightPercentageToDP("10%"),
        borderRadius: 10
      }}
        onPressOut={() => {dropdownSubItems()}}
      >
        <View style={{
          width: "100%",
          height: heightPercentageToDP("5%"),
          borderRadius: 10,
          borderBottomLeftRadius: dropdown ? 0 : 10,
          borderBottomRightRadius: dropdown ? 0 : 10,
          backgroundColor: COLORS.WHITE,
          elevation: 10
        }}>
          <View style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: COLORS.STRONG_CYAN
          }}>
            <Text style={{
              maxWidth: "70%",
              fontSize: 14,
              fontFamily: "AcuminBold",
              color: COLORS.STRONG_CYAN,
              marginLeft: "10%"
            }}>
              {daysToGetTask === 30 ? t("task-statistics-30-days") :  t("task-statistics-7-days")}
            </Text>
            <Image
              source={dropdown ? require("../../../../assets/icons/up-blue.png") : require("../../../../assets/icons/down-blue.png")}
              style={{width: 30, height: 30, marginRight: "5%"}}
            />
          </View>
        </View>
        <Animated.View style={{
          width: "100%",
          height: animDropdown,
          opacity: animOpacity,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          backgroundColor: COLORS.WHITE,
          elevation: 10
        }}>
          <TouchableOpacity style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
          }}
            onPressOut={() => {setLoadingData(true); setDaysToGetTask(daysToGetTask === 30 ? 7 : 30)}}
          >
            <Text style={{
              maxWidth: "70%",
              fontSize: 14,
              fontFamily: "AcuminBold",
              color: COLORS.BLACK,
              marginLeft: "10%"
            }}>
              {daysToGetTask === 30 ? t("task-statistics-7-days") :  t("task-statistics-30-days")}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
      <StatisticsComponent
        maxTasks={maxTasks}
        data={[
          data.houseworkTasks && data.houseworkTasks.taskDone || 0, data.houseworkTasks && data.houseworkTasks.taskFailed || 0, 
          data.educationTasks && data.educationTasks.taskDone || 0, data.educationTasks && data.educationTasks.taskFailed || 0,
          data.skillsTasks && data.skillsTasks.taskDone || 0, data.skillsTasks && data.skillsTasks.taskFailed || 0
        ]}
      />
      <ButtonSave title={"OK"} action={() => {props.navigation.goBack()}} style={{marginTop: "20%"}} />
    </View>
  )
}

export default TaskStatisticsScreen;