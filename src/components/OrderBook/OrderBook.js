import React, { useState } from "react";
import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Notification from "../../utils/Notification";
import { CountryConnect } from "../HOC/Country/CountryWrapper";
import { AuthConnect } from "../HOC/Auth/AuthContext";
import { FormattedMessage } from "react-intl";
import "./OrderBook.style.css";
import { useCountryToken } from "../../hooks/useOrders";
import Logging from "../../utils/Logging";
import OrderTable from "./OrderTable";
import ConfirmBox from "./ConfirmBox";
import OrderBookPage from "./OrderBookPage";
import OrderPlaceForm from "./OrderPlaceForm";

const ORDER_TYPE = {
  BUY: 0,
  SELL: 1,
};

var record = {};
var message = "";
var title = "";
var confirm = undefined;

function OrderBook(props) {
  const [ showConfirm, setShowConfirm ] = useState(false);
  const [ showPlaceForm, setShowPlaceForm ] = useState(false);
  const [ updateFlag, setUpdateFlag ] = useState(false);
  const { user, country, page } = props;
  const countryToken = useCountryToken(props.country.id);

  function handleAccept(r) {
    if (showConfirm) {
      return;
    }
    record = r;
    const { quantity, bcgPrice } = record;
    const { symbol } = countryToken.symbol;

    if (record.type === ORDER_TYPE.BUY) {
      title = (
        <FormattedMessage
          id="market.order.accept.buy.title"
          values={{ symbol }}
        />
      );
      message = (
        <FormattedMessage
          id="market.order.accept.buy.message"
          values={{ quantity, symbol, bcgPrice }}
        />
      );
    } else if (record.type === ORDER_TYPE.SELL) {
      title = (
        <FormattedMessage
          id="market.order.accept.sell.title"
          values={{ symbol }}
        />
      );
      message = (
        <FormattedMessage
          id="market.order.accept.sell.message"
          values={{ quantity, symbol, bcgPrice }}
        />
      );
    }

    setShowConfirm(true);
    confirm = acceptOrder;
  }

  // const checklimit = async (type, bcgPrice, token, quantity, userId) => {
  //   let result = { ok: true, message: "" };

  //   try {
  //     switch (type) {
  //       case ORDER_TYPE.BUY:
  //         {
  //           //accept sell token order, should have enough BCG
  //           const res = await fetchAPI(
  //             `${endpoints.GET_TOKEN_BALANCE}?userId=${userId}&tokenId`
  //           );

  //           if (!res?.isSuccess) {
  //             result.ok = false;
  //             result.message = "Cannot get your current balance of BCG";
  //           } else if (res.isSuccess && res.balance < bcgPrice) {
  //             result.ok = false;
  //             result.message = `Your balance ${res.balance} cannot afford exchange`;
  //           }
  //         }

  //         break;
  //       case ORDER_TYPE.SELL:
  //         {
  //           //accept buy token order,your account should have enough TKN to sell
  //           const res = await fetchAPI(
  //             `${endpoints.GET_TOKEN_BALANCE}?userId=${userId}&tokenId=${token.id}`
  //           );

  //           if (!res?.isSuccess) {
  //             result.ok = false;
  //             result.message = `Cannot get your current balance of ${token.symbol}`;
  //           } else if (res.isSuccess && res.balance < quantity) {
  //             result.ok = false;
  //             result.message = `Your balance ${res.balance} cannot afford exchange`;
  //           }
  //         }

  //         break;
  //     }
  //   } catch (error) {
  //     result.ok = false;
  //     result.message = "Can not get your balance";
  //   }

  //   return result;
  // };

  const acceptOrder = async () => {
    const { bcgPrice, quantity, id, type } = record;
    const { user } = props;

    const obj = {
      userId: user.id,
      orderId: id,
      type: type === ORDER_TYPE.BUY ? "Buy" : "Sell",
    };

    try {
      const result = await this.checklimit(
        type,
        bcgPrice,
        countryToken,
        quantity,
        user.id
      );

      if (!result.ok) {
        Notification.displayErrorMessage(result.message);

        return;
      }

      const response = await fetchAPI(`${endpoints.ACCEPT_ORDER}`, "post", obj);

      if (!response?.isSuccess) {
        throw Error(response.message);
      }

      Notification.displaySuccessMessage("Exchange successfully");

      setShowConfirm(false);
      setUpdateFlag(!updateFlag);
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        "Error while accepting the market order"
      );
    }
  };

  const handleClose = record => {
    if (showConfirm) {
      return;
    }

    const { bcgPrice, quantity, type } = record;
    const { symbol } = countryToken.symbol;

    switch (type) {
      case ORDER_TYPE.SELL:
        message = (
          <FormattedMessage
            id="market.order.close.sell.message"
            values={{
              quantity,
              symbol,
              bcgPrice,
            }}
          />
        );

        title = <FormattedMessage id="market.order.close.sell.title" />;

        break;
      case ORDER_TYPE.BUY:
        message = (
          <FormattedMessage
            id="market.order.close.buy.message"
            values={{
              quantity,
              symbol,
              bcgPrice,
            }}
          />
        );

        title = <FormattedMessage id="market.order.close.buy.title" />;

      break;
    }

    setShowConfirm(true);
    confirm = closeFun;
  };

  async function closeFun() {
    try {
      const obj = {
        userId: user.id,
        orderId: record.id,
        type: record.type === ORDER_TYPE.BUY ? "Buy" : "Sell",
      };

      const response = await fetchAPI(endpoints.CLOSE_ORDER, "post", obj);

      if (!response?.isSuccess) {
        throw Error(response.message);
      }

      Notification.displaySuccessMessage(
        <FormattedMessage id="market.order.notification.closed" />
      );

      setShowConfirm(false);
      setUpdateFlag(!updateFlag);
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        <FormattedMessage id="market.order.notification.closed.error" />
      );
    }
  }

  const handleSubmitted = async result => {
    setShowPlaceForm(false);

    if (result) {
      //this.forceUpdate();
      setUpdateFlag(!updateFlag);
    }
  };

  const showPlaceOrder = () => {
    if (!showConfirm) {
      setShowPlaceForm(true);
    }
  };

  const cancelPlaceOrder = () => {
    setShowPlaceForm(false);
  };

  const cancelConfirm = () => {
    setShowConfirm(false);
  };

  return (
    <div>
      {!page && (
        <OrderTable
          standardCurrency="BCG"
          closeOrder={handleClose}
          acceptOrder={handleAccept}
          user={user}
          showPlaceOrder={showPlaceOrder}
          countryToken={countryToken}
          updateFlag={updateFlag}
        />
      )}
      {page && (
        <OrderBookPage
          standardCurrency="BCG"
          closeOrder={handleClose}
          acceptOrder={handleAccept}
          user={user}
          showPlaceOrder={showPlaceOrder}
          updateFlag={updateFlag}
          countryToken={countryToken}
        />
      )}

      <ConfirmBox
        visible={showConfirm}
        content={message}
        title={title}
        onConfirm={confirm}
        onCancel={cancelConfirm}
      />
      <OrderPlaceForm
        visible={showPlaceForm}
        country={country}
        token={countryToken}
        standardCurrency="BCG"
        submitted={handleSubmitted}
        onCancel={cancelPlaceOrder}
      />
    </div>
  );
}

export default AuthConnect(CountryConnect(OrderBook, true));
