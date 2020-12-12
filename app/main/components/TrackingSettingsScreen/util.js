class Util{

  // map consts
  static MAP_ZOOM = {latitudeDelta: 0.012, longitudeDelta: 0.006};
  static LOC_FPT = {latitude: 10.8414846, longitude: 106.8100464};
  static REGION_FPT = {latitude: 10.8414846, longitude: 106.8100464,
    latitudeDelta: this.MAP_ZOOM.latitudeDelta, longitudeDelta: this.MAP_ZOOM.longitudeDelta};
  
  // conversion consts
  static MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  static WEEKDAYS_ABB = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


  // ===== LOCATION =====

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

  static getQuadFromLoc = (lat, lng) => {
    const LAT_DELTA = 0.0016;
    const LNG_DELTA = 0.001;
    let result = [];
    result.push({latitude: lat+LAT_DELTA, longitude: lng-LNG_DELTA});
    result.push({latitude: lat+LAT_DELTA, longitude: lng+LNG_DELTA});
    result.push({latitude: lat-LAT_DELTA, longitude: lng+LNG_DELTA});
    result.push({latitude: lat-LAT_DELTA, longitude: lng-LNG_DELTA});
    return result;
  }

  static quadLngLatToXY = (quad) => {
    const midLat = (quad[0].latitude+quad[1].latitude+quad[2].latitude+quad[3].latitude)/4;
    let result = [];
    quad.map((vertex, index) => {
      const xy = this.lngLatToXY(vertex.longitude, vertex.latitude, midLat);
      result.push({x: xy[0], y: xy[1]});
    });
    return result;
  }

  static isValidQuad = (quad) => {
    const quadXY = this.quadLngLatToXY(quad);
    let result = true;
    quadXY.map((vertex, index) => {
      const v1 = quadXY[index];
      const v2 = quadXY[(index+1)%4];
      const v3 = quadXY[(index+2)%4];
      const exp = (v3.x-v2.x)*(v2.y-v1.y)-(v2.x-v1.x)*(v3.y-v2.y) > 0;
      if (!exp){
        result = false;
        return;
      }
    });
    return result;
  }

  // ===== END LOCATION =====


  // ===== CALCULATIONS =====

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
    let result = new Date(date.getTime());
    result.setHours(0);
    result.setMinutes(0);
    result.setSeconds(0);
    result.setMilliseconds(0);
    return result;
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