import React from "react";
import { Col, Row, Menu, Icon } from "antd";
import { FormattedMessage } from "react-intl";
import { Router, Link } from "@reach/router";
import Insights from "./Insights";
import Stakeholders from "./Stakeholders";
import "./GoverningContainer.styles.css";
import OptionalLink from "../../components/OptionalLink";
import NotFound from "../Errors/NotFound";
import MyStake from "./MyStake";
import Residency from "./Residency";

export default function StakeContainer({ "*": selected }) {
  if (selected == "") {
    selected = "overview";
  }

  return (
    <div id="stake">
      <Row className="body">
        <Col xs={24} md={8} lg={6} xl={4} className="menu">
          <Menu selectedKeys={[ selected ]}>
            <Menu.Item key="back">
              <Link to="../">
                <Icon type="arrow-left" />
                &nbsp;
                <FormattedMessage id="country.returnToCountry" />
              </Link>
            </Menu.Item>
            <Menu.Item key="overview">
              <OptionalLink enabled={true} to="./">
                <FormattedMessage id="country.stake.menu.overview" />
              </OptionalLink>
            </Menu.Item>
            <Menu.Item key="insights">
              <OptionalLink enabled={true} to="./insights">
                <FormattedMessage id="country.stake.menu.insights" />
              </OptionalLink>
            </Menu.Item>
            <Menu.Item key="mystake">
              <OptionalLink enabled={true} to="./mystake">
                <FormattedMessage id="country.stake.menu.myStake" />
              </OptionalLink>
            </Menu.Item>
            <Menu.Item key="residency">
              <OptionalLink enabled={true} to="./residency">
                <FormattedMessage id="country.stake.menu.residency" />
              </OptionalLink>
            </Menu.Item>
          </Menu>
        </Col>
        <Col xs={24} md={16} lg={18} xl={20} className="content">
          <Router>
            <Stakeholders path="/" />
            <MyStake path="/mystake" />
            <Insights path="/insights" />
            <Residency path="/residency" />
            <NotFound
              default
              message={<FormattedMessage id="errors.pages.404.message.page" />}
            />
          </Router>
        </Col>
      </Row>
    </div>
  );
}
