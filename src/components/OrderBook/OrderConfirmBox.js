import { Modal } from "antd";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useTokenById } from "./../../hooks/useOrders";

const ORDER_TYPE = {
  BUY: 0,
  SELL: 1,
};

function ConfirmBox({ visible, record, action, onConfirm, onCancel }) {
  const { quantity, bcgPrice } = record;
  var token;

  if(record&&record.tradedToken&&record.tradedToken.symbol){
    token = record.tradedToken;
  }else 
    token = useTokenById(record && record.tradedToken ? record.tradedToken.id : "");
  var title = "", message = "";
  var symbol = token.symbol;

  if (action === "accept" && record.type === ORDER_TYPE.BUY) {
    title = (
      <FormattedMessage
        id="market.order.accept.sell.title"
        values={{ symbol }}
      />
    );
    message = (
      <FormattedMessage
        id="market.order.accept.sell.message"
        values={{ quantity, symbol, bcgPrice }}
      />
    );
  } else if (action === "accept" && record.type === ORDER_TYPE.SELL) {
    title = (
      <FormattedMessage
        id="market.order.accept.buy.title"
        values={{ symbol }}
      />
    );
    message = (
      <FormattedMessage
        id="market.order.accept.buy.message"
        values={{ quantity, symbol, bcgPrice }}
      />
    );
  } else if (action === "close" && record.type === ORDER_TYPE.SELL) {
    message = (
      <FormattedMessage
        id="market.order.close.sell.message"
        values={{
          quantity,
          symbol,
          bcgPrice,
        }}
      />
    );
    title = <FormattedMessage id="market.order.close.sell.title" values={{ symbol }} />;
  } else if (action === "close" && record.type === ORDER_TYPE.BUY) {
    message = (
      <FormattedMessage
        id="market.order.close.buy.message"
        values={{
          quantity,
          symbol,
          bcgPrice,
        }}
      />
    );

    title = <FormattedMessage id="market.order.close.buy.title" values={{ symbol }} />;
  }

  return (
    <Modal
      visible={visible}
      title={title}
      okText={<FormattedMessage id="market.order.place.confirm" />}
      onOk={onConfirm}
      cancelText={<FormattedMessage id="market.order.place.cancel" />}
      onCancel={onCancel}
    >
      {message}
    </Modal>
  ) ; 
}

export default ConfirmBox;
