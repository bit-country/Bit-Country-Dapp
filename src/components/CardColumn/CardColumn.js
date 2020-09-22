import React from "react";
import { Col } from "antd";

export default function CardColumn({ children }) {
  return (
    <Col xxl={6} lg={8} md={12} xs={24}>
      {children}
    </Col>
  );
}
