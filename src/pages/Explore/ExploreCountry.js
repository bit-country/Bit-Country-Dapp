/* eslint-disable */
import React, { useState, useEffect } from "react";
import ENDPOINTS from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { Layout, Divider, Button, Spin, Pagination, Row } from "antd";
import { FormattedMessage } from "react-intl";
import "./Explore.styles.css";
import Logging from "../../utils/Logging";
import Notification from "../../utils/Notification";
import SearchFilter from "./SearchFilter";
import GridView from "./GridVIew";
import ListView from "./ListView";
import queryString from "query-string";
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem";
import PageBanner from "../../components/PageBanner";
import Banner from "../../assets/images/explore.jpg";

const ExploreCountry = () => {
  const [filter, updateFilter] = useState();
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [countries, setCountry] = useState([]);
  const [totalResult, setTotalResult] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const initialPagination = {
    pageSize: 12,
    currentPage: 1,
    totalResult: totalResult,
  };
  const [pagination, setPagination] = useState({ ...initialPagination });

  const getQueryString = (target) =>
    Object.keys(target)
      .filter((key) => target[key] !== "" || target[key] !== null)
      .map((v) => `${v}=${target[v]}`)
      .join("&");

  const updateQuery = (pageReset) => {
    if (pageReset) {
      const s = { ...filter };
      delete s.skip;
      delete s.limit;
      updateFilter(s);
      return;
    }
    let searchQuery = getQueryString({ ...filter, ...term });
    if (searchQuery) searchQuery = `?${searchQuery}`;
    setQuery(searchQuery);

    history.pushState("", "", `/explore${searchQuery}`);
  };

  const getCountries = () => {
    searchCountries(`${ENDPOINTS.GET_COUNTRIES}?limit=${12}&skip=${0}`);
  };

  const searchCountries = (url) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setLoading(true);
    const countryEnpoint = url || `${ENDPOINTS.SEARCH_COUNTRIES}${query}`;
    fetchAPI(countryEnpoint).then((res) => {
      if (!res?.isSuccess) {
        Notification.displayErrorMessage(<FormattedMessage id={res.message} />);

        throw Error("Error while searching countries");
      }
      setTotalResult(res.totalResult);
      setCountry(res.countries || []);
      setLoading(false);
    });
  };

  const handleInputChange = ({ target }) => {
    const { value } = target;
    setTerm({ term: value });
  };

  const handleSelectChange = (toUpdate) => {
    // reset pagination
    let update = { ...filter, ...toUpdate };
    delete update.skip;
    delete update.limit;
    updateFilter(update);
  };

  const onPageChange = (current) => {
    setPagination({ ...pagination, currentPage: current });
    const { pageSize } = pagination;
    updateFilter({
      ...filter,
      skip: (current - 1) * pageSize,
      limit: pageSize,
    });
  };
  /* key: array of string */
  const resetSelectChange = (key) => {
    if (!key) {
      updateFilter({});
      return;
    }
    let copiedFilter = { ...filter };
    key.forEach((v) => {
      delete copiedFilter[v];
    });
    updateFilter(copiedFilter);
  };

  // did mounted and it updates the query string
  useEffect(() => {
    // update query
    if (!location.search) getCountries();
    else updateFilter(queryString.parse(location.search));
  }, []);

  // update query string when filter get updated.
  useEffect(() => {
    if (filter) updateQuery();
  }, [filter]);

  useEffect(() => {
    if (query !== "") searchCountries();
  }, [query]);

  return (
    <>
      <PageBanner
        title={<FormattedMessage id="explore.banner.title" />}
        subTitle={<FormattedMessage id="explore.banner.subtitle" />}
        pageTitle={<FormattedMessage id="explore.title" />}
        background={Banner}
      />
      <div id="explore">
        <Layout.Content>
          <Row style={{ textAlign: "end" }}>
            <span>
              {loading
                ? "Loading"
                : `Showing ${countries.length} of ${
                    totalResult || countries.length
                  } Countries`}{" "}
            </span>
          </Row>
          <SearchFilter
            handleInputChange={handleInputChange}
            searchCountries={searchCountries}
            handleSelectChange={handleSelectChange}
            changeViewMode={setViewMode}
            viewMode={viewMode}
            updateQuery={updateQuery}
            resetSelectChange={resetSelectChange}
          />

          <Spin spinning={loading}>
            {viewMode === "grid" ? (
              <GridView
                data={countries}
                loading={loading}
                onPageChange={onPageChange}
                totalResult={totalResult}
                pagination={pagination}
                setPagination={setPagination}
              />
            ) : (
              <ListView
                data={countries}
                pagination={pagination}
                setPagination={setPagination}
                totalResult={totalResult}
                onPageChange={onPageChange}
              />
            )}
          </Spin>
          <br />
        </Layout.Content>
      </div>
    </>
  );
};

export default ExploreCountry;
