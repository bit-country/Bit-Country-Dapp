import React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Divider } from "antd";

export default function Enact() {
  return (
    <Col
      push={4}
      span={16}
    >
      <h2>
        <FormattedMessage
          id="country.stake.enact.title"
        />
      </h2>
      <Divider />
      
    </Col>
  );
}