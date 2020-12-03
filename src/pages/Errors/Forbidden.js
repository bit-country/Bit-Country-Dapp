import React from "react";
import { navigate } from "@reach/router";
import "./Errors.styles.css";
import { FormattedMessage } from "react-intl";
import { Button } from "antd";
import CountryDetail from "../../components/CountryDetail";

export default function Forbidden(props) {
  const { errorMessageId, country,  loggedIn, joinCountry, isPublic } = props;

  const handleLogin = () => {
    navigate(
      "/login",
      {
        state: {
          isRedirectBack: true
        }
      }
    );
  };

  return (
    <div className="error-container no-access">
      <div className="content">
        <h1>
          <FormattedMessage
            id="errors.pages.403.title"
          />
        </h1>
        <h2 className="message">
          <FormattedMessage
            id={loggedIn && errorMessageId? errorMessageId : "errors.pages.403.message" }
          />
        </h2>
        { (loggedIn === false) && 
          <div>
            <Button onClick={handleLogin}>
              <FormattedMessage id="app.login" />
            </Button>
          </div>
        }
        {country && loggedIn &&
          <div>
            <CountryDetail 
              country={country} 
            >
              <div className="country-actions">
                <Button 
                  onClick={joinCountry} 
                  disabled={!loggedIn || !isPublic}
                  type="primary"
                >
                  { isPublic ? (
                    <FormattedMessage id="country.becomeResident" />
                  ) : (
                    "Invitation Only"
                  )}
                </Button>
              </div>
            </CountryDetail>
          </div>
        }
      </div>
    </div>
  );
}
