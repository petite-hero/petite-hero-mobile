import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, AsyncStorage, Image } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import styles from './styles/index.css';
import { fetchWithTimeout } from '../../../utils/fetch';
import { handleError } from '../../../utils/handleError';
import { Loader } from '../../../utils/loader';
import DetailShowingComponent from './DetailShowingComponent';

const handleShowHourAndMinute = (time) => {
  return time < 10 ?  "0" + time : time;
}

const handleShowTime = (time) => {
  if (typeof(time) == "string") {
    const tmp = time ? time.split(":") : "00:00:00".split(":");
    return tmp[0] + ":" + tmp[1];
  } else {
    return handleShowHourAndMinute(new Date(time).getHours()) + ":" + handleShowHourAndMinute(new Date(time).getMinutes());
  }
}

const handleShowDate = (date) => {
  const tmp = new Date(date).toDateString().split(" ").slice(1, 4);
  return tmp[0] + " " + tmp[1] + " " + tmp[2];
}

const TaskDetailsScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const categories = [
    {title: t("task-add-category-housework"), name: "Housework", color: COLORS.YELLOW},
    {title: t("task-add-category-education"), name: "Education", color: COLORS.STRONG_CYAN},
    {title: t("task-add-category-skills"), name: "Skills", color: COLORS.GREEN}
  ];

  useEffect(() => {
    (async() => {
      try {
        const ip = await AsyncStorage.getItem('IP');
        const response = await fetchWithTimeout('http://' + ip + PORT + '/task/' + props.route.params.taskId);
        const result = await response.json();
        if (result.code === 200) {
          setDetails(result.data);
          setCategory(categories.find(category => result.data.type === category.title));
        } else {
          handleError(result.msg);
        }
      } catch (error) {
        handleError(error.message);
      } finally {
        setLoading(false);
      }
    })()
  }, [])

  const approveOrDeclineTask = async(status) => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const taskId = props.route.params.taskId;
      const response = await fetchWithTimeout("http://" + ip + PORT + "/task/" + taskId + "/approve?success=" + status, {
        method: "PUT"
      });
      const result = await response.json();
      if (result.code === 200) {
        props.route.params.onGoBack();
        props.navigation.goBack();
      } else {
        handleError(result.msg);
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    loading ? 
    <Loader loading={loading}/>
    :
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={details.proofPhoto ? {uri: "data:image/png;base64," + details.proofPhoto} : require("../../../../assets/task-background/1.png")}
          style={{height: "100%", width: "100%"}}
        />
        <TouchableOpacity 
          style={styles.backContainer}
          onPress={() => {props.navigation.goBack()}}
        >
          <Image
            source={require("../../../../assets/icons/back.png")}
            style={{
              width: 30,
              height: 30
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.categoryContainer, {backgroundColor: category.color}]}>
        <Image
          source={category.name === "Housework" ? require("../../../../assets/icons/housework.png")
                : category.name === "Education" ? require("../../../../assets/icons/education.png")
                : require("../../../../assets/icons/skills.png")}
          style={{width: 45, height: 45}}
        />
      </View>
      <View style={styles.body}>
        <View style={{
          maxWidth: "50%"
        }}>
          <Text style={{
            fontFamily: "AcuminBold",
            fontSize: 20
          }}>
            {details.name}
          </Text>
        </View>
        <DetailShowingComponent t={t} details={details}/>
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeItem}>
            <Image
              source={require("../../../../assets/icons/calendar.png")}
              style={{width: 30, height: 30, marginLeft: 6, marginBottom: -5}}
            />
            <Text style={styles.date}>
              {handleShowDate(details.assignDate)}
            </Text>
          </View>
          <View style={styles.dateTimeItem}>
            <Image
              source={require("../../../../assets/icons/clock.png")}
              style={{width: 30, height: 30, marginLeft: 6, marginBottom: -5}}
            />
            <Text style={styles.date}>
              {t("task-details-from")} {handleShowTime(details.fromTime)} {t("task-details-to")} {handleShowTime(details.toTime)}
            </Text>
          </View>
        </View>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          marginTop: "5%"
        }}>
          {t("task-details-details")}
        </Text>
        <Text style={{
          fontFamily: "Acumin",
          fontSize: 16,
          marginTop: "1%",
          color: COLORS.LIGHT_GREY
        }}>
          {details.description}
        </Text>
        {
          details.status !== "HANDED" ?
          <TouchableOpacity style={styles.OKButton}
            onPress={() => {props.navigation.goBack()}}
          >
            <Text style={styles.buttonTitle}>
              OK
            </Text>
          </TouchableOpacity>
          :
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <TouchableOpacity style={[styles.changeStatusButton, {backgroundColor: COLORS.WHITE}]}
              onPress={() => {setLoading(true); approveOrDeclineTask(false)}}
            >
              <Text style={styles.buttonTitle}>
                {t("task-details-fail")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.changeStatusButton, {backgroundColor: COLORS.YELLOW}]}
              onPress={() => {setLoading(true); approveOrDeclineTask(true)}}
            >
              <Text style={styles.buttonTitle}>
                {t("task-details-done")}
              </Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    </View>
  )
}

export default TaskDetailsScreen;