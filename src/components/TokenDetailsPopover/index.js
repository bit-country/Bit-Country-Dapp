import React from "react";
import { injectIntl } from "react-intl";
import { Avatar, Popover, Descriptions } from "antd";
import "./index.css";

function TokenDetailsPopover(props) {
  if (!props.token) {
    return props.children;
  }

  const { intl } = props;
  const {
    name = "",
    symbol = "",
    totalSupply = 0,
    backing = 0,
  } = props.token;

  const title = (
    <div>
      <Avatar>{symbol}</Avatar>
      {name}
    </div>
  );

  const content = (
    <Descriptions>
      <Descriptions.Item 
        label={intl.formatMessage({ id: "country.tokenDetails.label.totalSupply" })}
      >
        {totalSupply.toLocaleString()}
      </Descriptions.Item>
      <Descriptions.Item 
        label={intl.formatMessage({ id: "country.tokenDetails.label.backing" })}
      >
        {backing.toLocaleString()}
      </Descriptions.Item>
      {/* <Descriptions.Item label={intl.formatMessage({ id: "country.tokenDetails.label.minter" })}>{minter.nickName}</Descriptions.Item>
      <Descriptions.Item label={intl.formatMessage({ id: "country.tokenDetails.label.mintedOn" })}>{mintedOn}</Descriptions.Item>
      <Descriptions.Item label={intl.formatMessage({ id: "country.tokenDetails.label.contractAddress" })}>{contractAddress}</Descriptions.Item> */}
    </Descriptions>
  );

  return (
    <Popover id="TokenPopover" title={title} content={content}>
      {props.children}
    </Popover>
  );
}

export default injectIntl(TokenDetailsPopover);