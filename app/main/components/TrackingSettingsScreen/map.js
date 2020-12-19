import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import MapView, { Marker, Circle, Polygon, Polyline }  from 'react-native-maps';

import styles from './styles/index.css';
import { COLORS, changeOpac } from "../../../const/const";

import Util from "./util";


const TrackingSettingMap = (props) => {

  const TYPE_COLORS = {"None": COLORS.GREEN, "Home": COLORS.YELLOW, "Education": COLORS.STRONG_CYAN};
  const TYPE_PINS = {"None": require("../../../../assets/icons/pin-others.png"), "Home": require("../../../../assets/icons/pin-home.png"), "Education": require("../../../../assets/icons/pin-school.png")}

  const [quadBorder, setQuadBorder] = React.useState([Util.LOC_FPT, Util.LOC_FPT, Util.LOC_FPT, Util.LOC_FPT, Util.LOC_FPT]);
  const [lastUpdate, setLastUpdate] = React.useState(new Date().getTime());
  const [vertex1, setVertex1] = React.useState(Util.LOC_FPT);
  const [vertex2, setVertex2] = React.useState(Util.LOC_FPT);
  const [vertex3, setVertex3] = React.useState(Util.LOC_FPT);
  const [vertex4, setVertex4] = React.useState(Util.LOC_FPT);
  const setVertices = [setVertex1, setVertex2, setVertex3, setVertex4];

  const handleVertexDrag = (event, vertexIndex) => {
    const now = new Date().getTime();
    if (now - lastUpdate > 50){
      const coor = event.nativeEvent.coordinate;
      let tmp = [...quadBorder];
      tmp[vertexIndex] = coor;
      if (vertexIndex == 0) tmp[4] = coor;
      setQuadBorder(tmp);
      setLastUpdate(now);
    }  
  }

  const handleVertexDragFinished = async (event, vertexIndex) => {
    const coor = event.nativeEvent.coordinate;
    let tmp = [...props.lQuad]; tmp[vertexIndex] = coor;
    if (!Util.isValidQuad(tmp)){
      let oldVertex = (Object.assign({}, props.lQuad[vertexIndex]));
      oldVertex.latitude += new Date().getMilliseconds()/100000000;
      setVertices[vertexIndex](oldVertex);
      let tmp2 = [...props.lQuad]; tmp2.push(tmp2[0]); setQuadBorder(tmp2);
    }
    else{
      props.setLQuad(tmp);
      let tmp2 = [...tmp]; tmp2.push(tmp2[0]); setQuadBorder(tmp2);
    }
  }

  React.useEffect(() => {
    if (props.status === "SETTING_LOC_NEW" || props.status === "SETTING_LOC"){
      let tmp = [...props.lQuad];
      tmp.push(tmp[0]);
      setQuadBorder(tmp);
      setVertex1(props.lQuad[0]);
      setVertex2(props.lQuad[1]);
      setVertex3(props.lQuad[2]);
      setVertex4(props.lQuad[3]);
    }
  }, [props.status]);
  
  return ([

    // map
    <View key={0} style={{...StyleSheet.absoluteFillObject}}>

      <MapView
        ref={(instance) => { props.setMap(instance) }}
        style={{width: Dimensions.get("screen").width, height: Dimensions.get("screen").height}}
        initialRegion={Util.REGION_FPT}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChangeComplete={props.onRegionChangeComplete}>

        {/* viewing state | showing location markers */}
        {props.status === "VIEWING" ? props.locList.map((loc, index) => {
          return (
            <Marker key={index} coordinate={{latitude: loc.latitude, longitude: loc.longitude}}>
              <Image source={TYPE_PINS[loc.type]} style={{width: 50, height: 50}} />
            </Marker>
          )
        })
        : null}

        {/* reactangle when setting location */}
        {props.status === "SETTING_LOC_NEW" || props.status === "SETTING_LOC" ? [
          <Polygon key={0} coordinates={props.lQuad} strokeWidth={0} fillColor={changeOpac(TYPE_COLORS[props.lType], 0.5)} />,
          <Polyline key={1} coordinates={quadBorder} strokeWidth={1} strokeColor={TYPE_COLORS[props.lType]} />,
          <Marker key={2} coordinate={vertex1} draggable onDrag={(event) => handleVertexDrag(event, 0)} onDragEnd={(event) => handleVertexDragFinished(event, 0)} anchor={{x: 0.5, y: 0.5}}><View style={[styles.safeLoc, {backgroundColor: TYPE_COLORS[props.lType]}]}/></Marker>,
          <Marker key={3} coordinate={vertex2} draggable onDrag={(event) => handleVertexDrag(event, 1)} onDragEnd={(event) => handleVertexDragFinished(event, 1)} anchor={{x: 0.5, y: 0.5}}><View style={[styles.safeLoc, {backgroundColor: TYPE_COLORS[props.lType]}]}/></Marker>,
          <Marker key={4} coordinate={vertex3} draggable onDrag={(event) => handleVertexDrag(event, 2)} onDragEnd={(event) => handleVertexDragFinished(event, 2)} anchor={{x: 0.5, y: 0.5}}><View style={[styles.safeLoc, {backgroundColor: TYPE_COLORS[props.lType]}]}/></Marker>,
          <Marker key={5} coordinate={vertex4} draggable onDrag={(event) => handleVertexDrag(event, 3)} onDragEnd={(event) => handleVertexDragFinished(event, 3)} anchor={{x: 0.5, y: 0.5}}><View style={[styles.safeLoc, {backgroundColor: TYPE_COLORS[props.lType]}]}/></Marker>
        ] : null}

      </MapView>

    </View>,

    // fixed pin
    props.status === "PINNING" ?
      <View key={1} style={styles.fixedPin}>
        <Image source={require("../../../../assets/icons/pin-default.png")} style={{width: 50, height: 50}} />
      </View>
    : null

  ])
}

export default TrackingSettingMap;