import React from "react";
import { Row, Col, } from "antd";
import { FormattedMessage } from "react-intl";
import "./index.css";
import BCImage from "../../assets/images/BG1png.png";
import SocialLinks from "../SocialLinks";

export default function Footer() {
  return (
    <div className="footer">
      <Row>
        <Col xs={0} md={1} lg={2} xl={3}></Col>
        <Col xs={24} md={22} lg={20} xl={18}>
          <Row>
            <Col span={24} className="center">
              <img src={BCImage} style={{ width: "10em" }} />
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
