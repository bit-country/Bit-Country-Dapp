import React, { useEffect, useState, useCallback } from "react";
import { Button } from "antd";
import { FormattedMessage } from "react-intl";
import "./index.css";
import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Logging from "../../utils/Logging";

export default function BlockSubscriber({ countryId, blockId }) {
  const [ subscriptionStatus, setSubscriptionStatus ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    if (blockId) {
      (async () => {
        try {
          setLoading(true);
  
          const response = await fetchAPI(
            `${endpoints.GET_SUBSCRIBED_TO_BLOCK}?countryId=${countryId}&blockId=${blockId}`
          );
  
          if (!response?.isSuccess) {
            throw Error("Error while retrieving subscription status");
          }
  
          setSubscriptionStatus(response.isSubscribed);
          setLoading(false);
        } catch(error) {
          Logging.Error(error);
        }
      })();
    }
  }, [ blockId, setSubscriptionStatus, setLoading ]);

  const handleSubscribe = useCallback(async () => {
    if (!blockId) {
      Logging.Error(new Error("Error while subscribing. Block unique ID is missing"));

      return;
    }

    try {
      setLoading(true);

      const response = await fetchAPI(
        `${endpoints.SUBSCRIBE_TO_BLOCK}?countryId=${countryId}&blockId=${blockId}`,
        "POST"
      );

      if (!response?.isSuccess) {
        throw Error("Error while subscribing to block");
      }

      setSubscriptionStatus(true);
      setLoading(false);
    } catch(error) {
      Logging.Error(error);
    }
  }, [ blockId, setSubscriptionStatus ]);

  const handleUnsubscribe = useCallback(async () => {
    if (!blockId) {
      Logging.Error(new Error("Error while subscribing. BlockDetail's unique ID is missing"));
      
      return;
    }

    try {
      setLoading(true);

      const response = await fetchAPI(
        `${endpoints.UNSUBSCRIBE_FROM_BLOCK}?countryId=${countryId}&blockId=${blockId}`,
        "POST"
      );

      if (!response?.isSuccess) {
        throw Error("Error while unsubscribing from block");
      }

      setSubscriptionStatus(false);
      setLoading(false);
    } catch(error) {
      Logging.Error(error);
    }
  }, [ blockId, setSubscriptionStatus ]);

  return (
    <div className="block-subscription">
      {subscriptionStatus ? (
        <Button 
          type="primary"
          onClick={handleUnsubscribe}
          loading={loading}
        >
          {!loading && (
            <span>
              <FormattedMessage
                id="country.block.unsubscribe"
              />
            </span>
          )} 
        </Button>
      ) : (
        <Button 
          type="primary"
          onClick={handleSubscribe}
          loading={loading}
        >
          {!loading && (
            <span>
              <FormattedMessage
                id="country.block.subscribe"
              />
            </span>
          )} 
        </Button>
      )}
    </div>
  );
}
