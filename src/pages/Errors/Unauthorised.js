import React from "react";
import "./Errors.styles.css";
import { Link } from "@reach/router";
import { FormattedMessage } from "react-intl";

export default function Unauthorised() {
  return (
    <div className="error-container logged-out">
      <div className="content">
        <h1>
          <FormattedMessage
            id="errors.pages.401.title"
          />
        </h1>
        <h2 className="message">
          <FormattedMessage
            id="errors.pages.401.message"
          />
        </h2>
        <Link to="/login">
          Login
        </Link>
      </div>
    </div>
  );
}
