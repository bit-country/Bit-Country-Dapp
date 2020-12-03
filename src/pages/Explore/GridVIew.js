/* eslint-disable */
import { Col, Pagination, Row } from "antd";
import React, { useEffect, useState } from "react";
import CardColumn from "../../components/CardColumn/CardColumn";
import CountryCard from "../../components/CountryCard";
import queryString from "query-string";
import "./Explore.styles.css";

const GridView = ({
  data,
  loading,
  totalResult,
  onPageChange,
  setPagination,
  pagination,
}) => {

  const countries = data.map((country) => (
    <CardColumn key={country.id}>
      <CountryCard key={country.id} country={country} />
    </CardColumn>
  ));

  useEffect(() => {
    const page =
      Math.ceil(
        queryString.parse(location.search)?.skip /
          queryString.parse(location.search)?.limit
      ) + 1;
   
    const newState = {
      ...pagination,
      ...totalResult,
      pageSize: queryString.parse(location.search)?.limit || 12,
      currentPage: Number.isNaN(page) ? 1 : page,
    };
    setPagination(newState);
  }, []);
  return (
    <>
      {countries.length === 0 ? (
        <p
          style={{
            color: "grey",
            fontSize: "2em",
            textAlign: "center",
            fontWeight: "600",
            opacity: "0.5",
            padding: "10%",
          }}
        >
          {loading ? null : "Start Exploring Countries"}
        </p>
      ) : (
        <div className="countries">{countries}</div>
      )}
      {countries.length > 0 ? (
        <Row justify="end">
          <Col style={{ float: "right", padding: "2%" }}>
            <Pagination
              onChange={(current) => onPageChange(current)}
              pageSize={pagination.pageSize}
              current={pagination.currentPage}
              total={totalResult}
            />
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default GridView;
