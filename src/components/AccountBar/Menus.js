import React from "react";
import { Row, Col, Menu } from "antd";
import { AuthConnect } from "../HOC/Auth/AuthContext";
import { Link } from "@reach/router";
import { FormattedMessage } from "react-intl";

function Menus() {
  return (
    <Row>
      <Col span={6}>
        <Menu
          selectable={false}
          style={{ backgroundColor: "#dedede" }}
        >
          <Menu.ItemGroup title="Countries">
            <Menu.Item key="explore">
              <Link to="/explore">
                <FormattedMessage
                  id="app.explore"
                />
              </Link>
            </Menu.Item>
            <Menu.Item key="my-countries">
              <Link to="/my-countries">
                <FormattedMessage
                  id="app.myCountries"
                />
              </Link>
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Col>
      <Col span={6}>
        <Menu
          selectable={false}
          style={{ backgroundColor: "#dedede" }}
        >
          <Menu.ItemGroup title="Economy">
            <Menu.Item key="my-wallet">
              <Link to="/wallet/balance">
                <FormattedMessage
                  id="app.myCurrencies"
                />
              </Link>
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Col>
      <Col span={6}>
        <Menu
          selectable={false}
          style={{ backgroundColor: "#dedede" }}
        >
          <Menu.ItemGroup title="Content">
            <Menu.Item key="my-posts">
              <Link to="/my-posts">
                <FormattedMessage
                  id="app.myPosts"
                />
              </Link>
            </Menu.Item>
            <Menu.Item key="my-mind">
              <Link to="/my-mind">
                <FormattedMessage
                  id="app.myMind"
                />
              </Link>
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Col>
      <Col span={6}>
        <Menu
          selectable={false}
          style={{ backgroundColor: "#dedede" }}
        >
          <Menu.ItemGroup title="Account">
            <Menu.Item key="profile">
              <Link to="/profile">
                <FormattedMessage
                  id="app.profile"
                />
              </Link>
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Col>
    </Row>
  );
}

export default AuthConnect(Menus);
