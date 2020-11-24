import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import styles from './styles/index.css';


const TrackingSettingControlPanel = (props) => {

  const ICONS = {"Home": require("../../../../assets/icons/home.png"), "Education": require("../../../../assets/icons/school.png"), "Others": require("../../../../assets/icons/others.png")};

  return (

    <View style={props.substatus === "SEARCH" ? styles.controlPanelFocused : styles.controlPanel}>

      {/* search bar */}
      <View style={props.substatus === "SEARCH" ? styles.searchBarContainerFocused : styles.searchBarContainer}>
        <GooglePlacesAutocomplete
          ref={(instance) => { props.setSearchBar(instance) }}
          styles={props.substatus === "SEARCH" ?
            {textInputContainer: styles.textInputContainerFocused, textInput: styles.textInputFocused, listView: styles.listView, row: styles.searchRow} :
            {textInputContainer: styles.textInputContainer, textInput: styles.textInput}}
          placeholder='Choose location...'
          fetchDetails={true}
          enablePoweredByContainer={false}
          autoFocus={false}
          onPress={props.onSearchResultPress}
          textInputProps={{ onFocus: props.onSearchBarPress, maxLength: 100 }}
          query={{key: 'AIzaSyBvfVumttk96MLwUy-oLqaz3OqtGSIAejk', components: 'country:vn',}}
          debounce={150}
        />
      </View>
      <TouchableOpacity style={props.substatus === "SEARCH" ? styles.searchBackBtnFocused : styles.searchBackBtn} onPress={props.onBackIconPress}>
        <Image source={require("../../../../assets/icons/back.png")} style={{width: 26, height: 26}} />
      </TouchableOpacity>

      {/* panel content */}
      <ScrollView style={props.substatus === "SEARCH" ? styles.panelContentFocused : styles.panelContent}>
        {/* list placeholder */}
        {props.locList.length == 0 ? <Text style={styles.locationPlaceholder}>There is no safe zone yet.</Text> : null}
        {/* location list */}
        <View>
          {props.status === "VIEWING" ? props.locList.map((loc, index) => {
            return (
            <TouchableOpacity key={index} style={styles.locationContainer} onPress={() => props.onLocationItemPress(loc, index)}>
              {loc.type === "Home" || loc.type === "Education" ?
                <View style={styles.typeIcon}>
                  <Image source={ICONS[loc.type]} style={{width: 40, height: 40}} />
                </View>
                :
                <View style={styles.typeIcon}>
                  <Image source={ICONS["Others"]} style={{width: 40, height: 40}} />
                </View>
              }
              <Text style={styles.locationName}>{loc.name} </Text>
              <Text style={styles.locationTime}>{loc.type === "Home" ? "All day" : "From "+loc.fromTime.slice(0, -3)+" to "+loc.toTime.slice(0, -3)}</Text>
              <View style={styles.rightIcon}>
                <Image source={require("../../../../assets/icons/forth.png")} style={{width: 30, height: 30}} />
              </View>
            </TouchableOpacity>
            )
          })
          : null}
        </View>
      </ScrollView>

    </View>

  )
}

export default TrackingSettingControlPanel;