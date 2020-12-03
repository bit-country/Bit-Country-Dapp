
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-parens */


import React from "react";
import IncorrectNetwork from "../../../pages/Errors/IncorrectNetwork";
import AccountLocked from "../../../pages/Errors/AccountLocked";
import UnsupportedBrowser from "../../../pages/Errors/UnsupportedBrowser";
import Spinner from "../../Spinner";
import { ApiPromise } from "@polkadot/api";
import { WsProvider } from "@polkadot/rpc-provider";

const defaultState = {
  address: "",
  loadingDApp: false,
  incorrectNetwork: false,
  accountLocked: false,
  unsupportedBrowser: false,
};

const DAppContext = React.createContext(defaultState);

export default class DApp extends React.PureComponent {

  /* eslint-disable no-console */

  state = defaultState;

  render() {
    const {
      loadingDApp,
    } = this.state;

    return loadingDApp ? (
      <Spinner />
    ) : (
        <DAppContext.Provider value={this.state}>
          {this.props.children}
        </DAppContext.Provider>
      );
  }
}

const componentRenderer = (Component, requiresWallet, props, value) => {
  if (!requiresWallet) {
    return <Component {...value} {...props} />;
  }

  const {
    unsupportedBrowser,
    accountLocked,
    incorrectNetwork
  } = value;

  return unsupportedBrowser ? (
    <UnsupportedBrowser />
  ) : accountLocked ? (
    <AccountLocked />
  ) : incorrectNetwork ? (
    <IncorrectNetwork />
  ) : (
          <Component {...value} {...props} />
        );
};

// eslint-disable-next-line react/display-name
export const DAppConnect = (WrappedComponent, requiresWallet = false) => props => (
  <DAppContext.Consumer>
    {value => componentRenderer(WrappedComponent, requiresWallet, props, value)}
  </DAppContext.Consumer>
);
