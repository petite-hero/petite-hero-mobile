import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../const/const';
import styles from './styles/index.css';

// represent an item in date list
const DateItem = ({item, index, currentIndex, refDateFlatlist, setCurrentIndex, setDate, setLoading, disabled}) => {
  return (
    <View>
      {
        item.numOfHandedTasks > 0 &&
        <View style={{
          position: "absolute",
          width: 10,
          height: 10,
          borderRadius: 5,
          right: 0,
          backgroundColor: COLORS.PURPLE,
          elevation: 8
        }}/>
      }
      {index !== currentIndex ?
      (
        <TouchableOpacity style={styles.dateContainer}
          disabled={disabled}
          onPress={() => {
            refDateFlatlist.current.scrollToIndex({index: index - 2 > 0 ? index - 2 : 0})
            setCurrentIndex(index);
            setLoading(true);
            const tmp = item.year + "-" + (item.monthNum + 1 >= 10 ? item.monthNum + 1 : "0" + (item.monthNum + 1)) + "-" + item.day;
            setDate(new Date((new Date(tmp).toDateString())).getTime());
          }}>
          <Text style={styles.dateText}>{item.dayOfWeek}</Text>
          <Text style={styles.dateNum}>{item.day}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.dateContainer, styles.dateActiveContainer]} disabled={disabled}>
          <Text style={[styles.dateText, styles.dateTextActive]}>{item.dayOfWeek}</Text>
          <Text style={[styles.dateNum, styles.dateTextActive]}>{item.day}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
};

export default DateItem;