import React, { Component } from "react";
import ENDPOINTS from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import Notification from "../../utils/Notification";
import CountryCard from "../../components/CountryCard";
import { Layout, Input, Row, Pagination, Spin } from "antd";
import { FormattedMessage } from "react-intl";
import "./Marketplace.styles.css";
import CardColumn from "../../components/CardColumn/CardColumn";
import Logging from "../../utils/Logging";

const PAGE_SIZE = 9;

const countryDemoData = [
  {
    id: 1,
    name: "Coding Kingdom",
    theme: "1",
    president: "Ray",
    description: "A land of coding. Share your skills and learn from the best.",
    population: 2480,
    token: {
      symbol: "CKD",
      totalSupply: 50000
    }
  },
  {
    id: 2,
    name: "Game Developer Retreat",
    theme: "3",
    president: "Tim",
    description: "Take some time for rest and relaxation. Talk all things game development in a comfortable environment.",
    population: 10001,
    token: {
      symbol: "GDRT",
      totalSupply: 100000
    }
  },
  {
    id: 3,
    name: "Up and coming stars",
    theme: "4",
    president: "Balraj",
    description: "Learn about the latest, greatest and hottest new stars on the block.",
    population: 1338,
    token: {
      symbol: "UACS",
      totalSupply: 10000
    }
  },
  {
    id: 4,
    name: "Lowlands",
    theme: "2",
    president: "Shannon",
    description: "Enjoy the game, equipment and advice for camping in the beautiful plains of the world.",
    population: 847,
    token: {
      symbol: "LwTk",
      totalSupply: 1000000
    }
  }
];

export default class MarketPlace extends Component {
  state = {
    loading: false,
    currentIndex: 1,
    countries: countryDemoData,
    total: 0,
    term: ""
  };

  loadData = () => {
    this.loadMoreData(0);
  }

  loadMoreData = async (offset, term = "") => {
    this.setState({
      loading: true
    });

    try {
      const response = await fetchAPI(`${ENDPOINTS.SEARCH_COUNTRIES}?term=${term}&offset=${offset}`);

      if (!response?.isSuccess) {
        throw Error("Error while retrieving marketplace data");
      }
  
      this.setState({
        countries: response.countries,
        total: response.total
      });
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        <FormattedMessage
          id="marketplace.notification.error"
        />
      );
    }

    this.setState({
      loading: false
    });
  }

  handlePageChange = pageNumber => {
    this.setState({ currentIndex: pageNumber });

    this.loadMoreData((pageNumber - 1) * PAGE_SIZE);
  }

  handleSearchChange = ({ target: { value } }) => {
    this.setState({
      term: value
    });
  }

  handleSearch = term => {
    this.loadMoreData(0, term);
  }

  renderSearchResult = () => { }

  render() {
    const {
      loading,
      total,
      countries,
      currentIndex,
      term
    } = this.state;

    const searchResults = countries.map(item => (
      <CardColumn key={item.id}>
        <CountryCard
          country={item}
        />
      </CardColumn>
    ));

    return (
      <Layout.Content id="marketplace">
        <h1 className="coming-soon">
          <FormattedMessage
            id="app.comingSoon"
          />
        </h1>
        <div className="title">
          <h2>Marketplace</h2>
        </div>
        <div>
          <div className="search-bar-container">
            <Input.Search
              className="search-bar-input"
              placeholder="Search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              value={term}
              name="term"
              onChange={this.handleSearchChange}
              onSearch={this.handleSearch}
            />
          </div>
          <Spin
            spinning={loading}
          >
            <Row gutter={[ "8", "8" ]}>
              {searchResults.length > 0 ? (
                searchResults
              ) : (
                <h3 className="ui header center aligned margined">
                  <FormattedMessage
                    id="marketplace.no_results"
                  />
                </h3>
              )}
            </Row>
          </Spin>
          <div className="pagination-container">
            <Pagination
              current={currentIndex}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={this.handlePageChange}
            />
          </div>
        </div>
      </Layout.Content>
    );
  }
}
