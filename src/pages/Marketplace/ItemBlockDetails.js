import React from "react";
import { Row, Col, Collapse, Button, Divider, Popover } from "antd";
import moment from "moment";
import Ownership from "./Ownership";
import Currency from "../../components/CurrencyIcon";
import { FormattedMessage } from "react-intl";

const { Panel } = Collapse;

const ItemCountryDetails = ({ details }) => {
  const {
    countryUniqueName,
    createdOn,
    description,
    ownership,
    price,
    title,
    itemDetails,
    owner,
    // views,
  } = details; 

  return (
    <Row>
      <Row gutter={[ 24, 24 ]}>
        <Col span={16}>
          ITEM FOR SELL{" "}
          <div>
            <h1 style={{ fontWeight: "700", letterSpacing: "2px" }}>{title}</h1>{" "}
            <div>
               <span style={{ textTransform: "uppercase" }}><FormattedMessage id="marketplace.itemDetails.ownedBy" /></span>
              &nbsp;   
              <span style={{ fontWeight: "700" }}>
                {owner ?? <FormattedMessage id="marketplace.itemDetails.unknownUser" /> }
              </span>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <Col span={12}>
            <span
              style={{
                display: "block",
                textTransform: "uppercase"
              }}
            >
              <FormattedMessage id="marketplace.itemDetails.postedOn" />
            </span>
            <span style={{ fontSize: "1.3em", color: "black" }}>
              {moment(createdOn).format("DD MMM YYYY")}
            </span>
          </Col>
        </Col>
      </Row>
      <hr />
      <Row gutter={[ 24, 24 ]}>
        <Col span={24}>
          <Row gutter={[ 24, 24 ]}>
            <Col span={24}>
              <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                {" "}
                <span
                  style={{
                    display: "block",
                    textTransform: "uppercase"
                  }}
                >
                  <FormattedMessage id="marketplace.itemDetails.sellingPrice" />
                </span>
                <Row>
                  <Currency price={price} />
                </Row>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                {" "}
                <span
                  style={{
                    display: "block",
                    textTransform: "uppercase"
                  }}
                >
                  <FormattedMessage id="marketplace.itemDetails.originalPrice" />
                </span>
                <Currency price={itemDetails.originalValue} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                {" "}
                <span
                  style={{
                    display: "block",
                    textTransform: "uppercase"
                  }}
                >
                  <FormattedMessage id="marketplace.itemDetails.estimatedPrice" />
                </span>
                <Currency price={itemDetails.estimatedValue} />
              </Col>
              <Col span={8}>
                <span
                  style={{
                    display: "block",
                    textTransform: "uppercase"
                  }}
                >
                  <FormattedMessage id="marketplace.itemDetails.totalBlocks" />
                </span>
                <span style={{ fontSize: "1.3em", color: "black" }}>
                  {itemDetails.totalBlocks ?? "--"}
                </span>
              </Col>
              <Col span={8}>
                <span
                  style={{
                    display: "block",
                    textTransform: "uppercase"
                  }}
                >
                 <FormattedMessage id="marketplace.itemDetails.population" />
                </span>
                <span style={{ fontSize: "1.3em", color: "black" }}>
                  {itemDetails.population ?? "--"}
                </span>
              </Col>
              <Col span={8}>
                <span
                  style={{
                    display: "block",
                    textTransform: "uppercase"
                  }}
                >
                  <FormattedMessage id="marketplace.itemDetails.currency" />
                </span>
                <span style={{ fontSize: "1.3em", color: "black" }}>
                  <Popover content={itemDetails?.token?.name}>
                    {itemDetails.token?.totalSupply ?? "--"} &nbsp;
                    {itemDetails.token?.symbol}
                  </Popover>
                </span>
              </Col>
            </Col>
          </Row>
          <Divider />
          <br />

          <Row>
            <span
              style={{
                display: "block",
                textTransform: "uppercase"
              }}
            >
              <FormattedMessage id="marketplace.itemDetails.description" />
            </span>
            <p style={{ fontSize: "1.3em", color: "black" }}>{description}</p>
          </Row>
          <Col span={24}>
            <Row>
              <Collapse bordered={false}>
                <Panel
                  header={
                  <span 
                    style={{ 
                      color: "grey",
                      textTransform: "uppercase"
                    }} >
                   <FormattedMessage id="marketplace.itemDetails.ownership" />
                   </span>}
                  key="1"
                >
                  <Ownership ownership={ownership} />
                </Panel>
              </Collapse>
            </Row>
          </Col>
          <Row style={{ float: "right", marginTop: "5%", width: "100%" }}>
            <Button style={{ width: "48%", height: "38px" }} type="primary">
            <FormattedMessage id="marketplace.itemDetails.buy" />
            </Button>
            &nbsp;
            <a href={`/c/${countryUniqueName}`} target="_blank" rel="noopener noreferrer" >
              <Button style={{ width: "48%", height: "38px" }}><FormattedMessage id="marketplace.itemDetails.view" /></Button>
            </a>
          </Row>
        </Col>
      </Row>
    </Row>
  );
};

export default ItemCountryDetails;
