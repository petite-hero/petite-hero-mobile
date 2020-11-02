class Util{

  static MAP_ZOOM = {latitudeDelta: 0.032, longitudeDelta: 0.016};
  static REGION_FPT = {latitude: 10.8414846, longitude: 106.8100464,
    latitudeDelta: this.MAP_ZOOM.latitudeDelta, longitudeDelta: this.MAP_ZOOM.longitudeDelta};
  
  static MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  static WEEKDAYS_ABB = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  // get user location
  // navigator.geolocation.getCurrentPosition(
  //     (data) => {
  //       setLatitude(data.coords.latitude);
  //       this.setState({longitude: data.coords.longitude});
  //     }
  // );

}

export default Util;