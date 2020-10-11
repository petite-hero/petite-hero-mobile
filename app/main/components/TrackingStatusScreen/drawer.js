import { Picker } from "@react-native-community/picker";

class Drawer{

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

  static getPointFromPointAngleDistDir(x0, y0, k, t, xB){
    let x = t/Math.sqrt(k*k+1);
    if (xB-x0 > 0) x = -x;
    let y = k*x ;
    return [x+x0, y+y0];
  }

  static getPointsFromPointAngleDistDir(x0, y0, k, t, yB){
    let x = t/Math.sqrt(k*k+1);
    if (yB-y0 > 0) x = -x;
    let y = k*x ;
    return  [x+x0, y+y0, -x+x0, -y+y0];
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
    let d = t*1;  // left & right padding

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
    console.log(result);
    return result;

  }

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