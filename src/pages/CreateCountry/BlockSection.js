import React from "react";
import { Row, Col, InputNumber } from "antd";

export default function BlockSection({ blocks = 9, blockPrice, onBlockChange }) {
  return (
    <div className="field">
      <label>Purchase Blocks</label>
      <p className="label-explaination">
        Your country start with 9 blocks, each block can have one topic.
        You may purchase more blocks to add more topics to your country.
      </p>
      <Row type="flex" align="middle">
        <Col span={21}>
          <InputNumber
            min={9}
            max={169}
            size="large"
            name="totalBlockNumber"
            onChange={onBlockChange}
            value={blocks}
          />
          <span> Initial Blocks </span>
        </Col>
        <Col span={3} align="right">
          <h3>{blocks * blockPrice} BCG</h3>
        </Col>
      </Row>
    </div>
  );
}
