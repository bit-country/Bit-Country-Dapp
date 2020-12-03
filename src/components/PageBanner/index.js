import { Col, Row } from "antd";
import React from "react";
import "./banner.style.css";
const PageBanner = ({ title, subTitle, pageTitle, background, style }) => {
  return (
    <div className="banner_container" >
      <div
        className="banner"
        style={{ backgroundImage: `url(${background})`, ...style }}
      />
      <Row className="overlay-container">
        <Col                   
          xs={1}
          sm={2}
          md={3}
          lg={1}
          xl={3}
          xxl={4}
        />
        <Col 
          xs={22}
          sm={20}
          md={18}
          lg={22}
          xl={18}
          xxl={16}
        >
          <Row
            gutter={24}
            className="overlay"
          >
            <Col className="explore_title" span={12}>{pageTitle}</Col>
            <Col className="banner_text" span={12}>
              <h2 className="banner_title">{title}</h2>
              <p className="banner_subtitle">{subTitle}</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default PageBanner;
