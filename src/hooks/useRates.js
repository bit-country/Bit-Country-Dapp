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
    (async () => {
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
    })();
  }, [ setLoading, setTokenRate, setError ]);

  return [ loading, tokenRate, error ];
}

export function useBlockRate() {
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const [ blockRate, setBlockRate ] = useState(0);

  useEffect(() => {
    (async () => {
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
    })();
  }, [ setLoading, setBlockRate, setError ]);

  return [ loading, blockRate, error ];
}

export default function useRates() {
  const [ loadingToken, tokenRate, errorToken ] = useTokenRate();
  const [ loadingBlock, blockRate, errorBlock ] = useBlockRate();

  return [ loadingToken || loadingBlock, tokenRate, blockRate, errorToken || errorBlock ];
}

export function UseRatesWrapper(WrappedComponent) {
  return function RatesWrapper(props) {
    const [ loading, tokenRate, blockRate, error ] = useRates();

    return (
      <Spin size="large" spinning={loading}>
        <WrappedComponent {...props} rates={{ loading, tokenRate, blockRate, error }} />
      </Spin>
    );
  };
}
