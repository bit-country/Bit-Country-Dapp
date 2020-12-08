import React from "react";
import { Row, Col, } from "antd";
import { FormattedMessage } from "react-intl";
import "./index.css";
import BCImage from "../../assets/images/BG1png.png";
import web3Foundation from "../../assets/images/web3foundation.png";
import SocialLinks from "../SocialLinks";

export default function Footer() {
  return (
    <div className="footer">
      <Row>
        <Col xs={24} md={{ push: 1, span: 22 }} lg={{ push: 2, span: 20 }} xl={{ push: 3, span: 18 }}>
          <Row>
            <Col span={12} className="center">
              <img src={BCImage} style={{ height: "8em" }} />
            </Col>
            <Col span={12} className="center">
              <img src={web3Foundation} style={{ height: "8em" }} />
            </Col>
          </Row>
          <h4 className="copyright inverted bold center">
            <FormattedMessage 
              id="home.footer.copyright" 
              values={{
                year: (new Date()).getFullYear()
              }}
            />
          </h4>
          <div className="center social">
            <SocialLinks />
          </div>
        </Col>
      </Row>
    </div>
  );
}
