import theme1 from "../assets/images/country_theme_1.jpg";
import theme2 from "../assets/images/country_theme_2.jpg";

export default class Utils {
  static getTheme(themeNumber) {
    switch (themeNumber) {
    case "1":
      return theme1;
    case "2":
      return theme2;
    case "3":
      return theme2;
    case "4":
      return theme2;
    case "5":
      return theme2;
    case "6":
      return theme2;
    default:
      break;
    }
  }
}
