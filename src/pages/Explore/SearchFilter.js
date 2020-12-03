/* eslint-disable */
import React, { useState } from "react";
import { Button, Col, Divider, Icon, Input, Popover, Row, Select } from "antd";
import { FormattedMessage } from "react-intl";
import "./Explore.styles.css";
import queryString from "query-string";

const { Search } = Input;
const { Option } = Select;
const initialState = {
  sort: "Population",
  population: "any",
  crc: "any",
  mng: "any",
  block: "any",
  sdk: "any",
};

const SearchFilter = ({
  handleInputChange,
  handleSelectChange,
  changeViewMode,
  viewMode,
  updateQuery,
  resetSelectChange,
  term,
}) => {
  const [filterVisible, toggleFilter] = useState(false);
  const [defaultValues, setDefaults] = useState({ ...initialState });

  const handleFilterChange = (id, value, keys) => {
    setDefaults({ ...defaultValues, [id]: value });
    if (value === "any") resetSelectChange(keys);
    else handleSelectChange(queryString.parse(value));
  };

  const handleFilterReset = () => {
    resetSelectChange();
    setDefaults({ ...initialState });
  };

  return (
    <div id="search">
      <Row gutter={[24, 12]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Search
            placeholder="Any Keywords..."
            name="term"
            defaultValue={queryString.parse(location.search)?.term}
            onChange={handleInputChange}
            onSearch={() => updateQuery(true)}
            enterButton
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              icon="sort-ascending"
              type="link"
              disabled
              style={{ border: "none", pointerEvents: "none" }}
            />
            <Select
              value={defaultValues.sort}
              style={{ width: "40%" }}
              onChange={(value) => handleFilterChange("sort", value, ["sort"])}
            >
              <Option value="sort=population">Population</Option>
              <Option value="sort=activeness">Activeness</Option>
            </Select>
            <Popover content="Grid View">
              <Button
                icon="appstore"
                type={`${viewMode === "grid" ? "primary" : null}`}
                style={{ margin: "0 5px" }}
                onClick={() => changeViewMode("grid")}
              />
            </Popover>
            <Popover content="List View">
              <Button
                type={`${viewMode === "list" ? "primary" : null}`}
                icon="unordered-list"
                onClick={() => changeViewMode("list")}
              />
            </Popover>
            <Button
              icon="filter"
              style={{ margin: "0 10px" }}
              onClick={() => toggleFilter(!filterVisible)}
            >
              Filters
            </Button>
          </div>
        </Col>
      </Row>
      {filterVisible ? (
        <>
          <Row
            style={{ paddingTop: "1%" }}
            className="fade-in"
            gutter={[24, 12]}
            justify="center"
          >
            <Col xs={12} sm={8} md={6} lg={4} xl={4}>
              <span className="search-filter-label">
                <FormattedMessage id="explore.filter.population" />
              </span>
              <Select
                value={defaultValues.population}
                onChange={(value) =>
                  handleFilterChange("population", value, [
                    "maxPopulation",
                    "minPopulation",
                  ])
                }
              >
                <Option value="any">
                  <FormattedMessage id="explore.filterOption.any" />
                </Option>
                <Option value="minPopulation=0&maxPopulation=1000">
                  <FormattedMessage id="explore.filterOption.under1k" />
                </Option>
                <Option value="minPopulation=1000&maxPopulation=10000">
                  1k-10k
                </Option>
                <Option value="minPopulation=10000">10k+</Option>
              </Select>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4} xl={4}>
              <span className="search-filter-label">
                <FormattedMessage id="explore.filter.blocks" />
              </span>
              <Select
                value={defaultValues.block}
                onChange={(value) =>
                  handleFilterChange("block", value, ["mimb", "maxBlocks"])
                }
              >
                <Option value="any">
                  <FormattedMessage id="explore.filterOption.any" />
                </Option>
                <Option value="mimb=0&maxBlocks=10">
                  <FormattedMessage id="explore.filterOption.under10" />
                </Option>
                <Option value="mimb=10&maxBlocks=100">10-100</Option>
                <Option value="mimb=100">100+</Option>
              </Select>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4} xl={4}>
              {" "}
              <span className="search-filter-label">
                <FormattedMessage id="explore.filter.currency" />
              </span>
              <Select
                value={defaultValues.crc}
                onChange={(value) => {
                  handleFilterChange("crc", value, ["crc"]);
                }}
              >
                <Option value="any">
                  <FormattedMessage id="explore.filterOption.any" />
                </Option>
                <Option value="crc=customized">
                  <FormattedMessage id="explore.filterOption.customized" />
                </Option>
                <Option value="crc=BCG">BCG</Option>
              </Select>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4} xl={4}>
              <span className="search-filter-label">
                <FormattedMessage id="explore.filter.managedBy" />
              </span>
              <Select
                value={defaultValues.mng}
                onChange={(value) => handleFilterChange("mng", value, ["mng"])}
              >
                <Option value="any">
                  <FormattedMessage id="explore.filterOption.any" />
                </Option>
                <Option value="mng=owner">
                  <FormattedMessage id="explore.filterOption.owner" />
                </Option>
                <Option value="mng=council">
                  <FormattedMessage id="explore.filterOption.council" />
                </Option>
              </Select>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4} xl={4}>
              {" "}
              <span className="search-filter-label">
                <FormattedMessage id="explore.filter.staking" />
              </span>
              <Select
                defaultValue="any"
                value={defaultValues.sdk}
                onChange={(value) => handleFilterChange("sdk", value, ["sdk"])}
              >
                <Option value="any">
                  <FormattedMessage id="explore.filterOption.any" />
                </Option>
                <Option value="sdk=true">
                  <FormattedMessage id="explore.filterOption.available" />
                </Option>
                <Option value="sdk=false">
                  <FormattedMessage id="explore.filterOption.notAvailable" />
                </Option>
              </Select>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4} xl={4}>
              <span
                className="search-filter-label"
                style={{ visibility: "hidden" }}
              >
                -
              </span>
              <Popover content="Reset Filter">
                <Button icon="redo" onClick={() => handleFilterReset()} />
              </Popover>
            </Col>
          </Row>
        </>
      ) : null}
    </div>
  );
};

export default SearchFilter;
