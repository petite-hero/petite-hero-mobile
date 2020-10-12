class Drawer{

  static LOC_FPT = {latitude: 10.8414846, longitude: 106.8100464};
  static LOCATION_ZOOM = {latitudeDelta: 0.024, longitudeDelta: 0.012};

  static lngLatToXY(lng, lat, midLat){
    let x = lng*Math.cos(midLat*Math.PI/180);
    let y = lat;
    return [x, y];
  }

  static xYToLngLat(x, y, midLat){
    let lng = x/Math.cos(midLat*Math.PI/180);
    let lat = y;
    return [lng, lat];
  }

  
  static realLocList = [
    {"latitude": 10.8464846, "longitude": 106.8150464, "time": 123},
    {"latitude": 10.8514846, "longitude": 106.8200464, "time": 123},
    {"latitude": 10.8514846, "longitude": 106.8250464, "time": 123},
    {"latitude": 10.8514846, "longitude": 106.8300464, "time": 123},
    {"latitude": 10.8514846, "longitude": 106.8350464, "time": 123},
    {"latitude": 10.8464846, "longitude": 106.8350464, "time": 123},
    {"latitude": 10.8354846, "longitude": 106.8310464, "time": 123},
  ]
  static locFPT = {
    "inPadding": 20,
    "inTime": {
      "hour": 19,
      "minute": 33,
    },
    "latitude": 10.8414846,
    "longitude": 106.8100464,
    "name": "Đại học FPT TP.HCM",
    "outPadding": 20,
    "outTime": {
      "hour": 20,
      "minute": 33,
    },
    "radius": 59.375,
    };
  static locLandmark = {
    "inPadding": 20,
    "inTime": {
      "hour": 21,
      "minute": 33,
    },
    "latitude": 10.794886,
    "longitude": 106.7219853,
    "name": "Landmark 81",
    "outPadding": 20,
    "outTime": {
      "hour": 23,
      "minute": 33,
    },
    "radius": 59.375,
  };

}

export default Drawer;