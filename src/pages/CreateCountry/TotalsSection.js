import React from "react";
import { Row, Col, Button } from "antd";
import { FormattedMessage } from "react-intl";

export default function TotalsSection({ getTotalCostIn, loading, onConfirm }) {
  return (
    <>
      <Row type="flex" align="middle">
        <Col xs={6} sm={12} md={16} lg={18} xxl={20}></Col>
        <Col xs={9} sm={6} md={4} lg={3} xxl={2} align="right">
          <FormattedMessage
            id="createCountry.payment.bcg.title"
          />
        </Col>
        <Col xs={9} sm={6} md={4} lg={3} xxl={2} align="right">
          <h3>{getTotalCostIn("bcg")} BCG</h3>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={6} sm={12} md={16} lg={18} xxl={20}></Col>
        <Col xs={18} sm={12} md={8} lg={6} xxl={4}>
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={onConfirm}
          >
            <FormattedMessage
              id="createCountry.payment.confirm"
            />
          </Button>
        </Col>
      </Row>
    </>
  );
}
