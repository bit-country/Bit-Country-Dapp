import React, { useState, useEffect } from "react";
import { List, Avatar, Col, Row, Empty } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import { fetchAPI } from "../../utils/FetchUtil";
import Notification from "../../utils/Notification";
import ENDPOINTS from "../../config/endpoints";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import "./Assets.styles.css";

const fakeData = {
  assets: [
    {
      asset: {
        symbol: "👑",
        name: "Monarch Title",
      },
      balance: 1
    },
    {
      asset: {
        symbol: "📜",
        name: "Libreland Decree",
      },
      balance: 1
    },
    {
      asset: {
        symbol: "🚀",
        name: "Far-traveller",
      },
      balance: 1
    }
  ]
};

function Assets({ user, intl }) {
  const [ assets, setAssets ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    (async function() {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_USER_DIGITAL_ASSETS}?userId=${user.id}`
      );
  
      if (!response?.isSuccess) {
        Notification.displayErrorMessage(intl.formatMessage({ id: "wallet.assets.fetch.error" }));
      }
  
      setAssets(response.assets.length > 0 ? response.assets : fakeData.assets);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Col
      push={4}
      span={16}
      className="assets"
    >
      <h1 className="coming-soon">
        <FormattedMessage
          id="app.comingSoon"
        />
      </h1>
      <h2>
        <FormattedMessage id="wallet.assets.header" />
      </h2>
      <List 
        dataSource={assets}
        locale={{
          emptyText: (
            <Empty
              description={intl.formatMessage({ id: "wallet.assets.none" })}
            />
          )
        }}
        header={(
          <Row className="asset-headers">
            <Col xs={12} sm={14} md={16}>
              <FormattedMessage id="wallet.assets.header.name" />
            </Col>
            <Col xs={6} lg={4}>
            </Col>
            <Col xs={6} sm={4} md={2} className="asset-balance">
              <FormattedMessage id="wallet.assets.header.quantity" />
            </Col>
          </Row>
        )}
        renderItem={item => (
          <List.Item
            onClick={() => alert(item.name)}
          >
            <div className="asset-image">
              <Avatar>{item.asset.symbol}</Avatar>
            </div>
            <Row className="asset-details">
              <Col xs={12} sm={14} md={16}>
                {item.asset.name}
              </Col>
              <Col xs={6} lg={4}>
              </Col>
              <Col xs={6} sm={4} md={2} className="balance">
                {item.balance}
              </Col>
            </Row>
          </List.Item>
        )}
        loading={isLoading}
      />
    </Col>
  );
}

export default AuthConnect(injectIntl(Assets));
