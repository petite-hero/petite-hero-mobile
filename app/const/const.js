export const COLORS = {
  BROWN: "#d67046",
  WHITE: "#ffffff",
  GREY: "#bbbbbb",
  LIGHT_GREY: "#8e8e8e",
  LIGHT_GREY_2: "#f7f7f7",
  LIGHT_GREY_3: "#fcfcfc",
  MEDIUM_GREY: "#d6d6d6",
  STRONG_GREY: "#656565",
  BLACK: "#000000",
  STRONG_ORANGE: "#f47e3e",
  LIGHT_ORANGE: "#ffe3c1",
  STRONG_CYAN: "#00ade8",
  MEDIUM_CYAN: "#9edbfa",
  LIGHT_CYAN: "#f2fbff",
  STRONG_BLUE: "#0084b1",
  NUDE: "#feefdd",
  RED: "#ec546b",
  YELLOW: "#fbc424",
  GREEN: "#07be8a",
  PURPLE: "#785adf",
};

export const IP = "192.168.100.57";
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

export const questBackgroundList = [
  {
    id: 1,
    image: require("../../assets/quest-background/normal.png"),
  },
  {
    id: 2,
    image: require("../../assets/quest-background/success.png"),
  },
  {
    id: 3,
    image: require("../../assets/quest-background/fail.png"),
  }
]

export const badgesList = [
  {
    id: 1,
    image: require("../../assets/badges/Awards-1.png"),
    imageFail: require("../../assets/badges/Awards-1-fail.png"),
    borderColor: COLORS.YELLOW
  },
  {
    id: 2,
    image: require("../../assets/badges/Awards-2.png"),
    imageFail: require("../../assets/badges/Awards-2-fail.png"),
    borderColor: COLORS.STRONG_CYAN
  },
  {
    id: 3,
    image: require("../../assets/badges/Awards-3.png"),
    imageFail: require("../../assets/badges/Awards-3-fail.png"),
    borderColor: COLORS.BROWN
  },
  {
    id: 4,
    image: require("../../assets/badges/Awards-4.png"),
    imageFail: require("../../assets/badges/Awards-4-fail.png"),
    borderColor: COLORS.BROWN
  },
  {
    id: 5,
    image: require("../../assets/badges/Awards-5.png"),
    imageFail: require("../../assets/badges/Awards-5-fail.png"),
    borderColor: COLORS.STRONG_CYAN
  },
  {
    id: 6,
    image: require("../../assets/badges/Awards-6.png"),
    imageFail: require("../../assets/badges/Awards-6-fail.png"),
    borderColor: COLORS.RED
  },
  {
    id: 7,
    image: require("../../assets/badges/Awards-7.png"),
    imageFail: require("../../assets/badges/Awards-7-fail.png"),
    borderColor: COLORS.YELLOW
  },
  {
    id: 8,
    image: require("../../assets/badges/Awards-8.png"),
    imageFail: require("../../assets/badges/Awards-8-fail.png"),
    borderColor: COLORS.RED
  },
  {
    id: 9,
    image: require("../../assets/badges/Awards-9.png"),
    imageFail: require("../../assets/badges/Awards-9-fail.png"),
    borderColor: COLORS.RED
  },
  {
    id: 10,
    image: require("../../assets/badges/Awards-10.png"),
    imageFail: require("../../assets/badges/Awards-10-fail.png"),
    borderColor: COLORS.YELLOW
  },
  {
    id: 11,
    image: require("../../assets/badges/Awards-11.png"),
    imageFail: require("../../assets/badges/Awards-11-fail.png"),
    borderColor: COLORS.RED
  },
  {
    id: 12,
    image: require("../../assets/badges/Awards-12.png"),
    imageFail: require("../../assets/badges/Awards-12-fail.png"),
    borderColor: COLORS.STRONG_CYAN
  },
  {
    id: 13,
    image: require("../../assets/badges/Awards-13.png"),
    imageFail: require("../../assets/badges/Awards-13-fail.png"),
    borderColor: COLORS.RED
  },
  {
    id: 14,
    image: require("../../assets/badges/Awards-14.png"),
    imageFail: require("../../assets/badges/Awards-14-fail.png"),
    borderColor: COLORS.STRONG_CYAN
  },
  {
    id: 15,
    image: require("../../assets/badges/Awards-15.png"),
    imageFail: require("../../assets/badges/Awards-15-fail.png"),
    borderColor: COLORS.STRONG_CYAN
  },
  {
    id: 16,
    image: require("../../assets/badges/Awards-16.png"),
    imageFail: require("../../assets/badges/Awards-16-fail.png"),
    borderColor: COLORS.STRONG_CYAN
  },
  {
    id: 17,
    image: require("../../assets/badges/Awards-17.png"),
    imageFail: require("../../assets/badges/Awards-17-fail.png"),
    borderColor: COLORS.STRONG_CYAN
  },
  {
    id: 18,
    image: require("../../assets/badges/Awards-18.png"),
    imageFail: require("../../assets/badges/Awards-18-fail.png"),
    borderColor: COLORS.STRONG_CYAN
  },
  {
    id: 19,
    image: require("../../assets/badges/Awards-19.png"),
    imageFail: require("../../assets/badges/Awards-19-fail.png"),
    borderColor: COLORS.RED
  },
  {
    id: 20,
    image: require("../../assets/badges/Awards-20.png"),
    imageFail: require("../../assets/badges/Awards-20-fail.png"),
    borderColor: COLORS.BROWN
  }
];
