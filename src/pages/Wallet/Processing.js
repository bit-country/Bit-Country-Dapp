import React, { useState, useEffect } from "react";
import { Icon } from "antd";
import { FormattedMessage } from "react-intl";
import { fetchAPI } from "../../utils/FetchUtil";
import Notification from "../../utils/Notification";
import ENDPOINTS from "../../config/endpoints";
import { navigate } from "@reach/router";
import "./Processing.styles.css";
import Logging from "../../utils/Logging";


function Processing({ location }) {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isError, setIsError ] = useState(false);
  
  const txTran = location && location.state && location.state.txTran;
  
  useEffect(() => {
    if (!txTran) {
      return;
    }

    (async function() {
      try {
        const response = await fetchAPI(
          `${ENDPOINTS.PROCESS_BCG}?txTran=${txTran}`,
          "POST"
        );
    
        if (!response?.isSuccess) {
          throw Error("Error while processing BCG purchase");
        }
    
        Notification.displaySuccessMessage(
          <FormattedMessage
            id="wallet.bcg.buy.notification.success"
          />
        );

        navigate("/wallet/balance");
      } catch (error) {
        Logging.Error(error);

        Notification.displayErrorMessage(
          <FormattedMessage
            id="wallet.bcg.buy.notification.failure"
          />
        );

        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [ setIsLoading, setIsError, location ]);

  if (!txTran) {
    Notification.displayErrorMessage(
      <FormattedMessage
        id="wallet.bcg.buy.notification.failure"
      />
    );

    return false;
  }

  return (
    <div
      id="processing"
    >
      {isLoading &&
        <Icon 
          type="loading" 
          className="loading"
        />
      }
      <h2>
        {isError ? (
          <FormattedMessage
            id="wallet.bcg.processing.error"
          />
        ) : (
          <FormattedMessage
            id="wallet.bcg.processing"
          />
        )}
      </h2>
    </div>
  );
}

export default Processing;
