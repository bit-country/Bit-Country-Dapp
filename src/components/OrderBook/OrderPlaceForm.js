import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Notification from "../../utils/Notification";
import { Form, Radio, InputNumber, Modal } from "antd";
import React from "react";
import "antd/dist/antd.css";
import { FormattedMessage } from "react-intl";
import Logging from "../../utils/Logging";

class OrderPlaceForm extends React.Component {
  handleSubmit = async e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll(async (error, values) => {
      if (!error) {
        const order = {
          ...values,
          countryId: this.props.country.id,
          tokenId: this.props.token.id,
        };

        try {
          const res = await fetchAPI(endpoints.PLACE_ORDER, "post", order);

          if (!res?.isSuccess) {
            throw Error("Error while placing market order");
          }

          Notification.displaySuccessMessage("Placed new market order");

          this.props.submitted(res?.isSuccess ?? false);
        } catch (error) {
          Logging.Error(error);

          Notification.displayErrorMessage("Error while placing market order");

          this.props.submitted(false);
        }
      }
    });
  };

  render() {
    const { visible, token, standardCurrency, onCancel, form } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        visible={visible}
        okText={<FormattedMessage id="market.order.form.place" />}
        onOk={this.handleSubmit}
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
              {token ? token.symbol : "TKN"}
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
}

const WrappedRegistrationForm = Form.create({ name: "register" })(
  OrderPlaceForm
);

export default WrappedRegistrationForm;
