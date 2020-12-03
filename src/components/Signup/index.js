import React, { Component } from "react";
import { navigate } from "@reach/router";
import { DAppConnect } from "../HOC/DApp/DAppWrapper";
import { AuthConnect } from "../HOC/Auth/AuthContext";
import { Input, Button } from "antd";
import { FormattedMessage } from "react-intl";

class SignupForm extends Component {
  state = {
    emailAddress: "",
    nickName: "",
    password: ""
  };

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value
    });
  };

  saveSetting = async () => {
    const {
      address,
      registerAccount,
      referrerId,
      referredCountryId
    } = this.props;

    const {
      emailAddress,
      nickName,
      password
    } = this.state;

    const userDetails = {
      email: emailAddress,
      walletAddress: address,
      nickName: nickName,
      password: password
    };

    const registered = await registerAccount(
      userDetails, 
      referrerId,
      referredCountryId);
    
    if (!registered) {
      return;
    }

    if (referrerId && referredCountryId) {
      setTimeout(
        () => {
          navigate(
            `/c/${referredCountryId}`,
            {
              state: {
                referrerId
              }
            }
          );
        }, 
        3000
      );

      return;
    }
    
    setTimeout(
      () => {
        navigate("/explore", { state: { newUser: true } });
      }, 
      3000
    );
  };

  redirectToLogin() {
    const {
      referrerId,
      referredCountryId
    } = this.props;

    navigate(
      "/login",
      {
        state: {
          referrerId,
          referredCountryId
        }
      }
    );
  }

  render() {
    const {
      referrerId,
      referredCountryId
    } = this.props;

    return (
      <>
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
            value={this.state.emailAddress}
            name="emailAddress"
          />
        </div>
        <div className="form field">
          <label>
            <FormattedMessage
              id="account.form.nickname.label"
            />
          </label>
          <Input
            type="text"
            onChange={this.handleChange}
            value={this.state.nickName}
            name="nickName"
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
            value={this.state.password}
            name="password"
          />
        </div>
        <div>
          <Button
            onClick={this.saveSetting.bind(this)}
            type="primary"
            className="form field button"
          >
            <FormattedMessage
              id="account.create.form.submit"
            />
          </Button>
        </div>

        <div>
          <FormattedMessage
            id="account.create.goToLogin"
          />{" "}
          <a onClick={this.redirectToLogin.bind(this)}>
            <FormattedMessage
              id="account.create.goToLoginButton"
            />
          </a>
        </div>
      </>
    );
  }
}

export default DAppConnect(AuthConnect(SignupForm));
