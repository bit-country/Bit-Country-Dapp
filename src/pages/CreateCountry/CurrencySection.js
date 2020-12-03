import React, { useCallback } from "react";
import { Row, Col, Input, InputNumber } from "antd";
import { FormattedMessage } from "react-intl";

export default function CurrencySection({
  name,
  symbol,
  totalSupply,
  backingBCG,
  onInputChange,
}) {
  const handleSupplyChange = useCallback(value => {
    onInputChange({ target: { name: "totalSupply", value } });
  });

  const handleBackingChange = useCallback(value => {
    onInputChange({ target: { name: "backingBCG", value } });
  });

  return (
    <>
      <div className="field">
        <label>Name</label>
        <p className="label-explaination">
          Give a name to your currency. This is the friendly name of your
          currency.
        </p>
        <Input
          placeholder="e.g MyCountryToken"
          name="currencyName"
          onChange={onInputChange}
          value={name}
          type="text"
          size="large"
        />
      </div>
      <div className="field">
        <label>Symbol/Ticker</label>
        <p className="label-explaination">
          3-4 character ticker. The ticker is the trading name for your currency
          on the Whenua exchange.
        </p>
        <div>
          <Input
            id="abbr"
            minLength={3}
            maxLength={4}
            name="currencySymbol"
            onChange={onInputChange}
            value={symbol}
            type="text"
            size="large"
          />
        </div>
        <div className="field">
          <label>Total Supply</label>
          <p className="label-explaination">
            This is the total amount of your currency put into circulation. Once
            you set the amount, it can’t be changed. You can create up to 1
            million and as little as 1k.
          </p>
          <Row type="flex" align="middle">
            <Col>
              <InputNumber
                className="supply"
                maxLength={13}
                formatter={value =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={value => value.replace(/\$\s?|(,*)/g, "")}
                min={1000}
                max={1000000000}
                step={1000}
                name="totalSupply"
                onChange={handleSupplyChange}
                value={totalSupply}
                size="large"
              />
              <a
                className="quickInput"
                onClick={() => handleSupplyChange(100000)}
              >
                100k
              </a>
              <a
                className="quickInput"
                onClick={() => handleSupplyChange(1000000)}
              >
                1mil
              </a>
              <a
                className="quickInput"
                onClick={() => handleSupplyChange(10000000)}
              >
                10mil
              </a>
              <a
                className="quickInput"
                onClick={() => handleSupplyChange(100000000)}
              >
                100mil
              </a>
            </Col>
          </Row>
        </div>
        <div className="field">
          <label>Backing</label>
          <p className="label-explaination">
            You must use BCG to back your currency, must have a minimum value of
            BCG equivalent to $1 USD.
          </p>
          <Row type="flex" align="middle">
            <Col span={21}>
              <InputNumber
                className="supply"
                maxLength={11}
                formatter={value =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={value => value.replace(/\$\s?|(,*)/g, "")}
                min={10}
                max={100000000}
                step={10}
                name="backingBCG"
                onChange={handleBackingChange}
                value={backingBCG}
                size="large"
              />
              <a
                className="quickInput"
                onClick={() => handleBackingChange(totalSupply / 10000)}
              >
                {" "}
                Weak{" "}
              </a>
              <a
                className="quickInput"
                onClick={() => handleBackingChange(totalSupply / 1000)}
              >
                {" "}
                Moderate{" "}
              </a>
              <a
                className="quickInput"
                onClick={() => handleBackingChange(totalSupply / 100)}
              >
                Strong
              </a>
            </Col>
          </Row>
        </div>
        <div className="field">
          <label>Backing strength</label>
          <p className="label-explaination">
            A stronger backing means more initial value.
          </p>
          <Row type="flex" align="middle">
            <Col span={24}>
              {totalSupply / backingBCG >= 10000
                ? "WEAK"
                : totalSupply / backingBCG > 100
                ? "MODERATE"
                : totalSupply / backingBCG > 1
                ? "STRONG"
                : "EXTREMELY STRONG"}
              {": "}

              <FormattedMessage
                id="createCountry.bcgValue"
                values={{
                  symbol: symbol ? symbol.toUpperCase() : "Your Token",
                  bcg: parseFloat((backingBCG / totalSupply).toExponential(2)),
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
