/* eslint-disable */
import React from "react";
import { Col, Row, Button } from "antd";
import { Link } from "@reach/router";
import ItemCard from "./ItemCard";
import "./Marketplace.styles.css";
import { FormattedMessage } from "react-intl";

const CategoryRow = ({ items, category }) => {
  return (
    <Row style={{ padding: "20px 0" }}>
      <Row>
        <h1
          style={{
            display: "inline",
            textTransform: "capitalize",
            borderBottom: "4px solid turquoise",
          }}
        >
          {category}
        </h1>
        <Button style={{ float: "right", color: "black" }} type="link">
          <Link to={`/marketplace/browse?category=${category}`}><FormattedMessage id="marketplace.browse.viewAll" /></Link>
        </Button>
      </Row>
      <Row
        className="itemRow"
        style={{ padding: "26px 0", overflowX: "auto", display: "flex" }}
        gutter={24}
      >
        {items?.map((value) => {
          return (
            <Col xs={12} sm={12} md={8} lg={7} xl={6} key={value.id}>
              <ItemCard item={value} />
            </Col>
          );
        })}
      </Row>
    </Row>
  );
};

export default CategoryRow;
