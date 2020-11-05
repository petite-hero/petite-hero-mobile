import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, AsyncStorage, Image } from 'react-native';
import { COLORS, PORT } from '../../../const/const';
import styles from './styles/index.css';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { fetchWithTimeout } from '../../../utils/fetch';
import { handleError } from '../../../utils/handleError';
import { Loader } from '../../../utils/loader';

const QuestDetailsScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async() => {
      try {
        const ip = await AsyncStorage.getItem('IP');
        const response = await fetchWithTimeout('http://' + ip + PORT + '/quest/' + props.route.params.questId);
        const result = await response.json();
        if (result.code === 200) {
          setDetails(result.data);
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

  const approveOrDeclineQuest = async(status) => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const questId = props.route.params.questId;
      const response = await fetchWithTimeout("http://" + ip + PORT + "/quest/" + questId + "?status=" + status, {
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
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          marginTop: "5%"
        }}>
          Quest Details
        </Text>
        <Text style={{
          fontFamily: "Acumin",
          fontSize: 16,
          marginTop: "5%",
          color: COLORS.LIGHT_GREY
        }}>
          {details.description}
        </Text>
        {
          details.status === "DONE" || details.status === "FAILED" ?
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
              onPress={() => {setLoading(true); approveOrDeclineQuest(false)}}
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
              onPress={() => {setLoading(true); approveOrDeclineQuest(true)}}
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

export default QuestDetailsScreen;