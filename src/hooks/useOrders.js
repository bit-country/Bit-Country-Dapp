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

          Notification.displayErrorMessage(
            <FormattedMessage id="market.order.notification.fetch.token.error" />
          );
        }
      })();
    }
  }, [ countryId ]);

  return countryToken;
}

export function useTokens(){
  const [ tokens, setTokens ] = useState([]);
 
  useEffect(()=>{
    ( async () => {
      const response = await fetchAPI(`${ENDPOINTS.GET_ALL_TOKEN}`);

      if(!response.isSuccess){
        Notification.displayErrorMessage(
          <FormattedMessage id="market.order.notification.fetch.token.error" />
        );
      }
      setTokens(response.tokens);
    })();
  }, []);

  return tokens  ;
}

export function useTokenById(tokenId){
  const [ token, setToken ] = useState({});

  useEffect(()=>{
    if(tokenId){
      (async () => {
        const response = await fetchAPI(
          `${ENDPOINTS.GET_TOKEN_BY_ID}?tokenId=${tokenId}`
        );

        if(!response.isSuccess) {
          Notification.displayErrorMessage(
            <FormattedMessage id="market.order.notification.fetch.token.error" />
          );
        } 
        setToken(response.token);
      })();
    }
  }, [ tokenId ]);
  
  return token;
}



export function useOrders(countryId, updateFlag, type, pagination) {
  const [ loading, setLoading ] = useState(true);
  const [ sellOrders, setSellOrders ] = useState([]);
  const [ buyOrders, setBuyOrders ] = useState([]);

  useEffect(() => {
    if (countryId) {
      if (pagination && type) {
        const { current, pageSize } = pagination;

        if (type === "Buy") {
          const requestBuyOrder = fetchAPI(
            `${ENDPOINTS.GET_BUY_ORDERS}?countryId=${countryId}&current=${current}&pageSize=${pageSize}`
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
            `${ENDPOINTS.GET_SELL_ORDERS}?countryId=${countryId}&current=${current}&pageSize=${pageSize}`
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
          `${ENDPOINTS.GET_BUY_ORDERS}?countryId=${countryId}`
        );

        const requestSellOrder = fetchAPI(
          `${ENDPOINTS.GET_SELL_ORDERS}?countryId=${countryId}`
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
  }, [ updateFlag, countryId, type, pagination ]);
  return [ sellOrders, buyOrders, loading ];
}


export function useGlobalOrders( updateFlag, pagination, filterObj) {
  const [ loading, setLoading ] = useState(true);
  const [ orders, setOrders ] = useState([]);
  const [ total, setTotal ] = useState(undefined);
  const { current, pageSize } = pagination;
  const { userId , tokenId, type } = filterObj;
 
  useEffect(() => {
    const queryStr = (userId ? `&userId=${filterObj.userId}` : "") 
    + ( tokenId ? `&tokenId=${filterObj.tokenId}` : "" )
    + ( type? `&type=${filterObj.type}` : "");

    setLoading(true);
    const getOrders = fetchAPI(
      `${ENDPOINTS.GET_GLOBAL_ORDERS}?current=${current}&pageSize=${pageSize}${queryStr}`);

    Promise.resolve(getOrders)
      .then(o => {
        setOrders(o.orders);
        setTotal(o.total);
        setLoading(false);
      })
      .catch(() => {
        Notification.displayErrorMessage(
          <FormattedMessage id="market.order.notification.fetch.error" />
        );
        setLoading(false);
      });
  }, [ updateFlag, pagination,filterObj ]);
  return [ orders,  total,  loading ];
}
