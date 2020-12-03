/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-parens */
import React, { useState, /*useCallback,*/ useEffect } from "react";
import { List, Avatar, Col, Row, Empty, Button, Divider, Grid, Card, Modal, Icon } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import { DAppConnect } from "../../components/HOC/DApp/DAppWrapper";
import { fetchAPI } from "../../utils/FetchUtil";
import Notification from "../../utils/Notification";
import ENDPOINTS from "../../config/endpoints";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
// import keyring from "@polkadot/ui-keyring";
import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { stringToU8a, isFunction } from "@polkadot/util";
import { useSubstrate } from "../../components/HOC/DApp/useSubstrate";
import { useMyAccount, useMyAddress, readMyAddress } from "../../components/HOC/DApp/SubstrateAccountProvider";
import TxButton from "../../components/HOC/DApp/TxButton";
import _ from "lodash";

function Wallet({ /*address,*/ user, intl }) {

  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [parachain, setParachain] = useState("");
  const [walletAccounts, setAccounts] = useState([]);
  const [{ isUsable, signer }, setSigner] = useState({ isUsable: true, signer: null });
  const [currentPair, setCurrentPair] = useState(null);
  const [signature, setSignature] = useState("");
  const { api, keyring, dispatch, account } = useSubstrate();
  const [substrate, setSubstrate] = useState(null);
  const [status, setStatus] = useState(null);
  const [isChooseAccountModal, setIsChooseAccountModal] = useState(false);
  const [accountList, setAccountList] = useState([]);
  const { setAddress, state: { address } } = useMyAccount();
  const [accountSelected, setAccountSelected] = useState(null);
  const [accountAddressSelected, setAccountAddressSelected] = useState("");
  const currentAddress = useMyAddress();
  const savedAddress = readMyAddress();

  console.log("account", account);

  useEffect(() => {
    (async function () {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_USER_TOKEN_BALANCE}?userId=${user.id}`
      );

      if (!response?.isSuccess) {
        Notification.displayErrorMessage(intl.formatMessage({ id: "wallet.token.fetch.error" }));
      }

      setTokens(response.tokenBalance);

    })();
  }, []);

  useEffect(() => {
    if (savedAddress) {
      setAccountAddressSelected(savedAddress);
    } else {
      setAccountAddressSelected(currentAddress);
    }
  }, [currentAddress]);

  useEffect(() => {
    async function connect() {
      // You can await here
      await connectWallet();
      // ...
    }
    connect();
  }, [api, keyring]);

  const connectWallet = async () => {
    await initApi(api, keyring);
  };

  const initApi = async (api, keyring) => {
    if (api && keyring) {

      const keyringOptions = keyring.getPairs().map(account => ({
        key: account.address,
        value: account.address,
        text: account.meta.name.toUpperCase(),
        icon: "user"
      }));

      const initialAddress =
        keyringOptions.length > 0 ? keyringOptions[0] : "";

      setAccountList(keyringOptions);

      if (savedAddress) {
        // setAddress(initialAddress.value);
        const selectedCurrentAddress = _.filter(keyringOptions, (o) => { return o.value == savedAddress; });

        if (selectedCurrentAddress.length > 0) {
          setAccountSelected(selectedCurrentAddress[0]);
        }
        setAccountAddressSelected(savedAddress);
        dispatch({ type: "SET_ACCOUNT", payload: selectedCurrentAddress[0] });
      }
      else {
        console.log("Hit ELSE saved address");

        setAddress(initialAddress.value);
        setAccountSelected(initialAddress);
        setAccountAddressSelected(initialAddress.value);
        dispatch({ type: "SET_ACCOUNT", payload: initialAddress });
      }

      setSubstrate({ api, keyring });
      setIsLoading(false);


      // setIsLoading(false);
    }
  };

  useEffect(() => {
    (async function () {

      await initApi(api, keyring);

    })();
  }, [api, keyring]);

  const onAccountListChange = (value) => {
    setAccountSelected(value);
    setAccountAddressSelected(value.key);
    setIsChooseAccountModal(false);
    dispatch({ type: "SET_ACCOUNT", payload: value });
  };

  return (
    <>
      <Col
        push={4}
        span={18}
      >
        <h2>
          Wallet
        </h2>
        <div>
          <Row gutter={16}>
            <Col className="wallet-info" span={24}>
              <Card className="wallet-detail" style={{ width: 500 }}>
                <div className="wallet-icon">
                </div>
                <div className="wallet-address">
                  <span className="wallet-name">
                    {account && account.text ? account.text && account.text.length > 15 ? `${account.text.substr(0, 10)} ...` : account.text : null}
                  </span>
                  <span className="wallet-address-detail">
                    {account && account.key && account.key.substr(0, 8)}....{account && account.key && account.key.substr(account.key.length - 8)}
                  </span>
                </div>
                <div className="wallet-setting">
                  <div className="edit-section"><a onClick={() => setIsChooseAccountModal(true)}>Edit</a></div>
                  <div className="copy-section"><a>Copy</a></div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <div>
          <Row className="balance-list">
            <Col span={8}>
              <Card style={{ width: 300 }} className="main-balance">
                <p>My Balance</p>
                {account && <MainBalance accountSelected={account.value} api={api} style={{ marginRight: 5 }} />}
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ width: 300 }} className="balance-record">
                <div className="currency-header">
                  <div className="token-description">
                    <div className="token-image">
                      <Avatar>{"MVPC"}</Avatar>
                    </div>
                    <div className="token-detail">
                      <span className="token-name">MVP Coin</span>
                      <span className="token-symbol">MVPC</span>
                    </div>
                  </div>
                  <div className="token-balance">
                    <h4>0</h4>
                    <span>≈BCG 12</span>
                  </div>
                </div>
                <div className="align-center">
                  <Button type="primary">Transfer</Button>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ width: 300 }} className="balance-record">
                <div className="currency-header">
                  <div className="token-description">
                    <div className="token-image">
                      <Avatar>{"MVPC"}</Avatar>
                    </div>
                    <div className="token-detail">
                      <span className="token-name">Unity Coin</span>
                      <span className="token-symbol">UNC</span>
                    </div>
                  </div>
                  <div className="token-balance">
                    <h4>0</h4>
                    <span>≈BCG 12</span>
                  </div>
                </div>
                <div className="align-center">
                  <Button type="primary">Transfer</Button>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ width: 300 }} className="balance-record">
                <div className="currency-header">
                  <div className="token-description">
                    <div className="token-image">
                      <Avatar>{"GWC"}</Avatar>
                    </div>
                    <div className="token-detail">
                      <span className="token-name">Game Coin</span>
                      <span className="token-symbol">GWC</span>
                    </div>
                  </div>
                  <div className="token-balance">
                    <h4>0</h4>
                    <span>≈BCG 11</span>
                  </div>
                </div>
                <div className="align-center">
                  <Button type="primary">Transfer</Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <Modal
          title="Choose Account"
          visible={isChooseAccountModal}
          onCancel={() => setIsChooseAccountModal(false)}
          footer={null}
        >
          <List
            className="account-list"
            dataSource={accountList}
            renderItem={item => (
              <List.Item key={item.key} onClick={() => onAccountListChange(item)}>
                <h4>
                  {item.text}
                </h4>
                <div>
                  <Icon className={`check-mark ${accountAddressSelected == item.key && "active"}`} type="check" />
                </div>
              </List.Item>
            )}
          >
          </List>
        </Modal>
      </Col>
    </>
  );
}

function MainBalance(props) {
  const { accountSelected, api } = props;
  const [accountBalance, setAccountBalance] = useState(0);

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;

    // If the user has selected an address, create a new subscription
    accountSelected && api &&
      api.query.system.account(accountSelected, balance => {
        setAccountBalance(balance.data.free.toHuman());
      })
        .then(unsub => {
          unsubscribe = unsub;
        })
        .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [accountSelected]);

  return accountSelected ? (
    <h3>
      {accountBalance}
    </h3>
  ) : null;
}

export default DAppConnect(AuthConnect(injectIntl(Wallet)));
