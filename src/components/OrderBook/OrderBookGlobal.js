import React, { useState } from "react";
import { Row, Col, Select, Checkbox, Button, Table } from "antd";
import "./OrderBook.style.css";
import { useTokens, useGlobalOrders } from "../../hooks/useOrders";
import { FormattedMessage } from "react-intl";

const { Column } = Table;
const { Option } = Select;

function OrderBookGlobal(props) {
  const  {  updateFlag, acceptOrder, closeOrder, user, showPlaceOrder } = props;
  const [ pagination, setPagination ] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });
  const [ filterObj, setFilterObj ] = useState({ userId: "", tokenId: "", type: "" });
  const  tokens  = useTokens();
  const [ orders, total, loading  ] = useGlobalOrders(updateFlag, pagination, filterObj );
  const nTokens = [ { id:"", symbol:"All Token" } ].concat(tokens);



  const onTokenChange = value => {
    const o = Object.assign({}, filterObj, { tokenId: value });
 
    setFilterObj(o);
  };
  const onTypeChange = value => {
    const o = Object.assign({}, filterObj, { type: value });

    setFilterObj(o);
  };
  const checkClick = function (e) {
    if (e.target.checked) {
      const o = Object.assign({}, filterObj, { userId : user.id } );

      setFilterObj(o);
    } else {
      const o = Object.assign({}, filterObj, { userId : "" } );

      setFilterObj(o);
    }
  };
  const handleTableChange = newPagination => {
    const obj = {
      ...pagination,
      ...newPagination,
    };

    setPagination(obj);
  };

  const content = nTokens.map(t=>(<Option value={t.id} key={t.id+"1"} >{t.symbol}</Option>));

  return (
    <div className="mainContent">
      <Row className="content-row header">
        <Col span={16} push={4}>
          <h2> <FormattedMessage id="market.order.global.title" /></h2>
        </Col>
      </Row>
      <Row className="content-row">
        <Col span={16} push={4}>
          <span style={{ fontSize: "18px", marginRight: "3%" }}>
            <FormattedMessage id="market.order.global.filter" />
          </span>
          <Select
            showSearch
            style={{ width: 200, marginRight: "2%" }}
            defaultValue=""
            optionFilterProp="children"
            onSelect={onTokenChange}
            filterOption={(input, option) =>{
              
              return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ; }
            }
          >
            {content }
          </Select>
          <Select
            
            style={{ width: 200, marginRight: "2%" }}
            defaultValue=""
            onChange={onTypeChange}
          >
            <Option value=""     key="All">All</Option>
            <Option value="Buy"  key="Buy">Buy</Option>
            <Option value="Sell" key="Sell">Sell</Option>
          </Select>
          <Checkbox onChange={checkClick} style={{ marginRight: "3%" }}>
            Show my orders only
          </Checkbox>
          <Button type="primary" style={{ float: "right" }} onClick={()=>showPlaceOrder(true)}>
            Place a Global Order
          </Button>
        </Col>
      </Row>
      <Row className="content-row">
        <Col span={16} push={4}>
          <Table
            dataSource={orders? orders: []}
            rowKey={record => record.id}
            loading = {loading}
            pagination={{
              ...pagination,
              showTotal: () => `total ${total} orders`,
              total: total,
            }}
            onChange={handleTableChange}
          >
            <Column
              title="Token"
              dataIndex = "tradedToken"
              render={(text ,record)=>{
                return record.tradedToken.symbol;
              }}
              sorter={(a, b) =>a.tradedToken.symbol.localeCompare( b.tradedToken.symbol)}
            />
            <Column
              title="QTY"
              dataIndex = "quantity"
              sorter={(a, b) => a.quantity - b.quantity}
            />
            <Column
              title="BCGPrice"
              dataIndex="bcgPrice"
              sorter={(a, b) => a.bcgPrice - b.bcgPrice}
            />
            <Column title="Type" render={(text, record)=> { return record.type == 1 ? "Sell" : "Buy" ; }} />
            <Column
              title="Action"
              dataIndex = "type"
              render={(text, record) =>
                record.investor && record.investor.id === user.id ? (
                  <Button type="primary" onClick={() => closeOrder(record)}>
                    <FormattedMessage id="market.order.table.close" />
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => {
                      acceptOrder(record);
                    }}
                  >
                    <FormattedMessage id="market.order.table.accept" />
                  </Button>
                ) 
              }
            ></Column>
          </Table>
        </Col>
      </Row>
    </div>
  );
} 

export default OrderBookGlobal ;
