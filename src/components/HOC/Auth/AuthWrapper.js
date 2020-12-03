import React, { PureComponent } from "react";
import Notification from "../../../utils/Notification";
import { fetchAPI } from "../../../utils/FetchUtil";
import { navigate } from "@reach/router";
import ENDPOINTS from "../../../config/endpoints";
import Cookies from "js-cookie";
import { injectIntl, FormattedMessage } from "react-intl";
import Logging from "../../../utils/Logging";
import { AuthContext } from "./AuthContext";
import PrimaryBar from "../../AccountBar/PrimaryBar";
import "./index.css";
import Spinner from "../../Spinner";

export const defaultState = {
  authLoading: true,
  loggedIn: false,
  user: null,
  notificationCount: 0,
};

class AuthWrapper extends PureComponent {
  state = defaultState;

  componentDidMount() {
    this.checkToken();
  }

  static getDerivedStateFromError(error) {
    navigate("/500", { state: { error } });
  }

  componentDidCatch(error, errorInfo) {
    Logging.Error(new Error("Uncaught error during render"), error, errorInfo.componentStack);
  }

  checkToken = async () => {
    try {
      const response = await fetchAPI(ENDPOINTS.GET_USER);

      if (response?.isSuccess) {
        this.setState({
          authLoading: false,
          loggedIn: true,
          user: response.user
        }, this.getNotificationCount);
      }
    } catch (error) {
      Logging.Error(error);
    } finally {
      this.setState({
        authLoading: false
      });
    }
  };

  getNotificationCount = async () => {
    try {
      const response = await fetchAPI(ENDPOINTS.GET_NOTIFICATION_COUNT);

      if (response?.isSuccess) {
        this.setState({
          notificationCount: response.notificationCount,
        });
      }
    } catch (error) {
      Logging.Error(error);
    } 
  }

  clearNotificationCount = () => {
    this.setState({
      notificationCount: 0,
    });
  }

  reloadProfile = async () => {
    try {
      const response = await fetchAPI(ENDPOINTS.GET_USER);

      if (response?.isSuccess) {
        this.setState({
          authLoading: false,
          loggedIn: true,
          user: response.user
        });
      }
    } catch (error) {
      Logging.Error(error);
    } finally {
      this.setState({
        authLoading: false
      });
    }
  }

  registerAccount = async (userDetails, referrerId, referredCountryId) => {
    try {
      let requestData;

      if (referrerId && referredCountryId) {
        requestData = { ...userDetails, referrerId, referredCountryId };
      } else {
        requestData = userDetails;
      }


      const response = await fetchAPI(ENDPOINTS.SIGN_UP, "POST", requestData);

      if (!response?.isSuccess) {
        Notification.displayErrorMessage(<FormattedMessage id={response.message} />);

        return false;
      }
  

      Cookies.set("bitToken", response.token.token);
  
      await this.checkToken();

      
      return true;
    } catch (error) {
      Notification.displayErrorMessage(<FormattedMessage id="account.notifications.errors.loginFailure" />);

      return false;
    }    
  }

  sendLogin = async (email, password) => {
    const settingObj = {
      email,
      password
    };

    try {
      const response = await fetchAPI(ENDPOINTS.SIGN_IN, "POST", settingObj);

      if (!response?.isSuccess) {
        Notification.displayErrorMessage(<FormattedMessage id={response.message} />);

        return false;
      }

      Cookies.set("bitToken", response.token.token);

      await this.checkToken();
      
      return true;
    } catch (error) {
      Notification.displayErrorMessage(<FormattedMessage id="account.notifications.errors.loginFailure" />);

      return false;
    }
  };

  sendLoginWithProvider = async (email, password, providerId) => {
    if (!providerId) {
      Logging.Error(new Error("No provider given to sign in with provider"));

      return;
    }

    const settingObj = {
      email,
      password
    };

    try {
      const response = await fetchAPI(
        `${ENDPOINTS.SIGN_IN_WITH_PROVIDER}?providerId=${providerId}`, 
        "POST", 
        settingObj
      );

      if (!response?.isSuccess) {
        Notification.displayErrorMessage(<FormattedMessage id={response.message} />);

        return false;
      }

      Cookies.set("bitToken", response.token.token);

      await this.checkToken();
      
      return true;
    } catch (error) {
      Notification.displayErrorMessage(<FormattedMessage id="account.notifications.errors.loginFailure" />);

      return false;
    }
  };

  sendLogout = async () => {    
    // TODO: Change back to Login once we leave early access.
    await navigate("/explore", { replace: true });

    window.setTimeout(() => {
      Cookies.remove("bitToken");

      this.setState({
        loggedIn: false,
        user: null,
      });
    }, 200);

    return true;
  };

  render() {
    const { authLoading } = this.state;

    return (
      <>
        <AuthContext.Provider
          value={{
            ...this.state,
            registerAccount: this.registerAccount,
            sendLogin: this.sendLogin,
            sendLoginWithProvider: this.sendLoginWithProvider,
            sendLogout: this.sendLogout,
            reloadProfile: this.reloadProfile,
            clearNotificationCount: this.clearNotificationCount
          }}
        >
          <PrimaryBar />
          {authLoading ? (
            <Spinner />
          ) : (
            this.props.children
          )}
        </AuthContext.Provider>
      </>
    );
  }
}

export default injectIntl(AuthWrapper);
