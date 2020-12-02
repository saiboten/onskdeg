import Color from "color";
import backgroundDark from "./images/background.svg";
import backgroundLight from "./images/lightBackground.svg";

// #586F7C - dark electric blue
// #B1740F - gold
// #FFFFFF - white
// #3E1929 - dark purple
// #D64933 - rød

interface Theme {
  background: string;
  primary: string;
  primaryLight: string;
  primaryLightest: string;
  primaryDark: string;
  primaryDarkest: string;
  negative: string;
  contrast: string;
  neutral: string;
  text: string;
  white: string;
}

const lightPrimary = "#5FD0A1";

// background: #5FD0A1; // mørkest grønn
// background: #5FD0A1 50 % // lys grønn??;
// rgba(95, 208, 161, 0.5);

export const lightTheme: Theme = {
  background: backgroundLight,
  primary: lightPrimary,
  primaryLight: "rgba(95, 208, 161, 0.5)",
  primaryLightest: "#DCD4E7",
  primaryDark: "#F7ECFB",
  primaryDarkest: "#ffffff",
  negative: "#E3363A",
  contrast: "#349EFF",
  neutral: "#3988ea",
  text: "#000000",
  white: "#FFFFFF",
};

const darkPrimary = "#BA5FD0";

export const darkTheme: Theme = {
  background: backgroundDark,
  primary: darkPrimary,
  primaryLight: "rgba(186, 95, 208, 0.5)",
  primaryLightest: "#DCD4E7",
  primaryDark: "#463F7C",
  primaryDarkest: "#292547",
  negative: "#ff5656",
  contrast: "#1FFFA3",
  neutral: "#3988ea",
  text: "#FFFFFF",
  white: "#FFFFFF",
};
