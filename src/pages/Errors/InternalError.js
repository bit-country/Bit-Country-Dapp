import React from "react";
import "./Errors.styles.css";
import { FormattedMessage } from "react-intl";

export default function InternalError() {
  return (
    <div className="error-container error">
      <div className="content">
        <h1>
          <FormattedMessage
            id="errors.pages.500.title"
          />
        </h1>
        <h2 className="message">
          <FormattedMessage
            id="errors.pages.500.message"
          />
        </h2>
      </div>
    </div>
  );
}
