import React, { Component } from "react";
import { Timeline, Row, Col } from "antd";
import { FormattedMessage } from "react-intl";

export default class Roadmap extends Component {
  render() {
    return (
      <div className="roadmap">
        <Row>
          <Col xs={0} md={1} lg={2} xl={3}></Col>
          <Col xs={24} md={22} lg={20} xl={18}>
            <h2 className="center">
              <FormattedMessage id="home.roadmap.title" />
            </h2>
            <div className="timeline">
              <Timeline mode="alternate">
                <Timeline.Item color="green">
                  <h3>
                    <FormattedMessage id="home.roadmap.stage1" />
                  </h3>
                  <FormattedMessage id="home.roadmap.stage1.details" />
                </Timeline.Item>
                <Timeline.Item color="orange">
                  <h3>
                    <FormattedMessage id="home.roadmap.stage2" />
                  </h3>
                  <FormattedMessage id="home.roadmap.stage2.details" />
                </Timeline.Item>
                <Timeline.Item color="orange">
                  <h3>
                    <FormattedMessage id="home.roadmap.stage3" />
                  </h3>
                  <FormattedMessage id="home.roadmap.stage3.details" />
                </Timeline.Item>
                <Timeline.Item color="orange">
                  <h3>
                    <FormattedMessage id="home.roadmap.stage4" />
                  </h3>
                  <FormattedMessage id="home.roadmap.stage4.details" />
                </Timeline.Item>
                <Timeline.Item color="orange">
                  <h3>
                    <FormattedMessage id="home.roadmap.stage5" />
                  </h3>
                  <FormattedMessage id="home.roadmap.stage5.details" />
                </Timeline.Item>
                {/* <Timeline.Item color="gray">
                  <h3>
                    <FormattedMessage id="home.roadmap.stage4" />
                  </h3>
                  <FormattedMessage id="home.roadmap.stage4.details" />
                </Timeline.Item> */}
              </Timeline>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
