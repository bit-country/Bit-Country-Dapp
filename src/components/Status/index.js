/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-parens */

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Avatar,
  Dropdown,
  Menu,
  Icon,
  Badge,
  Select,
} from "antd";
import { Link } from "@reach/router";
import { FormattedMessage } from "react-intl";
import "./index.css";
import { useSubstrate } from "../HOC/DApp/useSubstrate";
import { useMyAccount, useMyAddress, readMyAddress } from "../HOC/DApp/SubstrateAccountProvider";
import _ from "lodash";

const { Option } = Select;

export default function Status({ user, sendLogout, drawerOpen, toggleDrawer, notificationCount, clearNotificationCount }) {
  const [ collapsed, setCollapsed ] = useState(false);
  const [ collapsedWidth, setCollapsedWidth ] = useState(null);
  const containerRef = useRef();

  const { api, keyring, dispatch, account } = useSubstrate();
  // const [substrate, setSubstrate] = useState(null);
  const { setAddress, state: { address } } = useMyAccount();
  // const [accountSelected, setAccountSelected] = useState(null);
  const [ accountOption, setAccountOption ] = useState(null);
  const [ accountAddressSelected, setAccountAddressSelected ] = useState("");
  const currentAddress = useMyAddress();
  const savedAddress = readMyAddress();

  const userAvatar = user?.profileImageUrl ? (
    <Avatar
      shape="square"
      size="small"
      src={user.profileImageUrl}
      alt={user.nickName}
    />
  ) : (
      <Avatar
        shape="square"
        size="small"
        icon="user"
        alt="Default profile picture"
      />
    );

  useEffect(() => {
    const resizeHandler = () => {
      const rect =
        containerRef.current && containerRef.current.getBoundingClientRect();
      const parentRect = containerRef.current.parentElement.getBoundingClientRect();

      if (!rect) {
        return;
      }

      if (rect.width > parentRect.width) {
        setCollapsedWidth(rect.width);
        setCollapsed(true);
      } else if (collapsedWidth && parentRect.width > collapsedWidth) {
        setCollapsed(false);
        setCollapsedWidth(null);
      }
    };

    // Call for initial check.
    resizeHandler();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [ collapsed, collapsedWidth, containerRef ]);

  useEffect(() => {
    if (savedAddress) {
      setAccountAddressSelected(savedAddress);
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

      setAccountOption(keyringOptions);

      if (savedAddress) {
        // setAddress(initialAddress.value);
        const selectedCurrentAddress = _.filter(keyringOptions, (o) => { return o.value == savedAddress; });

        // if (selectedCurrentAddress.length > 0) {
        //   setAccountSelected(selectedCurrentAddress[0]);
        // }

        setAccountAddressSelected(savedAddress);
        dispatch({ type: "SET_ACCOUNT", payload: selectedCurrentAddress[0] });
      }
      else {
        setAddress(initialAddress.value);
        // setAccountSelected(initialAddress);
        setAccountAddressSelected(initialAddress.value);
        dispatch({ type: "SET_ACCOUNT", payload: initialAddress });
      }

      // setSubstrate({ api, keyring });
      // setIsLoading(false);
    }
  };

  const onWalletChange = (value, option) => {
    setAccountAddressSelected(value);
    setAddress(value.value);
    dispatch({ type: "SET_ACCOUNT", payload: value });
  };

  const dropdownMenu = useMemo(() => (
    <Menu className="status-dropdown">
      {user ? (
        <>
          {!account ? (
            <a className="connect-wallet" onClick={connectWallet}>
              <Icon type="plus" />
              Connect to Wallet
            </a>
          ) : (
              <>
                <a className="connect-wallet">
                  <BalanceAnnotation accountSelected={accountAddressSelected} style={{ marginRight: 5 }} />
                  <Select style={{ width: 220 }} defaultValue={account.key} value={account.key}>
                    {
                      accountOption != null ? accountOption.map((account, index) =>
                        (
                          <Option onClick={() => onWalletChange(account)} key={index} value={account.key}><strong>{account.text.substr(0, 8)} </strong>- {account.key.substr(0, 8)}....{account.key.substr(account.key.length - 4)}</Option>
                        )
                      ) : null
                    }
                  </Select>
                </a>
              </>
            )}
          <Link
            to="/notifications"
            onClick={clearNotificationCount}
          >
            <div className="notifications">
              <FormattedMessage
                key={notificationCount}
                id="app.notifications"
                values={{ count: notificationCount }}
              />
            </div>
          </Link>
          <Link
            to="/profile"
          >
            <Menu.Item
              key="Profile"
            >
              <span className="name">
                {user.nickName}
              </span>
            </Menu.Item>
          </Link>
          <Menu.Item key="Logout" onClick={sendLogout}>
            <Icon type="logout" /> <FormattedMessage id="app.logout" />
          </Menu.Item>
        </>
      ) : (
          <Link to="/login">
            <Menu.Item key="Profile">
              <span className="login">
                <FormattedMessage id="app.login" />
              </span>
            </Menu.Item>
          </Link>
        )}
    </Menu>
  ), [user, notificationCount, connectWallet]);

  return collapsed ? (
    <div className="navigation collapsed" ref={containerRef}>
      <div className={"profile" + (user ? " hint" : "")}>
        {user ? (
          <Badge dot count={notificationCount}>
            <Dropdown
              overlay={dropdownMenu}
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="status overlay-container"
            >
              {userAvatar}
            </Dropdown>
          </Badge>
        ) : (
            <Link className="nav-btn nav-btn-login" to="/login" >
              <Icon type="login" />
            </Link>
          )}
      </div>
      <div className="separator" />
      <div className="nav-btn">
        <a>
          <Icon
            type={drawerOpen ? "up" : "down"}
            onClick={toggleDrawer}
          />
        </a>
      </div>
    </div>
  ) : (
      <div className="navigation" ref={containerRef} >
        {user ? (
          <>
            {!account ? (
              <a className="connect-wallet" onClick={connectWallet}>
                <Icon type="plus" />
              Connect to Wallet
              </a>
            ) : (
                <>
                  <a className="connect-wallet">
                    <BalanceAnnotation accountSelected={account.key} style={{ marginRight: 5 }} />
                    <Select style={{ width: 220 }} defaultValue={account.key} value={account.key}>
                      {
                        accountOption != null ? accountOption.map((account, index) =>
                          (
                            <Option onClick={() => onWalletChange(account)} key={index} value={account.key}><strong>{account.text.substr(0, 8)} </strong>- {account.key.substr(0, 8)}....{account.key.substr(account.key.length - 4)}</Option>
                          )
                        ) : null
                      }
                    </Select>
                  </a>
                </>
              )}
            <Link
              to="/notifications"
            >
              <div className="notifications">
                <Badge dot count={notificationCount}>
                  <Icon type="bell" />
                </Badge>
              </div>
            </Link>
            <Link
              to="/profile"
            >
              <div className="profile">
                {userAvatar}
                <span className="name">{user.nickName}</span>
              </div>
            </Link>
            <a className="nav-btn" onClick={sendLogout}>
              <Icon type="logout" />
            </a>
            {/* <a className="nav-btn nav-btn-friend is-active" href="#" /> */}
            {/* <a
            className="nav-btn nav-btn-notification is-active"
            href="#"
          /> */}
          </>
        ) : (
            <>
              <Link className="nav-btn nav-btn-login" to="/login" >
                <Icon type="login" />
              </Link>
            </>
          )}
        <div className="separator" />
        <div className="nav-btn">
          <a>
            <Icon
              type={drawerOpen ? "up" : "down"}
              onClick={toggleDrawer}
            />
          </a>
        </div>
      </div>
    );
}


function BalanceAnnotation(props) {
  const { accountSelected } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState(0);

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;

    // If the user has selected an address, create a new subscription
    accountSelected &&
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
    <span>
      <Icon type='gold' />
      {accountBalance}
    </span>
  ) : null;
}
