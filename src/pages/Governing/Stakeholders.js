import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Col, Divider, Table, Avatar, Row } from "antd";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import OptionalLink from "../../components/OptionalLink";
import { CountryConnect } from "../../components/HOC/Country/CountryWrapper";
import { Link } from "@reach/router";

function Stakeholders(props) {
  const [stakeholders, setStakeholders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { country } = props;

  useEffect(() => {
    if (!country) {
      return;
    }

    (async function () {
      const response = await fetchAPI(`${ENDPOINTS.GET_COUNTRY_STAKEHOLDERS}?countryId=${country.id}`);

      if (response?.isSuccess) {
        setIsLoading(false);
        setStakeholders(response.countryStakeShare);
      }
    })();
  }, [country]);

  const columns = [{
    title: "Name",
    dataIndex: "user",
    key: "name",
    // eslint-disable-next-line react/display-name
    render: user => (
      <div className="stakeholder">
        <OptionalLink
          to={`/m/${user?.mind}`}
          enabled={user?.mind}
        >
          <Avatar
            shape="circle"
            src={user.profileImageUrl}
            alt={user.nickName}
          />
          <span className="name">{user.nickName}</span>
        </OptionalLink>
      </div>
    )
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount"
  },
  {
    title: "Percent",
    dataIndex: "percent",
    key: "percent",
    render: text => text + "%"
  }];

  return (
    <Col
      id="stakeholders"
      push={4}
      span={16}
    >
      <Row>
        <Col span={18}>
          <h2>
            <FormattedMessage
              id="country.stake.overview.title"
            />
          </h2>
        </Col>
        <Col span={6} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to="./mystake" className="ant-btn ant-btn-primary">
            <span>
              <FormattedMessage
                id="country.stake.stakeholders.takeMeToMyStake"
              />
            </span>
          </Link>
        </Col>
      </Row>
      <Divider />
      <Table
        loading={isLoading}
        dataSource={stakeholders}
        columns={columns}
        pagination={{ pageSize: 25 }}
        rowClassName={(record, index) => `index-${index}`}
      />
    </Col>
  );
}

export default CountryConnect(Stakeholders);