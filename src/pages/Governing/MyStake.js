import React, { useCallback, useEffect, useMemo, useState } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Form, Col, Divider, Row, InputNumber, Button } from "antd";
import ReactApexChart from "react-apexcharts";
import Logging from "../../utils/Logging";
import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Notification from "../../utils/Notification";
import { CountryConnect } from "../../components/HOC/Country/CountryWrapper";

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

function MyStake({ intl, form, country }) {
  const { getFieldDecorator } = form;
  const [ stakeTransactions, setStakeTransactions ] = useState([]);
  const [ totalStake, setTotalStake ] = useState(0);
  const [ quantity, setQuantity ] = useState(1);
  const [ submitting, setSubmitting ] = useState(false);

  useEffect(() => {
    if (!country) {
      return;
    }

    (async () => {
      try {
        const response = await fetchAPI(`${endpoints.GET_COUNTRY_USER_STAKE_RECORDS}?countryId=${country.id}`);

        if (!response?.isSuccess) {
          throw Error(response.message);
        }

        let runningTotal = 0;
        const data = response.countryUserStakingDetails.map(item => {
          runningTotal += item.amount;

          return {
            stakedOn: item.stakedOn,
            amount: runningTotal
          };
        });

        setStakeTransactions(data);
        setTotalStake(runningTotal);
      } catch (error) {
        Logging.Error(error);

        Notification.displayErrorMessage(
          <FormattedMessage
            id="country.stake.myStake.notification.error"
          />
        );
      }
    })();
  }, [ country ]);

  const series = useMemo(() => [ {
    name: "stake",
    data: stakeTransactions.length > 0 ? 
      stakeTransactions.map(value => ({
        x: new Date(value.stakedOn),
        y: value.amount
      })) : [ {
        x: new Date(),
        y: 0
      } ]
  } ], [ stakeTransactions ]);

  const handleSubmit = useCallback(e => {
    e.preventDefault();

    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      try {
        setSubmitting(true);

        const response = await fetchAPI(endpoints.STAKE_INTO_COUNTRY, "POST", {
          countryId: country.id,
          amount: values.quantity
        });
  
        if (!response?.isSuccess) {
          Logging.Error(response.message);

          Notification.displayErrorMessage(
            <FormattedMessage
              id={response.message}
            />
          );
          
          return;
        }

        const newStake = totalStake + response.stake.amount;
        const newStakes = [
          ...stakeTransactions,
          {
            stakedOn: response.stake.stakedOn,
            amount: newStake
          }
        ];

        setStakeTransactions(newStakes);
        setTotalStake(newStake);

        Notification.displaySuccessMessage(
          <FormattedMessage
            id="country.stake.myStake.notification.submitSuccess"
          />
        );
      } catch (error) {
        Logging.Error(error);

        Notification.displayErrorMessage(
          <FormattedMessage
            id="country.stake.myStake.notification.submitError"
          />
        );
      } finally {
        setSubmitting(false);
      }
    });
  }, [ country, totalStake, stakeTransactions ]);

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
            <FormattedMessage
              id="country.stake.myStake.total"
              values={{ total: totalStake }}
            />
          </div>
          {/* <div>
            My position: 5th
          </div> */}
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
                ],
              })(<InputNumber min={1} max={999999999} onChange={value => setQuantity(value)} />)
          }
        </Form.Item>
        <FormattedMessage
          id="country.stake.myStake.newTotal"
          values={{ newTotal: totalStake + quantity }}
        />
        {/* New total: {totalStake + quantity} (+{0.5}%) */}
        <Divider />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>Submit</Button>
        </Form.Item>
      </Form>
    </Col>
  );
}

export default injectIntl(CountryConnect(Form.create()(MyStake)));