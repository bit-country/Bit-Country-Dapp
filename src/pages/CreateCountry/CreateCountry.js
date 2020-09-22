import React, { Component } from "react";
import { navigate } from "@reach/router";
import { DAppConnect } from "../../components/HOC/DApp/DAppWrapper";
import {
  Layout,
  Divider,
} from "antd";
import Notification from "../../utils/Notification";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import "./../../css/CreateCountry.css";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { UseRatesWrapper } from "../../hooks/useRates";
import { FormattedMessage } from "react-intl";
import CountrySection from "./CountrySection";
import BlockSection from "./BlockSection";
import CurrencySection from "./CurrencySection";
import BlockchainSection from "./BlockchainSection";
import TotalsSection from "./TotalsSection";
import Logging from "../../utils/Logging";
import { CHAINTYPES } from "../../config/chainTypes";
import "./CreateCountry.styles.css";

const { Content } = Layout;

class CreateCountry extends Component {
  state = {
    loading: false,
    countryName: "",
    countryUniqueId: "",
    countryDescription: "",
    currencyName: "",
    currencySymbol: "",
    theme: 1,
    user: this.props.user,
    totalBlockNumber: 9,
    totalSupply: 1000,
    backingBCG: 10,
    blockPrice: 1,
    createOnPolkadot: false,
  };

  handleInputChange = e => {
    const { value, name } = e.target;

    this.setState({
      [name]: value
    });
  };

  createCountry = () => {
    const {
      countryName,
      countryUniqueId,
      countryDescription,
      theme,
      totalBlockNumber,
      currencyName,
      currencySymbol,
      totalSupply,
      backingBCG,
      createOnPolkadot,
    } = this.state;

    if (
      countryName == "" ||
      countryUniqueId == "" ||
      countryDescription == "" ||
      currencyName == "" ||
      currencySymbol == ""
    ) {
      Notification.displayErrorMessage(
        "Please enter all field before creating country"
      );

      return false;
    }

    if (countryDescription.length < 100) {
      Notification.displayErrorMessage(
        "Description needs to be longer than 100 characters"
      );

      return false;
    }

    if (currencySymbol.length < 3 || currencySymbol.length > 4) {
      Notification.displayErrorMessage(
        "Your currency symbol needs to between 3 and 4 characters"
      );

      return false;
    }

    let hostChain = CHAINTYPES.OffChain;

    if (createOnPolkadot) {
      hostChain = CHAINTYPES.Polkadot;
    }
    
    let newCountry = {
      countryName,
      countryUniqueId,
      countryDescription,
      blockNumber: totalBlockNumber,
      theme,
      currency: {
        name: currencyName,
        symbol: currencySymbol,
        totalSupply: totalSupply,
        backing: backingBCG
      },
      hostChain,
    };

    this.setState({
      loading: true,
    });

    switch (hostChain) {
      case CHAINTYPES.OffChain:
        this.createCountryOffChain(newCountry, null);
        break;

      default:
        Logging.Error(new Error("Unsupported chain type selected for country"), hostChain);
        
        Notification.displayErrorMessage(<FormattedMessage id="createCountry.errors.notification.unsupportedChain" />);

        break;
    }
  };

  createCountryOnChain = () => {
    
  }

  createCountryOffChain = async (newCountry, hash) => {
    try {
      newCountry.txTran = hash;
      newCountry.status = "Pending";
  
      const response = await fetchAPI(
        ENDPOINTS.CREATE_COUNTRY,
        "POST",
        newCountry
      );
  
      if (!response?.isSuccess) {
        Notification.displayErrorMessage(
          <FormattedMessage
            id="createCountry.notification.failure"
          />
        );
  
        throw Error("Error while sending request to API");
      }
  
      Notification.displaySuccessMessage(
        "Creating country transaction is pending..."
      );
  
      navigate(`/c/${response.country.id}/pending`);
    } catch (error) {
      Logging.Error(error);
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  chooseTheme = theme => {
    this.setState({ theme });
  };

  getTotalCostIn = unit => {
    let {
      totalBlockNumber,
      blockPrice,
      backingBCG,
    } = this.state;

    const totalBcg = totalBlockNumber * blockPrice + backingBCG; 

    switch (unit) {
      case "bcg":
        return totalBcg;
        
      default:
        Logging.Error(new Error("Invalid unit"));
        break;
    }
  };

  handleBlockChange = value => {
    this.setState({
      totalBlockNumber: value
    });
  }

  handleHostPolkadot = checked => {
    if (this.props.polkadotAvailable) {
      this.setState({ createOnPolkadot: checked });
    }
  }

  render() {
    const {
      loading,
      countryUniqueId,
      countryName,
      countryDescription,
      theme,
      blockPrice,
      currencyName,
      currencySymbol,
      totalBlockNumber,
      backingBCG,
      totalSupply,
      createOnPolkadot,
      user
    } = this.state;

    const {
      polkadotAvailable,
    } = this.props;

    const {
      tokenRate
    } = this.props.rates;

    const masterAccounts = [ "5f20b4fb831dc00338813b7b", "5f10d60bd88e6122d88f75cc", "5f10043cc85d3d2d58996167", "5f2b5a9cae86b00a0465a8d4", "5f111f2ad88e6122d88f75ce" ];

    if (user == null) {
      navigate("/401");

      return null;
    }
    
    if (masterAccounts.includes(user.id)) {
      return (
        <div className="layout">
          <Content>
            <div>
              <h1 className="center aligned">Create your country</h1>
              <h3 className="center aligned">
                  The only limit is your imagination
              </h3>
            </div>
            <Divider orientation="left">Country Profile</Divider>
            <CountrySection 
              uniqueId={countryUniqueId}
              name={countryName}
              description={countryDescription}
              theme={theme}
              onInputChange={this.handleInputChange}
              onThemeChange={this.chooseTheme}
            />
            <Divider orientation="left">Blocks</Divider>
            <BlockSection 
              blocks={totalBlockNumber}
              blockPrice={blockPrice}
              onBlockChange={this.handleBlockChange}
            />
            <Divider orientation="left">Currency</Divider>
            <CurrencySection
              name={currencyName}
              symbol={currencySymbol}
              totalSupply={totalSupply}
              backingBCG={backingBCG}
              tokenRate={tokenRate}
              onInputChange={this.handleInputChange}
            />
            <Divider orientation="left">Host blockchain</Divider>
            <BlockchainSection
              polkadotAvailable={polkadotAvailable}
              polkadot={createOnPolkadot}
              onPolkadotChange={this.handleHostPolkadot}
              polkadotDotEstimation={0}
            />
            <Divider />
            <TotalsSection
              getTotalCostIn={this.getTotalCostIn}
              onConfirm={this.createCountry}
              loading={loading}
            />
          </Content>
        </div>
      );    
    }

    return (
      <div className="layout" id="create-country">
        <Content>
          <div>
            <h1 className="center aligned">
              <FormattedMessage
                id="createCountry.title"
              />
            </h1>
            <h3 className="center aligned">
              <FormattedMessage
                id="createCountry.slogan"
              />
            </h3>
          </div>
          <Divider />
          <div className="early-access">
            <h2>
              <FormattedMessage
                id="createCountry.limitedAvailability.title"
              />
            </h2>
            <p>
              <FormattedMessage
                id="createCountry.limitedAvailability.description"
              />
            </p>
            <a href="mailto://genesis@bit.country">
              <FormattedMessage
                id="createCountry.limitedAvailability.action"
              />
            </a>
          </div>
        </Content>
      </div>
    );
  }
}

export default AuthConnect(DAppConnect(UseRatesWrapper(CreateCountry), false));
