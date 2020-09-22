import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Col, Divider, Table } from "antd";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";

export default function Stakeholders(props) {
  const [ stakeholders, setStakeholders ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const { id } = props;

  useEffect(() => {
    (async function() {
      const response = await fetchAPI(`${ENDPOINTS.GET_COUNTRY_STAKEHOLDERS}?countryUid=${id}`);
  
      if (response?.isSuccess) {
        setIsLoading(false);
        setStakeholders(response.stakeholders);
      }
    })();
  }, []);

  // const insightsData = [
  //   { title: "Residents", new: insights.newResidents, total: insights.population },
  //   { title: "Blocks", new: insights.newBlocks, total: insights.totalBlocks },
  //   { title: "Posts", new: insights.newPosts, total: insights.totalPosts },
  //   { title: "Comments", new: insights.newComments, total: insights.totalComments },
  //   { title: "Available Tokens",  total: `${insights.availableTokens} ${insights.tokenSymbol}` },
  //   { title: "Total Token Supply",  total: `${insights.tokenTotalSupply} ${insights.tokenSymbol}` },
  // ];

  const columns = [ {
    title: "Name",
    dataIndex: "user",
    key: "name",
    render: user => user.nickName
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity"
  },
  {
    title: "Percent",
    dataIndex: "percent",
    key: "percent",
    render: text => text + "%"
  } ];

  return (
    <Col
      id="stakeholders"
      push={4}
      span={16}
    >
      <h2>
        <FormattedMessage
          id="country.stake.overview.title"
        />
      </h2>
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
