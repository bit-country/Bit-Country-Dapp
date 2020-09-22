import React, { useCallback } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Form, Col, Divider, Row, InputNumber, Button } from "antd";
import ReactApexChart from "react-apexcharts";
import Logging from "../../utils/Logging";

function MyStake(props) {
  const { intl, form } = props;
  const { getFieldDecorator } = form;

  const options = {
    stroke: {
      curve: "stepline"
    },
    xaxis: {
      type: "datetime"
    },
    labels: [
      "Test"
    ]
  };
  const series = [ {
    name: "stake",
    data: [
      {
        x: new Date("2018-01-1").getTime(),
        y: 0
      },
      {
        x: new Date("2018-02-12").getTime(),
        y: 500
      },
      {
        x: new Date("2018-07-01").getTime(),
        y: 800
      },
      {
        x: new Date("2019-04-24").getTime(),
        y: 1100
      },
      {
        x: new Date("2020-01-31").getTime(),
        y: 2000
      },
      {
        x: new Date().getTime(),
        y: 2000
      }
    ]
  } ];

  const quantity = 500;

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      Logging.Log("Received values of form: ", values);
    });
  }, []);

  return (
    <Col
      push={4}
      span={16}
    >
      <h2>
        <FormattedMessage
          id="country.stake.myStake.title"
        />
      </h2>
      <Divider />
      <Row
        gutter={[ 16, 16 ]}
      >
        <Col
          xs={24}
          md={12}
        >
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            width="100%"
          />
        </Col>
        <Col
          xs={24}
          md={12}
        >
          <div>
            My stake: 2000 BaCn (5%)
          </div>
          <div>
            My position: 5th
          </div>
        </Col>
      </Row>
      <Divider
        orientation="left"
      >
        <FormattedMessage
          id="country.stake.myStake.section.addMore.title"
        />
      </Divider>
      <Form layout="vertical" onSubmit={handleSubmit}>
        <Form.Item label={intl.formatMessage({ id: "country.stake.myStake.section.addMore.quantity.label" })}>
          {
            getFieldDecorator("quantity",
              {
                initialValue: quantity,
                rules: [
                  { required: true, message: "Please input quantity." }
                ]
              })(<InputNumber min="1" max="999999999" />)
          }
        </Form.Item>
        New total: {2000 + quantity} (+{0.5}%)
        <Divider />
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </Col>
  );
}

export default injectIntl(Form.create()(MyStake));