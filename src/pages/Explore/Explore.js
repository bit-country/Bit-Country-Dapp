import React, { Component } from "react";
import CountryCard from "../../components/CountryCard";
import ENDPOINTS from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import {
  Layout,
  Divider,
  Button,
  Spin,
  Input,
  Select
} from "antd";
import { FormattedMessage } from "react-intl";
import "./Explore.styles.css";
import CardColumn from "../../components/CardColumn/CardColumn";
import Logging from "../../utils/Logging";
import Notification from "../../utils/Notification";

const { Search } = Input;
const { Option } = Select;

class Explore extends Component {
  state = {
    hasCountry: false,
    countries: [],
    limit: 12,
    skip: 0,
    loading: false,
    term: "",
    newTerm: false,
    moreToLoad: false,
    filters: { minPopulation: 0, minBlocks: 0 }
  };

  componentDidMount() {
    this.loadCountries();
  }

  loadCountries = async () => {
    try {
      const { limit, skip } = this.state;

      const responseCountry = await fetchAPI(
        `${ENDPOINTS.GET_COUNTRIES}?limit=${limit}&skip=${skip}`
      );

      if (!responseCountry?.isSuccess) {
        Notification.displayErrorMessage(
          <FormattedMessage
            id={responseCountry.message}
          />
        );

        throw Error("Error while searching countries");
      }

      this.setState(state => ({
        hasCountry: responseCountry.isSuccess,
        loading: false,
        countries: state.countries.concat(responseCountry.countries || []),
        skip: skip + limit,
        moreToLoad: responseCountry.countries.length === limit
      }));
    } catch (error) {
      Logging.Error(error);
    }
  };

  loadMoreCountries = () => {
    this.setState({
      loading: true
    });

    this.state.newTerm ? this.loadCountries() : this.searchCountries();
  };

  clearResult() {
    this.setState({
      hasCountry: false,
      countries: []
    });
  }

  searchCountries = async () => {
    if (this.state.newTerm) {
      this.clearResult();
    }

    try {
      const { term, limit, skip, filters } = this.state;

      const responseCountry = await fetchAPI(
        `${ENDPOINTS.SEARCH_COUNTRIES}?term=${term}&limit=${limit}&skip=${skip}&minPopulation=${filters.minPopulation}&minBlocks=${filters.minBlocks}`
      );

      if (!responseCountry?.isSuccess) {
        Notification.displayErrorMessage(
          <FormattedMessage
            id={responseCountry.message}
          />
        );

        throw Error("Error while searching countries");
      }

      this.setState(state => ({
        hasCountry: responseCountry.isSuccess,
        loading: false,
        countries: state.countries.concat(responseCountry.countries || []),
        skip: skip + limit,
        newTerm: false,
        moreToLoad: responseCountry.countries.length === limit
      }));
    } catch (error) {
      Logging.Error(error);
    }
  };

  getTotalResidentsByBlock(blockNumber) {
    return blockNumber * 256;
  }

  getEstimateValueByBlock(blockNumber) {
    return (blockNumber * 0.01 + blockNumber * 0.01 * 0.2).toFixed(2);
  }

  handleInputChange = e => {
    const { value, name } = e.target;

    this.setState({
      [name]: value,
      skip: 0,
      newTerm: true
    });
  };

  handleSelectChange = (value, name) => {
    const { filters } = this.state;

    filters[name] = value;
    this.setState({
      filters,
      skip: 0,
      newTerm: true
    });
  };

