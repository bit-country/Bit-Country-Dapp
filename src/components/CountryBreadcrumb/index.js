import React from "react";
import { Row, Col, Breadcrumb } from "antd";
import { Link } from "@reach/router";
import { FormattedMessage } from "react-intl";

// Crumbs
// { 
//   url: "/moderation",  --> becomes /dapp/country/${country.id}/moderation
//   name: "moderation" --> Can able be a react node
// }
export default function CountryBreadcrumb({ country, blockDetail, crumbs }) {
  return (
    <Row id="block-banner">
      <Col                   
        xs={1}
        sm={2}
        md={3}
        lg={1}
        xl={3}
        xxl={4}
      />
      <Col 
        xs={22}
        sm={20}
        md={18}
        lg={22}
        xl={18}
        xxl={16}
      >
        <Breadcrumb>
          {country && (
            <Breadcrumb.Item>
              <Link to="/my-countries">
                <FormattedMessage
                  id="app.myCountries"
                />
              </Link>
            </Breadcrumb.Item>
          )}
          {country && (
            <Breadcrumb.Item>
              <Link 
                to={`/c/${country.uniqueId}/`}
              >
                {country.name}
              </Link>
            </Breadcrumb.Item> 
          )}
          {country && blockDetail && (
            <Breadcrumb.Item>
              {crumbs ? (
                <Link 
                  to={`/c/${country.uniqueId}/b/${blockDetail.uniqueId}`}
                >
                  {blockDetail.name}
                </Link>
              ) : (
                blockDetail.name
              )}
            </Breadcrumb.Item>
          )}
          {crumbs && crumbs.map((crumb, index, array) => (
            <Breadcrumb.Item
              key={crumb.name}
            >
              { !crumb.url || index == array.length - 1 ? (
                crumb.name
              ) : (
                <Link 
                  to={crumb.url}
                >
                  {crumb.name}
                </Link>
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </Col>
    </Row>
  );
}
