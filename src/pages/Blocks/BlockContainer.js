import React from "react";
import {
  Row,
  Col,
} from "antd";
import "./../../css/NewsFeed.css";
import { CountryConnect } from "../../components/HOC/Country/CountryWrapper";
import CountryCol from "../../components/CountryCol";
import BlockNavigation from "../../components/BlockNavigation/BlockNavigation";
import { BlockConnect } from "../../components/HOC/Block/BlockWrapper";
import CountryBreadcrumb from "../../components/CountryBreadcrumb";
import BlockSubscriber from "../../components/BlockSubscriber";
import Scroller from "../../components/Scroller";
import Spinner from "../../components/Spinner";
import { navigate } from "@reach/router";

function BlockContainer({ loadingCountry, loadingBlock, country, children, countryId, blockDetail, blockId, isResident }) {
  if (!isResident) {
    navigate("/403");
  }

  return (
    <>
      {loadingCountry || loadingBlock ? (
        <Spinner />
      ) : (
        <Scroller>
          <div>
            <div className="block-interior">
              <CountryBreadcrumb country={country} blockDetail={blockDetail} />
              {/* <Row>
                <Col span={24}>
                  <div id="block-banner" />
                </Col>
              </Row> */}
              <Row gutter={10}>
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
                    <br/>
                    <h3>Block Details</h3>
                    <br/>
                  </CountryCol>
                  <CountryCol>
                    <br/>
                    <h3>Activities</h3>
                    <br/>
                    <br/>
                  </CountryCol>
                  <CountryCol>
                    <BlockNavigation countryId={countryId} blockId={blockId} blockDetail={blockDetail} />
                    <BlockSubscriber countryId={countryId} blockId={blockId} />
                  </CountryCol>
                  <CountryCol>
                    <br/>
                    <h3>Promoted Contents</h3>
                    <br/>
                    <br/>
                  </CountryCol>
                  <CountryCol>
                    <br/>
                    <h3>Promoted Contents</h3>
                    <br/>
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
            </div>
          </div>
        </Scroller>
      )}
    </>
  );
}

export default
  CountryConnect(
    BlockConnect(
      BlockContainer
    )
  );
