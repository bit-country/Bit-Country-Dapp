import React from "react";
import { Menu } from "antd";
import { FormattedMessage } from "react-intl";

const { Item } = Menu;

const BrowseMenu = ({ category, updateQuery, reloadItems }) => (
  <>
    {category ? (
      <Menu
        onSelect={({ key }) => {
          updateQuery("category", key);
          reloadItems();
        }}
        style={{ border: "none", fontWeight: "600" }}
        defaultSelectedKeys={[category]}
        mode="vertical-left"
      >
        <Item key="country"><FormattedMessage id="marketplace.country.title" /></Item>
        <Item key="block"><FormattedMessage id="marketplace.block.title" /></Item>
        <Item key="section"><FormattedMessage id="marketplace.section.title" /></Item>
        <Item key="asset"><FormattedMessage id="marketplace.asset.title" /></Item>
      </Menu>
    ) : null}
  </>
);

export default BrowseMenu;
