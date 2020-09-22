import React from "react";
import { CountryConnect } from "../../components/HOC/Country/CountryWrapper";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { Row, Col } from "antd";
import ModerationFeed from "./ModerationFeed";
import { FormattedMessage } from "react-intl";
import CountryBreadcrumb from "../../components/CountryBreadcrumb";

function ModerationContainer({ country, user }) {
  return (
    <div className="page-moderation">
      <div className="l-home">
        <CountryBreadcrumb 
          country={country}
          crumbs={[
            {
              name: (
                <FormattedMessage
                  id="country.moderation.title"
                />)
            }
          ]}
        />
        <Row gutter={10}>
          <Col 
            className="col-left" 
            xs={24}
            lg={6}
            xxl={4}
          >
          </Col>
          <Col 
            className="col-main"
            xs={24}
            lg={12}
            xxl={16}
          >
            <ModerationFeed 
              country={country}
              user={user}
            />
          </Col>
          <Col 
            className="col-right"
            xs={24}
            lg={6}
            xxl={4}
          >
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AuthConnect(CountryConnect(ModerationContainer));
