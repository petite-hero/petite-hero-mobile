export const COLORS = {
  WHITE : "#ffffff",
  GREY : "#bbbbbb",
  BLACK : "#000000",
  STRONG_ORANGE : "#f47e3e",
  LIGHT_ORANGE : "#ffe3c1",
  STRONG_CYAN : "#5ec7f9",
  LIGHT_CYAN : "#ecf8fe",
  NUDE: "#feefdd",
  RED: "#f32b2b",
  YELLOW: "#fbc424",
  GREEN: "#07be8a",
  PURPLE: "#7107be"
}

export const IP = "192.168.1.58";
export const PORT = ":8080";

export const NOTI = {
  PETITE_HERO : "Petite Hero",
  SILENT_NOTI : "silent-noti",
  CHILD_SAFE : "Child is currently safe",
  CHILD_NOT_SAFE : "Child is currently not safe",
  DONE_SETTING_UP_DEVICE : "Done setting up child's device"
}

export const changeOpac = (color, opac) => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return "rgba(" + r + "," + g + "," + b + "," + opac + ")";
}
