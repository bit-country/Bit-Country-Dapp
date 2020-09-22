import React, { Component } from "react";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import { Row, Col, Button } from "antd";
import { FormattedMessage } from "react-intl";
import Notification from "../../utils/Notification";
import Logging from "../../utils/Logging";
import "./WelcomePage.styles.css";

class WelcomePage extends Component {
  state = {
    welcomeMessage: ""
  };

  componentDidMount() {
    this.loadWelcomeMessage();
    this.loadCountryById();
  }

  loadWelcomeMessage = async () => {
    const {
      id
    } = this.props;

    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_WELCOME_MESSAGE}?countryId=${id}`
      );

      if (!response?.isSuccess) {
        throw Error("Error loading welcome message");
      }

      this.setState({
        welcomeMessage: response.welcomeMessage
      });
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        <FormattedMessage
          id="country.welcome.notification.error"
        />
      );
    }
  };

  loadCountryById = async () => {
    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_COUNTRY}?countryId=${this.props.id}`
      );

      if (!response?.isSuccess) {
        throw Error("Error while retrieving country data");
      }

      this.setState({
        country: response.country,
      });

    } catch (error) {
      Logging.Error(error);
      Notification.displayErrorMessage(error);
    }
  }

  handleNavigate = () => {
    const {
      navigate,
      id,
      userId
    } = this.props;

    navigate(
      `../../../${id}`,
      {
        state: {
          referrerId: userId
        }
      }
    );
  }

  handleLogin = () => {
    const {
      navigate,
      userId,
      Id
    } = this.props;

    navigate(
      "../../../login",
      {
        state: {
          referrerId: userId,
          referredCountryId: Id
        }
      }
    );
  }

  render() {
    const {
      welcomeMessage,
      country
    } = this.state;

    const {
      loggedIn
    } = this.props;

    return (
      <>
        <Row gutter={16} style={{ marginTop: "30px", textAlign: "center" }}>
          <Col span={14} push={5}>
            <p id="welcome-message">{welcomeMessage}</p>
            <br />
            <h2>{country?.name}</h2>
            <p>{country?.description}</p>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: "30px", textAlign: "center" }}>
          <Col span={14} push={5}>
            {loggedIn ? (
              <Button
                type="primary"
                onClick={this.handleNavigate}
              >
                <FormattedMessage
                  id="country.welcome.goToCountry"
                />
              </Button>
            ) : (
              <>
                <p className="notice">
                  <FormattedMessage
                    id="country.welcome.loginRequired"
                  />
                </p>
                <Button
                  type="primary"
                  onClick={this.handleLogin}
                >
                  <FormattedMessage
                    id="country.welcome.goToLogin"
                  />
                </Button>
              </>
            )}
          </Col>
        </Row>
      </>
    );
  }
}

export default AuthConnect(WelcomePage);
