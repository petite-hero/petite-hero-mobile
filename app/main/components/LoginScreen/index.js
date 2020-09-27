import React, { useContext } from 'react';
import { SafeAreaView, View, StyleSheet, Keyboard, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Icon } from 'react-native-elements'
import styles from './styles/index.css';

const LoginScreen = (props) => {

  [location, setLocation] = React.useState({latitude: 10.8413525, longitude: 106.8108569});  // FPT University location
  [searchBarFocused, setSearchBarFocused] = React.useState(false);
  [searchBar, setSearchBar] = React.useState(null);

  navigator.geolocation.getCurrentPosition(
      (data) => {
        setLatitude(data.coords.latitude);
        this.setState({longitude: data.coords.longitude});
      }
  );

  return (
    <SafeAreaView style={styles.container}>
        <View style={{...StyleSheet.absoluteFillObject}}>
          <MapView
            style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
            region={{latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.003, longitudeDelta: 0.003}}
            showsUserLocation={true}
            showsMyLocationButton={false}>
            <Marker coordinate={{latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.003, longitudeDelta: 0.003}} />
          </MapView>
        </View>
        <View style={searchBarFocused ? styles.searchBarContainerFocused : styles.searchBarContainer}>
          <GooglePlacesAutocomplete
            ref={(instance) => { setSearchBar(instance) }}
            styles={searchBarFocused ?
              {textInputContainer: styles.textInputContainerFocused, textInput: styles.textInput, listView: styles.listView} :
              {textInputContainer: styles.textInputContainer, textInput: styles.textInput, listView: styles.listView}}
            placeholder='Search'
            fetchDetails={true}
            onPress={(data, details = null) => {
              setLocation({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng});
              setSearchBarFocused(false);
              searchBar.setAddressText("");
            }}
            textInputProps={{
              onFocus: () => setSearchBarFocused(true),
            }}
            query={{key: 'AIzaSyBvfVumttk96MLwUy-oLqaz3OqtGSIAejk', components: 'country:vn',}}
            debounce={150}
          />
        </View>
        <View style={searchBarFocused ? styles.searchBackBtnFocused : styles.searchBackBtn}>
          <Icon name='arrow-left' type='font-awesome'
            onPress={() => {
              setSearchBarFocused(false);
              Keyboard.dismiss();
            }}/>
        </View>
    </SafeAreaView>
  );
};

export default LoginScreen;