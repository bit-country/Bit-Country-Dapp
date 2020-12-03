import theme1 from "../assets/images/block.jpg";
import theme2 from "../assets/images/ai.jpg";
import theme3 from "../assets/images/ai2.jpg";
import theme4 from "../assets/images/space.jpg";
import theme5 from "../assets/images/space1.jpg";
import theme6 from "../assets/images/02.jpg";
import theme7 from "../assets/images/03.jpg";

export default class Utils {
  static getTheme(themeNumber) {
    switch (themeNumber) {
      case "1":
        return theme1;
      case "2":
        return theme2;
      case "3":
        return theme3;
      case "4":
        return theme4;
      case "5":
        return theme5;
      case "6":
        return theme6;
      default:
        return theme7;
    }
  }
  static getAsset(assetNumber) {
    switch (assetNumber) {
      case 1:
        return "https://bucketforstandardtask.s3-ap-southeast-2.amazonaws.com/markus-spiske-KP1bubr2j4A-unsplash.jpg";
      case 2:
        return "https://bucketforstandardtask.s3-ap-southeast-2.amazonaws.com/scroll-311973_640.png";
      case 3:
        return "https://bucketforstandardtask.s3-ap-southeast-2.amazonaws.com/rocket.jpg";
      default:
        break;
    }
  }
}
