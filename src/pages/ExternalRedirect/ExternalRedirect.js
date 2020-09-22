import { navigate } from "@reach/router";
import React from "react";
import { FormattedMessage } from "react-intl";

export default function ExternalRedirect({ url }) {
  return (
    <>
      <h3>
        <FormattedMessage
          id="platform.redirect.title"
          defaultMessage="You are leaving Bit.Country."
        />
      </h3>
      <p>
        <FormattedMessage
          id="platform.redirect.message"
          defaultMessage="You are about to leave Bit.Country and head to an external site. We are not responsible for the content on this external site."
        />
      </p>
      <p>
        <FormattedMessage
          id="platform.redirect.confirmationMessage"
          defaultMessage="Are you sure you want to continue?"
        />
      </p>
      <div>
        <a onClick={() => navigate(-1)}>
          <FormattedMessage
            id="platform.redirect.goBack"
            defaultMessage="Take me back"
          />
        </a>
        <a href={url} rel="noopener noreferrer">
          <FormattedMessage
            id="platform.redirect.yes"
            defaultMessage="Yes"
          />
        </a>
      </div>
    </>
  );
}
