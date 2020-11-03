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
        handleError(error);
      } finally {
        setLoading(false);
      }
    })()
  }, [])

  const approveOrDeclineTask = async(status) => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/task/" + props.route.params.taskId + "/approve?success=" + status, {
        method: "PUT"
      });
      const result = await response.json();
      if (result.code === 200) {
        // props.route.params.onGoBack();
        props.navigation.goBack();
      } else {
        handleError(result.msg);
      }
    } catch (error) {
      handleError(error);
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
        height: "32%",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: "hidden"
      }}>
        <Image
          source={{uri: "https://sickkidscare.com.au/wp-content/uploads/2020/09/vb.png"}}
          style={{height: "100%", width: "100%"}}
        />
      </View>
      <View style={{
        position: "absolute",
        right: "10%",
        top: "28%",
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
          <Icon
            name="keyboard-arrow-left"
            type="material"
            color={COLORS.BLACK}
            onPress={() => {props.navigation.goBack()}}
          />
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
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.STRONG_CYAN,
          marginTop: "3%"
        }}>
          {handleShowDate(details.assignDate)}
        </Text>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 14,
          marginTop: "1%"
        }}>
          {handleShowTime(details.fromTime)} - {handleShowTime(details.toTime)}
        </Text>
        <Text style={{
          fontFamily: "Acumin",
          fontSize: 16,
          marginTop: "5%"
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
            backgroundColor: COLORS.WHITE,
            borderWidth: 2,
            borderRadius: heightPercentageToDP("5%"),
            borderColor: COLORS.YELLOW,
            alignItems: "center",
            justifyContent: "center"
          }}
            onPress={() => {props.navigation.goBack()}}
          >
            <Text style={{
              fontFamily: "Acumin",
              fontSize: 16
            }}>
              Back
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
                Decline
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
                Approve
              </Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    </View>
  )
}

export default TaskDetailsScreen;