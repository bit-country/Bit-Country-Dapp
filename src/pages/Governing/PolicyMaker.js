import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Col, Divider } from "antd";
import "./PolicyMaker.styles.css";

const dummyData = [
  {
    id: 1,
    title: "title",
    description: "description",
    table: [
      { id: 1, area: "Referral Incentive", previous: "1 TKN", new: "10 TKN" },
      { id: 2, area: "Residency ", previous: "Open to public", new: "Invitation only" }
    ],
    numberOfVotesFor: 100,
    numberOfVotesAgainst: 3,
    remainingVotes: 5
  },
  {
    id: 1,
    title: "title",
    description: "description",
    table: [
      { id: 1, area: "Referral Incentive", previous: "1 TKN", new: "10 TKN" },
      { id: 2, area: "Residency ", previous: "Open to public", new: "Invitation only" }
    ],
    numberOfVotesFor: 100,
    numberOfVotesAgainst: 3,
    remainingVotes: 5
  }
];

export default class PolicyMaker extends Component {
  state = {
    bills: []
  };

  componentDidMount() {
    this.loadBills();
  }

  loadBills = async () => {
    this.setState({
      bills: dummyData
    });
  }

  render() {
    return (
      <Col
        push={4}
        span={16}
      >
        <h2>
          <FormattedMessage
            id="country.stake.bills.title"
          />
        </h2>
        <Divider />
        <h4 style={{ whiteSpace: "pre-line" }}>
          <FormattedMessage
            id="country.stake.bills.noOwnership"
          />
        </h4>
        <p style={{ whiteSpace: "pre-line", margin: "1em 0" }}>
          <FormattedMessage
            id="country.stake.bills.future"
          />
        </p>
        {/* <div className="row-container">
          {bills.map(bill =>
            <Col key={bill.id} className="column-container" span={12}>
              <VoteCard bill={bill} key={bill.id} />
            </Col>
          )}
        </div> */}

      </Col>
    );
  }
}