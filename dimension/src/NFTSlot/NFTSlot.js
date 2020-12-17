import React, { useCallback, useState } from "react";
import { Button, DatePicker, Form, Input, InputNumber } from "antd";
import moment from "moment";

const appId = document.getElementById("smartasset-app").getAttribute("app-id");
const slotId = document.getElementById("smartasset-app").getAttribute("slot-id");

function NFTSlot({ form }) {
  const [submitting, setSubmitting] = useState(false);

  if (submitting) {
    return (
      <div>
        <h1>Your request is processing. Please wait...</h1>
        <Button onClick={() => setSubmitting(false)}>Go back</Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Submit a rental request</h1>
      <p>Display your NFT on this frame! First you'll want to select a rental period then select your nft.</p>
      <Form onSubmit={e => { 
        e.preventDefault(); 

        form.validateFieldsAndScroll((errors, values) => {
          if (errors) {
            return;
          }

          setSubmitting(true);

          window.parent.dispatchEvent(new CustomEvent(appId, {detail: { appType: "selectNFTAndSign", appParams: { pallet: "rental", args: { slotId: values.slotId, blockNumber: values.blockNumber } }}}));
        })
      }}>
        <Form.Item label="Rental Period (In Blocks)">
          {form.getFieldDecorator("blockNumber", {
            rules: [{ required: true, message: "Please select how many blocks you want to rent for!" }],
            initialValue: 1000
          })(
            <InputNumber /> 
          )}
        </Form.Item>
        <Form.Item label="Frame To Rent (Populated automatically)">
          {form.getFieldDecorator("slotId", {
            rules: [{ required: true, message: "Please enter a slotId!" }],
            initialValue: slotId
          })(
            <InputNumber disabled />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Select NFT
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Form.create({})(NFTSlot);
