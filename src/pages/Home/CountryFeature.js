import React from "react";
import countryLogo from "../../assets/images/countries.svg";
import blockLogo from "../../assets/images/blocks.svg";
import residentsLogo from "../../assets/images/residents.svg";
import economyLogo from "../../assets/images/economy.svg";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "antd";

export default function CountryFeature () {
  return (
    <div className="features">
      <div className="section" id="country">
        <Row>
          <Col xs={1} lg={2}></Col>
          <Col xs={22} lg={20}>
            <Row className="feature">
              <Col xs={24} lg = {12} className="logo center">
                <img src={countryLogo} />
              </Col>
              <Col xs={24} lg = {12} className="text">
                <h3>
                  <FormattedMessage id="home.features.countries" />
                </h3>
                <p>
                  <FormattedMessage id="home.features.countries.details" />
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="section" id="block">
        <Row>
          <Col xs={1} lg={2}></Col>
          <Col xs={22} lg={20}>
            <Row className="feature">
              <Col xs={0} lg = {12} className="text">
                <h3>
                  <FormattedMessage id="home.features.blocks" />
                </h3>
                <p>
                  <FormattedMessage id="home.features.blocks.details" />
                </p>
              </Col>
              <Col xs={24} lg = {12} className="logo center">
                <img src={blockLogo} />
              </Col>
              <Col xs={24} lg = {0} className="text">
                <h3>
                  <FormattedMessage id="home.features.blocks" />
                </h3>
                <p>
                  <FormattedMessage id="home.features.blocks.details" />
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="section" id="economy">
        <Row>
          <Col xs={1} lg={2}></Col>
          <Col xs={22} lg={20}>
            <Row className="feature">
              <Col xs={24} lg = {12} className="logo center">
                <img src={economyLogo} />
              </Col>
              <Col xs={24} lg = {12} className="text">
                <h3>
                  <FormattedMessage id="home.features.economy" />
                </h3>
                <p>
                  <FormattedMessage id="home.features.economy.details" />
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="section" id="residents">
        <Row>
          <Col xs={1} lg={2}></Col>
          <Col xs={22} lg={20}>
            <Row className="feature">
              <Col xs={0} lg = {12} className="text">
                <h3>
                  <FormattedMessage id="home.features.residents" />
                </h3>
                <p>
                  <FormattedMessage id="home.features.residents.details" />
                </p>
              </Col>
              <Col xs={24} lg = {12} className="logo center">
                <img src={residentsLogo} />
              </Col>
              <Col xs={24} lg = {0} className="text">
                <h3>
                  <FormattedMessage id="home.features.residents" />
                </h3>
                <p>
                  <FormattedMessage id="home.features.residents.details" />
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}