  render() {
    const { hasCountry, loading, moreToLoad } = this.state;

    const countries = this.state.countries.map(country => (
      <CardColumn key={country.id}>
        <CountryCard
          key={country.id}
          country={country}
        />
      </CardColumn>
    ));

    return (
      <div id="explore">
        <div className="banner">
          <div className="text">
            <h2 className="title">
              <FormattedMessage
                id="explore.banner.title"
              />
            </h2>
            <h3 className="subtitle">
              <FormattedMessage
                id="explore.banner.subtitle"
              />
            </h3>
            {/* <div className="call-to-action">
              <Link to="/c/mvp">
                <FormattedMessage
                  id="myCountries.banner.mvp.callToAction"
                />
              </Link>
            </div> */}
          </div>
        </div>
        <Layout.Content>
          <Divider orientation="left">
            <FormattedMessage id="explore.title" />
          </Divider>

          <div id="search">
            <Search
              placeholder="Search"
              size="large"
              name="term"
              onChange={this.handleInputChange}
              onSearch={this.searchCountries}
              enterButton
            />
            <div className="filters">
              <span className="filter-field">
                <label>
                  <FormattedMessage id="explore.filter.population" />
                </label>
                <Select
                  defaultValue={"any"}
                  style={{ width: 120 }}
                  onChange={value =>
                    this.handleSelectChange(value, "minPopulation")
                  }
                >
                  <Option value="any">
                    <FormattedMessage id="explore.filterOption.any" />
                  </Option>
                  <Option value="0&maxPopulation=1000">
                    <FormattedMessage id="explore.filterOption.under1k" />
                  </Option>
                  <Option value="1000&maxPopulation=10000">1k-10k</Option>
                  <Option value="10000">10k+</Option>
                </Select>
              </span>

              <span className="filter-field">
                <label>
                  <FormattedMessage id="explore.filter.blocks" />
                </label>
                <Select
                  defaultValue={"any"}
                  style={{ width: 120 }}
                  onChange={value => this.handleSelectChange(value, "mimb")}
                >
                  <Option value="any">
                    <FormattedMessage id="explore.filterOption.any" />
                  </Option>
                  <Option value="0&maxBlocks=10">
                    <FormattedMessage id="explore.filterOption.under10" />
                  </Option>
                  <Option value="10&maxBlocks=100">10-100</Option>
                  <Option value="100">100+</Option>
                </Select>
              </span>

              <span className="filter-field">
                <label>
                  <FormattedMessage id="explore.filter.currency" />
                </label>
                <Select
                  defaultValue={"any"}
                  style={{ width: 120 }}
                  onChange={value => this.handleSelectChange(value, "crc")}
                >
                  <Option value="any">
                    <FormattedMessage id="explore.filterOption.any" />
                  </Option>
                  <Option value="customized">
                    <FormattedMessage id="explore.filterOption.customized" />
                  </Option>
                  <Option value="BCG">BCG</Option>
                </Select>
              </span>

              <span className="filter-field">
                <label>
                  <FormattedMessage id="explore.filter.managedBy" />
                </label>
                <Select
                  defaultValue={"any"}
                  style={{ width: 120 }}
                  onChange={value => this.handleSelectChange(value, "mng")}
                >
                  <Option value="any">
                    <FormattedMessage id="explore.filterOption.any" />
                  </Option>
                  <Option value="owner">
                    <FormattedMessage id="explore.filterOption.owner" />
                  </Option>
                  <Option value="council">
                    <FormattedMessage id="explore.filterOption.council" />
                  </Option>
                </Select>
              </span>

              <span className="filter-field">
                <label>
                  <FormattedMessage id="explore.filter.stacking" />
                </label>
                <Select
                  defaultValue={"any"}
                  style={{ width: 120 }}
                  onChange={value => this.handleSelectChange(value, "stk")}
                >
                  <Option value="any">
                    <FormattedMessage id="explore.filterOption.any" />
                  </Option>
                  <Option value="true">
                    <FormattedMessage id="explore.filterOption.available" />
                  </Option>
                  <Option value="false">
                    <FormattedMessage id="explore.filterOption.notAvailable" />
                  </Option>
                </Select>
              </span>
            </div>
          </div>

          <Spin spinning={!hasCountry}>
            {countries.length > 0 ? (
              <div className="countries">{countries}</div>
            ) : hasCountry ? (
              <div className="empty">
                <label>
                  <FormattedMessage id="explore.noResultsFound" />
                </label>
              </div>
            ) : (
              <div className="empty" />
            )}
          </Spin>

          <div id="load-more">
            <Button
              onClick={this.loadMoreCountries}
              type="primary"
              hidden={!hasCountry}
              loading={loading}
              disabled={!moreToLoad}
            >
              <FormattedMessage id="explore.loadMore" />
            </Button>
          </div>
        </Layout.Content>
      </div>
    );
  }
}

export default AuthConnect(Explore);
