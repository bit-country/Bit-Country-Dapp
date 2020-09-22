import React from "react";
import { Collapse, Col, Divider, Row } from "antd";
import "./FAQ.styles.css";
import { FormattedMessage } from "react-intl";

export default function FAQ() {
  return (
    <Row>
      <Col 
        id="FAQ"
        push={4}
        span={16}
      >
        <h2>
          <FormattedMessage id="faq.title" />
        </h2>
        <Divider />
        <div className="content">
          <Collapse>
            <Collapse.Panel
              header={(
                <FormattedMessage
                  id="faq.question.1.title"
                />
              )}>
              <p className="answer">
                <FormattedMessage
                  id="faq.question.1.answer"
                />
              </p>
              <a href="">
                <FormattedMessage
                  id="faq.question.1.more"
                />
              </a>
            </Collapse.Panel>
            <Collapse.Panel
              header={(
                <FormattedMessage
                  id="faq.question.2.title"
                />
              )}>
              <p className="answer">
                <FormattedMessage
                  id="faq.question.2.answer"
                />
              </p>
              <a href="">
                <FormattedMessage
                  id="faq.question.2.more"
                />
              </a>
            </Collapse.Panel>
            <Collapse.Panel
              header={(
                <FormattedMessage
                  id="faq.question.3.title"
                />
              )}>
              <p className="answer">
                <FormattedMessage
                  id="faq.question.3.answer"
                />
              </p>
              <a href="">
                <FormattedMessage
                  id="faq.question.3.more"
                />
              </a>
            </Collapse.Panel>
            <Collapse.Panel
              header={(
                <FormattedMessage
                  id="faq.question.4.title"
                />
              )}>
              <p className="answer">
                <FormattedMessage
                  id="faq.question.4.answer"
                />
              </p>
            </Collapse.Panel>
          </Collapse>
        </div>
      </Col>
    </Row>
  );
}
