import Color from 'color';

export const primary = "#b49b57";
export const primaryDark = Color(primary).fade(.7).string();

export default {
  primary,
  primaryDark,
}