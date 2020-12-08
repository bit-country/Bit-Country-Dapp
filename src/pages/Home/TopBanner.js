import React from "react";
import { navigate } from "@reach/router";
import { FormattedMessage } from "react-intl";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { Col, Row, Button } from "antd";
import bitCountyTitle from "../../assets/images/Bit.Country.png";
import background from "../../assets/videos/home_bg.mp4";
import SocialLinks from "../../components/SocialLinks";

function TopBanner() {
  return (
    <div className="top-banner hero snap">
      <video src={background} muted={true} autoPlay loop className="hero-background" />
      <Row>
        <Col xs={24} md={{ push: 1, span: 22 }} lg={{ push: 2, span: 20 }} xl={{ push: 3, span: 18 }}>
          <div className="headline-slogan">
            <Row>
              <Col xs={24} sm={21} md={18} lg={15} xl={12}>
                <img src={bitCountyTitle} />
              </Col>
            </Row>
            <h2>
              <FormattedMessage id="app.title" />
            </h2>
            <h3>
              <FormattedMessage id="app.slogan" />
            </h3>
          </div>
          <Button
            className="call-to-action"
            type="primary"
            size="large"
            onClick={() => navigate("/create-country")}
          >
            <FormattedMessage id="app.createYourCountry" />
          </Button>
          <div className="social-medias">
            <h4 className="inverted">
              <FormattedMessage id="app.followus" />
            </h4>
            <SocialLinks />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AuthConnect(TopBanner);
