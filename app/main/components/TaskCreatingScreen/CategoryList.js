import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';

const CategoryList = ({t, categories, setCategories}) => {
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
    </View>
  )
}

export default CategoryList;