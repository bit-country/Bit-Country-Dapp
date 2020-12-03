import React from "react";
import {
  Row,
  Col,
  Button,
  Divider,
  Radio,
  Collapse,
  Alert,
  Tooltip,
  Icon,
} from "antd";
import { FormattedMessage } from "react-intl";

const { Panel } = Collapse;

export default function Summary({
  blocks,
  blockCost,
  backing,
  backingCost,
  totalCost,
  paymentCurrency,
  rate,
  onPaymentCurrencyChange,
  onConfirm,
  loading,
}) {
  return (
    <>
      <div
        style={{
          backgroundColor: "#fafafa",
          padding: "12px",
          borderRadius: "4px",
        }}
      >
        <h3>Summary</h3>
        <hr />
        <Row type="flex" align="middle">
          <Col xs={12} sm={12} md={12} lg={12} xxl={12} align="left">
            {blocks} Initial blocks
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xxl={12} align="right">
            {Math.round((blockCost + Number.EPSILON) * 100) / 100}{" "}
            {paymentCurrency}
          </Col>
        </Row>
        <Divider />
        <Row type="flex" align="middle">
          <Col xs={12} sm={12} md={12} lg={12} xxl={12} align="left">
            {backing} BCG backing
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xxl={12} align="right">
            {Math.round((backingCost + Number.EPSILON) * 100) / 100}{" "}
            {paymentCurrency}
          </Col>
        </Row>
        <hr />
        <Row type="flex" align="middle">
          <Col xs={12} sm={12} md={12} lg={12} xxl={12} align="left">
            <h3>
              <FormattedMessage id="createCountry.payment.bcg.title" />
            </h3>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xxl={12} align="right">
            <h3>
              {Math.round((totalCost + Number.EPSILON) * 100) / 100}{" "}
              {paymentCurrency}
            </h3>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
            <Button
              type="primary"
              size="large"
              block
              loading={loading}
              onClick={onConfirm}
            >
              <FormattedMessage id="createCountry.payment.confirm" />
            </Button>
          </Col>
        </Row>
      </div>
      <br />
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xxl={24} align="left">
          <Collapse defaultActiveKey={["1"]} style={{ border: 0 }}>
            <Panel
              header="Choose payment currency"
              key="1"
              style={{ border: 0 }}
            >
              <Radio.Group
                name="paymentCurrency"
                onChange={onPaymentCurrencyChange}
                value={paymentCurrency}
              >
                <Radio value={"BCG"}>BCG</Radio>
                <Radio value={"USD"}>USD</Radio>
              </Radio.Group>
              <br />
              <br />
              <p>Exchange Rate: 1 BCG = {rate} USD</p>
            </Panel>
          </Collapse>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xxl={24} align="left">
          <Collapse defaultActiveKey={["1"]} style={{ border: 0 }}>
            <Panel header="Bit Country" key="1" style={{ border: 0 }}>
              <p>Unique URL:</p>
              <p>Display Name:</p>
              <p>Description: </p>
              <p>Theme: </p>
            </Panel>
            <Panel header="Blocks" key="2" style={{ border: 0 }}>
              Initial Blocks:
            </Panel>
            <Panel header="Currency" key="3" style={{ border: 0 }}>
              <p>Name:</p>
              <p>Symbol/Ticker:</p>
              <p>Total Supply: </p>
              <p>Backing: </p>
            </Panel>
          </Collapse>
          <br />
          <Alert
            message="Host Blockchain"
            description={
              <span>
                This bit country and its currency will be deployed on&nbsp;
                <a
                  href="http://explorer.bit.country/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tooltip
                    title="Click to open the Bit.Country Whenua Explorer to see 
                  blockchain transactions and more."
                  >
                    Whenua
                    <sup>
                      <Icon type="question-circle-o" />
                    </sup>
                  </Tooltip>
                </a>
                , Bit.Country’s Polkadot Parachain.
              </span>
            }
            type="success"
          />
        </Col>
      </Row>
    </>
  );
}
