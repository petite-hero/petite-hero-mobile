import React, { useContext, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, TouchableOpacity, Text, TextInput, AsyncStorage, Switch, ScrollView } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import styles from './styles/index.css';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { fetchWithTimeout } from '../../../utils/fetch';
import { handleError } from '../../../utils/handleError';
import { Loader } from '../../../utils/loader';

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

const CategoryList = ({categories, setCategories}) => {
  const toggleCategory = (categoryIndex) => {
    let tmp = [...categories];
    tmp.map((value, index) => {
      index === categoryIndex ? value.active = true : value.active = false;
    });
    setCategories(tmp);
  }

  return (
    <View style={{
      flexDirection: "column",
      alignItems: "flex-start",
      paddingTop: "2.5%",
      paddingLeft: "10%",
      paddingRight: "10%",
      paddingBottom: "2.5%"
    }}>
      <Text style={{
        fontFamily: "AcuminBold",
        fontSize: 16,
        marginBottom: 15
      }}>
        Choose Category
      </Text>
      <View style={{
        flexDirection: "row"
      }}>
        {
          categories.map((value, index) => {
            return (
              <View
                key={index}
                style={{
                  minWidth: 45,
                  height: 45,
                  marginRight: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {toggleCategory(index)}}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 45,
                    borderRadius: 22.5,
                    backgroundColor: value.active ? value.color : COLORS.GREY,
                  }}
                >
                  <Icon
                    name={value.name}
                    type={value.type}
                    color={COLORS.WHITE}
                    containerStyle={{
                      alignSelf: "center",
                      alignContent: "flex-start"
                    }}
                    iconStyle={{
                      marginLeft: 10
                    }}
                  />
                  {
                    value.active &&
                    <Text style={{
                      alignSelf: "center",
                      textAlign: "center",
                      fontSize: 16,
                      fontFamily: "AcuminBold",
                      color: COLORS.WHITE,
                      marginLeft: 10,
                      marginRight: 10
                    }}>
                      {value.title}
                    </Text>
                  }
                </TouchableOpacity>
              </View>
            )
          }) 
        }
      </View>
    </View>
  )
}

const TimeSettings = ({startTime, setStartTime, endTime, setEndTime}) => {
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleShowingHours = (hours) => {
    const tmp = new Date(hours).getHours();
    return tmp < 10 ?  "0" + tmp : tmp;
  }

  const handleShowingMinute = (minutes) => {
    const tmp = new Date(minutes).getMinutes();
    return tmp < 10 ? "0" + tmp : tmp
  }

  return (
    <>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginLeft: "10%",
        marginRight: "10%"
      }}>
        <View style={{
          width: "50%"
        }}>
          <Text style={{
            fontFamily: "AcuminBold",
            fontSize: 16,
          }}>
            Start Time
          </Text>
        </View>
        <View style={{
          width: "50%"
        }}>
          <Text style={{
            fontFamily: "AcuminBold",
            fontSize: 16
          }}>
            End Time
          </Text>
        </View>
      </View>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginLeft: "10%",
        marginRight: "10%"
      }}>
        <View style={{
          width: "50%"
        }}>
          <TouchableOpacity style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "60%",
            borderBottomWidth: 1,
            borderColor: COLORS.STRONG_CYAN,
          }}
            onPress={() => {setShowStartTimePicker(true)}}
          >
            <Text style={{
              fontSize: 20,
              fontFamily: "AcuminBold",
              color: COLORS.STRONG_CYAN
            }}>
              {handleShowingHours(startTime) + ":" + handleShowingMinute(startTime)}
            </Text>
            <Icon
              type="material"
              name="keyboard-arrow-down"
              color={COLORS.STRONG_CYAN}
            />
          </TouchableOpacity>
        </View>
        <View style={{
          width: "50%"
        }}>
          <TouchableOpacity style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "60%",
            borderBottomWidth: 1,
            borderColor: COLORS.STRONG_CYAN
          }}
            onPress={() => {setShowEndTimePicker(true)}}
          >
            <Text style={{
              fontSize: 20,
              fontFamily: "AcuminBold",
              color: COLORS.STRONG_CYAN
            }}>
              {handleShowingHours(endTime) + ":" + handleShowingMinute(endTime)}
            </Text>
            <Icon
              type="material"
              name="keyboard-arrow-down"
              color={COLORS.STRONG_CYAN}
            />
          </TouchableOpacity>
        </View>
      </View>
      {
        showStartTimePicker &&
        <DateTimePicker
          mode="time"
          value={startTime}
          onChange={(event, time) => {
            setShowStartTimePicker(false);
            time ? setStartTime(new Date(time).getTime()) : null;
          }}
        />
      }
      {
        showEndTimePicker &&
        <DateTimePicker
          mode="time"
          value={endTime}
          onChange={(event, time) => {
            setShowEndTimePicker(false);
            time ? setEndTime(new Date(time).getTime()) : null;
          }}
        />
      }
    </>
  )
}

const CreateTaskScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [startTime, setStartTime] = useState(new Date(new Date().setHours(7, 0, 0)).getTime());
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(12, 0, 0)).getTime());
  const [loading, setLoading] = useState(true);
  const [isSelectedAll, setSelectAll] = useState(false);
  const [repeatOn, setRepeatOn] = useState(getDateList(props.route.params.date));
  const [categories, setCategories] = useState([
    {title: "Housework", active: true, name: "broom", type: "material-community", color: COLORS.YELLOW},
    {title: "Education", active: false, name: "school", type: "material", color: COLORS.STRONG_CYAN},
    {title: "Skills", active: false, name: "toys", type: "material", color: COLORS.GREEN}
  ]);
  const date = new Date(props.route.params.date).toDateString().split(" ");

  const createTask = async() => {
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
        date.active = true
        return date;
      })
    :
      newArray = newArray.map((date, index) => {
        date.active = false
        return date;
      })
    setRepeatOn(newArray);
  };

  return (
    <ScrollView style={styles.container}>
      <Loader loading={loading}/>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20%",
        marginLeft: "10%",
        marginRight: "10%",
        marginBottom: "10%",
      }}>
        {/* icon back */}
        <Icon
          name="keyboard-arrow-left"
          type="material"
          color={COLORS.BLACK}
          onPress={() => {props.navigation.goBack()}}
        />
        {/* end icon back */}
        {/* title of the screen */}
        <View style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Text style={{
            fontSize: 20,
            fontFamily: "AcuminBold"
          }}>
            Add New Task
          </Text>
          <Text style={{
            fontSize: 20,
            fontFamily: "Acumin",
            color: COLORS.LIGHT_GREY
          }}>
            {date[1]}, {date[2]} {date[3]}
          </Text>
        </View>
        {/* end title of the screen */}
        {/* create this View for center title purpose */}
        <View style={{marginRight: "10%"}}></View>
        {/* end View */}
      </View>
      {/* form */}
      {/* task name */}
      <View style={{
        flexDirection: "column",
        alignItems: "flex-start",
        paddingTop: "2.5%",
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingBottom: "2.5%"
      }}>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16
        }}>
          Task Name
        </Text>
          <TextInput
            value={name}
            onChangeText={(text) => {setName(text)}}
            style={{
              fontSize: 16,
              fontFamily: "Acumin",
              backgroundColor: COLORS.WHITE,
              borderBottomWidth: 2,
              borderColor: COLORS.GREY,
              width: "100%",
            }}
          />
      </View>
      {/* end task name */}
      {/* category */}
      <CategoryList categories={categories} setCategories={setCategories} category={category} setCategory={setCategory}/>
      {/* end category */}
      {/* time picker */}
      <TimeSettings startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime}/>
      {/* task details */}
      <View style={{
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: 15,
        marginLeft: "10%",
        marginRight: "10%",
      }}>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16
        }}>
          Task Details
        </Text>
        <TextInput
          value={details}
          onChangeText={(text) => {setDetails(text)}}
          style={{
            fontSize: 16,
            fontFamily: "Acumin",
            width: "100%",
            borderBottomWidth: 2,
            borderColor: COLORS.GREY,
            backgroundColor: COLORS.WHITE
          }}
        />
      </View>
      {/* end task details */}
      {/* repeat on */}
      <View style={{
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: 15,
        marginLeft: "10%",
        marginRight: "10%",
      }}>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16
        }}>
          Repeat On
        </Text>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 5
        }}>
          <Text style={{
            fontFamily: "Acumin",
            fontSize: 16,
            color: COLORS.LIGHT_GREY
          }}>
            All next 7 days
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
        <View style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 10
        }}>
          {repeatOn.map((value, index) => {
            return (
              index > 0 &&
              <TouchableOpacity key={index} style={{
                width: widthPercentageToDP("10%"),
                height: heightPercentageToDP("10%"),
                backgroundColor: value.active ? COLORS.STRONG_CYAN : COLORS.GREY,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: "3%",
                paddingRight: "3%",
                marginTop: 5,
                marginRight: 5,
              }}
                onPressOut={() => {
                  const newArray = [...repeatOn];
                  const index = newArray.indexOf(value);
                  newArray[index].active = !newArray[index].active;
                  setRepeatOn(newArray);
                }}
              >
                <Text style={{
                  fontSize: 10,
                  fontFamily: "Acumin",
                  color: COLORS.WHITE
                }}>
                  {value.dayOfWeek}
                </Text>
                <Text style={{
                  fontSize: 17,
                  fontFamily: "AcuminBold",
                  color: COLORS.WHITE
                }}>
                  {value.day}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      {/* end repeat on */}
      {/* button Save */}
      <TouchableOpacity style={{
        marginLeft: "10%",
        marginRight: "10%",
        marginTop: "10%",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        height: heightPercentageToDP("5%"),
        backgroundColor: COLORS.YELLOW
      }}
        onPress={() => {setLoading(true); createTask()}}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          Save
        </Text>
      </TouchableOpacity>
      {/* end button Save */}
      {/* end form */}
    </ScrollView>
  )
}

export default CreateTaskScreen;