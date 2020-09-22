import React, { useState, useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { Col, Divider, Input, InputNumber, Row, Button, Icon, Popconfirm } from "antd";
import "./Auction.styles.css";
import { Link } from "@reach/router";
import CountryDetail from "../../components/CountryDetail";

export default function Auction(props) {
  const [ showCancel, setShowCancel ] = useState(false);

  const handleCancel = useCallback(() => {
    setShowCancel(true);
  }, [ setShowCancel ]);

  const handleCancelComplete = useCallback(() => {
    setShowCancel(false);

    props.navigate("../");
  }, [ setShowCancel ]);

  const handleCancelClose = useCallback(() => {
    setShowCancel(false);
  }, [ setShowCancel ]);
  
  let country = null;

  if (props.location 
    && props.location.state 
    && props.location.state.country) {
    country = props.location.state.country;
  }

  if (!country) {
    return <div>Error</div>;
  }

  return (
    <Row
      id="auction"
    >
      <Row className="go-back">
        <Link to="../">
          <Icon type="arrow-left" />
          &nbsp;
          <FormattedMessage
            id="country.returnToCountry"
          />
        </Link>
      </Row>
      <Row
        gutter={[ 24, 24 ]}
        className="content"
      >
        <Col 
          xs={24} 
          md={8} 
          lg={6} 
        >
          <CountryDetail
            country={country}
          />
        </Col>
        <Col
          xs={24} 
          md={16} 
          lg={18} 
        >
          <Col
            push={2}
            span={18}
          >
            <h2>
              <FormattedMessage
                id="country.auction.title"
              />
            </h2>
            <Divider />
            <div>
              <h1 className="coming-soon">
                <FormattedMessage
                  id="app.comingSoon"
                />
              </h1>
              <p>
                <FormattedMessage
                  id="country.auction.description"
                />
              </p>
              <Divider orientation="left">
                <FormattedMessage
                  id="country.auction.section.details"
                />
              </Divider>
              <Row>
                <Col
                  xs={24}
                  md={6}
                >
                  <label>
                    <FormattedMessage
                      id="country.auction.field.reserve"
                    />
                  </label>
                </Col>
                <Col
                  xs={24}
                  md={18}
                >
                  <InputNumber />
                </Col>
              </Row>
              <Row>
                <Col
                  xs={24}
                  md={6}
                >
                  <label>
                    <FormattedMessage
                      id="country.auction.field.startingBid"
                    />
                  </label>
                </Col>
                <Col
                  xs={24}
                  md={18}
                >
                  <InputNumber />
                </Col>
              </Row>
              <Row>
                <Col
                  xs={24}
                  md={6}
                >
                  <label>
                    <FormattedMessage
                      id="country.auction.field.buyOut"
                    />
                  </label>
                </Col>
                <Col
                  xs={24}
                  md={18}
                >
                  <InputNumber />
                </Col>
              </Row>
              <Divider orientation="left">
                <FormattedMessage
                  id="country.auction.section.duration"
                />
              </Divider>
              <Row>
                <Col
                  xs={24}
                  md={6}
                >
                  <label>
                    <FormattedMessage
                      id="country.auction.field.dateStart"
                    />
                  </label>
                </Col>
                <Col
                  xs={24}
                  md={18}
                >
                  <Input type="date" />
                </Col>
              </Row>
              <Row>
                <Col
                  xs={24}
                  md={6}
                >
                  <label>
                    <FormattedMessage
                      id="country.auction.field.dateEnd"
                    />
                  </label>
                </Col>
                <Col
                  xs={24}
                  md={18}
                >
                  <Input type="date" />
                </Col>
              </Row>
              <Divider />
              <Row 
                gutter={12}
                className="actions"
              >
                <Popconfirm
                  title={
                    <FormattedMessage
                      id="country.auction.cancel.title"
                    />
                  }
                  visible={showCancel}
                  onConfirm={handleCancelComplete}
                  onCancel={handleCancelClose}
                  okText={
                    <FormattedMessage
                      id="country.auction.cancel.confirm"
                    />
                  }
                  cancelText={
                    <FormattedMessage
                      id="country.auction.cancel.close"
                    />
                  }
                >
                  <Button
                    onClick={handleCancel}
                  >
                    <FormattedMessage
                      id="country.auction.cancel"
                    />
                  </Button>
                </Popconfirm>
                <Button 
                  type="primary"
                >
                  <FormattedMessage
                    id="country.auction.place"
                  />
                </Button>
              </Row>
            </div>
          </Col>
        </Col>
      </Row>
    </Row>
  );
}
