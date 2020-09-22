import React from "react";
import "./Errors.styles.css";
import { FormattedMessage } from "react-intl";

export default function NotFound({ message }) {
  return (
    <div className="error-container not-found">
      <div className="content">
        <h1>
          <FormattedMessage
            id="errors.pages.404.title"
          />
        </h1>
        <h2 className="message">
          {message}
        </h2>
        <a onClick={() => { window.history.go(-2); }}>Go back</a>
      </div>
    </div>
  );
}
