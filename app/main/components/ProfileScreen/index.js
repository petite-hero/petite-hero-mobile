import React, { useContext, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, View, Text, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import AddChildScreen from '../AddChildScreen';
import styles from './styles/index.css';

const Stack = createStackNavigator();

const SettingItem = ({title, icon, action, subItems}) => {
  const [isDropdown, setDropdown] = useState(false);
  
  return (
    <>
    <TouchableOpacity style={{
      flexDirection: "row", 
      paddingLeft: wp("10%"), 
      paddingRight: wp("10%"),
      paddingTop: hp("2.5%"),
      paddingBottom: hp("2.5%"),
      backgroundColor: COLORS.NUDE
    }}
      onPress={() => {action ? action() : setDropdown(!isDropdown)}}
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
      isDropdown && subItems &&
      <View style={{
        paddingLeft: wp("25%"), 
        paddingRight: wp("12%"),
        backgroundColor: COLORS.LIGHT_ORANGE
      }}>
        {
          subItems.map((value, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={[styles.settingItem, {
                  width: "100%",
                  paddingTop: hp("2.5%"),
                  paddingBottom: hp("2.5%"),
                }]}
                onPress={value.action}
              >
                
                {value.text ? 
                  <View style={{flexDirection: "column"}}>
                    <Text style={{fontSize: hp("2.5%"), fontWeight: "bold"}}>{value.title}</Text>
                    <Text style={{fontSize: hp("2.5%")}}>{value.text}</Text>
                  </View> :
                  <Text style={{fontSize: hp("2.5%"), fontWeight: "bold"}}>{value.title}</Text>
                }
                <Icon name="keyboard-arrow-right" type='material' color={COLORS.GREY}/>
              </TouchableOpacity>
            )
          })
        }
      </View>
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
            <Text style={styles.name}>Red Sus</Text>
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
        <SettingItem title="Personal Profile" icon="face" subItems={[
          {
            title: "Your name",
            text: "Nguyễn Phú Hưng",
            action: null
          }
        ]}/>
        <SettingItem title="Collaborators" icon="group-add" subItems={[
          {
            title: "Add collaborator",
            action: null
          }
        ]}/>
        <SettingItem title="Children" icon="child-care" subItems={[
          {
            title: "Add child",
            action: () => {props.navigation.navigate("Add Child")}
          }
        ]}/>
        <SettingItem title="Subscription" icon="payment"/>
        <SettingItem title="Setting" icon="settings"/>
        <SettingItem title="Logout" icon="exit-to-app" action={() => {signOut()}}/>
      </ScrollView>
    </SafeAreaView>
  );
};


export default ProfileScreen;