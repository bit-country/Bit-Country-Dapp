import React, { Component } from "react";
import { Timeline, Row, Col } from "antd";
import { FormattedMessage } from "react-intl";

export default class Roadmap extends Component {
  render() {
    return (
      <div className="roadmap">
        <Row>
          <Col xs={24} md={{ push: 1, span: 22 }} lg={{ push: 2, span: 20 }} xl={{ push: 3, span: 18 }}>
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
