import React from "react";
import { Layout } from "antd";
import { FormattedMessage } from "react-intl";
import "./RequestAccess.css";
import { Link } from "@reach/router";

export default function RequestAccess() {
  return (
    <div id="request-early-access">
      <Layout.Content>
        <h2>
          <FormattedMessage
            id="requestAccess.title"
            defaultMessage="Request Early Access"
          />
        </h2>
        <p className="message">
          <FormattedMessage
            id="requestAccess.message"
            defaultMessage={"Great to know you are interested to get involved! During Early Access invitations are limited so express your interest by sending us an email."}
          />
        </p>
        <p>
          <a href="mailto://genesis@bit.country">
            <FormattedMessage
              id="createCountry.limitedAvailability.action"
            />
          </a>
        </p>
        <p>
          <FormattedMessage
            id="requestAccess.limitedAvailability.or"
            defaultMessage={"OR"}
          />
        </p>
        <p className="notice">
          <FormattedMessage
            id="requestAccess.limitedAvailability.message2"
            defaultMessage={"If you are a member of one of the existing communities with their own custom sign-in, you can sign-in on their country page."}
          />
        </p>
        <p>
          <Link to="/explore">
            <FormattedMessage
              id="createCountry.limitedAvailability.action2"
            />
          </Link>
        </p>
      </Layout.Content>
    </div>
  );
}
