import React, { useRef, useState } from 'react';
import { Image, View, TouchableOpacity, Text, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';

const SLIDE_WIDTH = wp("100%");

const slides = [
  {
    id: 1,
    image: require("../../../../assets/gif/welcome.gif")
  },
  {
    id: 2,
    image: require("../../../../assets/gif/2.gif")
  },
  {
    id: 3,
    image: require("../../../../assets/gif/3.gif")
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
  const refSlideContainer = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        ref={refSlideContainer}
        renderItem={({item, index}) => <Slide source={item.image}/>}
        keyExtractor={item => item.id + ""}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        scrollEnabled={true}
        initialNumToRender={3}
        scrollEventThrottle={3}
        onMomentumScrollEnd={({nativeEvent}) => {
          setCurrentIndex(Math.round(nativeEvent.contentOffset.x / SLIDE_WIDTH));
        }}
      />
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
            fontSize: 16
          }}>
            Skip
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
                refSlideContainer.current.scrollToIndex({index: currentIndex + 1});
                setCurrentIndex(currentIndex + 1);
              } else {
                props.navigation.navigate("Welcome");
              }
            }}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OpeningScreen;