import React, { Component } from "react";
import { Col, Row, Card, Table, Button } from "antd";
import "./PolicyMaker.styles.css";

const columns = [
  {
    title: "Area",
    dataIndex: "area",
    key: "area",
  },
  {
    title: "Previous",
    dataIndex: "previous",
    key: "previous",
  },
  {
    title: "New",
    dataIndex: "new",
    key: "new",
  }
];

export default class VoteCard extends Component {
  constructor(props) {
    super(props);

    this.updateVote = this.updateVote.bind(this);
  }

  updateVote(text) {
    // eslint-disable-next-line react/destructuring-assignment
    const bill = Object.assign(this.props.bill);

    if (text == "agree") {
      bill.numberOfVotesFor = bill.numberOfVotesFor + 1;
      bill.remainingVotes = bill.remainingVotes - 1;
    } else if (text == "disagree") {
      bill.numberOfVotesAgainst = bill.numberOfVotesAgainst + 1;
      bill.remainingVotes = bill.remainingVotes - 1;
    }
  }

  render() {
    const {
      bill
    } = this.props;

    return (
      <Card className="card" title={bill.title}>
        <p>{bill.description}</p>
        <Table columns={columns} dataSource={bill.table} rowKey="id" pagination={false} />
        <br />
        <Row className="row-container">
          <Col className="column-container" span={12}>
            <Button className="button agree" onClick={() => this.updateVote("agree")}>
              <i className="arrow alternate circle up outline big icon"></i>
              {bill.numberOfVotesFor}
            </Button>
          </Col>
          <Col className="column-container" span={12}>
            <Button className="button disagree" onClick={() => this.updateVote("disagree")}>
              <i className="arrow alternate circle down outline big icon"></i>
              {bill.numberOfVotesAgainst}
            </Button>
          </Col>
        </Row>
        <div>{bill.remainingVotes} remaining vote/s before the &quot;Bill&quot; is enacted</div>
      </Card>
    );
  }
}