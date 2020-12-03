import React from "react";
import { Router, Link } from "@reach/router";
import { Row, Col, Menu } from "antd";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import Create from "./Create";
import Assets from "./Assets";
import { FormattedMessage } from "react-intl";
import "./AssetContainer.styles.css";
import NotFound from "../Errors/NotFound";

function AssetContainer({ "*": selected = "balance" }) {
  return (
    <div id="asset">
      <Row className="body">
        <Col xs={24} md={8} lg={6} xl={4} className="menu">
          <Menu selectedKeys={[selected]}>
            <Menu.Item key="list">
              <Link to="list">
                <FormattedMessage id="asset.menu.list" />
              </Link>
            </Menu.Item>
            <Menu.Item key="create">
              <Link to="create">
                <FormattedMessage id="asset.menu.create" />
              </Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col xs={24} md={16} lg={18} xl={20} className="content">
          <Router>
            <Create path="/create" />
            <Assets path="/list" />
            <NotFound
              default
              message={(
                <FormattedMessage
                  id="errors.pages.404.message.page"
                />
              )}
            />
          </Router>
        </Col>
      </Row>
    </div>
  );
}

export default AuthConnect(AssetContainer, true);
