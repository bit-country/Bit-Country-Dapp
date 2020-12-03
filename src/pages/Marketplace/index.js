import React, { useEffect, useState } from "react";
import { Layout, Button, Row } from "antd";
import { Link } from "@reach/router";
import "./Marketplace.styles.css";
import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Notification from "../../utils/Notification";
import CategoryRow from "./CategoryRow";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { FormattedMessage } from "react-intl";
import PageBanner from "../../components/PageBanner";
import Banner from "../../assets/images/explore.jpg";

const Marketplace = () => {
  const [ data, setData ] = useState([ ]);

  useEffect(() => {
    fetchAPI(`${endpoints.MARKETPLACE_GETFEATUREITEMS}`).then(res => {
      if (res?.isSuccess) {
        setData(res.data);
      } else
        Notification.displayErrorMessage(
          <FormattedMessage id="errors.pages.500.message" />
        );
    });
  }, []);

  return (
    <>
      <PageBanner
        background={Banner}
        title={<FormattedMessage id="marketplace.title" />}
        subTitle={<FormattedMessage id="marketplace.description" />}
        pageTitle={<Row>
            <Button type="primary" style={{ width: "200px", height: "38px" }}>
              <Link
                style={{ textTransform: "uppercase", fontWeight: "600" }}
                to={"/marketplace/browse"}
              >
                <FormattedMessage id="marketplace.startExplore" />
              </Link>
            </Button>
            &nbsp;
            <Button style={{ width: "200px", height: "38px" }}>
              <Link
                style={{ textTransform: "uppercase", fontWeight: "600" }}
                to={"/marketplace/sell"}
              >
                <FormattedMessage id="marketplace.startSelling" />
              </Link>
            </Button>
          </Row>}
      />
      <Layout.Content>
        <div>
          <h1 style={{ fontSize: "3em", margin: "0" }}> </h1>
          <h3
            style={{ color: "grey", fontWeight: "400", fontSize: "1.3em" }}
          ></h3>
          
        </div>
        <br />
        <br />
        {data.map(value => (
          <CategoryRow
            key={value.id}
            items={value.items}
            category={value.category}
          />
        ))}
      </Layout.Content>
    </>
  );
};

export default AuthConnect(Marketplace, true);
