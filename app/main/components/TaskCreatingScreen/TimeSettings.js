import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { COLORS } from '../../../const/const';

const TimeSettings = ({t, startTime, setStartTime, endTime, setEndTime, setValidStartTime, setValidEndTime}) => {
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
            color: COLORS.BLACK
          }}>
            {t("task-add-start-time")}
          </Text>
        </View>
        <View style={{
          width: "50%"
        }}>
          <Text style={{
            fontFamily: "AcuminBold",
            fontSize: 16,
            color: COLORS.BLACK
          }}>
            {t("task-add-end-time")}
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
            <Image
              source={require("../../../../assets/icons/down-blue.png")}
              style={{
                width: 30,
                height: 30
              }}
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
            <Image
              source={require("../../../../assets/icons/down-blue.png")}
              style={{
                width: 30,
                height: 30
              }}
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
            setValidStartTime(true);
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
            setValidEndTime(true);
            time ? setEndTime(new Date(time).getTime()) : null;
          }}
        />
      }
    </>
  )
}

export default TimeSettings;