import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, AsyncStorage, Switch, ScrollView } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import styles from './styles/index.css';
import { fetchWithTimeout } from '../../../utils/fetch';
import { handleError } from '../../../utils/handleError';
import { Loader } from '../../../utils/loader';
import TimeSettings from './TimeSettings';
import CategoryList from './CategoryList';
import Header from '../../../base/components/Header';
import InputField from '../../../base/components/InputField';
import ButtonSave from '../../../base/components/ButtonSave';

const getDateList = (date) => {
  const currentDate = new Date(date);
  let datesArray = [];
  let newDate = new Date();
  let tmp = newDate.toDateString().split(" ");
  datesArray.push({
    dayOfWeek: tmp[0],
    day: tmp[2],
    date: new Date(new Date(newDate).toDateString()).getTime(),
    active: true
  })
  for (let i = 1; i <= 7; i++) {
    newDate.setDate(currentDate.getDate() + i);
    tmp = newDate.toDateString().split(" ");
    datesArray.push({
      dayOfWeek: tmp[0],
      day: tmp[2],
      date: new Date(new Date(newDate).toDateString()).getTime(),
      active: false
    })
  }
  return datesArray;
}

const getTime = (time) => {
  const tmp = time.split(":");
  return [parseInt(tmp[0]), parseInt(tmp[1]), parseInt(tmp[2])];
}

const TaskCreatingScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [name, setName]                     = useState("");
  const [validName, setValidName]           = useState(true);
  const [details, setDetails]               = useState("");
  const [validDetail, setValidDetail]       = useState(true);
  const [startTime, setStartTime]           = useState(new Date().getTime());
  const [validStartTime, setValidStartTime] = useState(true);
  const [endTime, setEndTime]               = useState(new Date().getTime());
  const [validEndTime, setValidEndTime]     = useState(true);
  const [timeMessage, setTimeMessage]       = useState("");
  const [loading, setLoading]               = useState(true);
  const [isSelectedAll, setSelectAll]       = useState(false);
  const [repeatOn, setRepeatOn]             = useState(getDateList(props.route.params.date));
  const [categories, setCategories]         = useState([
    {title: t("task-add-category-housework"), active: true, name: "Housework", color: COLORS.YELLOW},
    {title: t("task-add-category-education"), active: false, name: "Education", color: COLORS.STRONG_CYAN},
    {title: t("task-add-category-skills"), active: false, name: "Skills", color: COLORS.GREEN}
  ]);
  const date = new Date(props.route.params.date).toDateString().split(" ");

  const validate = () => {
    let isValidated = true;
    if (name.length === 0) {setValidName(false); isValidated = false}
    if (details.length === 0) {setValidDetail(false); isValidated = false}
    if (new Date(props.route.params.date).getTime() === new Date(new Date().toDateString()).getTime()) {
      if (startTime < new Date().getTime()) {
        setValidStartTime(false); 
        setTimeMessage(t("task-add-start-time-invalid"));
        isValidated = false;
      } else if (endTime < startTime) {
        setValidEndTime(false);
        setTimeMessage(t("task-add-end-time-invalid"))
        isValidated = false
      }
    } else {
      if (endTime < startTime) {setValidEndTime(false); isValidated = false}
    }
    return isValidated;
  }

  const createTask = async() => {
    if (!validate()) {
      setLoading(false);
      return null
    };
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem("user_id");
      const childId = await AsyncStorage.getItem('child_id');
      const repeatArray = repeatOn.reduce((accumulator, currentValue) => {
        return accumulator + +currentValue.active;
      }, "");
      const repeatOnList = repeatOn.filter(item => item.active === true);
      const dateList = repeatOnList.map(date => date.date);
      const type = categories.find(category => category.active).title;
      const response = await fetchWithTimeout('http://' + ip + PORT + '/child/task', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignDateList: dateList,
          childId: childId,
          creatorPhoneNumber: id,
          description: details,
          fromTime: startTime,
          name: name,
          repeatOn: repeatArray,
          toTime: endTime,
          type: type
        })
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

  useEffect(() => {
    props.route.params.taskId ? (async() => {
      try {
        const ip = await AsyncStorage.getItem('IP');
        const response = await fetchWithTimeout("http://" + ip + PORT + "/task/" + props.route.params.taskId);
        const result = await response.json();
        if (result.code === 200 && result.msg === "OK") {
          const fromTime = getTime(result.data.fromTime);
          const toTime = getTime(result.data.toTime);
          setName(result.data.name);
          setDetails(result.data.description);
          setCategories(categories.map((value, index) => {
            value.title === result.data.type ? value.active = true : value.active = false;
            return value;
          }));
          setStartTime(new Date(new Date().setHours(fromTime[0], fromTime[1], fromTime[2])).getTime());
          setEndTime(new Date(new Date().setHours(toTime[0], toTime[1], toTime[2])).getTime());
        } else {
          handleError(result.msg);
        }
      } catch (error) {
        handleError(error.message);
      } finally {
        setLoading(false);
      }
    })() :
    setLoading(false);
  }, []);

  const selectAll = (isSelectedAll) => {
    let newArray = [...repeatOn];
    isSelectedAll ? 
      newArray = newArray.map((date, index) => {
        if (index !== 0) date.active = true;
        return date;
      })
    :
      newArray = newArray.map((date, index) => {
        if (index !== 0) date.active = false;
        return date;
      })
    setRepeatOn(newArray);
  };

  return (
    <ScrollView style={styles.container}>
      <Loader loading={loading}/>
      <Header navigation={props.navigation} title={t("task-add-title")} subTitle={date[1] + ", " + date[2] + " " + date[3]}/>
      {/* form */}
      {/* task name */}
      <InputField title={t("task-add-name")} value={name} setValue={setName} valid={validName} setValid={setValidName} invalidMessage={t("task-add-name-empty")} maxLength={50}/>
      {/* end task name */}
      {/* category */}
      <CategoryList t={t} categories={categories} setCategories={setCategories}/>
      {/* end category */}
      {/* time picker */}
      <TimeSettings t={t} startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} setValidStartTime={setValidStartTime} setValidEndTime={setValidEndTime}/>
      { (!validStartTime || !validEndTime) &&
        <Text style={styles.invalidTimeMessage}>
          {timeMessage}
        </Text>
      }
      {/* task details */}
      <InputField title={t("task-add-details")} value={details} setValue={setDetails} valid={validDetail} setValid={setValidDetail} invalidMessage={t("task-add-details-empty")} maxLength={255} multiline={true}/>
      {/* end task details */}
      {/* repeat on */}
      <View style={styles.repeatContainer}>
        <Text style={styles.title}>
          {t("task-add-repeat-on")}
        </Text>
        <View style={styles.repeatSwitchContainer}>
          <Text style={styles.repeatText}>
            {t("task-add-repeat-on-check-all")}
          </Text>
          <Switch
            trackColor={{ false: COLORS.LIGHT_GREY, true: COLORS.LIGHT_CYAN }}
            thumbColor={isSelectedAll ? COLORS.STRONG_CYAN : COLORS.GREY}
            onValueChange={() => {setSelectAll(!isSelectedAll); selectAll(!isSelectedAll)}}
            value={isSelectedAll}
            style={{
              transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
              elevation: 0
            }}
          />
        </View>
        <View style={styles.repeatDateContainer}>
          {repeatOn.map((value, index) => {
            return (
              index > 0 &&
              <TouchableOpacity key={index} style={[styles.repeatDate, {backgroundColor: value.active ? COLORS.STRONG_CYAN : COLORS.GREY}]}
                onPressOut={() => {
                  const newArray = [...repeatOn];
                  const index = newArray.indexOf(value);
                  newArray[index].active = !newArray[index].active;
                  setRepeatOn(newArray);
                }}
              >
                <Text style={styles.dateText}>
                  {value.dayOfWeek}
                </Text>
                <Text style={styles.dateNum}>
                  {value.day}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      {/* end repeat on */}
      {/* button Save */}
      <ButtonSave title={t("task-add-save")} action={() => {setLoading(true); createTask()}} style={{marginBottom: 50}}/>
      {/* end button Save */}
      {/* end form */}
    </ScrollView>
  )
}

export default TaskCreatingScreen;