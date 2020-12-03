/* eslint-disable */
import React from "react";
import { Icon } from "antd";
import "./Marketplace.styles.css";
import { Link } from "@reach/router";
import CurrencyIcon from "../../assets/images/currency_colorful.png";

const title = [
  "MVP Studio",
  "Global Talent",
  "Industry Connect",
  "MS Tech",
  "MongoDB Community",
  "I Love Programming",
  "Cypress",
  "",
];

const ItemCard = ({ image, index }) => {
  return (
    <Link to="/marketplace/item/itemId">
      <div
        className="CardBody"
        style={{
          boxShadow:
            "rgb(234, 234, 234) 0px 2px 12px, rgba(0, 0, 0, 0.22) 0px 10px 10px 0px",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <div style={{ textAlign: "center", padding: "0 0 38px" }}>
          <img
            style={{
              width: "100%",
              objectFit: "scale-down",
              borderRadius: "5px",
            }}
            src={image}
          />
        </div>
        <div style={{ padding: "2%" }}>
          <h2
            style={{
              margin: "0",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {title[index]}
          </h2>
          <span style={{ color: "grey" }}>Valid for 6 months</span>
        </div>
        <br />
        <div style={{ textAlign: "end", display: "inline-flex" }}>
          <div>
            <img style={{ width: "20px" }} src={CurrencyIcon} />
            &nbsp;
            <span style={{ color: "grey" }}>
              <b>50</b>
            </span>
          </div>
          <div>
            <span style={{ padding: "5px", color: "grey" }}>
              <Icon type="eye" theme="filled" style={{ fontSize: "18px" }} />
              &nbsp;1091
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
