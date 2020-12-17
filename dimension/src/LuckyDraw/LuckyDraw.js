/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Button, Col, Row, InputNumber } from "antd";
import CurrencyIcon from "../../../src/assets/currency-icon/BCG_icon.png";
import "antd/dist/antd.css";
import "./LuckyDraw.style.css";
import Spinner from "../../../src/components/Spinner";
const appId = document.getElementById("smartasset-app").getAttribute("app-id");

export default function LuckyDraw() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    hasResult: false,
    message: "",
    wonPrize: null,
  });

  useEffect(() => {
    window.addEventListener("txPending", result => {
      setResult({
        hasResult: true,
        message: <><p>Transaction is pending...</p><Spinner /></>,
        wonPrize: 0
      });
    })

    window.addEventListener("txFailedOrCancelled", result => {
      setResult({
        hasResult: true,
        message: "Transaction failed or cancelled",
        wonPrize: 0
      });

      window.setTimeout(() => {
        setResult({
          hasResult: false,
          message: "",
          wonPrize: 0
        });
      }, 1000);
    });

    window.addEventListener("LuckyDraw", result => {
      debugger;
      if (result.detail.WinnerFail) {
        setResult({
          hasResult: true,
          message: "Sorry, the lucky number was: " + result.detail.LuckyNumber,
          wonPrize: 0
        });
      } else if (result.detail.WinnerPicked) {
        setResult({
          hasResult: true,
          message: "Congratulations! You won!",
          wonPrize: 0
        });
      }
      
    });
  }, []);

  const onDraw = () => {
    const draw = Math.floor(Math.random() * Math.floor(2));
    const wonPrize = draw === 1;

    window.parent.dispatchEvent(
      new CustomEvent(appId, {
        detail: { appType: "luckydraw", appParams: { value: amount } },
      })
    );

    setResult({
      hasResult: true,
      message:
        "You can confirm or cancel the transaction by closing the window.",
      wonPrize,
    });
  };
  const renderDrawOption = () => {
    return (
      <>
        <h1
          style={{ fontSize: "2.2em", fontWeight: "300", textAlign: "center" }}
        >
          What is the lucky number?
        </h1>
        <Row className="drawCardsContainer">
          <Col>
            <div className="drawCard">
              <div className="drawCard-amount">
                <Row>
                  <Col style={{ textAlign: "center" }} span={24}>
                    <InputNumber
                      autoFocus
                      onChange={(value) => setAmount(value)}
                      style={{
                        fontSize: "1.1em",
                        fontWeight: "800",
                        height: "inherit",
                        width: "auto",
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
        <div style={{ textAlign: "center", paddingTop: "5%" }}>
          <Button
            disabled={amount === "" && !loading}
            className="draw-btn"
            onClick={() => onDraw(amount)}
            type="primary"
          >
            Best Of Luck!
          </Button>
        </div>
      </>
    );
  };
  const renderResult = () => {
    return (
      <>
        <h1
          style={{
            fontSize: "4em",
            letterSpacing: "1px",
            fontWeight: "300",
            padding: "5%",
            textAlign: "center",
          }}
        >
          {result.message}
        </h1>
      </>
    );
  };
  return (
    <div>
      <div>
        <h2
          style={{ fontSize: "2em", fontWeight: "bold", letterSpacing: "1px" }}
        >
          Lucky Draw
        </h2>
        <p style={{ fontSize: "1.2em", fontStyle: "italic" }}>
          Enter into the draw with Bit.Country Gold!
        </p>
        <br />
      </div>
      <div>{result.hasResult ? renderResult() : renderDrawOption()}</div>
    </div>
  );
}
