/* eslint-disable  react/display-name  */
import React from "react";
import { Table } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: text => <a>{text}</a>,
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Percent",
    dataIndex: "percent",
    key: "percent",
    render: text => <a>{text}%</a>,
  },
];
const Ownership = ({ ownership }) => {
  return (
    <Table style={{ width: "100%" }} columns={columns} dataSource={ownership} />
  );
};

export default Ownership;
