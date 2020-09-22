import React, { Component } from "react";
import { navigate, /*Link*/ } from "@reach/router";
import CountryCard from "../../components/CountryCard";
import ENDPOINTS from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { Layout, Divider, Spin } from "antd";
import { FormattedMessage } from "react-intl";
import "./MyCountries.styles.css";
import CardColumn from "../../components/CardColumn/CardColumn";
import Logging from "../../utils/Logging";
import Notification from "../../utils/Notification";

class MyCountries extends Component {
  state = {
    hasCountry: false,
    countries: []
  };    

  componentDidMount() {
    this.loadUserAndCountries();
  }

  loadUserAndCountries = async () => {
    try {
      const {
        user
      } = this.props;
  
      const responseCountry = await fetchAPI(
        `${ENDPOINTS.GET_COUNTRIES_BY_USER}?userId=${user.id}`
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
        countries:  
          state.countries.concat(responseCountry.countries || [])
      }));
    } catch (error) {
      Logging.Error(error);
    }
  }
  
  getTotalResidentsByBlock(blockNumber) {
    return blockNumber * 256;
  }

  getEstimateValueByBlock(blockNumber) {
    return (blockNumber * 0.01 + blockNumber * 0.01 * 0.2).toFixed(2);
  }

  handleCreateCountry = () => {
    navigate("/create-country");
  }

  render() {
    const {
      hasCountry
    } = this.state;

    const countries = this.state.countries.map(
      country => (
        <CardColumn key={country.id}>
          <CountryCard key={country.id} country={country} />
        </CardColumn>
      )
    );

    return (
      <div id="my-countries">
        <div className="banner">
          <div className="text">
            <h2 className="title">
              <FormattedMessage
                id="myCountries.banner.mvp.title"
              />
            </h2>
            <h3 className="subtitle">
              <FormattedMessage
                id="myCountries.banner.mvp.subtitle"
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
        {/* <div className="banner">
          <div className="text">
            <h2 className="title">
              <FormattedMessage
                id="myCountries.banner.title"
              />
            </h2>
            <h3 className="subtitle">
              <FormattedMessage
                id="myCountries.banner.subtitle"
              />
            </h3>
            <div className="call-to-action">
              <Button
                onClick={this.handleCreateCountry}
              >
                <FormattedMessage
                  id="myCountries.banner.callToAction"
                />
              </Button>
            </div>
          </div>
        </div> */}
        <Layout.Content>
          <Divider orientation="left">
            <FormattedMessage
              id="myCountries.section.myCountries"
            />
          </Divider>
          <Spin spinning={!hasCountry}>
            <div className="countries">
              {countries}
            </div>
          </Spin>
        </Layout.Content>
      </div>
    );
  }
}

export default AuthConnect(MyCountries, true);
