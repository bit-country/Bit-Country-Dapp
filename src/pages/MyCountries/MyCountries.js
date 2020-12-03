import React, { Component } from "react";
import { navigate, /*Link*/ } from "@reach/router";
import CountryCard from "../../components/CountryCard";
import ENDPOINTS from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { Button, Layout, Spin } from "antd";
import { FormattedMessage } from "react-intl";
import "./MyCountries.styles.css";
import CardColumn from "../../components/CardColumn/CardColumn";
import Logging from "../../utils/Logging";
import Notification from "../../utils/Notification";
import PageBanner from "../../components/PageBanner";
import BannerImage from "../../assets/images/my_countries.jpg";

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
        <PageBanner
          title={ <FormattedMessage
            id="myCountries.banner.mvp.title"
          />}   
          subTitle={<FormattedMessage
            id="myCountries.banner.mvp.subtitle"
          />}
          pageTitle={<FormattedMessage
            id="myCountries.section.myCountries"
          />}
          background={BannerImage}  
        />
     
        <Layout.Content>
          <div className="call-to-action">
            <Button
              onClick={this.handleCreateCountry}
              type="primary"
              icon="plus"
            >
              <span>
                <FormattedMessage
                  id="myCountries.banner.callToAction"
                />
              </span>
            </Button>
          </div>
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
