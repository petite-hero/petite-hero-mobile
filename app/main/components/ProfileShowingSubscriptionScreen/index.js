import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Text, AsyncStorage, Image } from "react-native";
import { Icon } from "react-native-elements";
import { RadioButton } from "react-native-paper";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Header from "../../../base/components/Header";
import { COLORS, PORT } from "../../../const/const";
import { fetchWithTimeout } from "../../../utils/fetch";
import { handleError } from "../../../utils/handleError";
import { Loader } from "../../../utils/loader";
import { ConfirmationModal } from "../../../utils/modal";
import styles from "./styles/index.css";

const ProfileShowingSubscriptionScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      <Loader loading={loading}/>
      {/* header */}
      <Header navigation={props.navigation} title={t("profile-subscription-title")}/>
      {/* end header */}
      <View style={styles.subscriptionContainer}>
        <View style={styles.column}>
          <View style={styles.smallBox}>
            <Text style={styles.subscriptionTitle}>
              Standard
            </Text>
            <Text style={styles.subscriptionPrice}>
              69.000/đ month
            </Text>
          </View>
          <View style={styles.largeBox}>
            <Text style={[styles.number, {marginTop: -15}]}>2</Text>
            <Text style={styles.text}>Children</Text>
            <Text style={styles.number}>2</Text>
            <Text style={styles.text}>Collaborators</Text>
            <TouchableOpacity style={styles.buttonSelect}>
              <Text style={[styles.text, {color: COLORS.WHITE}]}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.column}>
          <View style={[styles.smallBox, {backgroundColor: COLORS.YELLOW}]}>
            <Text style={[styles.subscriptionTitle, {color: COLORS.STRONG_GREY}]}>
              Gold
            </Text>
            <Text style={[styles.subscriptionPrice, {color: COLORS.STRONG_GREY}]}>
              79.000/đ month
            </Text>
          </View>
          <View style={[styles.largeBox, {backgroundColor: COLORS.YELLOW}]}>
            <Text style={[styles.number, {marginTop: -15, color: COLORS.STRONG_GREY}]}>3</Text>
            <Text style={[styles.text, {color: COLORS.STRONG_GREY}]}>Children</Text>
            <Text style={[styles.number, {color: COLORS.STRONG_GREY}]}>2</Text>
            <Text style={[styles.text, {color: COLORS.STRONG_GREY}]}>Collaborators</Text>
            <TouchableOpacity style={[styles.buttonSelect, {backgroundColor: COLORS.STRONG_GREY}]}>
              <Text style={[styles.text, {color: COLORS.WHITE}]}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.column}>
          <View style={[styles.smallBox, {backgroundColor: COLORS.STRONG_CYAN}]}>
            <Text style={[styles.subscriptionTitle, {color: COLORS.WHITE}]}>
              Premium
            </Text>
            <Text style={[styles.subscriptionPrice, {color: COLORS.WHITE}]}>
              99.000/đ month
            </Text>
          </View>
          <View style={[styles.largeBox, {backgroundColor: COLORS.STRONG_CYAN}]}>
            <Text style={[styles.number, {marginTop: -15, color: COLORS.WHITE}]}>5</Text>
            <Text style={[styles.text, {color: COLORS.WHITE}]}>Children</Text>
            <Text style={[styles.number, {color: COLORS.WHITE}]}>4</Text>
            <Text style={[styles.text, {color: COLORS.WHITE}]}>Collaborators</Text>
            <TouchableOpacity style={[styles.buttonSelect, {backgroundColor: COLORS.WHITE}]}>
              <Text style={[styles.text, {color: COLORS.STRONG_CYAN}]}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileShowingSubscriptionScreen;
