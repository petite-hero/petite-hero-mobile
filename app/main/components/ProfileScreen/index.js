import React, { useContext, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, View, Text, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import AddChildScreen from '../AddChildScreen';
import styles from './styles/index.css';

const Stack = createStackNavigator();

const SettingItem = ({title, icon, subItems}) => {
  const [isDropdown, setDropdown] = useState(false);
  
  return (
    <>
    <TouchableOpacity style={{
      flexDirection: "row", 
      paddingLeft: wp("10%"), 
      paddingRight: wp("10%"),
      paddingTop: hp("2.5%"),
      paddingBottom: hp("2.5%")
    }}
      onPress={() => {setDropdown(!isDropdown)}}
    >
      <View style={{width: hp("5%"), height: hp("5%"), borderRadius: hp("2.5%"), marginRight: wp("5%"), backgroundColor: COLORS.STRONG_ORANGE}}></View>
      <View style={styles.settingItem}>
        <Text style={{fontSize: hp("3%")}}>{title}</Text>
        <Image source={{uri: icon}}/>
      </View>
    </TouchableOpacity>
    {
      isDropdown && subItems &&
      <TouchableOpacity style={{
        paddingLeft: wp("10%"), 
        paddingRight: wp("10%"),
        paddingTop: hp("2.5%"),
        paddingBottom: hp("2.5%")
      }}>
        {
          subItems.map((value, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.settingItem}
                onPress={value.action}
              >
                <Text style={{fontSize: hp("2.5%")}}>{value.title}</Text>
              </TouchableOpacity>
            )
          })
        }
      </TouchableOpacity>
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{
          flexDirection: "row", 
          justifyContent: "space-between",
          marginTop: hp("10%")
        }}>
          <View>
            <Text style={styles.name}>An Khang</Text>
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
        <SettingItem title="Personal Profile" icon="abc"/>
        <SettingItem title="Collaborators" icon="abc"/>
        <SettingItem title="Children" icon="abc" subItems={[
          {
            title: "Add child",
            action: () => {props.navigation.navigate("Add Child")}
          },
        ]}/>
        <SettingItem title="Subscription" icon="abc"/>
        <SettingItem title="Setting" icon="abc"/>
        <SettingItem title="Logout" icon="abc"/>
      </ScrollView>
    </SafeAreaView>
  );
};


export default ProfileScreen;