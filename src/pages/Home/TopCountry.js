import React, { Component } from "react";
import CountryCard from "../../components/CountryCard";
import ENDPOINTS from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import { FormattedMessage } from "react-intl";
import { Button, Row, Col } from "antd";
import { Link } from "@reach/router";
import Logging from "../../utils/Logging";

export default class TopCountry extends Component {
  state = {
    countries: []
  };

  componentDidMount() {
    this.loadCountries();
  }

  loadCountries = async () => {
    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_COUNTRIES}?limit=3&skip=0`
      );

      if (response?.isSuccess && response.countries.length > 0) {
        this.setState({
          countries: response.countries
        });
      }
    } catch (error) {
      Logging.Error(error);
    }
  };

  render() {
    const countries = this.state.countries.map(country => (
      <Col xs={24} sm={12} xl={8} key={country.id}>
        <CountryCard country={country} />
      </Col>
    ));

    return (
      <div className="top-countries">
        <Row>
          <Col xs={24} md={{ push: 1, span: 22 }} lg={{ push: 2, span: 20 }} xl={{ push: 3, span: 18 }}>
            <h2 className="center">
              <FormattedMessage id="home.topCountry.title" />
            </h2>
            <Row className="country-cards">{countries}</Row>
            <div className="center">
              <Link to="/explore">
                <Button
                  size="large"
                  ghost
                >
                  <FormattedMessage id="home.topCountry.explore" />
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
