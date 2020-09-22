import React, { useState, useCallback } from "react";
import { Col, Modal, Divider, InputNumber, Row, Button, Spin } from "antd";
import { FormattedMessage } from "react-intl";
import "./BuyBCG.styles.css";
import { useTokenRate } from "../../hooks/useRates";
import { DAppConnect } from "../../components/HOC/DApp/DAppWrapper";

function BuyBCG() {
  const [ loading, tokenRate, error ] = useTokenRate();
  const [ quantity, setQuantity ] = useState(1);
  const [ showConfirm, setShowConfirm ] = useState(false);

  const handleChange = useCallback(value => {
    setQuantity(value);
  }, [ setQuantity ]);

  const handleClick = useCallback(() => {
    setShowConfirm(true);
  }, [ setShowConfirm ]);

  const handleConfirmCancel = useCallback(() => {
    setShowConfirm(false);
  }, [ setShowConfirm ]);

  const handleConfirmPurchase = useCallback(() => {
    setShowConfirm(false);
  }, [ quantity, tokenRate, setShowConfirm ]);


  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%"
        }}
      >
        <Spin size="large" />
      </div>
    );
  } else if (error) {
    return (
      <Col
        push={4}
        span={16}
      >
        <h3 className="error">
          <FormattedMessage
            id="wallet.bcg.rate.error"
          />
        </h3>
      </Col>
    );
  }

  const totalToken = (quantity * tokenRate).toFixed(5);

  return (
    <>
      <Col
        push={4}
        span={16}
      >
        <h2>
          <FormattedMessage
            id="wallet.bcg.buy.title"
          />
        </h2>
        <Divider />
        <Row>
          <label>
            <FormattedMessage
              id="wallet.bcg.buy.quantity.label"
            />
          </label>
        </Row>
        <Row>
          <Col span={24}>
            <InputNumber
              name="quantity"
              onChange={handleChange}
              min={0}
              max={100000}
              value={quantity}
            />
            <a 
              className="quickInput"
              onClick={() => setQuantity(1)}
            >
              <FormattedMessage
                id="wallet.bcg.buy.preset.1"
              />
            </a>
            <a 
              className="quickInput"
              onClick={() => setQuantity(10)}
            >
              <FormattedMessage
                id="wallet.bcg.buy.preset.10"
              />
            </a>
            <a 
              className="quickInput"
              onClick={() => setQuantity(50)}
            >
              <FormattedMessage
                id="wallet.bcg.buy.preset.50"
              />
            </a>
            <a 
              className="quickInput"
              onClick={() => setQuantity(100)}
            >
              <FormattedMessage
                id="wallet.bcg.buy.preset.100"
              />
            </a>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col push={16} span={8} className="total">
            <div>
              <h4>
                <FormattedMessage
                  id="wallet.bcg.buy.total.label"
                />
              </h4>
            </div> 
            <div>
              <FormattedMessage
                id="wallet.bcg.buy.total.token"
                values={{
                  value: totalToken
                }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col push={16} span={8} className="buttons">
            <Button 
              type="primary"
              onClick={handleClick}
            >
              <FormattedMessage
                id="wallet.bcg.buy.purchase"
              />
            </Button>
          </Col>
        </Row>
      </Col>
      <Modal
        visible={showConfirm}
        title={(
          <FormattedMessage
            id="wallet.bcg.buy.confirm.title"
          />
        )}
        okText={(
          <FormattedMessage
            id="wallet.bcg.buy.confirm.okay"
          />
        )}
        onOk={handleConfirmPurchase}
        cancelText={(
          <FormattedMessage
            id="wallet.bcg.buy.confirm.cancel"
          />
        )}
        onCancel={handleConfirmCancel}
      >
        <FormattedMessage
          id="wallet.bcg.buy.confirm.message"
          values={{
            quantity
          }}
        />
      </Modal>
    </>
  );
}

export default DAppConnect(BuyBCG, true);