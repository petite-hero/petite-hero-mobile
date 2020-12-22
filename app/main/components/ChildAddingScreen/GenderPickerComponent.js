import React from "react";
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { COLORS } from "../../../const/const";

const GenderPickerComponent = ({t, genders, setGenders}) => {
  const toggleGender = (genderIndex) => {
    let tmp = [...genders];
    tmp.map((value, index) => {
      index === genderIndex ? value.active = true : value.active = false;
    });
    setGenders(tmp);
  }

  return (
    <View style={{
      flexDirection: "column",
      alignItems: "flex-start",
      paddingTop: "2.5%",
      paddingLeft: "10%",
      paddingRight: "10%",
      paddingBottom: "2.5%"
    }}>
      <Text style={{
        fontFamily: "AcuminBold",
        fontSize: 16,
        marginBottom: 15,
        color: COLORS.BLACK
      }}>
        {t("child-add-gender")}
      </Text>
      <View style={{
        flexDirection: "row"
      }}>
        {
          genders.map((value, index) => {
            return (
              <View
                key={index}
                style={{
                  minWidth: 45,
                  height: 45,
                  marginRight: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {toggleGender(index)}}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 45,
                    borderRadius: 22.5,
                    backgroundColor: value.active ? value.color : COLORS.GREY,
                  }}
                >
                  <View style={{
                    alignSelf: "center",
                    alignContent: "flex-start"
                  }}>
                    <Image
                      source={value.title === "Boy" ? require("../../../../assets/icons/boy.png") : require("../../../../assets/icons/girl.png")}
                      style={{width: 25, height: 25, marginLeft: 10}}
                    />
                  </View>
                  {
                    value.active &&
                    <Text style={{
                      alignSelf: "center",
                      textAlign: "center",
                      fontSize: 16,
                      fontFamily: "AcuminBold",
                      color: COLORS.WHITE,
                      marginRight: 15
                    }}>
                      {value.title === "Boy" ? t("child-add-gender-boy") : t("child-add-gender-girl")}
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

export default GenderPickerComponent;