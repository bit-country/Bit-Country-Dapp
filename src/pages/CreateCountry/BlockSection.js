import React from "react";
import { Row, Col, InputNumber, Tooltip, Icon } from "antd";

export default function BlockSection({
  blocks = 9,
  onBlockChange,
}) {
  return (
    <div className="field">
      <label>
        <span>
          Additional&nbsp;
          <Tooltip title={blockTip}>
            Blocks&nbsp;
            <Icon type="question-circle-o" />
          </Tooltip>
        </span>
      </label>
      <p className="label-explaination">
        <span>
          A country starts with 9 blocks, you can add more now to save on
          transaction&nbsp;
          <Tooltip title={feeTip}>
            fees
            <sup>
              <Icon type="question-circle-o" />
            </sup>
          </Tooltip>
        </span>
        <span>
          &nbsp;or add them at a higher&nbsp;
          <Tooltip title={costTip}>
            cost
            <sup>
              <Icon type="question-circle-o" />
            </sup>
          </Tooltip>
        </span>
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
      </Row>
    </div>
  );
}

const blockTip = () => {
  return (
    <div>
      <p>
        <b>What is a Block?</b>
      </p>
      <p>
        They act like a unit of categorization. A block will have a topic and
        all content created under that block&apos;s timeline should follow that
        topic.
      </p>
      <p>
        Blocks also have a dimension behind them where your community can
        gather, host events and trade services.
      </p>
    </div>
  );
};

const feeTip = () => {
  return (
    <div>
      <p>
        Each transaction that interacts with the blockchain will attract a
        transaction fee. The fee can vary based on the complexity of the
        transaction.
      </p>
      <p>
        In this case, by bundling the additional blocks together you are able to
        reduce some of the transaction fee compared to doing each purchase
        separately.
      </p>
    </div>
  );
};

const costTip = () => {
  return (
    <div>
      <p>
        <b>Why does it cost more?</b>
      </p>
      <p>
        Every transaction involving the blockchain attracts a transaction fee.
        You will be charged a fee per transaction, it can be a good idea to do
        more at once if possible to save on cost.
      </p>
    </div>
  );
};
