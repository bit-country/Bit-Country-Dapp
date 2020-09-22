import React from "react";
import { Col, Divider } from "antd";
import { FormattedMessage } from "react-intl";

export default function History() {
  return (
    <Col
      push={4}
      span={16}
    >
      <h2>
        <FormattedMessage
          id="country.stake.history.title"
        />
      </h2>
      <Divider />
      <h4 style={{ whiteSpace: "pre-line" }}>
        <FormattedMessage
          id="country.stake.history.noOwnership"
        />
      </h4>
      <p style={{ whiteSpace: "pre-line", margin: "1em 0" }}>
        <FormattedMessage
          id="country.stake.history.future"
        />
      </p>
    </Col>
  );
}
