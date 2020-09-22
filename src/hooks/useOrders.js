import React from "react";
import { fetchAPI } from "../utils/FetchUtil";
import { useState, useEffect } from "react";
import ENDPOINTS from "../config/endpoints";
import { FormattedMessage } from "react-intl";
import Notification from "../utils/Notification";
import Logging from "../utils/Logging";

export function useCountryToken(countryId) {
  const [ countryToken, setCountryToken ] = useState({});

  useEffect(() => {
    if (countryId) {
      (async () => {
        try {
          const response = await fetchAPI(
            `${ENDPOINTS.GET_COUNTRY_TOKEN}?countryId=${countryId}`
          );
  
          if (!response?.isSuccess) {
            throw Error("Error while retrieving country token details");
          }
  
          setCountryToken(response.token);
        } catch (error) {
          Logging.Error(error);
        }
      })();
    }
  }, [ countryId ]);

  return countryToken;
}

export function useOrders(countryTokenId, updateFlag, type, pagination) {
  const [ loading, setLoading ] = useState(false);
  const [ sellOrders, setSellOrders ] = useState([]);
  const [ buyOrders, setBuyOrders ] = useState([]);

  useEffect(() => {
    if (countryTokenId) {
      setLoading(true);

      if (pagination && type) {
        const { current, pageSize } = pagination;

        if (type === "Buy") {
          const requestBuyOrder = fetchAPI(
            `${ENDPOINTS.GET_BUY_ORDERS}?tokenId=${countryTokenId}&current=${current}&pageSize=${pageSize}`
          );

          Promise.resolve(requestBuyOrder)
            .then(buyOrders => {
              setBuyOrders(buyOrders);
              setLoading(false);
            })
            .catch(() => {
              Notification.displayErrorMessage(
                <FormattedMessage id="market.order.notification.fetch.error" />
              );

              setLoading(false);
            });
        } else if (type === "Sell") {
          const requestSellOrder = fetchAPI(
            `${ENDPOINTS.GET_SELL_ORDERS}?tokenId=${countryTokenId}&current=${current}&pageSize=${pageSize}`
          );

          Promise.resolve(requestSellOrder)
            .then(sellOrders => {
              setSellOrders(sellOrders);
              setLoading(false);
            })
            .catch(() => {
              Notification.displayErrorMessage(
                <FormattedMessage id="market.order.notification.fetch.error" />
              );

              setLoading(false);
            });
        } else {
          Notification.displayErrorMessage(
            <FormattedMessage id="market.order.notification.type.error" />
          );

          setLoading(false);
        }
      } else {
        const requestBuyOrder = fetchAPI(
          `${ENDPOINTS.GET_BUY_ORDERS}?tokenId=${countryTokenId}`
        );

        const requestSellOrder = fetchAPI(
          `${ENDPOINTS.GET_SELL_ORDERS}?tokenId=${countryTokenId}`
        );

        Promise.all([ requestBuyOrder, requestSellOrder ])
          .then(function ([ buyOrders, sellOrders ]) {
            setBuyOrders(buyOrders);
            setSellOrders(sellOrders);
            setLoading(false);
          })
          .catch(function () {
            Notification.displayErrorMessage(
              <FormattedMessage id="market.order.notification.fetch.error" />
            );

            setLoading(false);
          });
      }
    }
  }, [ updateFlag, countryTokenId, type, pagination ]);
  return [ sellOrders, buyOrders, loading ];
}
