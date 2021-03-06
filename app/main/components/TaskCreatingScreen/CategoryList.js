import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';

const CategoryList = ({t, navigation, categories, setCategories}) => {
  const toggleCategory = (categoryIndex) => {
    let tmp = [...categories];
    tmp.map((value, index) => {
      index === categoryIndex ? value.active = true : value.active = false;
    });
    setCategories(tmp);
  }

  return (
    <View style={styles.categoryList}>
      <Text style={[styles.title, {marginBottom: 15}]}>
        {t("task-add-category")}
      </Text>
      <View style={{flexDirection: "row"}}>
        {
          categories.map((value, index) => {
            return (
              <View
                key={index}
                style={{
                  minWidth: 45,
                  height: 45,
                  marginRight: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {toggleCategory(index)}}
                  activeOpacity={0.8}
                  style={[styles.categoryButton, {backgroundColor: value.active ? value.color : COLORS.GREY}]}
                >
                  <Image
                    source={value.name === "Housework" ? require("../../../../assets/icons/housework.png")
                          : value.name === "Education" ? require("../../../../assets/icons/education.png")
                          : require("../../../../assets/icons/skills.png")}
                    style={{width: 45, height: 45}}
                  />
                  {
                    value.active &&
                    <Text style={styles.categoryText}>
                      {value.title}
                    </Text>
                  }
                </TouchableOpacity>
              </View>
            )
          }) 
        }
      </View>
      <TouchableOpacity
        onPress={() => {navigation.navigate("TaskStatistics")}}
        activeOpacity={0.8}
        style={[styles.categoryButton, {
          position: "absolute",
          top: 48,
          right: widthPercentageToDP("10%"),
          width: 45,
          borderWidth: 1,
          justifyContent: "center",
          borderColor: COLORS.STRONG_CYAN,
          backgroundColor: COLORS.WHITE,
        }]}
      >
        <Image
          source={require("../../../../assets/icons/info.png")}
          style={{width: 45, height: 45}}
        />
      </TouchableOpacity>
    </View>
  )
}

export default CategoryList;