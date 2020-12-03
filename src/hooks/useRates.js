import React, { useState, useEffect } from "react";
import { fetchAPI } from "../utils/FetchUtil";
import Notification from "../utils/Notification";
import ENDPOINTS from "../config/endpoints";
import { FormattedMessage } from "react-intl";
import { Spin } from "antd";
import Logging from "../utils/Logging";

export function useTokenRate() {
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const [ tokenRate, setTokenRate ] = useState(0);

  useEffect(() => {
    loadTokenRate();
  }, [ setLoading, setTokenRate, setError ]);

  const loadTokenRate = async () => {
    try {
      const response = await fetchAPI(ENDPOINTS.GET_TOKEN_RATE);

      if (!response?.isSuccess) {
        throw Error("Error while retrieving BCG rate");
      }

      setTokenRate(response.rate);

      setLoading(false);
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        <FormattedMessage
          id="wallet.bcg.rate.notification.failure"
        />
      );

      setError(true);

      setLoading(false);
    }
  };

  return [ loading, tokenRate, error, loadTokenRate ];
}

export function useBlockRate() {
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const [ blockRate, setBlockRate ] = useState(0);

  useEffect(() => {
    loadBlockRate();
  }, [ setLoading, setBlockRate, setError ]);

  const loadBlockRate = async () => {
    try {
      const response = await fetchAPI(ENDPOINTS.GET_BLOCK_RATE);

      if (!response?.isSuccess) {
        throw Error("Error while retrieving Block rate");
      }

      setBlockRate(response.rate);

      setLoading(false);
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        <FormattedMessage
          id="wallet.bcg.rate.notification.failure"
        />
      );

      setError(true);

      setLoading(false);
    }
  };

  return [ loading, blockRate, error, loadBlockRate ];
}

export function useBCGToEthRate() {
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const [ BCGToEthRate, setBCGToEthRate ] = useState(0);

  useEffect(() => {
    loadBCGToEthRate();
  }, [ setLoading, setBCGToEthRate, setError ]);

  const loadBCGToEthRate = async () => {
    try {
      const response = await fetchAPI(ENDPOINTS.GET_BCG_TO_ETH_RATE);

      if (!response?.isSuccess) {
        throw Error("Error while retrieving BCG to Eth rate");
      }

      setBCGToEthRate(response.rate);

      setLoading(false);
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        <FormattedMessage
          id="wallet.bcg.rate.notification.failure"
        />
      );

      setError(true);
      setLoading(false);
    }
  };

  return [ loading, BCGToEthRate, error, loadBCGToEthRate ];
}

export function useTokenPerBlockRate() {
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const [ tokenPerBlockRate, setTokenPerBlockRate ] = useState(0);
  
  useEffect(() => {
    loadTokenPerBlockRate();
  }, [ setLoading, setTokenPerBlockRate, setError ]);

  const loadTokenPerBlockRate = async () => {
    try {
      const response = await fetchAPI(ENDPOINTS.GET_TOKEN_PER_BLOCK_RATE);

      if (!response?.isSuccess) {
        throw Error("Error while retrieving token per block rate");
      }

      setTokenPerBlockRate(response.rate);

      setLoading(false);
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        <FormattedMessage
          id="wallet.bcg.rate.notification.failure"
        />
      );

      setError(true);
      setLoading(false);
    }
  };

  return [ loading, tokenPerBlockRate, error, loadTokenPerBlockRate ];
}

export default function useRates() {
  const [ loadingToken, tokenRate, errorToken, loadTokenRate ] = useTokenRate();
  const [ loadingBlock, blockRate, errorBlock, loadBlockRate ] = useBlockRate();
  const [ loadingBCGToEth, BCGToEthRate, errorBCGToEth, loadBCGToEthRate ] = useBCGToEthRate();
  const [ loadingTokenPerBlock, tokenPerBlockRate, errorTokenPerBlock, loadTokenPerBlockRate ] = useTokenPerBlockRate();
  const [ timeLoaded, setTimeLoaded ] = useState(Date.now());
  
  const reloadIfStale = () => {    
    const timeLimit = 60000;
    const currentTime = Date.now();

    if ( currentTime - timeLoaded > timeLimit ) {
      loadTokenRate();
      loadBlockRate();
      loadBCGToEthRate();
      loadTokenPerBlockRate();
      
      setTimeLoaded(currentTime);
    }
  };

  return [ loadingToken || loadingBlock || loadingBCGToEth || loadingTokenPerBlock, 
    tokenRate, blockRate, BCGToEthRate, tokenPerBlockRate, 
    errorToken || errorBlock || errorBCGToEth || errorTokenPerBlock,
    reloadIfStale ];
}

export function UseRatesWrapper(WrappedComponent) {
  return function RatesWrapper(props) {
    const [ loading, tokenRate, blockRate, BCGToEthRate, tokenPerBlockRate, error, reloadIfStale ] = useRates();

    return (
      <Spin size="large" spinning={loading}>
        <WrappedComponent {...props} rates={{ loading, tokenRate, blockRate, BCGToEthRate, tokenPerBlockRate, error, reloadIfStale }} />
      </Spin>
    );
  };
}
