import React from "react";
import { Router, Link } from "@reach/router";
import { Row, Col, Menu } from "antd";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import Wallet from "./Wallet";
import { FormattedMessage } from "react-intl";
//import BuyBCG from "./BuyBCG";
import "./WalletContainer.styles.css";
import NotFound from "../Errors/NotFound";

function WalletContainer({ "*": selected = "balance" }) {  
  return (
    <div id="wallet">
      <Row className="body">
        <Col xs={24} md={8} lg={6} xl={4} className="menu">
          <Menu selectedKeys={[ selected ]}>
            <Menu.Item key="balance">
              <Link to="balance">
                <FormattedMessage id="wallet.menu.balance" />
              </Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col xs={24} md={16} lg={18} xl={20} className="content">
          <Router>
            <Wallet path="/balance" />
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

export default AuthConnect(WalletContainer, true);
