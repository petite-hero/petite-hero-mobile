import React, { useContext } from 'react';
import { SafeAreaView, View, Text, Image } from 'react-native';
import { COLORS } from '../../../const/color';
import styles from './styles/index.css';

const ProfileScreen = (props) => {
  const { t } = useContext(props.route.params.locale);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          style={[styles.avatar, {backgroundColor: COLORS.STRONG_ORANGE}]}
          // source={{uri: "https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.15752-9/118881393_430697914571214_4949863648741553269_n.jpg?_nc_cat=107&_nc_sid=ae9488&_nc_ohc=CRL20t0CXSoAX-UGsNg&_nc_ht=scontent.fsgn2-3.fna&oh=8a78db6a5556a3e8d4039464250d0c91&oe=5F91B50E"}}
        />
      </View>
      <View style={styles.informationContainer}>
        <Text style={styles.name}>{t('hero-test')}</Text>
        <Text style={styles.message}>
          {t("profile-lorem")}
        </Text>
      </View>
      <View style={styles.profileBoard}>
        <Image 
            style={styles.circle}
            source={{uri: "https://jooinn.com/images/white-11.jpg"}}
        />
        <Image
            style={styles.settingItem}
            source={{uri: "https://jooinn.com/images/white-11.jpg"}}
        />
        <Image 
            style={styles.settingItem}
            source={{uri: "https://jooinn.com/images/white-11.jpg"}}
        />
        <Image 
            style={styles.settingItem}
            source={{uri: "https://jooinn.com/images/white-11.jpg"}}
        />
        <Image 
            style={styles.settingItem}
            source={{uri: "https://jooinn.com/images/white-11.jpg"}}
        />
      </View>
    </SafeAreaView>
  );
};


export default ProfileScreen;