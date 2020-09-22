import React from "react";
import "./Errors.styles.css";
import { FormattedMessage } from "react-intl";

export default function Forbidden() {
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
            id="errors.pages.403.message"
          />
        </h2>
      </div>
    </div>
  );
}
