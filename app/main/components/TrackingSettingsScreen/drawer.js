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

  static getPointFromPointAngleDistDir(x0, y0, k, t, x1){
    let X = t/Math.sqrt(k*k+1);
    if (x0-x1 < 0) X = -X;
    let Y = k*X ;
    return [X+x0, Y+y0];
  }

  static getPointsFromPointAngleDistDir(x0, y0, m, d, y1){
    let X = d/Math.sqrt(m*m+1);
    if (y0-y1 < 0) X = -X;
    let Y = m*X ;
    return  [X+x0, Y+y0, -X+x0, -Y+y0];
  }

  static getZoneFromLoc(latA, lngA, latB, lngB, midLat){
    
    let result = [];

    // convert to x, y
    let [xA, yA] = this.lngLatToXY(lngA, latA, midLat);
    let [xB, yB] = this.lngLatToXY(lngB, latB, midLat);
    if (yB === yA) yB += 0.0001;  // special case
    if (xB === xA) xB += 0.0001;  // special case

    // calculate needed parameters
    let lengthAB = Math.sqrt(Math.pow(xB-xA, 2)+Math.pow(yB-yA, 2));  // Pythagoras
    let k = (yB-yA)/(xB-xA);  // tan(alpha)
    let m = -1/k;  // tan (beta)
    let t = lengthAB*0.2;  // top & bottom padding
    let d = lengthAB*0.2;  // left & right padding

    // calculate points
    let [xA_, yA_] = this.getPointFromPointAngleDistDir(xA, yA, k, t, xB);
    let [xB_, yB_] = this.getPointFromPointAngleDistDir(xB, yB, k, t, xA);
    let [xC, yC, xF, yF] = this.getPointsFromPointAngleDistDir(xA_, yA_, m, d, yB);
    let [xE, yE, xD, yD] = this.getPointsFromPointAngleDistDir(xB_, yB_, m, d, yA);

    // convert to long lat
    let [lngC, latC] = this.xYToLngLat(xC, yC, midLat);
    let [lngF, latF] = this.xYToLngLat(xF, yF, midLat);
    let [lngD, latD] = this.xYToLngLat(xD, yD, midLat);
    let [lngE, latE] = this.xYToLngLat(xE, yE, midLat);

    // return result
    result.push({latitude: latC, longitude: lngC});
    result.push({latitude: latD, longitude: lngD});
    result.push({latitude: latE, longitude: lngE});
    result.push({latitude: latF, longitude: lngF});
    return result;

  }

  static locFPT = {
    "inPadding": 20,
    "fromTime": "19:33:00",
    "latitude": 10.8414846,
    "longitude": 106.8100464,
    "name": "Đại học FPT TP.HCM",
    "outPadding": 20,
    "toTime": "20:33:00",
    "radius": 59.375,
    };
  static locLandmark = {
    "inPadding": 20,
    "fromTime": "21:33:00",
    "latitude": 10.794886,
    "longitude": 106.7219853,
    "name": "Landmark 81",
    "outPadding": 20,
    "toTime": "23:33:00",
    "radius": 59.375,
  };

}

export default Drawer;