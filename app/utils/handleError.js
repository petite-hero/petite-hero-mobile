import React from 'react';
import { ToastAndroid } from "react-native";

export const handleError = (errorMsg) => {
  if (errorMsg === "timeout") return showError("Failed to connect. Please check your network settings and try again");
  else return showError(errorMsg);
}

const showError = (message) => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
  )
}