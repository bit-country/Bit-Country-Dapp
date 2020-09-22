import React from "react";
import SignupForm from "../../components/Signup";
import { Typography, Col, Row, Divider } from "antd";

const { Title } = Typography;

export default function Register(props) {
  const { 
    location: {
      state
    }
  } = props;

  let referrerId, referredCountryId;

  if (state) {
    referrerId = state.referrerId;
    referredCountryId = state.referredCountryId;
  }

  return (
    <>
      <Row gutter={16} style={{ margin: "4em 0", textAlign: "center" }}>
        <Col span={5} />
        <Col span={14}>
          <div>
            <Title level={2}>Your Bit.Country Account</Title>
            {/*this.state.address*/}
            <p>Edit your account details here.</p>
            <Divider />
            <SignupForm referrerId={referrerId} referredCountryId={referredCountryId} />
          </div>
        </Col>
        <Col span={5} />
      </Row>
    </>
  );
}
