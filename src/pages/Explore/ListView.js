/* eslint-disable react/display-name */
import { Link } from "@reach/router";
import { Button, Table } from "antd";
import React from "react";

const ListView = ({ data, pagination, totalResult, onPageChange }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      render: (_, country) => (
        <div>
          {" "}
          <span>{country.name}</span> <br />
          <span style={{ fontStyle: "italic" }}>
            Owned By <b>{country.president}</b>
          </span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "40%",
    },
    {
      title: "Population",
      dataIndex: "population",
      key: "population",
      width: "10%",
    },

    {
      title: "Blocks",
      dataIndex: "block",
      key: "block",
      width: "10%",

      render: (_, country) => <span>{country.blocks?.length || 0}</span>,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "data.token.symbol",
      width: "10%",

      render: (_, country) => (
        <span>
          {country.token?.totalSupply} {country.token?.symbol}
        </span>
      ),
    },
    {
      width: "10%",
      render: (_, country) => (
        <Link to={country.uniqueId ? `/c/${country.uniqueId}` : ""}>
          <Button>View</Button>
        </Link>
      ),
    },
  ];

  return (
    <Table
      pagination={{
        pageSize: pagination.pageSize,
        current: pagination.currentPage,
        total: totalResult,
        onChange: current => onPageChange(current),
      }}
      rowKey="name"
      dataSource={data}
      columns={columns}
    />
  );
};

export default ListView;
