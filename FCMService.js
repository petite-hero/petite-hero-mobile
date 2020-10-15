import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'

class FCMService {

    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotifcationListeners(onRegister, onNotification, onOpenNotification)
    }

    registerAppWithFCM = async() => {
        // for ios permission
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true);
        }
    }

    checkPermission = (onRegister) => {
        messaging().hasPermission()
        .then(enabled => {
            if (enabled) {
                // user has permissions
                this.getToken(onRegister)
            } else {
                // user doesn't have permission
                this.requestPermission(onRegister)
            }
        }).catch(error => {
            console.log("[FCMService] Permission rejected ", error)
        })
    }

    getToken = (onRegister) => {
        messaging().getToken()
        .then(fcmToken => {
            if (fcmToken) {
                onRegister(fcmToken)
            } else {
                console.log("[FCMService] User doesn't have a device token")
            }
        }).catch(error => {
            console.log("[FCMService] getToken rejected ", error)
        })
    }

    requestPermission = (onRegister) => {
        messaging().requestPermission()
        .then(() => {
            this.getToken(onRegister)
        }).catch(error => {
            console.log("[FCMService] Request Permission rejected ", error)
        })
    }

    deleteToken = () => {
        console.log("FCMService] deleteToken");
        messaging().deleteToken()
        .catch(error => {
            console.log("[FCMService] Delete token error ", error)
        })
    }

    createNotifcationListeners = (onRegister, onNotification, onOpenNotification) => {

        // when the application is running, but in the background
        messaging()
        .onNotificationOpenedApp(remoteMessage => {
            console.log("[FCMService] onNotificationOpenApp Notification caused app to open")
            
            if (remoteMessage) {
                const notification = remoteMessage.notification;
                onOpenNotification(notification);
                // this.removeDeliverdNotification(notification.notificationId)
            }
        });
        
        // when the application is opened from a quit state
        messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            console.log("[FCMService] getInitialNotification Notification caused app the open");

            if (remoteMessage) {
                const notification = remoteMessage.notification;
                onOpenNotification(notification);
                // this.removeDeliverdNotification(notification.notificationId)
            }
        });

        // foreground state message
        this.messageListener = messaging().onMessage(async remoteMessage => {
            console.log("[FCMService] A new FCM messaged arrived! ", remoteMessage);

            if (remoteMessage) {
                let notification = null;
                if (Platform.OS === 'ios') {
                    notification = remoteMessage.data.notification;
                } else {
                    notification = remoteMessage.notification;
                }
                onOpenNotification(notification);
            }
        });

        // triggered when have new token
        messaging().onTokenRefresh(fcmToken => {
            console.log("[FCMService] New token refresh: ", fcmToken);
            onRegister(fcmToken);
        })
    }

    unRegister = () => {
        this.messageListener();
    }
}

export const fcmService = new FCMService()