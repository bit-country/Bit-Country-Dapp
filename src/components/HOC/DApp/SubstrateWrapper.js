
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-parens */
import React, { useCallback, useEffect, useReducer, useContext, useState } from "react";
import IncorrectNetwork from "../../../pages/Errors/IncorrectNetwork";
import AccountLocked from "../../../pages/Errors/AccountLocked";
import UnsupportedBrowser from "../../../pages/Errors/UnsupportedBrowser";
import Spinner from "../../Spinner";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import jsonrpc from "@polkadot/types/interfaces/jsonrpc";
import { DefinitionRpcExt, RegistryTypes } from "@polkadot/types/types";
import keyring, { Keyring } from "@polkadot/ui-keyring";
import { formatBalance } from "@polkadot/util";
import { cacheSubstrateMetadata, getSubstrateMetadataRecord as getCachedSubstrateMetadata } from "../../../config/storage/metadata";
import Logging from "../../../utils/Logging";

const defaultState = {
  address: "",
  loadingDApp: true,
  incorrectNetwork: false,
  accountLocked: false,
  unsupportedBrowser: false,
  ethereumAvailable: false,
  polkadotApi: null,
  endpoint: "wss://whenua.bit.country",
  rpc: { ...jsonrpc },
  account: ""
};

let _api;

export { _api as api }; //Export api to consumer from _api

const reducer = (state, action) => {
  switch (action.type) {
    case "RESET_SOCKET": {
      const endpoint = action.payload || state.endpoint;

      return { ...state, endpoint };

    }
    case "CONNECT": {
      // log.info(`Connected to Substrate node ${state.endpoint?.toString()}`)
      return { ...state, api: action.payload, apiState: "CONNECTING" };
    }
    case "CONNECT_SUCCESS": {
      if (state.apiState !== "CONNECTING") {
        const { payload } = action;
        let tookTimeLog;

        const startTime = payload;
        const tookTime = window.performance.now() - startTime;

        tookTimeLog = `Took ${tookTime / 1000} seconds`;

        // log.info(`✅ Substrate API is ready. ${tookTimeLog}`)
      }
      return { ...state, apiState: "READY" };
    }
    case "CONNECT_ERROR": {
      const err = action.payload;
      // log.error(`❌ Failed to connect to Substrate node ${state.endpoint?.toString()} . ${err}`)

      return { ...state, apiState: "ERROR", apiError: err };
    }
    case "SET_KEYRING": {
      // log.info(`✅ Loaded accounts with Keyring`)
      Logging.Log("SET_KEYRING", action.payload);
      return { ...state, keyring: action.payload, keyringState: "READY" };
    }
    case "SET_ACCOUNT": {
      // log.info(`✅ Loaded accounts`)
      Logging.Log("SET_ACCOUNT", action.payload);
      return { ...state, account: action.payload };
    }
    case "KEYRING_ERROR": {
      const err = action.payload;
      // log.error(`❌ Failed to load accounts with Keyring. ${err}`)

      return { ...state, keyring: undefined, keyringState: "ERROR", keyringError: err };
    }
    default: {
      throw new Error(`Unknown type of action: ${action.type}`);
    }
  }
};

export const SubstrateContext = React.createContext();

export const SubstrateProvider = (props) => {

  const [state, dispatch] = useReducer(reducer, defaultState);

  const { api, endpoint, rpc } = state;

  const connect = useCallback(async () => {
    if (api) return;

    // log.info(`Connecting to Substrate node ${endpoint} ...`)
    const connectTime = window.performance.now();

    const provider = new WsProvider(endpoint);

    const metadata = await getCachedSubstrateMetadata();
    let isMetadataCached = metadata != null;

    // console.log(`>>> METADATA key: ${Object.keys(metadata || {})}`)


    _api = new ApiPromise({
      provider, types: {
        // mapping the actual specified address format
        Address: "AccountId",
        // mapping the lookup
        LookupSource: "AccountId",
        Balance: "u128",
        AssetId: "u64",
        AssetInfo: {
          owner: "AccountId",
          data: "AssetData"
        },
        AssetData: {
          name: "Text",
          description: "Text",
          properties: "Text",
          supporters: "Vec<AccountId>"
        },
        AuctionId: "u64",
        AuctionItem: {
          asset_id: "AssetId",
          recipient: "AccountId",
          initial_amount: "Balance",
          amount: "Balance",
          start_time: "u32",
          end_time: "u32"
        },
        AuctionInfo: {
          bid: "Option<(AccountId,Balance)>",
          start: "BlockNumber",
          end: "Option<BlockNumber>"
        },
        RentId: "u64",
        RentalInfo: {
          owner: "AccountId",
          start: "BlockNumber",
          end: "Option<BlockNumber>",
          price_per_block: "Balance"
        }
      }, rpc, metadata
    });

    const onConnectSuccess = async () => {
      dispatch({ type: "CONNECT_SUCCESS", payload: connectTime });
      if (!isMetadataCached) {
        isMetadataCached = true;
        await cacheSubstrateMetadata(_api);
      }
    };

    const onReady = () => {
      dispatch({ type: "CONNECT", payload: _api });
      onConnectSuccess();
    };

    const onConnect = () => {
      dispatch({ type: "CONNECT", payload: _api });
      // `ready` event is not emitted upon reconnection. So we check explicitly here.
      _api.isReady.then((_api) => onConnectSuccess());
    };

    _api.on("connected", onConnect);
    _api.on("ready", onReady);
    _api.on("error", err => dispatch({ type: "CONNECT_ERROR", payload: err }));
    _api.on("disconnected", () => console.log("Disconnected"));

    return () => _api?.disconnect();
  }, [api, endpoint, rpc, dispatch]);


  // hook to get injected accounts
  const { keyringState } = state;
  const loadAccounts = useCallback(async (api) => {
    // Ensure the method only run once.
    if (keyringState || !api) return;

    try {
      await web3Enable("Bit Country");
      let allAccounts = await web3Accounts();

      allAccounts = allAccounts.map(({ address, meta }) =>
        ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));

      keyring.loadAll({ isDevelopment: true }, allAccounts);

      dispatch({ type: "SET_KEYRING", payload: keyring });
    } catch (err) {
      // log.error(`Keyring failed to load accounts. ${err}`);
      dispatch({ type: "KEYRING_ERROR", payload: err });
    }
  }, [keyringState, dispatch]);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (!api) return;

    api.isReady
      .then(api => loadAccounts(api));
  }, [loadAccounts, api]);

  return (
    <SubstrateContext.Provider value={[state, dispatch]}>
      {props.children}
    </SubstrateContext.Provider>
  );
};

export const useSubstrateContext = () => useContext(SubstrateContext)[0];

