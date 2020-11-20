import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, AsyncStorage, Image } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import styles from './styles/index.css';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { fetchWithTimeout } from '../../../utils/fetch';
import { handleError } from '../../../utils/handleError';
import { Loader } from '../../../utils/loader';

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

const getTime = (time) => {
  const tmp = time.split(":");
  return [parseInt(tmp[0]), parseInt(tmp[1]), parseInt(tmp[2])];
}

const isLate = (date, submitTime, time) => {
  const tmp = getTime(time);
  const toTime = new Date(new Date(date).setHours(tmp[0], tmp[1], tmp[2])).getTime();
  return submitTime - toTime > 0;
}

const categories = [
  {title: "Housework", name: "broom", type: "material-community", color: COLORS.YELLOW},
  {title: "Education", name: "school", type: "material", color: COLORS.STRONG_CYAN},
  {title: "Skills", name: "toys", type: "material", color: COLORS.GREEN}
];

const TaskDetailsScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

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
      <View style={{
        width: "100%",
        height: widthPercentageToDP("100%"),
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: "hidden"
      }}>
        <Image
          source={details.proofPhoto ? {uri: "data:image/png;base64," + details.proofPhoto} : require("../../../../assets/task-background/1.png")}
          style={{height: "100%", width: "100%"}}
        />
        <Icon
          name="keyboard-arrow-left"
          type="material"
          color={COLORS.BLACK}
          containerStyle={{
            position: "absolute",
            left: "10%",
            top: "15%",
            width: widthPercentageToDP("10%"),
            height: widthPercentageToDP("10%"),
            borderRadius: widthPercentageToDP("5%"),
            backgroundColor: COLORS.WHITE,
            alignItems: "center",
            justifyContent: "center",
            elevation: 10
          }}
          onPress={() => {props.navigation.goBack()}}
        />
      </View>
      <View style={{
        position: "absolute",
        right: "10%",
        top: widthPercentageToDP("92%"),
        width: "15%",
        height: widthPercentageToDP("15%"),
        backgroundColor: category.color,
        borderRadius: widthPercentageToDP("7.5%"),
        alignItems: "center",
        justifyContent: "center",
        elevation: 8
      }}>
        <Icon
          name={category.name}
          type={category.type}
          color={COLORS.WHITE}
        />
      </View>
      <View style={{
        marginTop: "10%",
        marginLeft: "10%",
        marginRight: "10%",
      }}>
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
        {
          details.status === "DONE" || details.status === "FAILED" ?
            <Text style={{
              fontFamily: "Acumin",
              color: details.status === "DONE" && COLORS.GREEN
                  || details.status === "FAILED" && COLORS.RED,
              textTransform: "capitalize"
            }}>
              {details.status}
            </Text>
          : details.submitDate ?
            isLate(details.assignDate, details.submitDate, details.toTime) ?
            <Text style={{
              fontFamily: "Acumin",
              color: COLORS.RED
            }}>
              Submitted late at {handleShowTime(details.submitDate)}
            </Text>
            :
            <Text style={{
              fontFamily: "Acumin",
              color: COLORS.GREEN
            }}>
              Submitted at {handleShowTime(details.submitDate)}
            </Text>
          : isLate(details.assignDate, new Date().getTime(), details.toTime) ?
            <Text style={{
              fontFamily: "Acumin",
              color: COLORS.YELLOW
            }}>
              Late
            </Text>
            :
            <Text style={{
              fontFamily: "Acumin",
              color: details.status === "HANDED" && COLORS.BLACK
                  || details.status === "ASSIGNED" && COLORS.STRONG_CYAN,
              textTransform: "capitalize"
            }}>
              {details.status}
            </Text>
        }
        <View style={{
          flexDirection: "row",
          marginTop: "3%",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: COLORS.WHITE
        }}>
          <View style={{
            flexDirection: "column",
            alignItems: "flex-start",
            width: "50%",
            borderLeftWidth: 2,
            borderColor: COLORS.LIGHT_GREY
          }}>
            <Icon
              name="date-range"
              type="material"
              color={COLORS.BLACK}
              style={{
                marginLeft: 10
              }}
            />
            <Text style={{
              fontFamily: "Acumin",
              fontSize: 16,
              color: COLORS.LIGHT_GREY,
              marginLeft: 10
            }}>
              {handleShowDate(details.assignDate)}
            </Text>
          </View>
          <View style={{
            flexDirection: "column",
            alignItems: "flex-start",
            width: "50%",
            borderLeftWidth: 2,
            borderColor: COLORS.LIGHT_GREY
          }}>
            <Icon
              name="schedule"
              type="material"
              color={COLORS.BLACK}
              style={{
                marginLeft: 10
              }}
            />
            <Text style={{
              fontFamily: "Acumin",
              fontSize: 16,
              color: COLORS.LIGHT_GREY,
              marginLeft: 10
            }}>
              From {handleShowTime(details.fromTime)} to {handleShowTime(details.toTime)}
            </Text>
          </View>
        </View>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          marginTop: "5%"
        }}>
          Task Details
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
          <TouchableOpacity style={{
            width: "100%",
            paddingTop: "5%",
            paddingBottom: "5%",
            marginTop: "10%",
            backgroundColor: COLORS.YELLOW,
            borderRadius: heightPercentageToDP("5%"),
            alignItems: "center",
            justifyContent: "center"
          }}
            onPress={() => {props.navigation.goBack()}}
          >
            <Text style={{
              fontFamily: "Acumin",
              fontSize: 16
            }}>
              OK
            </Text>
          </TouchableOpacity>
          :
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <TouchableOpacity style={{
              width: "48%",
              paddingTop: "5%",
              paddingBottom: "5%",
              marginTop: "10%",
              backgroundColor: COLORS.WHITE,
              borderWidth: 2,
              borderRadius: heightPercentageToDP("5%"),
              borderColor: COLORS.YELLOW,
              alignItems: "center",
              justifyContent: "center"
            }}
              onPress={() => {setLoading(true); approveOrDeclineTask(false)}}
            >
              <Text style={{
                fontFamily: "Acumin",
                fontSize: 16
              }}>
                Fail
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              width: "48%",
              paddingTop: "5%",
              paddingBottom: "5%",
              marginTop: "10%",
              backgroundColor: COLORS.YELLOW,
              borderRadius: heightPercentageToDP("5%"),
              alignItems: "center",
              justifyContent: "center"
            }}
              onPress={() => {setLoading(true); approveOrDeclineTask(true)}}
            >
              <Text style={{
                fontFamily: "Acumin",
                fontSize: 16
              }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    </View>
  )
}

export default TaskDetailsScreen;