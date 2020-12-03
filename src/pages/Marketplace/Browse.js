import React from "react";
import { Layout, Tabs, Button, Icon } from "antd";
import { Link } from "@reach/router";
import "./Marketplace.styles.css";
import BrowseBody from "./BrowseBody";
import { FormattedMessage } from "react-intl";

const { TabPane } = Tabs;

const Browse = () => {
  return (
    <Layout.Content>
      <h1 style={{ fontSize: "2em", textTransform: "capitalize" }}>
        <FormattedMessage
          id="marketplace.title"
        />
      </h1>
      <Tabs
        defaultActiveKey="browse"
        tabBarExtraContent={
          <Button type="link">
            <Icon type="plus" />
            &nbsp;
            <Link to={"/marketplace/sell"}>
              <FormattedMessage id="marketplace.startSelling" />
            </Link>
          </Button>
        }
      >
        <TabPane tab={<FormattedMessage id="marketplace.browse.title" />} key="browse">
          <BrowseBody />
        </TabPane>
      </Tabs>
    </Layout.Content>
  );
};

export default Browse;
