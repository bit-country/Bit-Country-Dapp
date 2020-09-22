import React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Divider, Row } from "antd";
import ReactApexChart from "react-apexcharts";

export default function Overview() {
  const options = {
    labels: [
      "MVP Studio",
      "MVPians",
      "Global Talent IO",
      "Industry Connect",
      "Shannon Christie",
      "Justin Pham",
      "Tim Young",
      "Ray Lu",
      "Lew Angeles",
    ],
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    }
  };
  const series = [
    50,
    20,
    10,
    5,
    3,
    3,
    3,
    3,
    3
  ];

  const totalStake = 10000000;

  return (
    <Col
      push={4}
      span={16}
    >
      <h2>
        <FormattedMessage
          id="country.stake.overview.title"
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
          <h4>Stake distribution:</h4>
          <ReactApexChart
            options={options}
            series={series}
            type="pie"
            width="100%"
          />
        </Col>
        <Col
          xs={24}
          md={12}
        >
          <h4>
            <FormattedMessage
              id="country.stake.overview.details"
            />
          </h4>
          <div>
            <FormattedMessage
              id="country.stake.overview.totalStake"
              values={{ stake: totalStake.toLocaleString() }}
            />
          </div>
          <div>
            <FormattedMessage
              id="country.stake.overview.totalStakeholders"
              values={{ stakeholders: series.length }}
            />
          </div>
        </Col>
        {/* <Col
          xs={24}
          md={12}
        >
          <h4>Bills:</h4>
          <div>Pending: 3</div>
          <div>Passed: 2</div>
        </Col>
        <Col
          xs={24}
          md={12}
        >
          <h4>Insights:</h4>
          <div>Ad Revenue: 3 BCG</div>
          <div>Pending Ads: 1</div>
          <div>Active Ads: 2</div>
          <div>New members: 40</div>
          <div>New content: 10</div>
        </Col> */}
      </Row>
      <Row>
        <Col span={24}>
          <div className="stake-information">
            <FormattedMessage
              id="country.stake.overview.upsell"
              values={{
                token: "MVPC"
              }}
            />
          </div>
        </Col>
      </Row>
    </Col>
  );
}