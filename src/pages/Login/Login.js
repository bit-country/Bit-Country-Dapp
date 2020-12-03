import React, { Component } from "react";
import { navigate } from "@reach/router";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { Row, Col, Typography, Input, Button, Divider } from "antd";
import { FormattedMessage } from "react-intl";

const { Title } = Typography;

class Login extends Component {
  state = {
    emailAddress: "",
    password: ""
  };

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value
    });
  };

  login = async () => {
    const { 
      location: {
        state
      }
    } = this.props;
    
    let referrerId, referredCountryId;
  
    if (state) {
      referrerId = state.referrerId;
      referredCountryId = state.referredCountryId;
    }

    this.setState({
      loggingIn: true
    });

    const loggedIn = await this.props.sendLogin(
      this.state.emailAddress,
      this.state.password
    );

    this.setState({
      loggingIn: false
    });

    if (!loggedIn) {
      return;
    }

    if (referrerId && referredCountryId) {
      navigate(
        `/c/${referredCountryId}`,
        {
          state: {
            referrerId
          }
        }
      );

      return;
    }

    if (state?.isRedirectBack) {
      navigate(-1);
    }

    navigate("/my-countries");
  };

  redirectToSetting = () => {
    const { 
      location: {
        state
      }
    } = this.props;
  
    let referrerId, referredCountryId;
  
    if (state) {
      referrerId = state.referrerId;
      referredCountryId = state.referredCountryId;
    }

    navigate(
      "/register",
      {
        state: {
          referrerId,
          referredCountryId
        }
      }
    );
  }

  render() {
    const { emailAddress, password, loggingIn } = this.state;
    const { 
      location: {
        state
      }
    } = this.props;

    let referrerId, referredCountryId;

    if (state) {
      referrerId = state.referrerId;
      referredCountryId = state.referredCountryId;
    }

    return (
      <Row 
        gutter={16} 
        style={{ margin: "4em 0", textAlign: "center" }}
        className="content"
      >
        <Col span={5} />
        <Col span={14}>
          <Title level={2}>
            <FormattedMessage
              id="account.login.title"
            />
          </Title>
          <p>
            <FormattedMessage
              id="account.login.subtitle"
            />
          </p>
          <Divider />
          
          {(referrerId && referredCountryId) && (
            <>
              <div className="form field">
                <label>
                  <FormattedMessage
                    id="account.form.referrer.label"
                  />
                </label>
                <Input
                  disabled
                  value={referrerId}
                  type="text"
                />
              </div>
              <div className="form field">
                <label>
                  <FormattedMessage
                    id="account.form.referredCountry.label"
                  />
                </label>
                <Input
                  disabled
                  value={referredCountryId}
                  type="text"
                />
              </div>
            </>
          )}
          <div className="form field">
            <label>
              <FormattedMessage
                id="account.form.emailAddress.label"
              />
            </label>
            <Input
              type="text"
              onChange={this.handleChange}
              value={emailAddress}
              name="emailAddress"
            />
          </div>
          <div className="form field">
            <label>
              <FormattedMessage
                id="account.form.password.label"
              />
            </label>
            <Input
              type="password"
              onChange={this.handleChange}
              value={password}
              name="password"
            />
          </div>
          <div>
            <Button
              loading={loggingIn}
              onClick={this.login}
              type="primary"
              className="form field button"
            >
              <span>
                <FormattedMessage
                  id="app.login"
                />
              </span>
            </Button>
          </div>
          <div>
            <a onClick={this.redirectToSetting}>
              <FormattedMessage
                id="account.login.goToRegister"
              />
            </a>
          </div>
        </Col>
        <Col span={5} />
      </Row>
    );
  }
}

export default AuthConnect(Login, false);
