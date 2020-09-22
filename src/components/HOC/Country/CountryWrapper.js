import React from "react";
import { fetchAPI, setCustomHeader } from "../../../utils/FetchUtil";
import ENDPOINTS from "../../../config/endpoints";
import { AuthConnect } from "../Auth/AuthContext";
import Notification from "../../../utils/Notification";
import Logging from "../../../utils/Logging";
import { wrappedComponentRenderer } from "../WrappedComponentRenderer";
import { FormattedMessage } from "react-intl";
import { Modal } from "antd";
import LoginForm from "../../LoginForm";
import { navigate } from "@reach/router";


const defaultState = {
  country: null,
  signInWithProviderModal: false,
  signInProvider: null,
  blockDetails: null,
  themeUrl: "",
  isOwner: false,
  isModerator: false,
  isResident: false,
  loadingCountry: true,
  loadingResidency: false
};

const CountryContext = React.createContext(defaultState);

class CountryWrapper extends React.PureComponent {
  state = defaultState;

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.loadData();
    }
  }

  loadData = async () => {
    this.setState({
      loadingCountry: true
    });

    const countryById = this.loadCountryById();
    const countryRole = this.loadUserCountryRole();
    const countryBlockDetails = this.loadCountryBlockDetails();

    await Promise.all([ countryById, countryRole, countryBlockDetails ]);

    this.setState({
      loadingCountry: false
    });
  }

  loadCountryById = async () => {
    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_COUNTRY}?countryId=${this.props.id}`
      );

      if (response?.status == 404) {
        navigate("/404/c");

        return;
      } else if (!response?.isSuccess) {
        throw Error("Error while retrieving country data");
      }

      this.setState({
        country: response.country,
        signInProvider: response.signInProvider ?? null,
      });

      setCustomHeader("countryId", response.country.uniqueId);
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(error);
    }
  }

  loadCountryBlockDetails = async () => {
    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_BLOCKS_BY_COUNTRY}?countryId=${this.props.id}`
      );

      if (!response?.isSuccess) {
        throw Error("Error while retrieving country data");
      }

      this.setState({
        blockDetails: response.blocks,
      });
    } catch (error) {
      Logging.Error(error);
    }
  };

  refreshBlocks = async () => {
    const country = this.loadCountryById();
    const block = this.loadCountryBlockDetails();

    await Promise.all([ country, block ]);
  }

  loadUserCountryRole = async () => {
    if (!this.props.loggedIn) {
      return;
    }

    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_USER_COUNTRY_ROLE}?countryId=${this.props.id}&userId=${this.props.user.id}`
      );

      if (!response?.isSuccess) {
        throw Error("Error while getting country role");
      }

      let newState = {
        isResident: response.userCountryRole
      };

      switch (response.userCountryRole) {
        case "Owner":
          newState.isOwner = true;
          break;
        case "Moderator":
          newState.isModerator = true;
          break;
        default:
          break;
      }

      this.setState(newState);
    } catch (error) {
      Logging.Error(error);
    }
  }
  
  joinCountry = async () => {
    const {
      location: { state },
    } = this.props;

    let requestData = {
      countryId: this.props.id,
    };
    
    if (state) {
      requestData.referrerId = state.referredId;
    }
    
    this.setState({ loadingResidency: true });

    try {
      const response = await fetchAPI(
        ENDPOINTS.JOIN_COUNTRY,
        "POST",
        requestData
      );

      if (!response?.isSuccess) {
        throw Error("Error becoming a resident");
      }

      Notification.displaySuccessMessage(
        <FormattedMessage
          id="country.resident.notifications.joined"
          values={{
            country: this.state.country.name
          }}
        />
      );

      this.setState({
        isResident: true,
        loadingResidency: false
      });
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        "Error becoming a resident, please try again later"
      );
    }
  }

  leaveCountry = async () => {
    this.setState({ loadingResidency: true });

    try {
      const response = await fetchAPI(ENDPOINTS.LEAVE_COUNTRY, "POST", {
        countryId: this.props.id,
      });

      if (!response?.isSuccess) {
        throw Error("Error leaving the country");
      }

      Notification.displaySuccessMessage(
        <FormattedMessage
          id="country.resident.notifications.left"
          values={{
            country: this.state.country.name
          }}
        />
      );

      this.setState({
        isResident: false,
        isModerator : false,
        loadingResidency: false
      });
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        "Error leaving the country, please try again later"
      );
    }
  }

  openSignInWithProviderModal = () => {
    this.setState({
      signInWithProviderModal: true
    });
  }

  closeSignInWithProviderModal = () => {
    this.setState({
      signInWithProviderModal: false
    });
  }

  handleProviderSignIn = async (username, password) => {
    const {
      sendLoginWithProvider
    } = this.props;
    const {
      signInProvider
    } = this.state;
   
    if (!signInProvider) {
      return;
    }

    const response = await sendLoginWithProvider(username, password, signInProvider.providerId);

    if (response) {
      await this.loadUserCountryRole();

      Notification.displaySuccessMessage(
        <FormattedMessage
          id="account.login.provider.notification.success"
          values={{
            name: signInProvider.name
          }}
        />
      );

      this.closeSignInWithProviderModal();
    }
  }

  render() {
    const { 
      children
    } = this.props;
    const {
      signInWithProviderModal,
      signInProvider
    } = this.state;

    return (
      <CountryContext.Provider 
        value={{ 
          ...this.state, 
          countryId: this.props.id,
          joinCountry: this.joinCountry, 
          leaveCountry: this.leaveCountry,
          openSignInWithProviderModal: this.openSignInWithProviderModal,
          closeSignInWithProviderModal: this.closeSignInWithProviderModal,
          refreshBlocks: this.refreshBlocks,
        }}
      >
        {children}
        <Modal
          visible={signInWithProviderModal}
          onCancel={this.closeSignInWithProviderModal}
          closable
          maskClosable
          footer={null}
        >
          <LoginForm 
            onLogin={this.handleProviderSignIn}
            imageURL={signInProvider?.imageURL}
            providerName={signInProvider?.name}
          />
        </Modal>
      </CountryContext.Provider>
    );
  }
}

// eslint-disable-next-line react/display-name
export const CountryConnect = (WrappedComponent, requiresCountry) => props => (
  <CountryContext.Consumer>
    {value => wrappedComponentRenderer(WrappedComponent, requiresCountry ? "loadingCountry" : null, props, value, true)}
  </CountryContext.Consumer>
);

export default AuthConnect(CountryWrapper);
