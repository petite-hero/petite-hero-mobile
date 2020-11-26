import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, AsyncStorage, Image } from 'react-native';
import { COLORS, PORT } from '../../../const/const';

const handleShowTime = (time) => {
  if (typeof(time) == "string") {
    const tmp = time ? time.split(":") : "00:00:00".split(":");
    return tmp[0] + ":" + tmp[1];
  } else {
    return handleShowHourAndMinute(new Date(time).getHours()) + ":" + handleShowHourAndMinute(new Date(time).getMinutes());
  }
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

const DetailShowingComponent = ({ t, details }) => {
  return (
    details.status === "DONE" || details.status === "FAILED" ?
      <Text style={{
        fontFamily: "Acumin",
        color: details.status === "DONE" && COLORS.GREEN
            || details.status === "FAILED" && COLORS.RED,
      }}>
        { details.status === "DONE" ? t("task-status-done") : t("task-status-failed") }
      </Text>
    : details.submitDate ?
      isLate(details.assignDate, details.submitDate, details.toTime) ?
      <Text style={{
        fontFamily: "Acumin",
        color: COLORS.RED
      }}>
        { t("task-details-submit-late") } { handleShowTime(details.submitDate) }
      </Text>
      :
      <Text style={{
        fontFamily: "Acumin",
        color: COLORS.GREEN
      }}>
        { t("task-details-submit") } { handleShowTime(details.submitDate) }
      </Text>
    : isLate(details.assignDate, new Date().getTime(), details.toTime) ?
      <Text style={{
        fontFamily: "Acumin",
        color: COLORS.YELLOW
      }}>
        { t("task-status-late") }
      </Text>
    :
      <Text style={{
        fontFamily: "Acumin",
        color: details.status === "HANDED" && COLORS.BLACK
            || details.status === "ASSIGNED" && COLORS.STRONG_CYAN
      }}>
        { t("task-status-assigned") }
      </Text>
  );
}

export default DetailShowingComponent;