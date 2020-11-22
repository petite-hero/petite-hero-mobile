import React, { useContext, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Loader } from '../../../utils/loader'
import QRCode from 'react-native-qrcode-svg';
import styles from './styles/index.css'
import { badgesList, COLORS } from '../../../const/const';
import { Icon } from 'react-native-elements';
import * as Notifications from 'expo-notifications';
import { heightPercentageToDP } from 'react-native-responsive-screen';

// silent notification for updating location
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    let noti = notification.request.content;
    if (noti.title == null) {
      // console.log("Do not show notification");
    } else {
      // console.log("Show notification")
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.MAX
      }
    }
  }
});

const ChildAddingShowingQrScreen = (props) => {
  const { t }                 = useContext(props.route.params.localizationContext);
  const [loading, setLoading] = useState(false);
  const logo = badgesList[0].image;

  // listen to smartwatch QR scanning updates
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const listenQRScanned = () => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Silent noti for updating child loc
      if (notification.request.content.title === "Petite Hero" && notification.request.content.body === "Done setting up child device") { 
        props.navigation.navigate("Profile");
      }
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  };

  React.useEffect(() => {
    // listen to location update from server
    listenQRScanned();
  }, []);

  return (
    <View style={styles.container}>
      <Loader loading={loading}/>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20%",
        marginLeft: "10%",
        marginRight: "10%",
        marginBottom: "10%",
      }}>
        {/* icon back */}
        <Icon
          name="keyboard-arrow-left"
          type="material"
          color={COLORS.BLACK}
          onPress={() => {props.navigation.goBack()}}
        />
        {/* end icon back */}
        {/* title of the screen */}
        <View style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Text style={{
            fontSize: 20,
            fontFamily: "AcuminBold"
          }}>
            {t("child-add-title")}
          </Text>
        </View>
        {/* end title of the screen */}
        {/* create this View for center title purpose */}
        <View style={{marginRight: "10%"}}></View>
        {/* end View */}
      </View>
      <View style={{
        width: "100%",
        marginBottom: "10%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.LIGHT_CYAN
      }}>
        <Text style={{
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: 16,
          fontFamily: "AcuminBold",
          textAlign: "center",
          color: COLORS.STRONG_GREY
        }}>
          {t("child-add-qr-scan")}
        </Text>
      </View>
      <View style={{
        alignItems: "center",
        justifyContent: "center"
      }}>
        <QRCode
          value={props.route.params.qr}
          logo={logo}
          logoSize={30}
          logoBackgroundColor='transparent'
          size={200}
        />
      </View>
      <TouchableOpacity style={{
        marginLeft: "10%",
        marginRight: "10%",
        marginTop: "10%",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        height: heightPercentageToDP("5%"),
        borderWidth: 2,
        borderColor: COLORS.YELLOW,
        backgroundColor: COLORS.WHITE
      }}
        onPress={() => {props.navigation.navigate("Profile")}}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          {t("child-add-qr-scan-later")}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ChildAddingShowingQrScreen;