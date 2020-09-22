import React from "react";
import { Col, Row, Menu, Icon, Button } from "antd";
import { Link } from "@reach/router";
import "./OrderBook.style.css";
import OrderPageTable from "./OrderPageTable";
import { FormattedMessage } from "react-intl";

function OrderBookPage(props) {
  const {
    user,
    acceptOrder,
    closeOrder,
    standardCurrency,
    showPlaceOrder,
    updateFlag,
    countryToken,
  } = props;

  const buyprops = {
    type: "Buy",
    acceptOrder,
    closeOrder,
    standardCurrency,
    user,
    updateFlag,
    countryToken,
  };
  const sellprops = {
    type: "Sell",
    acceptOrder,
    closeOrder,
    standardCurrency,
    user,
    updateFlag,
    countryToken,
  };

  return (
    <div id="orderBook">
      <Row className="body">
        <Col xs={24} md={8} lg={6} xl={4} className="menu">
          <Menu>
            <Menu.Item>
              <Link to="../../">
                <Icon type="arrow-left" />
                &nbsp;
                <FormattedMessage id="country.returnToCountry" />
              </Link>
            </Menu.Item>
          </Menu>
        </Col>

        <Col xs={24} md={16} lg={18} xl={20}>
          <Row>
            <Col
              span={6}
              className="orderbutton"
              style={{ paddingTop: "1.5em", paddingRight: "2em" }}
            >
              <Button
                type="primary"
                className="middleCentredButton"
                onClick={showPlaceOrder}
              >
                <FormattedMessage id="market.order.table.place" />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8} lg={9} xl={12} className="content">
              <OrderPageTable {...sellprops}></OrderPageTable>
            </Col>
            <Col xs={12} md={8} lg={9} xl={12} className="content">
              <OrderPageTable {...buyprops}></OrderPageTable>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default OrderBookPage;
