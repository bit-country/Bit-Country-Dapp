import React, { useEffect, useRef, useState } from "react";
import { Col, Input, Row, Divider, Select, Spin, Button, Empty } from "antd";
import BrowseMenu from "./BrowseMenu";
import ItemCard from "./ItemCard";
import "./Marketplace.styles.css";
import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Notification from "../../utils/Notification";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { FormattedMessage } from "react-intl";

const { Option } = Select;
const initalPagination = {
  currentPage: 0,
  skip: 0,
  pageSize: 10,
};
const initialQuery = {
  category: "country",
  sortby: "createdOn",
  orderby: "desc",
  keyword: "",
};

const BrowseBody = () => {
  const searchInput = useRef(null);
  const [items, setItems] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ ...initalPagination });
  const [totalResult, setTotalResult] = useState(0);
  const [query, setQuery] = useState();
  const getQueryString = () =>
    Object.keys(query)
      .filter(key => query[key] !== "")
      .map(v => `${v}=${query[v]}`)
      .join("&");

  useEffect(() => {
    let toConvert = new URL(window.location).searchParams;

    if (Object.keys(toConvert).length === 0) toConvert = { ...initialQuery };

    setQuery(toConvert);
  }, []);
  useEffect(() => {
    // filter the empty query then map and join each query
    if (query) {
      const filter = getQueryString();

      window.history.pushState("", "", `/marketplace/browse?${filter}`);

      reloadItems();
    }
  }, [query]);

  // get item using filter
  const fetchMore = () => {
    setLoading(true);
    // filter the empty query then map and join each query
    const filter = getQueryString();
    const { pageSize, currentPage } = pagination;
    const skipping = pageSize * currentPage;

    fetchAPI(
      `${endpoints.MARKETPLACE_BROWSE}?${filter}&take=${pageSize}&skip=${skipping}`
    ).then(res => {
      if (res?.isSuccess) {
        if (res.items.length > 0) {
          setItems([...items, ...res.items]);
        }

        const currentMaxItems = pageSize * currentPage;

        if (res?.totalResult <= currentMaxItems) setHasNextPage(false);

        const nextPage = {
          ...pagination,
          currentPage: currentPage + 1,
        };

        setPagination(nextPage);
        setLoading(false);
        setTotalResult(res.totalResult);
      } else
        Notification.displayErrorMessage(
          <FormattedMessage id="errors.pages.500.message" />
        );
    });
  };
  const infiniteRef = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: fetchMore,
    scrollContainer: "window",
  });
  const updateQuery = (name, value) => {
    if (!value) {
      const copiedQuery = { ...query };

      delete copiedQuery[name];
      setQuery(copiedQuery);
    } else setQuery({ ...query, [name]: value });
  };

  const reloadItems = () => {
    setItems([]);
    setPagination(initalPagination);
    setHasNextPage(true);
  };

  return (
    <Row gutter={20}>
      <Col span={5}>
        <BrowseMenu
          reloadItems={reloadItems}
          category={query?.category}
          updateQuery={updateQuery}
        />
      </Col>
      <Col span={19}>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={12} xl={14}>
            <Col span={14}>
              <Input.Search
                ref={searchInput}
                placeholder="Search"
                onChange={({ target }) =>
                  setTimeout(() => updateQuery("keyword", target.value), 1000)
                }
              />
            </Col>
            <Col span={8}>
              <Button
                onClick={() => {
                  updateQuery("keyword", null);
                  if (searchInput.current.state)
                    searchInput.current.state.value = "";
                }}
                icon="undo"
              />{" "}
              &nbsp;
              <Button onClick={reloadItems} type="primary">
                Search
              </Button>
            </Col>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={10}
            style={{ textAlign: "end" }}
          >
            <Select
              style={{ width: "180px", border: "none" }}
              defaultValue="createdOn_desc"
              onSelect={value => {
                const splitStr = value.split("_");

                setQuery({
                  ...query,
                  sortby: splitStr[0],
                  orderby: splitStr[1],
                });

                reloadItems();
              }}
            >
              <Option value="createdOn_desc">
                <FormattedMessage id="marketplace.filter.recentlyListed" />
              </Option>
              <Option value="price_desc"><FormattedMessage id="marketplace.filter.mostExpensive" /></Option>
              <Option value="price_des"><FormattedMessage id="marketplace.filter.cheapest" /></Option>
              <Option value="views_desc"><FormattedMessage id="marketplace.filter.mostViews" /></Option>
            </Select>
            <span style={{ padding: "10px" }}> {totalResult} <FormattedMessage id="marketplace.result.title" /></span>
          </Col>
        </Row>
        <Divider />
        <Row>
          <div ref={infiniteRef}>
            {items.length === 0 ? (
              <Empty style={{ paddingTop: "10%" }} />
            ) : (
                items.map(item => (
                  <div key={item.id} style={{ display: "inline-flex" }}>
                    <div style={{ width: "280px", margin: "15px" }}>
                      {" "}
                      <ItemCard item={item} />
                    </div>
                  </div>
                ))
              )}
          </div>
        </Row>
        <Row>
          {loading && (
            <Spin
              style={{ width: "100%", textAlign: "center", paddingTop: "30px" }}
              spinning={true}
            />
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default BrowseBody;
