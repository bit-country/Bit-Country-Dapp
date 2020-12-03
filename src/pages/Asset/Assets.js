/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import { Col, Row, Empty, Spin, Modal, InputNumber, Form, Button, Icon } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import { fetchAPI } from "../../utils/FetchUtil";
import Notification from "../../utils/Notification";
import ENDPOINTS from "../../config/endpoints";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import "./Assets.styles.css";
import AssetItemCard from "./AssetItemCard";
import { useSubstrate } from "../../components/HOC/DApp/useSubstrate";
import TransactionUtil from "../../components/HOC/DApp/Transaction";
import { useMyAccount, useMyAddress, readMyAddress } from "../../components/HOC/DApp/SubstrateAccountProvider";

const { Item } = Form;

function Assets({ user, intl, form }) {

  const { getFieldDecorator, setFieldsValue } = form;
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItem] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAskingPrice, setIsAskingPrice] = useState(false);
  const [selectable, setSelectable] = useState(false);
  const { api, keyring, account, apiState } = useSubstrate();
  const { setAddress, state: { address } } = useMyAccount();
  const [status, setStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const savedAddress = readMyAddress();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("select") == 1) {
      setSelectable(true);
    }
  }, []);

  useEffect(() => {
    fetchUserItems();
  }, []);

  const fetchUserItems = () => {
    setIsLoading(true);
    fetchAPI(`${ENDPOINTS.MARKETPLACE_GETSELLABLEITEM}?module=country`).then(res => {
      if (res?.isSuccess) {

        let userItems = [];

        userItems.push({
          category: "country",
          items: res.data.countryItems
        });
        userItems.push({
          category: "block",
          items: res.data.blockItems
        });
        userItems.push({
          category: "section",
          items: res.data.sectionItems
        });
        userItems.push({
          category: "asset",
          items: res.data.assetItems
        });

        setItem(userItems);
        setIsLoading(false);
      }
    });
  };

  const onSelectSellItem = (item, category) => {
    setSelectedItem(item);
    setIsAskingPrice(true);
  };

  const setCountryId = () => {

  };

  const setVisible = () => {

  };

  const onFinish = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  const submitAuction = async e => {
    e.preventDefault();
    form.validateFields(async (err, values) => {
      const submitBody = {
        ...values,
        price: values.reservedPrice,
        itemId: selectedItem.id,
        category: "asset",
        title: selectedItem.name,
        itemImage: selectedItem.url,
        description: selectedItem.description
      };

      if (!err) {
        setStatus("Sending transaction...");
        setIsProcessing(true);

        if (apiState == "READY" && api) {
          let assetId = null;

          TransactionUtil.GetEventDetail(api, selectedItem.blockHash, "NewNftCreated", "AssetId").then(events => {
            let blockHashEvent = events.find(event => event.type == "AssetId");

            if (blockHashEvent) {
              console.log(blockHashEvent);

              assetId = parseInt(blockHashEvent.value);

              const accountPair = keyring.getPair(savedAddress);

              console.log("accountPair", accountPair);

              TransactionUtil.Transaction({
                accountPair: accountPair,
                type: "SIGNED-TX",
                setStatus: setStatus,
                attrs: {
                  palletRpc: "auction",
                  callable: "createAuction",
                  inputParams: [assetId, values.reservedPrice],
                  paramFields: [true, true]
                },
                api: api,
                setLoading: setIsProcessing
              }).then(async hash => {

                submitBody.blockHash = hash;
                await fetchAPI(`${ENDPOINTS.MARKETPLACE_CREATESELL}`, "post", submitBody)
                  .then(res => {
                    if (res?.isSuccess) {
                      // location.assign("/marketplace/browse");
                      Notification.displaySuccessMessage("Your asset has been placed to the marketplace.");
                      setIsAskingPrice(false);
                      setIsProcessing(false);
                      fetchUserItems();
                    }
                    else
                      Notification.displayErrorMessage("Something went wrong, please try again later.");
                    setIsProcessing(false);
                  });
              });

            }

          }).error(err => { });
        }
      }
      console.log("values", values);
    });
  };

  const renderItemCards = () => {
    return items?.length === 0 || items === null ? (
      <Empty style={{ paddingTop: "10%" }} />
    ) : (
      items?.map(category =>
        category.items?.map((item, index) => {
          if (!item.assetId && item.blockHash) {
            console.log("renderItemCards", apiState, api);

            if (apiState == "READY" && api) {
              TransactionUtil.GetEventDetail(api, item.blockHash, "NewNftCreated", "AssetId").then(async events => {
                let blockHashEvent = events.find(event => event.type == "AssetId");

                console.log("blockHashEvent", blockHashEvent);

                // if (blockHashEvent && blockHashEvent.type == "AssetId") {
                //   fetchAPI(`${ENDPOINTS.UPDATE_ASSET_ID_FROM_HASH}?id=${item.id}&assetId=${blockHashEvent.value}`, "post")
                //     .then((res) => {
                //       if (res?.isSuccess) {
                //         // location.assign("/marketplace/browse");
                //       }
                //     });
                // }
              });
            }
          }

          return (
            <Col key={index} xs={24} sm={12} md={12} lg={8} xl={8}>
              <AssetItemCard isViewable={true} key={index} category={category.category} setSelectedItem={onSelectSellItem} setCountryId={setCountryId} setVisible={setVisible} item={item} selectable={selectable} />
            </Col>
          );
        })
      )
    );
  };

  const onCancel = () => {
    setIsAskingPrice(false);
  };

  return (
    <Col
      push={4}
      span={16}
      className="assets"
    >
      <h1>
        My NFT <FormattedMessage id="wallet.assets.header" />
      </h1>
      <Row gutter={[24, 24]} style={{ paddingTop: "40px" }}>
        {isLoading ? <Spin spinning={isLoading} style={{ width: "100%", textAlign: "center", padding: "10%" }} /> : renderItemCards()}
      </Row>
      <Modal
        visible={isAskingPrice}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
        </Button>,
          <Button key="submit" type="primary" onClick={submitAuction}>
            Confirm
        </Button>
        ]}>
        <Row gutter={24} justify='center'>
          <Col span={14}>
            <AssetItemCard
              category={"asset"}
              setCountryId={setCountryId}
              setVisible={setVisible}
              item={selectedItem}
              isSelected={true}
              isViewable={false}
              setSelectedItem={onSelectSellItem} />
          </Col>

          <Col span={10}>
            <Form onSubmit={onFinish}>
              <Item label="Reserved Price">
                {getFieldDecorator("reservedPrice", {
                  rules: [{ required: true, message: "Please enter the price" }],
                })(
                  <InputNumber />
                )}
              </Item>
              <i>Once you confirm the item on sell, your item will be on auction for 7 days on marketplace</i>
              <Item>
                <br />
              </Item>
            </Form>
          </Col>
        </Row>
      </Modal>
      <Modal
        visible={isProcessing}
        title={"Creating auction"}
        footer={null}>
        <Spin indicator={<Icon type="loading" style={{ fontSize: 24, textAlign: "center" }} spin />} tip={status} />
      </Modal>
    </Col>
  );
}

export default AuthConnect(injectIntl(Form.create()(Assets)));
