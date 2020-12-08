import React from "react";
import { fetchAPI, setCustomHeader } from "../../../utils/FetchUtil";
import ENDPOINTS from "../../../config/endpoints";
import { AuthConnect } from "../Auth/AuthContext";
import Notification from "../../../utils/Notification";
import Logging from "../../../utils/Logging";
import { wrappedComponentRenderer } from "../WrappedComponentRenderer";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, Form, Input, Modal, Spin } from "antd";
import LoginForm from "../../LoginForm";
import { navigate } from "@reach/router";
import residencyTypes from "../../../config/residencyTypes";
import residencyAcceptanceTypes from "../../../config/residencyAcceptanceTypes";
import "./CountryWrapper.css";


const defaultState = {
  country: null,
  signInWithProviderModal: false,
  signInProvider: null,
  applyForResidencyModal: false,
  blockDetails: null,
  themeUrl: "",
  isOwner: false,
  isModerator: false,
  isResident: false,
  hasBlockPurchasePermission: false,
  loadingCountry: true,
  loadingResidency: false,
  residencyType: residencyTypes.CLOSED,
  processingApplication: false,
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
    const countryBlockPurchasePermission = this.loadUserBlockPurchasePermission();
    const countryBlockDetails = this.loadCountryBlockDetails();

    await Promise.all([ countryById, countryRole, countryBlockPurchasePermission, countryBlockDetails ]);

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
        residencyType: response.country?.residencyType ?? residencyTypes.CLOSED
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

  loadUserBlockPurchasePermission = async() => {
    const { 
      loggedIn,
      id: countryId,
      user
    } = this.props;

    if (!loggedIn) {
      return;
    }

    const {
      id: userId
    } = user;

    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_USER_BLOCKPURCHASE_PERMISSION}?countryId=${countryId}&userId=${userId}`
      );

      if (!response?.isSuccess) {
        throw Error("Error while getting block purchase permission for user");
      }

      this.setState({
        hasBlockPurchasePermission: response.hasBlockPurchasePermission
      });
    } catch (error) {
      Logging.Error(error);
    }    
  }
  
  joinCountry = async data => {
    const {
      location: { state },
    } = this.props;

    let requestData = {
      countryId: this.props.id,
    };

    if (data) {
      requestData.message = data.message;
    }
    
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
        if (response?.message || response?.json?.message) {
          Notification.displayErrorMessage(
            <FormattedMessage id={response.message || response.json.message} />
          );
  
          throw Error(response.message || response.json.message);
        }

        // TODO Add default error message

        this.setState({
          loadingResidency: false
        });

        return;
      }

      switch (response.status) {
        case residencyAcceptanceTypes.Rejected:
          Notification.displayErrorMessage(
            <FormattedMessage
              id="country.resident.notifications.rejected"
            />
          );

          break;

        case residencyAcceptanceTypes.Submitted:
          Notification.displaySuccessMessage(
            <FormattedMessage
              id="country.resident.notifications.submitted"
            />
          );

          break;
        
        case residencyAcceptanceTypes.Approved:
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
          });
          break;

        default:
          Notification.displayErrorMessage(
            "Application has uncertain status, please contact development team"
          );

          break;
      }
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        "Error becoming a resident, please try again later"
      );
    } finally {
      this.setState({
        loadingResidency: false
      });
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

  applyForResidence = async () => {
    const {
      residencyType
    } = this.state.country;

    switch(residencyType) {
      case residencyTypes.PUBLIC:
        this.setState({
          processingApplication: true
        }, this.openApplyForResidencyModal);

        await this.joinCountry();

        this.setState({
          processingApplication: false
        }, this.closeApplyForResidencyModal);

        return;

      case residencyTypes.APPLICATION:
      case residencyTypes.INVITATION_ONLY:
        this.openApplyForResidencyModal();

        return;

      case residencyTypes.CLOSED:
        Notification.displayErrorMessage(
          <FormattedMessage
            id="country.residencyClosed"
          />
        );

        return;
    }
  }

  openApplyForResidencyModal = () => {
    this.setState({ applyForResidencyModal: true });
  }

  closeApplyForResidencyModal = () => {
    this.setState({ applyForResidencyModal: false });
  }

  handleResidencyApplication = async e => {
    e.preventDefault();

    this.setState({
      processingApplication: true
    });

    const form = new FormData(e.target);

    await this.joinCountry({ message: form.get("message") });

    this.closeApplyForResidencyModal();

    this.setState({ processingApplication: false });
  }

  render() {
    const { 
      children,
      intl
    } = this.props;
    const {
      signInWithProviderModal,
      signInProvider,
      applyForResidencyModal,
      processingApplication
    } = this.state;

    return (
      <CountryContext.Provider 
        value={{ 
          ...this.state, 
          countryId: this.props.id,
          loggedIn: this.props.loggedIn,
          joinCountry: this.applyForResidence, 
          leaveCountry: this.leaveCountry,
          openSignInWithProviderModal: this.openSignInWithProviderModal,
          closeSignInWithProviderModal: this.closeSignInWithProviderModal,
          openApplyForResidencyModal: this.openApplyForResidencyModal,
          closeApplyForResidencyModal: this.closeApplyForResidencyModal,
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
        <Modal
          visible={applyForResidencyModal}
          onCancel={this.closeApplyForResidencyModal}
          closable
          maskClosable
          footer={null}
        >
          {processingApplication ? (
            <>
              <h2>
                <FormattedMessage
                  id="testtest"
                  defaultMessage="Your application has been submitted"
                />
              </h2>
              <div className="processing-application">
                <Spin size="large" tip="Processing..." />
              </div>
            </>
          ) : (
            <Form onSubmit={this.handleResidencyApplication}>
              <h2>
                <FormattedMessage
                  id="country.residencyModal.title"
                  defaultMessage="Submit your residency application"
                />
              </h2>
              <Form.Item
                label={
                  <FormattedMessage
                    id="country.residencyModal.message"
                    defaultMessage="Message"
                  />
                }
              >
                <Input.TextArea
                  name="message"
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  allowClear
                  placeholder={intl.formatMessage({
                    id: "country.residencyModal.messagePlaceholder",
                    defaultMessage: "Why should this country owner accept your application?"
                  })}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  <FormattedMessage
                    id="form.submit"
                  />
                </Button>
              </Form.Item>
            </Form>
          )}
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

export default injectIntl((AuthConnect(CountryWrapper)));
