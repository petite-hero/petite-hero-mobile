import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import styles from './styles/index.css';


const TrackingSettingControlPanel = (props) => {

  const TYPE_ICON = {"Home": {name: "home", color: "#fbc424"}, "Education" : {name: "school", color: "#00ade8"}};

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
          textInputProps={{ onFocus: props.onSearchBarPress }}
          query={{key: 'AIzaSyBvfVumttk96MLwUy-oLqaz3OqtGSIAejk', components: 'country:vn',}}
          debounce={150}
        />
      </View>
      <View style={props.substatus === "SEARCH" ? styles.searchBackBtnFocused : styles.searchBackBtn}>
        <Icon name='keyboard-arrow-left' type='material' size={24} onPress={props.onBackIconPress}/>
      </View>

      {/* panel content */}
      <ScrollView style={props.substatus === "SEARCH" ? styles.panelContentFocused : styles.panelContent}>
        <View style={{flexDirection: "row"}}>
          {/* location list */}
          <View style={{flex: 8}}>
          {props.status === "VIEWING" ? props.locList.map((loc, index) => {
            return (
            <TouchableOpacity key={index} style={styles.locationContainer} onPress={() => props.onLocationItemPress(loc, index)}>
              {loc.type === "Home" || loc.type === "Education" ?
                <View style={[styles.typeIcon, {backgroundColor: TYPE_ICON[loc.type].color}]}>
                  <Icon name={TYPE_ICON[loc.type].name} type='material' color="white"/>
                </View>
              : null}
              <Text style={styles.locationName}>{loc.name} </Text>
              <Text style={styles.locationTime}>{loc.type === "Home" ? "All day" : "From "+loc.fromTime.slice(0, -3)+" to "+loc.toTime.slice(0, -3)}</Text>
              <View style={styles.rightIcon}><Icon name='keyboard-arrow-right' type='material'/></View>
            </TouchableOpacity>
            )
          })
          : null}
          </View>
        </View>
      </ScrollView>

    </View>

  )
}

export default TrackingSettingControlPanel;