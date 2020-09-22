import React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Divider, Icon, List, Button, Row } from "antd";
import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import { DAppConnect } from "../../components/HOC/DApp/DAppWrapper";
import "./PendingCountry.styles.css";
import Logging from "../../utils/Logging";
import { CHAINTYPES } from "../../config/chainTypes";

const Stage = ({ title, description, status, actions }) => (
  <List.Item 
    className="stage"
    actions={actions}
  >
    <List.Item.Meta 
      className="icon"
      avatar={status == null ? (
        <Icon type="loading" />
      ) : status ? (
        <Icon type="check" className="success" />
      ) : (
        <Icon type="stop" className="failure" />
      )}
      title={title}
      description={description}
    />
  </List.Item>
);

class PendingCountry extends React.Component {
  state = {
    countryTx: {},
    countryStatus: null,
    tokenTx: {},
    tokenStatus: null,
  }

  componentDidMount() {
    const { id } = this.props;

    this.loadTxHashes(id);
  }

  loadTxHashes = async countryId => {
    try {
      const response = await fetchAPI(
        `${endpoints.GET_COUNTRY_PENDING_STATUS}?countryId=${countryId}`
      );
  
      if (!response?.isSuccess) {
        throw Error("Error while retrieving country status");
      }

      if ((response.countryTx.chain != CHAINTYPES.OffChain && response.countryTx.hash == null)
        || (response.tokenTx.chain != CHAINTYPES.OffChain && response.tokenTx.hash == null)) {
        window.setTimeout(() => this.loadTxHashes(countryId), 2000);
      }

      this.setState({
        countryTx: response.countryTx,
        tokenTx: response.tokenTx
      }, this.loadReceipts);
    } catch (error) {
      Logging.Error(error);
    }
  }

  loadReceipts = async () => {
    const {
      countryTx,
      tokenTx
    } = this.state;

    let countryStatus = null, tokenStatus = null;

    try {
      if (countryTx) {
        switch (countryTx.chain) {
          case CHAINTYPES.OffChain:
            countryStatus = true;
            break;
  
          default:
            throw Error("Unsupported blockchain");
        }
      }

      if (tokenTx) {
        switch (tokenTx.chain) {
          case CHAINTYPES.OffChain:
            tokenStatus = true;
            break;
  
          default:
            throw Error("Unsupported blockchain");
        }
      }
    } catch (error) {
      Logging.Error(new Error("Error while getting receipts"), error);
    } finally {
      this.setState({
        countryStatus,
        tokenStatus
      });
    }
  }

  handleNavigate = () => {
    const { navigate } = this.props;

    navigate("../");
  }

  render() {
    const {
      countryStatus,
      tokenStatus
    } = this.state;

    const complete = countryStatus && tokenStatus;

    return (
      <Row>
        <Col
          push={4}
          span={16}
          className="content"
        >
          <Divider orientation="left">
            <h3>
              <FormattedMessage
                id="country.pending.title"
              />
            </h3>
          </Divider>
          <h4>
            <FormattedMessage
              id="country.pending.introduction"
            />
          </h4>
          <div>
            <FormattedMessage
              id="country.pending.note"
            />
          </div>
          <Divider />
          <List
            itemLayout="horizontal"
          >
            <Stage
              title={<FormattedMessage id="country.pending.step.orderPlaced.title" />}
              description={<FormattedMessage id="country.pending.step.orderPlaced.description" />}
              status={true}
            />
            <Stage 
              title={<FormattedMessage id="country.pending.step.countryConfirming.title" />} 
              description={<FormattedMessage id="country.pending.step.countryConfirming.description" />} 
              status={countryStatus}
            />
            <Stage 
              title={<FormattedMessage id="country.pending.step.currencyConfirming.title" />} 
              description={<FormattedMessage id="country.pending.step.currencyConfirming.description" />} 
              status={tokenStatus}
            />
            <Stage 
              title={<FormattedMessage id="country.pending.step.blockchainConfirmed.title" />} 
              description={<FormattedMessage id="country.pending.step.blockchainConfirmed.description" />} 
              status={complete}
              actions={[ complete && (
                <List.Item>
                  <Button 
                    type="primary"
                    onClick={this.handleNavigate}
                  >
                    <FormattedMessage
                      id="country.pending.step.action"
                    />
                  </Button>
                </List.Item>
              ) ]}
            />
          </List>
        </Col>
      </Row>
    );
  }
}

export default DAppConnect(PendingCountry);
