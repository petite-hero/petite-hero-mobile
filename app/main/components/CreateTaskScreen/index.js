import React, { useContext, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, TouchableOpacity, Text, TextInput, AsyncStorage } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import styles from './styles/index.css';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { fetchWithTimeout } from '../../../utils/fetch';
import { handleError } from '../../../utils/handleError';
import { Loader } from '../../../utils/loader';

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
  const [loading, setLoading] = useState(false);
  const [repeatOn, setRepeatOn] = useState([
    {day: "Monday", active: false},
    {day: "Tuesday", active: false},
    {day: "Wednesday", active: false},
    {day: "Thursday", active: false},
    {day: "Friday", active: false},
    {day: "Saturday", active: false},
    {day: "Sunday", active: false},
  ]);
  const [categories, setCategories] = useState([
    {title: "Housework", active: true, name: "broom", type: "material-community", color: COLORS.YELLOW},
    {title: "Education", active: false, name: "school", type: "material", color: COLORS.STRONG_CYAN},
    {title: "Skills", active: false, name: "toys", type: "material", color: COLORS.GREEN}
  ]);

  const createTask = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem("user_id");
      const repeatArray = repeatOn.reduce((accumulator, currentValue) => {
        return accumulator + +currentValue.active;
      }, "");
      const type = categories.find(category => category.active).title;
      const response = await fetchWithTimeout('http://' + ip + PORT + '/child/task', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignDate: props.route.params.date,
          childId: 1,
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

  return (
    <View style={styles.container}>
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
        <Text style={{
          fontSize: 20,
          fontFamily: "AcuminBold"
        }}>
          Add New Task
        </Text>
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
            width: "100%",
            borderBottomWidth: 2,
            borderColor: COLORS.GREY
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
            borderColor: COLORS.GREY
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
          flexWrap: "wrap",
          marginTop: 10
        }}>
          {repeatOn.map((value, index) => {
            return (
              <TouchableOpacity key={index} style={{
                height: heightPercentageToDP("5%"),
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
                  fontSize: 15,
                  fontFamily: "Acumin",
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
    </View>
  )
}

export default CreateTaskScreen;