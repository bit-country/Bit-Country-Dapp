import React, { Component } from "react";
import CountryCard from "../../components/CountryCard";
import ENDPOINTS from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import { FormattedMessage } from "react-intl";
import { Button, Row, Col } from "antd";
import { navigate } from "@reach/router";
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
          <Col xs={0} md={1} lg={2} xl={3}></Col>
          <Col xs={24} md={22} lg={20} xl={18}>
            <h2 className="center">
              <FormattedMessage id="home.topCountry.title" />
            </h2>
            <Row className="country-cards">{countries}</Row>
            <div className="center">
              <Button
                size="large"
                ghost
                onClick={() => navigate("/my-countries")}
              >
                <FormattedMessage id="home.topCountry.explore" />
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
