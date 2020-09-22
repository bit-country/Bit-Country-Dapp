import React, { useCallback, useState } from "react";
import { Divider, Input, Button, Typography } from "antd";
import { FormattedMessage } from "react-intl";
import "./index.css";

const {
  Title
} = Typography;

export default function LoginForm({ onLogin, imageURL, providerName }) {
  const [ emailAddress, setEmailAddress ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ loading, setLoading ] = useState(false);

  const handleChange = useCallback(({ target: { name, value } }) => {
    switch(name) {
      case "emailAddress":
        setEmailAddress(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  });

  const handleLogin = useCallback(async () => {
    setLoading(true);

    await onLogin(emailAddress, password);

    setLoading(false);
  }, [ onLogin, emailAddress, password, setLoading ]);

  const handleEnter = useCallback(({ key }) => {
    if (key === "Enter"
      && emailAddress.length > 0
      && password.length > 0) {
      handleLogin();
    }
  }, [ handleLogin ]);

  return (
    <>
      <div className="login-provider-image">
        <img src={imageURL} width="100%" />
      </div>
      <Title level={2} className="login-provider-title">
        <FormattedMessage
          id="account.login.provider.title"
          values={{
            name: providerName
          }}
        />
      </Title>
      <Divider />
      
      <div className="form field">
        <label>
          <FormattedMessage
            id="account.form.emailAddress.label"
          />
        </label>
        <Input
          type="text"
          onChange={handleChange}
          onKeyUp={handleEnter}
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
          onChange={handleChange}
          onKeyUp={handleEnter}
          value={password}
          name="password"
        />
      </div>
      {/* <div className="ui big message error-warning">
        Make sure to save your MetaMask login information and account
        recovery details! We can’t help you regain access if you lose it.
      </div> */}
      <div
        className="login-provider-button"
      >
        <Button
          onClick={handleLogin}
          type="primary"
          className="form field button"
          loading={loading}
        >
          Login
        </Button>
      </div>
    </>
  );
}
