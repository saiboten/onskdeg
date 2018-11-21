import Color from 'color';

const primary = "#b49b57";
const primaryDark = Color(primary).fade(.7).string();
const primaryLight = Color(primary).saturate(.5).lighten(.4).string();

const negative = "#ff5656";
const positive = "#49b557";
const neutral = "#3988ea";

export default {
  primary,
  primaryDark,
  primaryLight,
  negative,
  positive,
  neutral,
}