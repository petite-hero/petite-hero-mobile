import React, { useContext, useState } from 'react';
import { SafeAreaView, View, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';

const SettingItem = ({title, icon}) => {
  const [isDropdown, setDropdown] = useState(false);
  return (
    <View style={{
      flexDirection: "row", 
      paddingLeft: wp("10%"), 
      paddingRight: wp("10%"),
      paddingTop: hp("2.5%"),
      paddingBottom: hp("2.5%")
    }}>
      <View style={{width: hp("5%"), height: hp("5%"), borderRadius: hp("2.5%"), marginRight: wp("5%"), backgroundColor: COLORS.STRONG_ORANGE}}></View>
      <View style={styles.settingItem}>
        <Text style={{fontSize: hp("3%")}}>{title}</Text>
        <Image source={{uri: icon}}/>
      </View>
    </View>
  )
}

const ProfileScreen = (props) => {
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
            <View style={styles.avatar}></View>
          </View>
        </View>
      </View>
      <ScrollView>
        <SettingItem title="Personal Profile" icon="abc"/>
        <SettingItem title="Collaborators" icon="abc"/>
        <SettingItem title="Subscription" icon="abc"/>
        <SettingItem title="Setting" icon="abc"/>
        <SettingItem title="Logout" icon="abc"/>
      </ScrollView>
    </SafeAreaView>
  );
};


export default ProfileScreen;