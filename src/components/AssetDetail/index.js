import React from "react";
import { Card, Row, Col, Divider } from "antd";
import { FormattedMessage } from "react-intl";
import Utils from "../../utils/Utils";

export default function AssetDetail({
  asset,
  balance,
  sales,
  children,
}) {
  return (
    <Card cover={<img src={Utils.getAsset(asset.number)} />}>
      <h3>{asset.name}</h3>
      <p>{asset.description}</p>
      <Row>
        <Col span={12}>
          <FormattedMessage id="wallet.assets.auction.quantity" />:
        </Col>
        <Col span={12}>{balance}</Col>
      </Row>
      <Divider orientation="left">
        <FormattedMessage id="wallet.assets.auction.previoussale" />
      </Divider>
      {}
      <Row>
        <Col xs={24} md={12}>
          <label>
            <FormattedMessage id="wallet.assets.auction.history.dealDate" />
          </label>
        </Col>
        <Col xs={24} md={12}>
          <label>
            <FormattedMessage id="wallet.assets.auction.history.dealPrice" />
          </label>
        </Col>
      </Row>
      <hr style={{ size: 1 }} />
      {sales == null ? (
        <FormattedMessage id="wallet.assets.auction.history.null" />
      ) : (
        sales.map((sale, i) => (
          <Row key={i}>
            <Col xs={24} md={12}>
              {sale.date}
            </Col>
            <Col xs={24} md={12}>
              {sale.price}
            </Col>
          </Row>
        ))
      )}
      <br />
      {children}
    </Card>
  );
}
