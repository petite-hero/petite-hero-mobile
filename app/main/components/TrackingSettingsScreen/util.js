class Util{

  // map consts
  static MAP_ZOOM = {latitudeDelta: 0.012, longitudeDelta: 0.006};
  static LOC_FPT = {latitude: 10.8414846, longitude: 106.8100464};
  static REGION_FPT = {latitude: 10.8414846, longitude: 106.8100464,
    latitudeDelta: this.MAP_ZOOM.latitudeDelta, longitudeDelta: this.MAP_ZOOM.longitudeDelta};
  
  // conversion consts
  static MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  static WEEKDAYS_ABB = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


  // ===== CALCULATIONS =====

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
    return result;

  }

  static getRectFromLoc = (lat, lng) => {
    const LAT_DELTA = 0.0016;
    const LNG_DELTA = 0.001;
    let result = [];
    result.push({latitude: lat+LAT_DELTA, longitude: lng-LNG_DELTA});
    result.push({latitude: lat+LAT_DELTA, longitude: lng+LNG_DELTA});
    result.push({latitude: lat-LAT_DELTA, longitude: lng+LNG_DELTA});
    result.push({latitude: lat-LAT_DELTA, longitude: lng-LNG_DELTA});
    return result;
  }

  static calLocSettingContainerHeight = (itemNum) => {
    const ITEM_HEIGHT = 56;
    const MIN = 74 + 2*ITEM_HEIGHT;
    const MAX = 74 + 4*ITEM_HEIGHT;
    let result = 74 + itemNum*ITEM_HEIGHT;
    if (result < MIN) return MIN;
    if (result > MAX) return MAX;
    return result;
  }

  // ===== END CALCULATIONS =====
  

  // ===== CONVERSIONS =====

  static dateToHour0(date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  static numberTo2Digits(num) {
    return num < 10 ? "0"+num : num;
  }

  static dateToStr(date) {
    return this.MONTHS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
  }

  static strToDate(str) {
    const hour = str.slice(0, 2);
    const minute = str.slice(3, 5);
    let date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  static repeatArrToShowStr = (repeatArr) => {
    let result = "";
    let count = 0;
    this.WEEKDAYS_ABB.map((day, index) => {
      if (repeatArr[index]){
        if (count === 0) result += day;
        else if (count < 3) result += ", " + day;
        else if (count === 3) result += "...";
        count++;
      }
    });
    return count === 0 ? "None" : result;
  }

  static strToRepeatArr = (str) => {
    let result = [false, false, false, false, false, false, false];
    this.WEEKDAYS_ABB.map((day, index) => {
      if (str.includes(day)) result[index] = true;
    });
    return result;
  }

  static repeatArrToStr = (repeatArr) => {
    let result = "";
    repeatArr.map((isRepeat, index) => {
      result += isRepeat ? "1" : "0";
    });
    return result;
  }

  // ===== END CONVERSIONS =====


  // ===== VALIDATIONS =====

  static isOverlap(locList, fromTime, toTime, id){
    if (locList == undefined || locList.length == 0) return false;
    const from = fromTime.getTime();
    const to = toTime.getTime();
    let result = false;
    locList.map((loc, index) => {
      if (loc.safezoneId != id){
        const locFrom = this.strToDate(loc.fromTime).getTime();
        const locTo = this.strToDate(loc.toTime).getTime();
        if ((from >= locFrom && from <= locTo) || (to >= locFrom && to <= locTo) || (locFrom >= from && locFrom <= to)){
          result = true;
          return;
        }
      }
    });
    return result;
  }

  // ===== END VALIDATIONS =====

  // get user location
  // navigator.geolocation.getCurrentPosition(
  //     (data) => {
  //       setLatitude(data.coords.latitude);
  //       this.setState({longitude: data.coords.longitude});
  //     }
  // );

}

export default Util;