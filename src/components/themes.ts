import Color from "color";
import backgroundDark from "./images/background.svg?url";
import backgroundLight from "./images/lightBackground.svg?url";

// #586F7C - dark electric blue
// #B1740F - gold
// #FFFFFF - white
// #3E1929 - dark purple
// #D64933 - rød

interface Theme {
  background: string;
  secondary: string;
  secondaryDark: string;
  primaryLight: string;
  primary: string;
  primaryDark: string;
  negative: string;
  contrast: string;
  neutral: string;
  text: string;
  white: string;
}

export const lightTheme: Theme = {
  background: backgroundLight,
  primaryLight: "#DCD4E7",
  primary: "#F7ECFB",
  primaryDark: "#ffffff",
  secondary: "#5FD0A1",
  secondaryDark: "rgba(95, 208, 161, 0.5)",
  negative: "#E3363A",
  contrast: "#349EFF",
  neutral: "#3988ea",
  text: "#000000",
  white: "#FFFFFF",
};

export const darkTheme: Theme = {
  background: backgroundDark,
  secondaryDark: "rgba(186, 95, 208, 0.5)",
  primaryLight: "#DCD4E7",
  primary: "#463F7C",
  primaryDark: "#292547",
  secondary: "#BA5FD0",
  negative: "#ff5656",
  contrast: "#1FFFA3",
  neutral: "#3988ea",
  text: "#FFFFFF",
  white: "#FFFFFF",
};

export const christmasTheme: Theme = {
  background: ".",
  secondaryDark: "#78BCE3",
  secondary: "#99CDEA",
  primaryLight: "#F3F6F5",
  primary: "#e5ebec",
  primaryDark: "#bed8eb",
  negative: "#ff5656",
  contrast: "#E83151",
  neutral: "#3988ea",
  text: "#000",
  white: "#FFFFFF",
};
