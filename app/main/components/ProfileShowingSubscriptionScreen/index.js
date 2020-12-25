import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Header from "../../../base/components/Header";
import { COLORS, PORT } from "../../../const/const";
import { fetchWithTimeout } from "../../../utils/fetch";
import { showMessage } from "../../../utils/showMessage";
import { Loader } from "../../../utils/loader";
import { ConfirmationModal } from "../../../utils/modal";
import styles from "./styles/index.css";
import NumberFormat from "react-number-format";
import * as WebBrowser from 'expo-web-browser';

const ProfileShowingSubscriptionScreen = (props) => {
  const { t, locale } = useContext(props.route.params.localizationContext);
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  
  const getListOfSubscription = async() => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const response = await fetchWithTimeout("http://" + ip + PORT + "/subscription/type/list");
      const result = await response.json();
      if (result.code === 200) {
        const tmp = result.data.filter(subscription => subscription.subscriptionTypeId !== 1);
        setSubscriptions(tmp);
      }
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const createTransaction = async(subscriptionTypeId, subscriptionTypeName) => {
    try {
      const ip = await AsyncStorage.getItem('IP');
      const id = await AsyncStorage.getItem("user_id");
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + id + "/payment", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionTypeId: subscriptionTypeId,
          description: subscriptionTypeName
        })
      });
      const result = await response.json();
      if (result.code === 200) {
        WebBrowser.openBrowserAsync(result.data);
      }
    } catch (error) {
      showMessage(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    props.navigation.addListener("blur", () => {props.route.params.goBack()});
    getListOfSubscription();
  }, [])

  return (
    loading ? <Loader loading={true}/> :
    <View style={styles.container}>
      {/* header */}
      <Header navigation={props.navigation} title={t("profile-subscription-title")}/>
      {/* end header */}
      <View style={styles.subscriptionContainer}>
        {subscriptions.map((subscription, index) => {
          if (index < 3) return (
          <View key={index + ""} style={styles.column}>
            <View style={[styles.smallBox, {backgroundColor: index === 0 && COLORS.WHITE || index === 1 && COLORS.YELLOW || index === 2 && COLORS.STRONG_CYAN || COLORS.WHITE}]}>
              <Text style={[styles.subscriptionTitle, {color: index === 0 && COLORS.STRONG_CYAN || index === 1 && COLORS.STRONG_GREY || index === 2 && COLORS.WHITE || COLORS.WHITE}]}>
                {subscription.name.replace("Petite Hero", "")}
              </Text>
              <NumberFormat
                value={subscription.price}
                renderText={value => 
                  <Text style={[styles.subscriptionPrice, {color: index === 0 && COLORS.STRONG_CYAN || index === 1 && COLORS.STRONG_GREY || index === 2 && COLORS.WHITE || COLORS.WHITE}]}>
                    {value}/month
                  </Text>
                }
                displayType="text"
                thousandSeparator={locale === "en" ? "," : "."}
                decimalSeparator={locale === "en" ? "." : ","}
                suffix="đ"
              />
            </View>
            <View style={[styles.largeBox, {backgroundColor: index === 0 && COLORS.WHITE || index === 1 && COLORS.YELLOW || index === 2 && COLORS.STRONG_CYAN || COLORS.WHITE}]}>
              <Text style={[styles.number, {marginTop: -15, color: index === 0 && COLORS.STRONG_CYAN || index === 1 && COLORS.STRONG_GREY || index === 2 && COLORS.WHITE || COLORS.WHITE}]}>
                {subscription.maxChildren}
              </Text>
              <Text style={[styles.text, {color: index === 0 && COLORS.STRONG_CYAN || index === 1 && COLORS.STRONG_GREY || index === 2 && COLORS.WHITE || COLORS.WHITE}]}>Children</Text>
              <Text style={[styles.number, {color: index === 0 && COLORS.STRONG_CYAN || index === 1 && COLORS.STRONG_GREY || index === 2 && COLORS.WHITE || COLORS.WHITE}]}>
                {subscription.maxCollaborator}
              </Text>
              <Text style={[styles.text, {color: index === 0 && COLORS.STRONG_CYAN || index === 1 && COLORS.STRONG_GREY || index === 2 && COLORS.WHITE || COLORS.WHITE}]}>Collaborators</Text>
              <TouchableOpacity style={[styles.buttonSelect, {backgroundColor: index === 0 && COLORS.STRONG_CYAN || index === 1 && COLORS.STRONG_GREY || index === 2 && COLORS.WHITE || COLORS.WHITE}]}
                onPressOut={() => {setLoading(true); createTransaction(subscription.subscriptionTypeId, subscription.name)}}
              >
                <Text style={[styles.text, {color: index === 0 && COLORS.WHITE || index === 1 && COLORS.WHITE || index === 2 && COLORS.STRONG_CYAN || COLORS.WHITE}]}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        )})}
      </View>
      { props.route.params.message &&
      <View style={{
        marginTop: "10%",
        marginLeft: "10%",
        marginRight: "10%"
      }}>
        <Text style={{
          fontSize: 16,
          fontFamily: "Acumin",
          color: COLORS.RED,
          textAlign: "center"
        }}>
          {t("profile-subscription-expired-message")}
        </Text>
      </View>
      }
    </View>
  );
};

export default ProfileShowingSubscriptionScreen;
