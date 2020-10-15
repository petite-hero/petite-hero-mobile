import PushNotification from 'react-native-push-notification'
import { Platform } from 'react-native'

class LocalNotificationService {
    configure = (onOpenNotification) => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log("[LNS] onRegister: ", token);
            },
            onNotification: function (notification) {
                console.log("[LNS] onNotification: ", notification);
                if (!notification?.data) {
                    return;
                }
                notification.userInteraction = true;
                onOpenNotification(Platform.OS === 'ios' ? notification.data.item : notification.data);

                // only call callback if not from foreground
                // if (Platform.OS === 'ios') {
                //     notification.finish(PushNotificationIOS.FetchResult.NoData);
                // }
            },

            // IOS only (optional): default: all - Permission to register
            // permissions: {
            //     alert: true,
            //     badge: true,
            //     sound: true,
            // },

            // should the initial notification be popped automatically
            popInitialNotification: true,

            // (optional) default: true
            // - Specified if permission (ios) and token (android and ios) will requested or not,
            // - If not, u must call PushNotificationsHandler.requestPermission() LocalNotificationService
            // - If u are not using remote notification or do not have Firebase installed, use this:
            //     requestPermission: Platform.OS === 'ios'
            requestPermissions: true,
        })
    }

    unregister = () => {
        PushNotification.unregister();
    }

    showNotification = (id, title, message, data = {}, options = {}) => {
        PushNotification.localNotification({
            // Android only properties
            ...this.buildAndroidNotification(id, title, message, data, options),
           
            // IOS only properties
            // ...this.buildIOSNotification(id, title, message, data, options),
           
            // IOS and Android properties
            title: title || "",
            message: message || "",
            playSound: options.playSound || false,
            soundName: options.soundName || 'default',
            userInteraction: false // Boolean: if the notification was opened by the user from the notification
        });
    }

    buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
        return {
            id: id,
            autoCancel: true,
            largeIcon: options.largeIcon || "ic_launcher",
            smallIcon: options.smallIcon || "ic_notification",
            bigText: message || '',
            subText: title || '',
            vibrate: options.vibrate || true,
            vibration: options.vibration || 300,
            priority: options.priority || "high",
            importance: options.importance || "high", // (optional) set notification importance, default: high
            data: data,
        }        
    }

    // buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    //     return {
    //         alertAction: options.alertAction || 'view',
    //         category: options.category || '',
    //         userInfo: {
    //             id: id,
    //             item: data
    //         }
    //     }        
    // }

    cancelAllLocalNotifications = () => {
        if (Platform.OS === 'ios') {
            return; 
        } else {
            PushNotification.cancelAllLocalNotifications();
        }
    }

    removeDeliveredNotificationByID = (notificationId) => {
        console.log("[LNS] removeDeliveredNotificationByID: ", notification);
        PushNotification.cancelAllLocalNotifications({id: `${notificationId}`});
    }

}


export const localNotificationService = new LocalNotificationService()