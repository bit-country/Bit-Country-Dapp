import React from "react";
import { Card, Row, Col } from "antd";
import { FormattedMessage } from "react-intl";
import Utils from "../../utils/Utils";
import TokenDetailsPopover from "../../components/TokenDetailsPopover";

export default function CountryDetail({ country, signInProvider, children }) {
  if (!country) {
    return false;
  }

  return (
    <Card 
      cover={<img src={Utils.getTheme(country.theme)} />} 
      bordered={false} 
      bodyStyle={{ borderBottom: "1px solid #e8e8e8" }}
    >
      {signInProvider}
      <h3>{country.name}</h3>
      <p>{country.description}</p>
      <Row>
        <Col span={12}>
          <FormattedMessage id="country.owner" />:
        </Col>
        <Col span={12}>
          {country.president}
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormattedMessage id="country.population" />:
        </Col>
        <Col span={12}>
          {country.population}
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormattedMessage id="country.token" />:
        </Col>
        <Col span={12}>
          {country.token?.symbol ? (
            <TokenDetailsPopover token={country.token}>
              <span className="token-popover-hint">
                {`${country.token.totalSupply.toLocaleString()} ${country.token.symbol}`}
              </span>
            </TokenDetailsPopover>
          ) : (
            <FormattedMessage 
              id="country.details.token.empty"
            /> 
          )}
        </Col>
      </Row>
      <br />
      {children}
    </Card>
  );
}
