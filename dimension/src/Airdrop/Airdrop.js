/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "antd";
import CurrencyIcon from "../../../src/assets/currency-icon/BCG_icon.png";
import "antd/dist/antd.css";
import { useCallback } from "react";
import "./Airdrop.style.css";
import Spinner from "../../../src/components/Spinner";

const appId = document.getElementById("smartasset-app").getAttribute("app-id");

const STATES = {
  DEFAULT: 0,
  SUBMITTED: 1,
  PENDING: 2,
  FAILED: 3,
  COMPLETED: 4
}

export default function Airdrop() {
  const [dispensing, setDispensing] = useState(STATES.DEFAULT);

  const handleDispense = useCallback(value => {
    window.parent.dispatchEvent(new CustomEvent(appId, {detail: { appType: "airdrop", appParams: { value }}}));

    setDispensing(STATES.SUBMITTED);
  }, []);

  useEffect(() => {
    window.addEventListener("txPending", result => {
      setDispensing(STATES.PENDING);
    })

    window.addEventListener("txFailedOrCancelled", result => {
      setDispensing(STATES.FAILED);

      window.setTimeout(() => {
        setDispensing(STATES.DEFAULT);
      }, 1000);
    });

    window.addEventListener("Airdrop", result => {
      setDispensing(STATES.COMPLETED);
    });
  }, []);

  
  switch (dispensing) {
    case STATES.DEFAULT:
      return (
        <>
          <div>
            <h2
              className="header"
            >
              Airdrop
            </h2>
            <p className="message">
              There's a storm rolling in! How much do you wish to dispense?
            </p>
            <br />
          </div>
          <div className="container">
            <Card title="Mist" className="item" bordered={false} onClick={() => handleDispense(100)}>
              <h3>100</h3>
            </Card>
            <Card title="Drizzle" className="item" bordered={false} onClick={() => handleDispense(200)}>
              <h3>200</h3>
            </Card>
            <Card title="Storm" className="item" bordered={false} onClick={() => handleDispense(1000)}>
              <h3>1000</h3>
            </Card>
          </div>
        </>
      );
    
    case STATES.SUBMITTED:
      return (
        <div>
          <h2
            className="header"
          >
            Airdrop request submitted...
          </h2>
          <p>Sign the transaction to start, cancel if you change your mind.</p>
        </div>
      );

    case STATES.PENDING:
      return (
        <div>
          <h2
            className="header"
          >
            Transaction pending...
          </h2>
          <Spinner />
        </div>
      );

    case STATES.FAILED:
      return (
        <div>
          <h2
            className="header"
          >
            Transaction failed or cancelled.
          </h2>
        </div>
      );

    case STATES.COMPLETED:
      return (
        <div>
          <h2
            className="header"
          >
            Success!
          </h2>
        </div>
      );
  }
}
