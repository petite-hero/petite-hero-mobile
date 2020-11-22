import React, { useContext, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { badgesList, COLORS } from '../../../const/const';
import styles from './styles/index.css';

const BadgeItem = (item, index, badge, setBadge) => {
  return (
    <TouchableOpacity style={{
      width: widthPercentageToDP("18%"),
      height: widthPercentageToDP("18%"),
      borderRadius: widthPercentageToDP("9%"),
      marginRight: "2%",
      backgroundColor: COLORS.LIGHT_CYAN,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderWidth: item.id === badge.id ? 3 : 0,
      borderColor: COLORS.STRONG_CYAN
    }}
      onPress={() => {setBadge(item)}}
    >
      <Image
        source={item.image}
        style={{
          width: "90%",
          height: "90%"
        }}
      />
    </TouchableOpacity>
  )
};

const QuestChoosingBadgeScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const [badge, setBadge] = useState(props.route.params.badge);

  return (
    <View style={styles.container}>
      <View style={{
        width: "100%",
        height: widthPercentageToDP("100%"),
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: "hidden"
      }}>
        <Image
          source={badge.image}
          style={{height: "100%", width: "100%"}}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            left: "10%",
            top: "15%",
            width: widthPercentageToDP("10%"),
            height: widthPercentageToDP("10%"),
            borderRadius: widthPercentageToDP("5%"),
            backgroundColor: COLORS.WHITE,
            alignItems: "center",
            justifyContent: "center",
            elevation: 10
          }}
          onPress={() => {props.navigation.goBack()}}
        >
          <Image
            source={require("../../../../assets/icons/back.png")}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      </View>
      <View style={{
        marginTop: "5%",
        marginLeft: "10%",
        marginRight: "10%",
      }}>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 20,
          marginTop: "5%"
        }}>
          {t("quest-add-choose-reward-icon")}
        </Text>
      </View>
      <View style={{
        height: "30%",
        marginTop: "5%",
        marginLeft: "10%",
        marginRight: "10%"
      }}>
        <FlatList
          data={badgesList}
          renderItem={({item, index}) => BadgeItem(item, index, badge, setBadge)}
          ItemSeparatorComponent={() => <View style={{margin: "2%"}}></View>}
          keyExtractor={item => item.id + ""}
          showsVerticalScrollIndicator={false}
          numColumns={4}
        />
      </View>
      {/* button Choose */}
      <TouchableOpacity style={{
        marginLeft: "10%",
        marginRight: "10%",
        marginTop: "10%",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        height: heightPercentageToDP("5%"),
        backgroundColor: COLORS.YELLOW
      }}
        onPress={() => {props.route.params.onGoBack(badge); props.navigation.goBack()}}
      >
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 16,
          color: COLORS.BLACK
        }}>
          OK
        </Text>
      </TouchableOpacity>
      {/* end button Choose */}
    </View>
  )
}

export default QuestChoosingBadgeScreen;