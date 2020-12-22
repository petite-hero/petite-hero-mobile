import React, { useContext, useRef, useState } from 'react';
import { Image, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';

const SLIDE_WIDTH = wp("100%");

const slides = [
  {
    id: 1,
    image: require("../../../../assets/gif/welcome_1.gif"),
    text: "Approriate way to track your children's location."
  },
  {
    id: 2,
    image: require("../../../../assets/gif/welcome_2.gif"),
    text: "Simple way to deliver and manage daily tasks of your children."
  },
  {
    id: 3,
    image: require("../../../../assets/gif/welcome_3.gif"),
    text: "Inspirational way to give your children challenges and achievements."
  }
]

const Slide = ({source}) => {
  return (
    <Image
      source={source}
      style={{
        width: SLIDE_WIDTH,
        height: "100%"
      }}
    />
  );
}

const OpeningScreen = (props) => {
  const { t } = useContext(props.route.params.localizationContext);
  const refSlideContainer = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={refSlideContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        scrollEnabled={true}
        scrollEventThrottle={3}
        onMomentumScrollEnd={({nativeEvent}) => {
          setCurrentIndex(Math.round(nativeEvent.contentOffset.x / SLIDE_WIDTH));
        }}
      >
        {slides.map((slide, index) => (
          <View key={index + ""}>
            <Slide source={slide.image}/>
            <Text style={{
              position: "absolute",
              left: "10%",
              right: "10%",
              top: index === 1 ? "15%" : "78%",
              textAlign: "center",
              fontFamily: "Montserrat",
              color: COLORS.BLACK,
              fontSize: 16
            }}>
              {slide.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={{
        position: "absolute",
        top: "90%",
        width: wp("80%"),
        marginLeft: "10%",
        marginRight: "10%",
        flexDirection: "row",
        justifyContent: "space-between",
        elevation: 1
      }}>
        <TouchableOpacity onPress={() => {
          props.navigation.navigate("Welcome");
        }}>
          <Text style={{
            fontFamily: "MontserratBold",
            fontSize: 16,
            color: COLORS.BLACK
          }}>
            {t("opening-skip")}
          </Text>
        </TouchableOpacity>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {
            slides.map((value, index) => (
              <View 
              key={index + ""}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginRight: 8,
                backgroundColor: index === currentIndex ? COLORS.STRONG_CYAN : COLORS.GREY
              }}/>
            ))
          }
        </View>
        <TouchableOpacity>
          <Text style={{
            fontFamily: "MontserratBold",
            fontSize: 16,
            color: COLORS.STRONG_CYAN
          }}
            onPress={() => {
              if (currentIndex < slides.length - 1) {
                refSlideContainer.current.scrollTo({x: SLIDE_WIDTH * (currentIndex + 1)});
                setCurrentIndex(currentIndex + 1);
              } else {
                props.navigation.navigate("Welcome");
              }
            }}
          >
            {t("opening-next")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OpeningScreen;