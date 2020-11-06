import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, AsyncStorage, Image } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import styles from './styles/index.css';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { fetchWithTimeout } from '../../../utils/fetch';
import { handleError } from '../../../utils/handleError';
import { Loader } from '../../../utils/loader';

const handleShowTime = (time) => {
  const tmp = time ? time.split(":") : "00:00:00".split(":");
  return tmp[0] + ":" + tmp[1];
}

const handleShowDate = (date) => {
  const tmp = new Date(date).toDateString().split(" ").slice(1, 4);
  return tmp[0] + " " + tmp[1] + " " + tmp[2];
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
          source={{uri: "https://sickkidscare.com.au/wp-content/uploads/2020/09/vb.png"}}
          // source={{uri: "https://scontent-sin6-2.xx.fbcdn.net/v/t1.15752-9/123192711_3395183017226006_6360276073099702214_n.jpg?_nc_cat=105&ccb=2&_nc_sid=ae9488&_nc_ohc=vpDD0WzdvzEAX9x_z4P&_nc_ht=scontent-sin6-2.xx&oh=f8a4a7834f361012f52fb402aef7fd52&oe=5FC7F8D1"}}
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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
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
          <View style={{
            paddingTop: "2%",
            paddingLeft: "8%",
            paddingRight: "8%",
            paddingBottom: "2%",
            borderRadius: 10,
            backgroundColor: details.status === "DONE" && COLORS.GREEN
                            || details.status === "FAILED" && COLORS.RED
                            || details.status === "HANDED" && COLORS.PURPLE
                            || details.status === "ASSIGNED" && COLORS.STRONG_CYAN,
          }}>
            <Text style={{
              fontFamily: "Acumin",
              color: COLORS.WHITE,
              textTransform: "capitalize"
            }}>
              {details.status}
            </Text>
          </View>
        </View>
        <View style={{
          flexDirection: "row",
          marginTop: "3%",
          justifyContent: "flex-start",
          alignItems: "center",
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