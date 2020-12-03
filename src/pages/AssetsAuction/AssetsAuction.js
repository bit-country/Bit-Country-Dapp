import React, { useState, useCallback } from "react";
import { FormattedMessage } from "react-intl";
import {
  Col,
  Divider,
  Input,
  InputNumber,
  Row,
  Button,
  Icon,
  Popconfirm,
} from "antd";
import Notification from "../../utils/Notification";
import ENDPOINTS from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import { Link } from "@reach/router";
import AssetDetail from "../../components/AssetDetail";
import Logging from "../../utils/Logging";

export default function AssetsAuction(props) {
  const [ showCancel, setShowCancel ] = useState(false);
  const [ auctionInfo, setAuctionInfo ] = useState({
    Quantity: 1,
    Reserve: 0,
    StartBid: 0,
    BitIncrements: 0,
    BuyOut: 0,
    StartDate: "",
    EndDate: "",
  });

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

  const onChange = useCallback(
    value => {
      setAuctionInfo({ ...auctionInfo, [value.name]: value.value });
    },
    [ auctionInfo ]
  );
  const handleSubmit = useCallback(async () => {
    try {
      for (let item in auctionInfo) {
        if (!auctionInfo[item]) {
          Notification.displayErrorMessage(
            `Please provide ${item} information`
          );
          return;
        }
      }

      if (auctionInfo.StartDate >= auctionInfo.EndDate) {
        Notification.displayErrorMessage(
          "EndDate must be later than StartDate"
        );
        return;
      }

      const response = await fetchAPI(
        `${ENDPOINTS.CREATE_ASSET_AUCTION}`,
        "POST",
        auctionInfo
      );

      if (!response.isSuccess) {
        Notification.displayErrorMessage(
          "Error creating a new auction of the asset"
        );
        return;
      }
      Notification.displaySuccessMessage(
        "New auction for the asset has been created successfully..."
      );
      props.navigate("../");
    } catch (error) {
      Logging.error(error);
    }
  }, [ auctionInfo ]);

  const { asset, balance, owner, sales } = props.location.state.item;

  if (!asset || !balance) {
    return <div>Error</div>;
  }

  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  let todayString = yyyy + "-" + mm + "-" + dd;

  return (
    <Row id="auction">
      <Row className="go-back">
        <Link to="../">
          <Icon type="arrow-left" />
          &nbsp;
          <FormattedMessage id="wallet.assets.auction.returnToWallet" />
        </Link>
      </Row>
      <Row gutter={[ 24, 24 ]} className="content">
        <Col xs={24} md={8} lg={6}>
          <AssetDetail
            asset={asset}
            balance={balance}
            owner={owner}
            sales={sales}
          />
        </Col>
        <Col xs={24} md={16} lg={18}>
          <Col push={2} span={18}>
            <h2>
              <FormattedMessage id="wallet.assets.auction.title" />
            </h2>
            <Divider />
            <div>
              <p>
                <FormattedMessage id="wallet.assets.auction.description" />
              </p>
              <Divider orientation="left">
                <FormattedMessage id="wallet.assets.auction.section.details" />
              </Divider>
              <Row>
                <Col xs={24} md={6}>
                  <label>
                    <FormattedMessage id="wallet.assets.auction.field.quantity" />
                  </label>
                </Col>
                <Col xs={24} md={18}>
                  <InputNumber
                    min={1}
                    max={balance}
                    defaultValue={1}
                    onChange={value =>
                      onChange({ name: "Quantity", value: value })
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={6}>
                  <label>
                    <FormattedMessage id="wallet.assets.auction.field.reserve" />
                  </label>
                </Col>
                <Col xs={24} md={18}>
                  <InputNumber
                    min={0}
                    onChange={value =>
                      onChange({ name: "Reserve", value: value })
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={6}>
                  <label>
                    <FormattedMessage id="wallet.assets.auction.field.startingBid" />
                  </label>
                </Col>
                <Col xs={24} md={18}>
                  <InputNumber
                    min={0}
                    onChange={value =>
                      onChange({ name: "StartBid", value: value })
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={6}>
                  <label>
                    <FormattedMessage id="wallet.assets.auction.field.bidIncrements" />
                  </label>
                </Col>
                <Col xs={24} md={18}>
                  <InputNumber
                    min={1}
                    onChange={value =>
                      onChange({ name: "BitIncrements", value })
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={6}>
                  <label>
                    <FormattedMessage id="wallet.assets.auction.field.buyOut" />
                  </label>
                </Col>
                <Col xs={24} md={18}>
                  <InputNumber
                    min={1}
                    onChange={value => onChange({ name: "BuyOut", value })}
                  />
                </Col>
              </Row>
              <Divider orientation="left">
                <FormattedMessage id="wallet.assets.auction.section.duration" />
              </Divider>
              <Row>
                <Col xs={24} md={6}>
                  <label>
                    <FormattedMessage id="wallet.assets.auction.field.startingDate" />
                  </label>
                </Col>
                <Col xs={24} md={18}>
                  <Input
                    type="date"
                    min={todayString}
                    onChange={value =>
                      onChange({ name: "StartDate", value: value.target.value })
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={6}>
                  <label>
                    <FormattedMessage id="wallet.assets.auction.field.endDate" />
                  </label>
                </Col>
                <Col xs={24} md={18}>
                  <Input
                    type="date"
                    min={todayString}
                    onChange={value =>
                      onChange({ name: "EndDate", value: value.target.value })
                    }
                  />
                </Col>
              </Row>
              <Divider />
              <Row gutter={12} className="actions">
                <Popconfirm
                  title={
                    <FormattedMessage id="wallet.assets.auction.cancel.title" />
                  }
                  visible={showCancel}
                  onConfirm={handleCancelComplete}
                  onCancel={handleCancelClose}
                  okText={
                    <FormattedMessage id="wallet.assets.auction.cancel.confirm" />
                  }
                  cancelText={
                    <FormattedMessage id="wallet.assets.auction.cancel.close" />
                  }
                >
                  <Button onClick={handleCancel}>
                    <FormattedMessage id="wallet.assets.auction.cancel" />
                  </Button>
                </Popconfirm>
                <Button type="primary" onClick={handleSubmit}>
                  <FormattedMessage id="wallet.assets.auction.place" />
                </Button>
              </Row>
            </div>
          </Col>
        </Col>
      </Row>
    </Row>
  );
}
