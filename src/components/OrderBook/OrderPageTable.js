import { Table, Button } from "antd";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useOrders } from "../../hooks/useOrders";

const { Column } = Table;

export default function OrderPageTable(props) {
  const [ pagination, setPagination ] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });

  const {
    user,
    standardCurrency,
    type,
    acceptOrder,
    closeOrder,
    countryToken,
    updateFlag,
  } = props;

  const currency = countryToken ? countryToken.symbol : "";

  const [ sellOrders, buyOrders, loading ] = useOrders(
    countryToken ? countryToken.id : "",
    updateFlag,
    type,
    pagination
  );

  const orders = type === "Sell" ? sellOrders : buyOrders;

  const titleColor = props.type === "Buy" ? "#598600" : "#c5004c";
  const className = props.type === "Buy" ? "buyColumn" : "sellColumn";

  const handleTableChange = newPagination => {
    const obj = {
      ...pagination,
      ...newPagination,
    };

    setPagination(obj);
  };

  const columnActionTitle = (
    <FormattedMessage id="market.order.columns.action" />
  );

  const columnPriceTitle = (
    <FormattedMessage
      id="market.order.columns.price"
      values={{ symbol: standardCurrency }}
    />
  );
  const colunmQuantityTitle = (
    <FormattedMessage
      id="market.order.columns.quantity"
      values={{ symbol: currency }}
    />
  );

  return (
    <div>
      <Table
        tableLayout="fixed"
        dataSource={orders.orders}
        title={() => (
          <h3 style={{ color: titleColor, textAlign: "center" }}>
            {type === "Buy" ? (
              <FormattedMessage id="market.order.table.section.buy" />
            ) : (
              <FormattedMessage id="market.order.table.section.sell" />
            )}
          </h3>
        )}
        loading={loading}
        rowKey={record => record.id}
        pagination={{
          ...pagination,
          showTotal: () => `total ${orders.total} orders`,
          total: orders.total,
        }}
        onChange={handleTableChange}
        scroll={{ y: 500 }}
      >
        <Column
          title={colunmQuantityTitle}
          dataIndex="quantity"
          key="quantity"
          className={className}
          align="center"
        />

        <Column
          title={columnPriceTitle}
          dataIndex="bcgPrice"
          key="bcgPrice"
          className={className}
          align="center"
        />

        <Column
          align="center"
          title={columnActionTitle}
          className={className}
          key="action"
          render={(text, record) => (
            <div size="middle">
              {record.investor && record.investor.id === user.id ? (
                <Button type="primary" onClick={() => closeOrder(record)}>
                  {" "}
                  <FormattedMessage id="market.order.table.close" />
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    acceptOrder(record);
                  }}
                >
                  {" "}
                  <FormattedMessage id="market.order.table.accept" />
                </Button>
              )}
            </div>
          )}
        />
      </Table>
    </div>
  );
}
