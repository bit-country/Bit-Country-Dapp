import React, { useState, /*useCallback,*/ useEffect } from "react";
import { List, Avatar, Col, Row, /*Modal, Form, Input, Radio, InputNumber,*/ Empty } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import { DAppConnect } from "../../components/HOC/DApp/DAppWrapper";
import { fetchAPI } from "../../utils/FetchUtil";
import Notification from "../../utils/Notification";
import ENDPOINTS from "../../config/endpoints";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";

// const useWithdrawTokenModal = address => {
//   const [ modalOpen, setModalOpen ] = useState(false);
//   const handleClose = useCallback(() => setModalOpen(false), [ setModalOpen ]);
//   const handleOk = useCallback(() => setModalOpen(false), [ setModalOpen ]);

//   const [ selectedToken, setSelectedToken ] = useState({});
//   const handleItemClick = useCallback(selectedToken => {
//     if (!address) {
//       Notification.displayErrorMessage(
//         <FormattedMessage
//           id=""
//         />
//       );

//       return;
//     }

//     setSelectedToken(selectedToken);
//     setModalOpen(true);
//   }, [ setSelectedToken, setModalOpen ]);

//   const [ transactionType, setTransactionType ] = useState("withdraw");
//   const handleTypeChange = useCallback(({ target: { value } }) => setTransactionType(value), [ setTransactionType ]);

//   const [ quantity, setQuantity ] = useState(1);
//   const handleQuantityChange = useCallback(
//     value => {
//       let parsedNumber = Number(value);

//       if (parsedNumber) {
//         setQuantity(
//           Math.max(
//             1, 
//             Math.min(
//               selectedToken.balance, 
//               value
//             )
//           )
//         );
//       }
//     }
//   );

//   return [
//     modalOpen, 
//     transactionType, 
//     quantity, 
//     handleTypeChange, 
//     handleQuantityChange, 
//     handleClose, 
//     handleOk, 
//     handleItemClick
//   ];
// };

function Wallet({ /*address,*/ user, intl }) {
  const [ tokens, setTokens ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    (async function() {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_USER_TOKEN_BALANCE}?userId=${user.id}`
      );

      if (!response?.isSuccess) {
        Notification.displayErrorMessage(intl.formatMessage({ id: "wallet.token.fetch.error" }));
      }

      setTokens(response.tokenBalance);
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      <Col
        push={4}
        span={16}
      >
        <h2>
          <FormattedMessage id="wallet.token.header" />
        </h2>
        <List 
          dataSource={tokens}
          locale={{
            emptyText: (
              <Empty
                description={intl.formatMessage({ id: "wallet.token.none" })}
              />
            )
          }}
          header={(
            <Row className="token-headers">
              <Col xs={12} sm={14} md={16}>
                <FormattedMessage id="wallet.token.header.name" />
              </Col>
              <Col xs={6} lg={4} className="symbol">
                <FormattedMessage id="wallet.token.header.symbol" />
              </Col>
              <Col xs={6} sm={4} md={2} className="token-balance">
                <FormattedMessage id="wallet.token.header.balance" />
              </Col>
            </Row>
          )}
          renderItem={item => (
            <List.Item
              // onClick={() => handleItemClick(item)}
            >
              <div className="token-image">
                <Avatar>{item.token.symbol}</Avatar>
              </div>
              <Row className="token-details">
                <Col xs={12} sm={14} md={16}>
                  {item.token.name}
                </Col>
                <Col xs={6} lg={4} className="symbol">
                  [{item.token.symbol}]
                </Col>
                <Col xs={6} sm={4} md={2} className="token-balance">
                  {item.balance}
                </Col>
              </Row>
            </List.Item>
          )}
          loading={isLoading}
        />
      </Col>
      {/* <Modal
        visible={modalOpen}
        closable
        okText={<FormattedMessage id="wallet.transaction.confirm" />}
        onCancel={handleClose}
        onOk={handleOk}
        title={(
          <FormattedMessage id="wallet.transaction.modal.title" />
        )}
      >
        <div id="transaction-type">
          <FormattedMessage id="wallet.transactionType" />
        </div>        
        <Radio.Group onChange={handleTypeChange} value={transactionType}>
          <Radio value="withdraw">
            <FormattedMessage id="wallet.withdraw" />
          </Radio>                
          <Radio value="deposit">
            <FormattedMessage id="wallet.deposit" />
          </Radio>
        </Radio.Group>
        <Form>
          <Form.Item
            label={<FormattedMessage id="wallet.transaction.token" />}
          >
            <Input readOnly disabled value={`[${selectedToken.token && selectedToken.token.symbol}] ${selectedToken.token && selectedToken.token.name}`} />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="wallet.transaction.quantity" />}
          >
            <InputNumber 
              min={1} 
              max={selectedToken.balance} 
              value={quantity} 
              onChange={handleQuantityChange}
              precision={0} 
            />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="wallet.transaction.address" />}
          >
            <Input readOnly disabled value={address} />
          </Form.Item>
        </Form>
      </Modal> */}
    </>
  );
}

export default DAppConnect(AuthConnect(injectIntl(Wallet)));
