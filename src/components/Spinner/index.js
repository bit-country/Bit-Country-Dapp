import React from "react";
import { Spin } from "antd";

export default function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - var(--bar-height))"
      }}
    >
      <Spin size="large" />
    </div>
  );
}
