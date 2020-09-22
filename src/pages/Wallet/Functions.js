import React, { useState, useEffect, useCallback } from "react";
import {
  List,
  Avatar,
  Col,
  Row,
  Empty,
  Button,
  InputNumber,
  Form,
  Modal,
} from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import "./Functions.styles.css";

const fakeData = {
  functions: [
    {
      function: {
        symbol: "👑",
        name: "KingSize()",
        description: "Make a post extram lardge",
      },
      quantity: 1,
    },
    {
      function: {
        symbol: "📜",
        name: "Burn()",
        description: "Convert your country currency to BCG",
      },
      quantity: 1,
    },
    {
      function: {
        symbol: "🚀",
        name: "Portal()",
        description: "Fast travel to a block afar or another country",
      },
      quantity: 1,
    },
  ],
};

function Functions({ intl }) {
  const [ functions, setFunctions ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ modalOpen, setModalOpen ] = useState(false);
  const handleClose = useCallback(() => setModalOpen(false), [ setModalOpen ]);
  const handleOk = useCallback(() => setModalOpen(false), [ setModalOpen ]);

  const [ selectedFunction, setSelectedFunction ] = useState({});

  const handleItemClick = useCallback(
    selectedFunction => {
      setSelectedFunction(selectedFunction);
      setModalOpen(true);
    },
    [ setSelectedFunction, setModalOpen ]
  );

  useEffect(() => {
    (async function () {
      // const response = await fetchAPI(
      //   `${ENDPOINTS.GET_USER_FUNCTIONS}?userId=${user.id}`
      // );

      // if (!response?.isSuccess) {
      //   Notification.displayErrorMessage(
      //     intl.formatMessage({ id: "wallet.functions.fetch.error" })
      //   );
      // }

      setFunctions(fakeData.functions);
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      <Col push={4} span={16} className="functions">
        <h1 className="coming-soon">
          <FormattedMessage id="app.comingSoon" />
        </h1>
        <h2>
          <FormattedMessage id="wallet.functions.header" />
        </h2>
        <List
          dataSource={functions}
          locale={{
            emptyText: (
              <Empty
                description={intl.formatMessage({
                  id: "wallet.functions.none",
                })}
              />
            ),
          }}
          header={
            <Row className="function-headers">
              <Col xs={6} lg={4}>
                <FormattedMessage id="wallet.functions.header.name" />
              </Col>
              <Col xs={10} sm={12} md={14}>
                <FormattedMessage id="wallet.functions.header.description" />
              </Col>
              <Col xs={4} sm={3} md={2} className="function-quantity">
                <FormattedMessage id="wallet.functions.header.quantity" />
              </Col>
              <Col xs={4} sm={3} md={2}></Col>
            </Row>
          }
          renderItem={item => (
            <List.Item>
              <div className="function-image">
                <Avatar>{item.function.symbol}</Avatar>
              </div>
              <Row className="function-details">
                <Col xs={6} lg={4}>
                  {item.function.name}
                </Col>
                <Col xs={10} sm={12} md={14}>
                  {item.function.description}
                </Col>
                <Col xs={4} sm={3} md={2} className="quantity">
                  {item.quantity}
                </Col>
                <Col xs={4} sm={3} md={2}>
                  <Button type="primary" onClick={() => handleItemClick(item)}>
                    <FormattedMessage id="wallet.functions.purchase" />
                  </Button>
                </Col>
              </Row>
            </List.Item>
          )}
          loading={isLoading}
        />
      </Col>
      <Modal
        visible={modalOpen}
        closable
        okText={<FormattedMessage id="wallet.functions.purchase.confirm" />}
        onCancel={handleClose}
        onOk={handleOk}
        title={<FormattedMessage id="wallet.functions.purchase.modal.title" />}
      >
        <Form>
          <Form.Item
            label={
              <FormattedMessage id="wallet.functions.purchase.modal.name" />
            }
          >
            <label>{selectedFunction.name}</label>
          </Form.Item>
          <Form.Item
            label={
              <FormattedMessage id="wallet.functions.purchase.modal.description" />
            }
          >
            <label>{selectedFunction.description}</label>
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="wallet.functions.purchase.quantity" />}
          >
            <InputNumber min={1} precision={0} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AuthConnect(injectIntl(Functions));
