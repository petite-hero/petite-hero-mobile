export const COLORS = {
  WHITE: "#ffffff",
  GREY: "#bbbbbb",
  LIGHT_GREY: "#8e8e8e",
  STRONG_GREY: "#656565",
  BLACK: "#000000",
  STRONG_ORANGE: "#f47e3e",
  LIGHT_ORANGE: "#ffe3c1",
  STRONG_CYAN: "#00ade8",
  MEDIUM_CYAN: "#9edbfa",
  LIGHT_CYAN: "#ecf8fe",
  NUDE: "#feefdd",
  RED: "#ec546b",
  YELLOW: "#fbc424",
  GREEN: "#07be8a",
  PURPLE: "#785adf",
};

export const IP = "192.168.1.5";
export const PORT = ":8080";

export const NOTI = {
  PETITE_HERO: "Petite Hero",
  SILENT_NOTI: "silent-noti",
  CHILD_SAFE: "Child is currently safe",
  CHILD_NOT_SAFE: "Child is currently not safe",
  DONE_SETTING_UP_DEVICE: "Done setting up child's device",
};

export const changeOpac = (color, opac) => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return "rgba(" + r + "," + g + "," + b + "," + opac + ")";
};

export const categories = [
  {title: "Housework", name: "broom", type: "material-community", color: COLORS.YELLOW},
  {title: "Education", name: "school", type: "material", color: COLORS.STRONG_CYAN},
  {title: "Skills", name: "toys", type: "material", color: COLORS.GREEN}
];

export const badgesList = [
  {
    id: 1,
    image: require("../../assets/badges/Awards-1.png"),
  },
  {
    id: 2,
    image: require("../../assets/badges/Awards-2.png"),
  },
  {
    id: 3,
    image: require("../../assets/badges/Awards-3.png"),
  },
  {
    id: 4,
    image: require("../../assets/badges/Awards-4.png"),
  },
  {
    id: 5,
    image: require("../../assets/badges/Awards-5.png"),
  },
  {
    id: 6,
    image: require("../../assets/badges/Awards-6.png"),
  },
  {
    id: 7,
    image: require("../../assets/badges/Awards-7.png"),
  },
  {
    id: 8,
    image: require("../../assets/badges/Awards-8.png"),
  },
  {
    id: 9,
    image: require("../../assets/badges/Awards-9.png"),
  },
  {
    id: 10,
    image: require("../../assets/badges/Awards-10.png"),
  },
  {
    id: 11,
    image: require("../../assets/badges/Awards-11.png"),
  },
  {
    id: 12,
    image: require("../../assets/badges/Awards-12.png"),
  },
  // {
  //   id: 13,
  //   image: require("../../assets/badges/Awards-13.png"),
  // },
  // {
  //   id: 14,
  //   image: require("../../assets/badges/Awards-14.png"),
  // },
  // {
  //   id: 15,
  //   image: require("../../assets/badges/Awards-15.png"),
  // },
  // {
  //   id: 16,
  //   image: require("../../assets/badges/Awards-16.png"),
  // },
  // {
  //   id: 17,
  //   image: require("../../assets/badges/Awards-17.png"),
  // },
  // {
  //   id: 18,
  //   image: require("../../assets/badges/Awards-18.png"),
  // },
  // {
  //   id: 19,
  //   image: require("../../assets/badges/Awards-19.png"),
  // },
  // {
  //   id: 20,
  //   image: require("../../assets/badges/Awards-20.png"),
  // },
  // {
  //   id: 21,
  //   image: require("../../assets/badges/Awards-21.png"),
  // },
  // {
  //   id: 22,
  //   image: require("../../assets/badges/Awards-22.png"),
  // },
  // {
  //   id: 23,
  //   image: require("../../assets/badges/Awards-23.png"),
  // },
  // {
  //   id: 24,
  //   image: require("../../assets/badges/Awards-24.png"),
  // },
  // {
  //   id: 25,
  //   image: require("../../assets/badges/Awards-25.png"),
  // },
  // {
  //   id: 26,
  //   image: require("../../assets/badges/Awards-26.png"),
  // },
  // {
  //   id: 27,
  //   image: require("../../assets/badges/Awards-27.png"),
  // },
  // {
  //   id: 28,
  //   image: require("../../assets/badges/Awards-28.png"),
  // },
  // {
  //   id: 29,
  //   image: require("../../assets/badges/Awards-29.png"),
  // },
  // {
  //   id: 30,
  //   image: require("../../assets/badges/Awards-30.png"),
  // },
  // {
  //   id: 31,
  //   image: require("../../assets/badges/Awards-31.png"),
  // },
  // {
  //   id: 32,
  //   image: require("../../assets/badges/Awards-32.png"),
  // },
  // {
  //   id: 33,
  //   image: require("../../assets/badges/Awards-33.png"),
  // },
  // {
  //   id: 34,
  //   image: require("../../assets/badges/Awards-34.png"),
  // },
  // {
  //   id: 35,
  //   image: require("../../assets/badges/Awards-35.png"),
  // },
  // {
  //   id: 36,
  //   image: require("../../assets/badges/Awards-36.png"),
  // },
  // {
  //   id: 37,
  //   image: require("../../assets/badges/Awards-37.png"),
  // },
  // {
  //   id: 38,
  //   image: require("../../assets/badges/Awards-38.png"),
  // },
  // {
  //   id: 39,
  //   image: require("../../assets/badges/Awards-39.png"),
  // },
  // {
  //   id: 40,
  //   image: require("../../assets/badges/Awards-40.png"),
  // },
  // {
  //   id: 41,
  //   image: require("../../assets/badges/Awards-41.png"),
  // },
  // {
  //   id: 42,
  //   image: require("../../assets/badges/Awards-42.png"),
  // },
  // {
  //   id: 43,
  //   image: require("../../assets/badges/Awards-43.png"),
  // },
  // {
  //   id: 44,
  //   image: require("../../assets/badges/Awards-44.png"),
  // },
  // {
  //   id: 45,
  //   image: require("../../assets/badges/Awards-45.png"),
  // },
];
