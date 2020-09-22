import { Modal } from "antd";
import React from "react";
import { FormattedMessage } from "react-intl";

function ConfirmBox({ visible, title, content, onConfirm, onCancel }) {
  return (
    <Modal
      visible={visible}
      title={title}
      okText={<FormattedMessage id="market.order.place.confirm" />}
      onOk={onConfirm}
      cancelText={<FormattedMessage id="market.order.place.cancel" />}
      onCancel={onCancel}
    >
      {content}
    </Modal>
  );
}

export default ConfirmBox;
