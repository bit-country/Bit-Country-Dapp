import React, { useState } from "react";
import {
  Button,
  Col,
  Empty,
  Form,
  InputNumber,
  Layout,
  Row,
  Steps,
  Spin,
  Icon,
} from "antd";
import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Notification from "../../utils/Notification";
import SellingItemCard from "./SellingItemCard";
import "./Marketplace.styles.css";
import { FormattedMessage } from "react-intl";
import { navigate } from "@reach/router";

const { Item } = Form;

const SellingForm = ({ form }) => {
  const { getFieldDecorator } = form;
  const [itemToSell, setItemToSell] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [current, setCurrentStep] = useState(0);
  const [category, setCategory] = useState(null);

  const onSubmit = e => {
    e.preventDefault();

    form.validateFields(async (err, values) => {
      const data = {
        ...values,
        itemId: selectedItem.id,
        category,
        title: selectedItem.name,
        description: selectedItem.description,
      };

      if (!err) {
        await fetchAPI(
          `${endpoints.MARKETPLACE_CREATESELL}`,
          "post",
          data
        ).then(res => {
          if (res?.isSuccess) {
            navigate("../browse");
          } else
            Notification.displayErrorMessage(
              "Something went wrong, please try again later."
            );
        });
      }
    });
  };
  const fetchSellableItems = item => {
    setLoading(true);
    fetchAPI(`${endpoints.MARKETPLACE_GETSELLABLEITEM}?module=${item}`).then(
      res => {
        if (res?.isSuccess) setItemToSell(res.data.items);
        setLoading(false);
      }
    );
  };

  const onSelectSellItem = item => {
    setSelectedItem(item);
    setCurrentStep(prev => (item ? ++prev : --prev));
  };

  const renderItemCards = () => {
    return itemToSell?.length === 0 || itemToSell === null ? (
      <Empty style={{ paddingTop: "10%" }} />
    ) : (
        itemToSell?.map(item => (
          <Col key={item.id} xs={24} sm={12} md={12} lg={8} xl={6}>
            <SellingItemCard
              category={category}
              setSelectedItem={onSelectSellItem}
              item={item}
            />
          </Col>
        ))
      );
  };
  const onItemSelected = value => {
    setCurrentStep(1);
    fetchSellableItems(value);
    setCategory(value);
  };
  const steps = [
    {
      title: <FormattedMessage id="marketplace.selling.selectCategory" />,
      content: (
        <Row style={{ margin: "auto", paddingTop: "5%" }}>
          <h1
            style={{ fontSize: "3em", fontWeight: "300", textAlign: "center" }}
          >
            <FormattedMessage id="marketplace.selling.whatToSell" />
          </h1>
          <div className="itemToSell">
            <div onClick={() => onItemSelected("country")}>
              <span><FormattedMessage id="marketplace.country.title" /></span>
            </div>
            <div onClick={() => onItemSelected("block")}>
              <span><FormattedMessage id="marketplace.block.title" /></span>
            </div>
            <div onClick={() => onItemSelected("section")}>
              <span><FormattedMessage id="marketplace.section.title" /></span>
            </div>
          </div>
        </Row>
      ),
    },
    {
      title: <FormattedMessage id="marketplace.selling.pickSell" />,
      content: (
        <>
          <Button
            onClick={() => {
              setCurrentStep(0);
              setCategory(null);
            }}
          >
            <Icon type="arrow-left" /> Back
          </Button>
          <Row gutter={[24, 24]} style={{ paddingTop: "40px" }}>
            {loading ? (
              <Spin
                spinning={loading}
                style={{ width: "100%", textAlign: "center", padding: "10%" }}
              />
            ) : (
                renderItemCards()
              )}
          </Row>
        </>
      ),
    },
    {
      title: <FormattedMessage id="marketplace.selling.modifyPrice" />,
      content: (
        <Row gutter={24} justify="center">
          <Col span={14}>
            <SellingItemCard
              category={category}
              item={selectedItem}
              isSelected={true}
              setSelectedItem={onSelectSellItem}
            />
          </Col>

          <Col span={10} style={{ paddingTop: "20%" }}>
            <div>
              <h1 style={{ fontSize: "2em", fontWeight: "300" }}>
                <FormattedMessage id="marketplace.selling.howMuch" />
              </h1>
            </div>
            <br />
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Item>
                  {getFieldDecorator("price", {
                    rules: [
                      { required: true, message: "Please enter the price" },
                    ],
                  })(<InputNumber style={{ width: "100%" }} autoFocus />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item>
                  <Button type="primary" htmlType="submit">
                    Confirm
                  </Button>
                </Item>
              </Col>
            </Row>
          </Col>
        </Row>
      ),
    },
    {
      title: <FormattedMessage id="marketplace.selling.done" />,
      content: (
        <Item>
          <Button type="primary" htmlType="submit">
            Confirm
          </Button>
        </Item>
      ),
    },
  ];

  return (
    <Layout.Content>
      <Steps size="small" current={current}>
        {steps.map(item => (
          <Steps.Step
            description={item.description}
            key={item.title}
            title={item.title}
          />
        ))}
      </Steps>

      <Form onSubmit={onSubmit}>
        <div className="steps-content" style={{ padding: "40px" }}>
          {steps[current].content}
        </div>
      </Form>
    </Layout.Content>
  );
};

export default Form.create({ name: "sellingForm" })(SellingForm);
