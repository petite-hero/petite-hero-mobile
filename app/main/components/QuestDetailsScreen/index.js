import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, AsyncStorage, Image, ImageBackground } from 'react-native';
import { badgesList, COLORS, PORT, questBackgroundList } from '../../../const/const';
import styles from './styles/index.css';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
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
      <ImageBackground 
        source={details.status === "DONE" ? questBackgroundList[1].image
              : details.status === "FAILED" ? questBackgroundList[2].image
              : questBackgroundList[0].image}
        style={{
          width: "100%",
          height: widthPercentageToDP("100%"),
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          overflow: "hidden",
      }}>
        <Image
          source={details.status === "FAILED" ? badgesList[details.reward - 1].imageFail : badgesList[details.reward - 1].image}
          style={{height: "100%", width: "100%"}}
        />
        <TouchableOpacity
          style={{
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
        >
          <Image
            source={require("../../../../assets/icons/back.png")}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      </ImageBackground>
      <View style={{
        marginTop: "10%",
        marginLeft: "10%",
        marginRight: "10%",
      }}>
        <View>
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
          <View>
            <Text style={{
              fontFamily: "Acumin",
              color: details.status === "DONE" ? COLORS.GREEN
                    : details.status === "FAILED" ? COLORS.RED
                    : COLORS.STRONG_CYAN
            }}>
            {   
              details.status === "ASSIGNED" ? t("quest-status-assigned")
            : details.status === "DONE" ? t("quest-status-done")
            : t("quest-status-failed")
            }
            </Text>
          </View>
        </View>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          marginTop: "5%"
        }}>
          {t("quest-details-reward-details")}
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
                {t("quest-details-fail")}
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
                {t("quest-details-done")}
              </Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    </View>
  )
}

export default QuestDetailsScreen;