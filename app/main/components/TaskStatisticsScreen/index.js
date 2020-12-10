import AsyncStorage from '@react-native-community/async-storage';
import React, { useContext, useEffect, useState } from 'react'
import { View } from 'react-native';
import ButtonSave from '../../../base/components/ButtonSave';
import Header from '../../../base/components/Header';
import { PORT } from '../../../const/const';
import { fetchWithTimeout } from '../../../utils/fetch';
import { showMessage } from '../../../utils/showMessage';
import { Loader } from '../../../utils/loader';
import StatisticsComponent from './StatisticsComponent';
import styles from './styles/index.css';

const TaskStatisticsScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(new Date().setDate(new Date().getDate() - 30));
  const [endTime, setEndTime] = useState(new Date().getTime())

  const getData = async() => {
    try {
      const ip = await AsyncStorage.getItem("IP");
      const childId = await AsyncStorage.getItem('child_id');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/task/" + childId + "/summary?end=" + endTime + "&start=" + startTime);
      const result = await response.json();
      if (result.code === 200) {
        setData(result.data);
        setLoading(false);
      } else {
        showMessage(result.msg);
        props.navigation.goBack();  
      }
    } catch (error) {
      showMessage(error);
      props.navigation.goBack();
    }
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    loading ? <Loader loading={true}/>
    :
    <View style={styles.container}>
      <Header navigation={props.navigation} title={t("task-statistics-title")}/>
      <StatisticsComponent
        data={[
          data.houseworkTasks && data.houseworkTasks.taskDone || 0, data.houseworkTasks && data.houseworkTasks.taskFailed || 0, 
          data.educationTasks && data.educationTasks.taskDone || 0, data.educationTasks && data.educationTasks.taskFailed || 0,
          data.skillsTasks && data.skillsTasks.taskDone || 0, data.skillsTasks && data.skillsTasks.taskFailed || 0
        ]}
      />
      <ButtonSave title={"OK"} action={() => {props.navigation.goBack()}}/>
    </View>
  )
}

export default TaskStatisticsScreen;