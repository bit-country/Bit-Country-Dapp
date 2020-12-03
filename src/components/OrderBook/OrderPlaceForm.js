import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Notification from "../../utils/Notification";
import { Form, Radio, InputNumber, Modal, Select } from "antd";
import React from "react";
import "antd/dist/antd.css";
import { FormattedMessage } from "react-intl";
import Logging from "../../utils/Logging";
import { CountryConnect } from "./../../pages/CountryWrapper.js";
import { useCountryToken, useTokens } from "../../hooks/useOrders";

const { Option } = Select;

function  OrderPlaceForm (props) {
  const { form, country,visible, standardCurrency,onCancel, submitted, globalFlag } = props;
  const { getFieldDecorator } = form;

  const formItemLayout = {
    labelCol: {
      sm: { span: 8 },
    },
    wrapperCol: {
      sm: { span: 16 },
    },
  };
  var token = useCountryToken(country? country.id: "");
  const handleSubmit = async e => {
    e.preventDefault();
    form.validateFieldsAndScroll(async (error, values) => {
      if (!error) {
        try {
          if(globalFlag){
            const order = {
              ...values,
              countryId: "global"
            };

            const res = await fetchAPI(endpoints.PLACE_GLOBAL_ORDER, "post", order);

            if (!res?.isSuccess) {
              throw Error("Error while placing market order");
            }
            
            Notification.displaySuccessMessage("Placed new market order");
            submitted(res.isSuccess);
          } else {
            const order = {
              ...values,
              countryId: country.id,
              tokenId: token.id,
            };

            const res = await fetchAPI(endpoints.PLACE_ORDER, "post", order);

            if (!res?.isSuccess) {
              throw Error("Error while placing market order");
            }
  
            Notification.displaySuccessMessage("Placed new market order");
  
            submitted(res?.isSuccess ?? false);
          } 
        } catch (error) {
          Logging.Error(error);

          Notification.displayErrorMessage("Error while placing market order");

          submitted(false);
        }
      }
    });
  };

  const tokens = useTokens();
  const nTokens = [ { id:"", symbol:"All Token" } ].concat(tokens);
  const content = nTokens.map(t=>(<Option value={t.id} key={t.id+"1"} >{t.symbol}</Option>));
  
  return (
    <Modal
      visible={visible}
      okText={<FormattedMessage id="market.order.form.place" />}
      onOk={handleSubmit}
      cancelText={<FormattedMessage id="market.order.form.cancel" />}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form {...formItemLayout}>
        <div className="subTitle">
          <FormattedMessage id="market.order.form.title" />
        </div>
        <Form.Item
          label={<FormattedMessage id="market.order.form.label.token" />}
        >
          <span className="ant-form-text">
            {globalFlag == true? (
              getFieldDecorator("tokenId", {
                rules: [ { required: true, message: "Please choose a token" } ]
              })(
                <Select
                  showSearch
                  style={{ width: 200, marginRight: "2%" }}
                  
                  optionFilterProp="children"
                  filterOption={(input, option) =>{
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ; }
                  }
                >
                  {content }
                </Select>
              )
            ) :( token ? token.symbol : "")}
          </span>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="market.order.form.label.type" />}
        >
          {getFieldDecorator("type", {
            rules: [ { required: true, message: "Please choose order type" } ]
          })(
            <Radio.Group>
              <Radio value="Buy">
                <FormattedMessage id="market.order.place.type.buy" />
              </Radio>
              <Radio value="Sell">
                <FormattedMessage id="market.order.place.type.sell" />
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item
          label={
            <FormattedMessage
              id="market.order.form.label.quantity"
              values={{ symbol: token ? token.symbol : "TKN" }}
            />
          }
        >
          {getFieldDecorator("quantity", {
            rules: [
              {
                type: "integer",
                required: true,
                message: "Please integer quantity of token",
              },
            ],
          })(<InputNumber min={1} style={{ width: "170px" }} />)}
        </Form.Item>
        <Form.Item
          label={
            <FormattedMessage
              id="market.order.form.label.quantity"
              values={{ symbol: standardCurrency }}
            />
          }
        >
          {getFieldDecorator("bcgPrice", {
            rules: [ { required: true, message: "Please input BCGPrice" } ]
          })(<InputNumber style={{ width: "170px" }} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
  
}

const WrappedRegistrationForm = Form.create({ name: "register" })(
  OrderPlaceForm
);

export default CountryConnect(WrappedRegistrationForm);
