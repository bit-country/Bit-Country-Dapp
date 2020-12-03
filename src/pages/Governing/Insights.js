import React, { useState, useEffect } from "react";
import { fetchAPI } from "../../utils/FetchUtil";
import { FormattedMessage } from "react-intl";
import { Col, Divider, Table, } from "antd";
import ENDPOINTS from "../../config/endpoints";

export default function Insights(props) {
  const [ insights, setInsights ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const { id } = props;

  useEffect(() => {
    (async function() {
      const response = await fetchAPI(`${ENDPOINTS.GET_COUNTRY_INSIGHTS}?countryUid=${id}`);
  
      if (response?.isSuccess) {
        setIsLoading(false);
        setInsights(response.countryInsights);
      }
    })();
  }, []);

  const insightsData = [
    { title: "Residents", new: insights.newResidents, total: insights.population },
    { title: "Blocks", new: insights.newBlocks, total: insights.totalBlocks },
    { title: "Posts", new: insights.newPosts, total: insights.totalPosts },
    { title: "Comments", new: insights.newComments, total: insights.totalComments },
    { title: "Available Tokens",  total: `${insights.availableTokens} ${insights.tokenSymbol}` },
    { title: "Total Token Supply",  total: `${insights.tokenTotalSupply} ${insights.tokenSymbol}` },
  ];

  const columns = [
    {
      title: "Insights",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "New",
      dataIndex: "new",
      key: "new",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ];

  return (
    <Col
      push={4}
      span={16}
      className="insightsContainer"
    >
      <h2>
        <FormattedMessage
          id="country.stake.insights.title"
        />
      </h2>
      <Divider />
      <Table columns={columns} dataSource={insightsData} loading={isLoading} pagination={{ position: "none" }}/>
    </Col>
  );
}