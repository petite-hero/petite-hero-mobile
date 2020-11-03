import React, { useContext, useRef, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import Animated, { Easing } from 'react-native-reanimated';
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
        marginLeft: "10%", 
        marginRight: "10%",
        marginBottom: hp("2.5%"),
        paddingTop: hp("1%"),
        paddingBottom: hp("1%"),
        borderRadius: hp("4%"),
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
      }}
        onPress={() => {action ? action() : dropdownSubItems(subItems.length)}}
      >
        <Icon 
          name={icon}
          type='material'
          color={COLORS.STRONG_CYAN}
          style={{
            width: hp("5%"), 
            height: hp("5%"), 
            marginRight: wp("1%"), 
            marginLeft: wp("1%"), 
            justifyContent: "center",
          }}
        />
        <View style={styles.settingItem}>
          <Text style={{
            fontSize: 20,
            fontFamily: "Acumin",
            color: COLORS.STRONG_CYAN
          }}>
            {title}
          </Text>
          {subItems && <Icon name={isDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} type='material' color={COLORS.GREY}/>}
        </View>
      </TouchableOpacity>
      {
        subItems &&
        <Animated.View style={{
          paddingLeft: wp("25%"), 
          paddingRight: wp("12%"),
          backgroundColor: COLORS.LIGHT_CYAN,
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
                      <Text style={{
                        fontSize: hp("2.5%"),
                        fontFamily: "AcuminBold"
                      }}>
                        {value.title}
                      </Text>
                      <Text style={{
                        fontSize: hp("2.5%"),
                        fontFamily: "Acumin",
                        color: COLORS.GREY
                      }}>
                        {value.text}
                      </Text>
                    </View> :
                    <Text style={{
                      fontSize: hp("2.5%"),
                      fontFamily: "AcuminBold"
                    }}>
                      {value.title}
                    </Text>
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
  </Stack.Navigator>
);

const ProfileScreenContent = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const { signOut } = React.useContext(props.route.params.authContext);
  return (
    <View style={styles.container}>
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
              backgroundColor: COLORS.STRONG_CYAN,
              borderRadius: hp("1.75%"),
              marginTop: hp("1%"),
              justifyContent: "center"
            }}>
              <Text style={{
                fontFamily: "AcuminBold",
                alignSelf: "center",
                color: COLORS.WHITE
              }}>
                Subscribed
              </Text>
            </View>
          </View>
          <View>
            <Image
              style={[styles.avatar, {backgroundColor: COLORS.STRONG_CYAN}]}
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
            action: () => {props.navigation.navigate("AddChild")}
          }
        ]}/>
        <SettingItem key="4" title="Subscription" icon="payment" action={() => {}}/>
        <SettingItem key="5" title="Setting" icon="settings" action={() => {}}/>
        <SettingItem key="6" title="Logout" icon="exit-to-app" action={() => {signOut()}}/>
      </ScrollView>
    </View>
  );
};


export default ProfileScreen;