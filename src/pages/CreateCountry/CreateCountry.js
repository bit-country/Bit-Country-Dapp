import React, { Component } from "react";
import { navigate } from "@reach/router";
import { DAppConnect } from "../../components/HOC/DApp/DAppWrapper";
import { Layout, Divider } from "antd";
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
import Logging from "../../utils/Logging";
import { CHAINTYPES } from "../../config/chainTypes";
import "./CreateCountry.styles.css";
import UniqueNameModal from "./UniqueNameModal";
import TotalsSection from "./TotalsSection";

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
    totalBlockNumber: 9,
    totalSupply: 1000,
    backingBCG: 10,
    blockPrice: 1,
    createOnPolkadot: false,
    data: [],
    loadingNames: false,
    paymentCurrency: "BCG",
    bcgToUsdRate: 0.705813,
  };

  componentDidMount() {
    this.loadUniqueNames();
  }

  loadUniqueNames = async () => {
    this.setState({
      loadingNames: true
    });

    try {
      const response = await fetchAPI(ENDPOINTS.GET_COUNTRY_NAMES);

      if (!response?.isSuccess) {
        if (response?.json?.message) {
          Notification.displayErrorMessage(
            <FormattedMessage
              id={response.json.message}
            />
          );
    
          throw Error(response.json.message);
        }

        Notification.displayErrorMessage(
          <FormattedMessage
            id="createCountry.uniqueName.notification.error"
            defaultMessage="Error while retrieving your country names, please try again later"
          />
        );

        throw Error("Error while retrieving country names");
      }
      
      this.setState({
        data: response.names
      });
    } catch (error) {
      Logging.Error(error);
    } finally {
      this.setState({
        loadingNames: false
      });
    }
  }

  handleInputChange = e => {
    const { value, name } = e.target;

    this.setState({
      [name]: value,
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
      createOnPolkadot
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

    if (countryDescription.length < 30) {
      Notification.displayErrorMessage(
        "Description needs to be longer than 30 characters"
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
        backing: backingBCG,
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
        Logging.Error(
          new Error("Unsupported chain type selected for country"),
          hostChain
        );

        Notification.displayErrorMessage(
          <FormattedMessage id="createCountry.errors.notification.unsupportedChain" />
        );

        break;
    }
  };

  createCountryOnChain = () => {};

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
        if (response?.message || response?.json?.message) {
          Notification.displayErrorMessage(
            <FormattedMessage id={response.message || response.json.message} />
          );
  
          throw Error(response.message || response.json.message);
        }

        Notification.displayErrorMessage(
          <FormattedMessage id="createCountry.notification.failure" />
        );

        throw Error("Error while sending request to API");
      }

      Notification.displaySuccessMessage(
        "Creating country transaction is pending..."
      );

      navigate(`/c/${response.country.uniqueId}/pending`);
    } catch (error) {
      Logging.Error(error);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  chooseTheme = theme => {
    this.setState({ theme });
  };

  getTotalCostIn = unit => {
    let { totalBlockNumber, blockPrice, backingBCG } = this.state;

    const totalBcg = totalBlockNumber * blockPrice + backingBCG;

    switch (unit) {
      case "bcg":
        return totalBcg;

      default:
        Logging.Error(new Error("Invalid unit"));
        break;
    }
  };

  convertToPaymentCurrency = amount => {
    const { paymentCurrency, bcgToUsdRate } = this.state;

    if (paymentCurrency === "BCG") return amount;
    if (paymentCurrency === "USD") return amount * bcgToUsdRate;

    Logging.Error(new Error("Invalid unit"));
  };

  getTotalCostInBCG = () => {
    const { backingBCG } = this.state;

    return this.getBlockTotalInBCG() + backingBCG;
  };

  getBlockTotalInBCG = () => {
    const { totalBlockNumber, blockPrice } = this.state;

    return totalBlockNumber * blockPrice;
  };

  getGasEstimate = () => {
    const { createOnEthereum, smartContractGasEstimation } = this.state;

    return createOnEthereum ? smartContractGasEstimation : 0;
  };

  handleBlockChange = value => {
    this.setState({
      totalBlockNumber: value,
    });
  };

  handlePaymentCurrencyChange = value => {
    this.setState({
      paymentCurrency: value,
    });
  };

  handlePaymentCurrencyChange = value => {
    this.setState({
      paymentCurrency: value,
    });
  };

  handleHostPolkadot = checked => {
    const { polkadotAvailable } = this.props;

    if (polkadotAvailable) {
      this.setState({ createOnPolkadot: checked });
    }
  };

  handleShowUniqueNameModal = () => {
    this.setState({
      showUniqueNameModal: true
    });
  }

  handleHideUniqueNameModal = () => {
    this.setState({
      showUniqueNameModal: false
    });
  }

  handleUpdateNames = names => {
    const selected = names.find(item => item.selected);

    let selectedId = "";

    if (selected) {
      selectedId = selected.id;
    }

    this.setState({
      data: names,
      countryUniqueId: selectedId
    });
  }

  handleNewUniqueName = name => {
    const {
      data
    } = this.state;

    const newNames = data.map(x => {
      if (x.selected) {
        return { ...x, selected: false } ;
      }

      return x;
    });
  
    newNames.push({
      ...name,
      selected: true
    });

    this.handleUpdateNames(newNames);

    this.handleHideUniqueNameModal();
  }

  render() {
    const {
      loading,
      countryName,
      countryDescription,
      theme,
      currencyName,
      currencySymbol,
      totalBlockNumber,
      backingBCG,
      totalSupply,
      createOnPolkadot,
      data,
      loadingNames,
      showUniqueNameModal,
    } = this.state;

    const {
      polkadotAvailable,
      rates: { tokenRate },
      user,
    } = this.props;

    if (user == null) {
      navigate("/401");

      return null;
    }

    return (
      <div className="layout">
        <Content id="create-country">
          <div>
            <h1 className="center aligned">Create a bit country</h1>
            <h3 className="center aligned">
              Your real economy in a virtual world
            </h3>
          </div>

          <Divider orientation="left">Bit Country</Divider>
          <CountrySection
            uniqueNames={data}
            loadingNames={loadingNames}
            handleCreate={this.handleShowUniqueNameModal}
            handleUpdateData={this.handleUpdateNames}
            name={countryName}
            description={countryDescription}
            theme={theme}
            onInputChange={this.handleInputChange}
            onThemeChange={this.chooseTheme}
          />
          <Divider orientation="left">Blocks</Divider>
          <BlockSection
            blocks={totalBlockNumber}
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
          <Divider orientation="left">Host Blockchain</Divider>
          This bit country and its currency will be deployed on Whenua,
          Bit.Country’s Polkadot Parachain. See the Bit.Country Whenua
          Explorer
          <a
            href="http://explorer.bit.country/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" here "}
          </a>
          to see blockchain transactions and more.
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
        <UniqueNameModal
          visible={showUniqueNameModal}
          onCancel={this.handleHideUniqueNameModal}
          onSuccess={this.handleNewUniqueName}
        />
      </div>
    );
  }
}

export default AuthConnect(DAppConnect(UseRatesWrapper(CreateCountry), false));
