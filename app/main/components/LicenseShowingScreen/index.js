import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import Header from '../../../base/components/Header';
import { PORT } from '../../../const/const';
import { fetchWithTimeout } from '../../../utils/fetch';
import { Loader } from '../../../utils/loader';
import { showMessage } from '../../../utils/showMessage';
import styles from './styles/index.css';

const LicenseShowingScreen = (props) => {
  const [licenseEn, setLicenseEn] = useState("");
  const [licenseVn, setLicenseVn] = useState("");

  const getLicense = async() => {
    try {
      const ip = await AsyncStorage.getItem("IP");
      const response = await fetchWithTimeout("http://" + ip + PORT + "/config", {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type' : "application/json"
        }
      });
      const result = await response.json();
      console.log(result);
      if (result.code === 200) {
        const en = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="utf-8">
            <title>Petite Hero</title>
          </head>
          <body>
            <span style="font-size: 35px">
              ${result.data.license_EN}
            </span>
          </body>
          </html>`;
        const vi = `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
        <meta charset="utf-8">
          <title>Petite Hero</title>
        </head>
        <body>
          <span style="font-size: 35px">
            ${result.data.license_VN}
          </span>
        </body>
        </html>`;
        setLicenseEn(en);
        setLicenseVn(vi);
      }
    } catch (error) {
      showMessage(error.message);
    }
  }

  useEffect(() => {
    getLicense();
  }, []);

  return (
    (!licenseEn || !licenseVn) ? <Loader loading={true}/> :
    <View style={styles.container}>
      <Header navigation={props.navigation} title={"License & Policy"}/>
      <WebView
        style={{
          marginLeft: "10%",
          marginRight: "10%"
        }}
        originWhitelist={['*']}
        source={{
          baseUrl: "",
          html: licenseVn
        }}
      />
    </View>
  )
}

export default LicenseShowingScreen;