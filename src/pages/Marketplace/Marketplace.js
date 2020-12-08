/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Layout, Button, Divider, Row } from "antd";
import { Link } from "@reach/router";
import ItemCard from "./ItemCard";
import "./Marketplace.styles.css";
import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Notification from "../../utils/Notification";
import CategoryRow from "./CategoryRow";
import { FormattedMessage } from "react-intl";


const Marketplace = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAPI(`${endpoints.MARKETPLACE_GETFEATUREITEMS}`)
      .then(res => {
        if (res?.isSuccess) {
          setData(res.data)
        }
        else
          Notification.displayErrorMessage('Something went wrong, please try again later.')
      })
  }, [])

  return (
    <Layout.Content id="marketplace">
      <div >
        <h1 style={{ fontSize: '3em', margin: '0' }}>Marketplace </h1>
        <h3 style={{ color: 'grey', fontWeight: '400', fontSize: '1.3em' }}>Welcome to the marketplace and start browsing your next digital assets</h3>
        <Row style={{ paddingTop: '30px' }}>
          <Button type='primary' style={{ width: '200px', height: '38px' }} >
            <Link
              to={`/marketplace/browse`}
            >
              <FormattedMessage
                id="marketplace.startExplore"
              />
          </Link>
          </Button>
        &nbsp;
        <Button style={{ width: '200px', height: '38px' }}>
            <Link
              to={`/asset/list`}
            >
              <FormattedMessage
                id="marketplace.startSelling"
              />
          </Link>
          </Button>
        </Row>
      </div>
      <Divider />
      {data.map(value =>
        <CategoryRow items={value.items} category={value.category} />
      )}

    </Layout.Content >
  );
};

export default Marketplace;
