import { toast } from "react-toastify";

export default class Notification {
  static displaySuccessMessage(message) {
    toast(message, {
      type: toast.TYPE.SUCCESS,
      autoClose: 4000
    });
  }

  static displayErrorMessage(message) {
    toast(message, {
      type: toast.TYPE.ERROR,
      autoClose: 4000
    });
  }
}
