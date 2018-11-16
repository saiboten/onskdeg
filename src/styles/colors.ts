import Color from 'color';

export const gold = "#b49b57";
export const goldDark = Color(gold).fade(.7).string();

export default {
  gold,
  goldDark,
}