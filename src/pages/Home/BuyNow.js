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
          <Col xs={24} md={{ push: 1, span: 22 }} lg={{ push: 2, span: 20 }} xl={{ push: 3, span: 18 }}>
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
              onClick={() => navigate("/create-country")}
            >
              <FormattedMessage id="app.createYourCountry" />
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
