import React from "react";
import {
  Row,
  Col,
  Button
} from "antd";
import "./../../css/NewsFeed.css";
import { CountryConnect } from "../../components/HOC/Country/CountryWrapper";
import CountryCol from "../../components/CountryCol";
import BlockNavigation from "../../components/BlockNavigation/BlockNavigation";
import { BlockConnect } from "../../components/HOC/Block/BlockWrapper";
import CountryBreadcrumb from "../../components/CountryBreadcrumb";
import BlockSubscriber from "../../components/BlockSubscriber";
import Spinner from "../../components/Spinner";
import { FormattedMessage } from "react-intl";
import Forbidden from "../../pages/Errors/Forbidden";
import QuickSharer from "../../components/QuickSharer";

function BlockContainer({ loadingCountry, loadingBlock, country, children, countryId, blockDetail, blockId, isResident, loggedIn, joinCountry, isPublic }) {
  if (!isResident) {
    return (
      <Forbidden
        errorMessageId="errors.pages.403.message.residentOnly"
        country={country}
        loggedIn={loggedIn}
        joinCountry={joinCountry}
        isPublic={isPublic}
      />
    );
  }

  return (
    <>
      {loadingCountry || loadingBlock ? (
        <Spinner />
      ) : (
          <div className="block-interior">
            <CountryBreadcrumb country={country} blockDetail={blockDetail} />
            <QuickSharer />
            <Row style={{ marginLeft: 0, marginRight: 0 }} gutter={10}>
              <Col
                className="col-push"
                xs={1}
                sm={2}
                md={3}
                lg={1}
                xl={3}
                xxl={4}
              />
              <Col
                className="col-left"
                xs={22}
                sm={20}
                md={18}
                lg={8}
                xl={6}
                xxl={5}
              >
                <CountryCol>
                  <BlockNavigation countryId={countryId} blockId={blockId} blockDetail={blockDetail} />
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: "1em" }}>
                      <Button
                        type="primary"
                        href={`${window.location.origin}/c/${countryId}/b/${blockId}/viewer`}
                      >
                        <span>
                          <FormattedMessage
                            id="country.block.enterDimension"
                            defaultMessage="Enter Dimension"
                          />
                        </span>
                      </Button>
                    </div>
                    <BlockSubscriber countryId={countryId} blockId={blockId} />
                  </div>
                </CountryCol>
              </Col>
              <Col
                className="col-main"
                xs={22}
                sm={20}
                md={18}
                lg={14}
                xl={12}
                xxl={11}
              >
                {children}
              </Col>
            </Row>
          </div >
        )
      }
    </>
  );
}

export default
  CountryConnect(
    BlockConnect(
      BlockContainer
    )
  );
