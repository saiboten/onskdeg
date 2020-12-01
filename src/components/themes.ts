import Color from "color";

// #586F7C - dark electric blue
// #B1740F - gold
// #FFFFFF - white
// #3E1929 - dark purple
// #D64933 - rød

interface Theme {
  background: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  negative: string;
  contrast: string;
  neutral: string;
  text: string;
  white: string;
}

const lightPrimary = "#acacde";

export const lightTheme: Theme = {
  background: "#DEDEDE",
  primary: lightPrimary,
  primaryDark: Color(lightPrimary).darken(0.1).string(),
  primaryLight: Color(lightPrimary).lighten(0.1).string(),
  negative: "#B1740F",
  contrast: "#B1740F",
  neutral: "#3988ea",
  text: "#4C2A0F",
  white: "#FFFFFF",
};

const darkPrimary = "#b49b57";

export const darkTheme: Theme = {
  background: "#262626",
  primary: darkPrimary,
  primaryDark: Color(darkPrimary).fade(0.7).string(),
  primaryLight: Color(darkPrimary).saturate(0.5).lighten(0.4).string(),
  negative: "#ff5656",
  contrast: "#49b557",
  neutral: "#3988ea",
  text: "#FFFFFF",
  white: "#FFFFFF",
};
