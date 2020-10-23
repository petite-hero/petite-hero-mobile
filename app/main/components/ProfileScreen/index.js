import React, { useContext, useEffect, useRef, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, View, Text, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import AddChildScreen from '../AddChildScreen';
import Animated, { Easing, set } from 'react-native-reanimated';
import styles from './styles/index.css';

const Stack = createStackNavigator();

const SettingItem = ({title, icon, action, subItems}) => {
  const [isDropdown, setDropdown] = useState(false);
  const animDropdown = useRef(new Animated.Value(0)).current;

  const dropdownSubItems = (numOfSubItems) => {
    setDropdown(!isDropdown);
    if (!isDropdown) {
      Animated.timing(
        animDropdown,
        {
          toValue: numOfSubItems * hp("10%"),
          duration: 400,
          easing: Easing.ease
        }
      ).start();
    } else {
      Animated.timing(
        animDropdown,
        {
          toValue: 0,
          duration: 400,
          easing: Easing.ease
        }
      ).start();
    }
  }

  return (
    <>
      <TouchableOpacity style={{
        flexDirection: "row", 
        paddingLeft: wp("10%"), 
        paddingRight: wp("10%"),
        paddingTop: hp("2.5%"),
        paddingBottom: hp("2.5%"),
        backgroundColor: COLORS.NUDE,
      }}
        onPress={() => {action ? action() : dropdownSubItems(subItems.length)}}
      >
        <Icon 
          name={icon}
          type='material'
          color={COLORS.WHITE}
          style={{
            width: hp("5%"), 
            height: hp("5%"), 
            borderRadius: hp("2.5%"), 
            marginRight: wp("5%"), 
            justifyContent: "center",
            backgroundColor: COLORS.GREY
          }}
        />
        <View style={styles.settingItem}>
          <Text style={{fontSize: hp("3%")}}>{title}</Text>
          {subItems && <Icon name={isDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} type='material' color={COLORS.GREY}/>}
        </View>
      </TouchableOpacity>
      {
        subItems &&
        <Animated.View style={{
          paddingLeft: wp("25%"), 
          paddingRight: wp("12%"),
          backgroundColor: COLORS.LIGHT_ORANGE,
          height: animDropdown
        }}
        >
          {
            subItems.map((value, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.settingItem, {
                    width: "100%",
                    height: hp("10%")
                  }]}
                  onPress={value.action}
                >
                  {value.text ? 
                    <View style={{flexDirection: "column"}}>
                      <Text style={{fontSize: hp("2.5%"), fontWeight: "bold"}}>{value.title}</Text>
                      <Text style={{fontSize: hp("2.5%"), color: COLORS.GREY}}>{value.text}</Text>
                    </View> :
                    <Text style={{fontSize: hp("2.5%"), fontWeight: "bold"}}>{value.title}</Text>
                  }
                  <Icon name="keyboard-arrow-right" type='material' color={COLORS.GREY}/>
                </TouchableOpacity>
              )
            })
          }
        </Animated.View>
      }
    </>
  )
}

const ProfileScreen = ({route}) => (
  <Stack.Navigator 
    initialRouteName="ProfileScreenContent"
    screenOptions={{
      headerShown: false
    }}
    >
    <Stack.Screen 
      name="ProfileScreenContent"
      component={ProfileScreenContent}
      initialParams={{ authContext: route.params.authContext, localizationContext: route.params.localizationContext }}
    />
    <Stack.Screen
      name="Add Child"
      component={AddChildScreen}
    />
  </Stack.Navigator>
);

const ProfileScreenContent = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const { signOut } = React.useContext(props.route.params.authContext);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{
          flexDirection: "row", 
          justifyContent: "space-between",
          marginTop: hp("10%")
        }}>
          <View>
            <Text style={styles.name}>Hưng Nguyễn</Text>
            <View style={{
              width: wp("35%"), 
              height: hp("3.5%"), 
              backgroundColor: COLORS.STRONG_ORANGE,
              borderRadius: hp("1.75%"),
              marginTop: hp("1%"),
              justifyContent: "center"
            }}>
              <Text style={{
                alignSelf: "center",
                color: COLORS.WHITE,
                fontWeight: "bold"
              }}>
                Subscribed
              </Text>
            </View>
          </View>
          <View>
            <Image
              style={[styles.avatar, {backgroundColor: COLORS.STRONG_ORANGE}]}
              source={require('../../../../assets/parent-avatar.png')}
            />
          </View>
        </View>
      </View>
      <ScrollView>
        <SettingItem key="1" title="Personal Profile" icon="face" subItems={[
          {
            title: "Your name",
            text: "Nguyễn Phú Hưng",
            action: () => props.navigation.navigate("ChangeParentProfile", {screenName: "Your name", value: "Nguyễn Phú Hưng"})
          },
          {
            title: "D.O.B",
            text: "03/08/1999",
            action: () => props.navigation.navigate("ChangeParentProfile", {screenName: "Date of birth", value: "03/08/1999"})
          },
          {
            title: "Phone",
            text: "0987654321",
            action: () => props.navigation.navigate("ChangeParentProfile", {screenName: "Phone", value: "0987654321"})
          },
          {
            title: "Email",
            text: "hungng@gmail.com",
            action: () => props.navigation.navigate("ChangeParentProfile", {screenName: "Email", value: "hungng@gmail.com"})
          }
        ]}/>
        <SettingItem key="2" title="Collaborators" icon="group-add" subItems={[
          {
            title: "Collaborator 1",
            text: "Lâm Lệ Dương",
            action: null
          },
          {
            title: "Add collaborator",
            action: null
          }
        ]}/>
        <SettingItem key="3" title="Children" icon="child-care" subItems={[
          {
            title: "Child 1",
            text: "Nguyễn Phú Hưng Jr.",
            action: null
          },
          {
            title: "Add child",
            action: () => {props.navigation.navigate("Add Child")}
          }
        ]}/>
        <SettingItem key="4" title="Subscription" icon="payment" action={() => {}}/>
        <SettingItem key="5" title="Setting" icon="settings" action={() => {}}/>
        <SettingItem key="6" title="Logout" icon="exit-to-app" action={() => {signOut()}}/>
      </ScrollView>
    </SafeAreaView>
  );
};


export default ProfileScreen;