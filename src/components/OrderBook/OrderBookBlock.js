import React from "react";
import { Button, Spin, Skeleton } from "antd";
import { FormattedMessage } from "react-intl";
import { useOrders } from "../../hooks/useOrders";
import { useCountryToken } from "../../hooks/useOrders";
import { CountryConnect } from "../../pages/CountryWrapper";

function OrderBookBlock(props) {
  //(0 = Sell, 1 = Buy)
  const {
    country,
    standardCurrency,
    closeOrder,
    acceptOrder,
    user,
    showPlaceOrder,
    updateFlag,
  } = props;

  const countryToken = useCountryToken(country.id);
  const [ sellOrders, buyOrders, loading ] = useOrders(
    country.id,
    updateFlag
  );

  const currency = countryToken ? countryToken.symbol : "";
  const renderRow = (row, rowClassName) => (
    <div key={row.id} className={`row ${rowClassName}`}>
      <div className="column quantity">{row.quantity}</div>
      <div className="column price">{row.bcgPrice}</div>
      <div className="column action">{renderAction(row)}</div>
    </div>
  );

  const renderAction = row => { 
    if (row.investor && row.investor.id === user.id) {
      return (
        <Button
          onClick={() => closeOrder(row)}
          type="danger"
          ghost
          style={{ width: "70%" }}
        >
          <FormattedMessage id="market.order.table.close" />
        </Button>
      );
    }

    return (
      <Button onClick={() => acceptOrder(row)} type="primary" ghost>
        <FormattedMessage id="market.order.table.accept" />
      </Button>
    );
  };

  return (
    <div id="tableDiv">
      <div className="market-orders">
        <div className="headers">
          <div className="column">
            <FormattedMessage
              id="market.order.columns.quantity"
              values={{ symbol: currency }}
            />
          </div>
          <div className="column">
            <FormattedMessage
              id="market.order.columns.price"
              values={{ symbol: standardCurrency }}
            />
          </div>
          <div className="column" />
        </div>
        <div className="body">
          <div>
            <div className="section buy">
              {loading ? (
                <OrderSkeleton />
              ) : (
                buyOrders.orders?.map(order => renderRow(order, "buy"))
              )}
            </div>
            <div className="section title buy">
              <FormattedMessage id="market.order.table.section.buy" />
            </div>
          </div>

          <div className="section divider" />

          <div>
            <div className="section title sell">
              <FormattedMessage id="market.order.table.section.sell" />
            </div>
            <div className="section sell">
              {loading ? (
                <OrderSkeleton />
              ) : (
                sellOrders.orders?.map(order => renderRow(order, "sell"))
              )}
            </div>
          </div>
        </div>
      </div>

      <Button
        type="primary"
        className="middleCentredButton"
        onClick={()=>showPlaceOrder(false)}
      >
        <FormattedMessage id="market.order.table.place" />
      </Button>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <Spin>
      <Skeleton
        title={{
          width: "100%",
        }}
        paragraph={{
          rows: 2,
          width: [ "100%", "100%" ],
        }}
      />
    </Spin>
  );
}

export default CountryConnect(OrderBookBlock);
