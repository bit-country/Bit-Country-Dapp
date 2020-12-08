/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Notification from "../../utils/Notification";
import { CountryConnect } from "../HOC/Country/CountryWrapper";
import { AuthConnect } from "../HOC/Auth/AuthContext";
import { FormattedMessage } from "react-intl";
import "./OrderBook.style.css";
import Logging from "../../utils/Logging";
import OrderBookBlock from "./OrderBookBlock";
import OrderBookPage from "./OrderBookPage";
import OrderBookGlobal from "./OrderBookGlobal";
import OrderPlaceForm from "./OrderPlaceForm";
import OrderConfirmBox from "./OrderConfirmBox";


const ORDER_TYPE = {
  BUY: 0,
  SELL: 1,
};

var record = {};
var confirm = undefined;
var action = "";
var globalFlag = false;

function OrderBook(props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPlaceForm, setShowPlaceForm] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const { user, page, global } = props;

  const handleAccept = r => {
    if (showConfirm) {
      return;
    }
    record = r;
    action = "accept";
    setShowConfirm(true);
    confirm = acceptOrder;
  };

  const checklimit = async (type, bcgPrice, token, quantity, userId) => {
    let result = { ok: true, message: "" };

    try {
      switch (type) {
        case ORDER_TYPE.BUY:
          {
            //accept sell token order, should have enough BCG
            const res = await fetchAPI(
              `${endpoints.GET_TOKEN_BALANCE}?userId=${userId}&tokenId`
            );

            if (!res?.isSuccess) {
              result.ok = false;
              result.message = "Cannot get your current balance of BCG";
            } else if (res.isSuccess && res.balance < bcgPrice) {
              result.ok = false;
              result.message = `Your balance ${res.balance} cannot afford exchange`;
            }
          }

          break;
        case ORDER_TYPE.SELL:
          {
            //accept buy token order,your account should have enough TKN to sell
            const res = await fetchAPI(
              `${endpoints.GET_TOKEN_BALANCE}?userId=${userId}&tokenId=${token.id}`
            );

            if (!res?.isSuccess) {
              result.ok = false;
              result.message = `Cannot get your current balance of ${token.symbol}`;
            } else if (res.isSuccess && res.balance < quantity) {
              result.ok = false;
              result.message = `Your balance ${res.balance} cannot afford exchange`;
            }
          }

          break;
      }
    } catch (error) {
      result.ok = false;
      result.message = "Can not get your balance";
    }

    return result;
  };

  const acceptOrder = async record => {

    const { user } = props;

    const obj = {
      userId: user.id,
      orderId: record.id,
      type: record.type === ORDER_TYPE.BUY ? "Buy" : "Sell",
    };

    try {
      const result = await checklimit(
        record,
        user.id
      );

      if (!result.ok) {
        Notification.displayErrorMessage(result.message);
        return;
      }

      const response = await fetchAPI(`${endpoints.ACCEPT_ORDER}`, "post", obj);

      if (!response?.isSuccess) {
        if (response?.message || response?.json?.message) {
          Notification.displayErrorMessage(
            <FormattedMessage id={response.message || response.json.message} />
          );
  
          throw Error(response.message || response.json.message);
        }

        // TODO Add default error message
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

  async function closeFun() {
    try {
      const obj = {
        userId: user.id,
        orderId: record.id,
        type: record.type === ORDER_TYPE.BUY ? "Buy" : "Sell",
      };

      const response = await fetchAPI(endpoints.CLOSE_ORDER, "post", obj);

      if (!response?.isSuccess) {
        if (response?.message || response?.json?.message) {
          Notification.displayErrorMessage(
            <FormattedMessage id={response.message || response.json.message} />
          );
  
          throw Error(response.message || response.json.message);
        }

        // TODO Add default error message
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

  const showPlaceOrder = value => {
    if (!showConfirm) {
      setShowPlaceForm(true);
      if (value)
        globalFlag = true;
      else
        globalFlag = false;
    }
  };

  const cancelPlaceOrder = () => {
    setShowPlaceForm(false);
  };

  const cancelConfirm = () => {
    setShowConfirm(false);
  };

  const handleClose = () => {
    // TODO: update to use real handle close.
  };

  return (
    <div>
      {(!page && !global) && (
        <OrderBookBlock
          standardCurrency="BCG"
          closeOrder={handleClose}
          acceptOrder={handleAccept}
          user={user}
          showPlaceOrder={showPlaceOrder}
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
        />
      )}
      {
        global && (
          <OrderBookGlobal
            standardCurrency="BCG"
            user={user}
            closeOrder={handleClose}
            acceptOrder={handleAccept}
            showPlaceOrder={showPlaceOrder}
            updateFlag={updateFlag} />)
      }


      <OrderConfirmBox
        visible={showConfirm}
        record={record}
        action={action}
        onConfirm={confirm}
        onCancel={cancelConfirm}
      />
      <OrderPlaceForm
        globalFlag={globalFlag}
        visible={showPlaceForm}
        standardCurrency="BCG"
        submitted={handleSubmitted}
        onCancel={cancelPlaceOrder}
      />
    </div>
  );
}

export default AuthConnect(CountryConnect(OrderBook, true));
