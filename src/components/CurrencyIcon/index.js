import { Row } from "antd";
import React from "react";
import CurrencyIcon from "../../assets/currency-icon/BCG_icon.png";
import "./Currency.styles.css";

const Currency = ({ price, icon }) => {
  return (
    <Row>
      <div
        style={{
          width: "20px",
          top: "24%",
          position: "absolute",
        }}
      >
        {icon ?? (
          <img
            style={{
              width: "20px",
              top: "24%",
              position: "absolute",
            }}
            src={CurrencyIcon}
          />
        )}
      </div>
      <span
        style={{
          fontSize: "1.5em",
          paddingLeft: "28px",
        }}
      >
        {price ?? "--"}
      </span>
    </Row>
  );
};

export default Currency;
