import React from "react";
import { navigate } from "@reach/router";
import { Button, Row, Col } from "antd";
import { FormattedMessage } from "react-intl";
import hero from "../../assets/videos/hero.mp4";

export default function BuyNow() {
  return (
    <div className="buy-now center hero">
      <video src={hero} autoPlay loop className="hero-background" />
      <div className="mask">
        <Row>
          <Col xs={0} md={1} lg={2} xl={3}></Col>
          <Col xs={24} md={22} lg={20} xl={18}>
            <h1 className="inverted">
              <FormattedMessage id="home.buyNow" />
            </h1>
            <h2 className="inverted">
              <FormattedMessage id="home.buyNow.details" />
            </h2>
            <br />
            <br />
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/request-access")}
            >
              <FormattedMessage id="app.createYourCountry" />
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
