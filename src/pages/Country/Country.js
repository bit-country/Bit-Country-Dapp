import React, { Component } from "react";
import BlockGrid from "./BlockGrid";
import Utils from "../../utils/Utils";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { Row, Col, Button, Menu, Drawer } from "antd";
import Invitation from "./Invitation";
import ActivityRules from "./CountryActivityRules";
import { FormattedMessage } from "react-intl";
import "./Country.styles.css";
import CountryDetail from "../../components/CountryDetail";
import { CountryConnect } from "../../components/HOC/Country/CountryWrapper";
import Spinner from "../../components/Spinner";
import { Link } from "@reach/router";
import residencyTypes from "../../config/residencyTypes";

class Country extends Component {
  state = {
    drawer: {
      visible: false,
      key: "map",
      title: null,
    },
  };

  getTheme = () => {
    if (this.props.country?.theme) {
      return Utils.getTheme(this.props.country.theme);
    }

    return Utils.getTheme(0);
  };

  renderDrawer = () => {
    const { id, location, isOwner, isModerator, country } = this.props;

    switch (this.state.drawer.key) {
      case "invite":
        return <Invitation id={id} location={location} isOwner={isOwner} isModerator={isModerator} country={country}/>;
      case "rules":
        return <ActivityRules id={id} isOwner={isOwner} isModerator={isModerator} country={country} />;
    }
  };

  onClose = () => {
    this.setState({
      drawer: {
        visible: false,
        key: "map"
      },
    });
  };

  handleClick = ({ key }) => {
    switch (key) {
      case "invite":
        this.setState({
          drawer: {
            visible: true,
            key,
            title: <FormattedMessage id="country.invitePeople" />,
          },
        });

        break;
      case "rules":
        this.setState({
          drawer: {
            visible: true,
            key,
            title: <FormattedMessage id="country.activityRules" />,
          },
        });

        break;
      default:
        this.setState({
          drawer: {
            visible: false,
            key,
            title: false,
          },
        });

        break;
    }
  }

  render() {
    const { drawer } = this.state;
    const {
      loadingCountry,
      country,
      signInProvider,
      blockDetails,
      refreshBlocks,
      isResident,
      isOwner,
      hasBlockPurchasePermission,
      navigate,
      joinCountry,
      leaveCountry,
      loggedIn,
      loadingResidency,
      openSignInWithProviderModal,
      residencyType
    } = this.props;

    return (
      <>
        {loadingCountry ? (
          <Spinner />
        ) : (
          <div id="country-page">
            <Row className="body">
              <Col xs={24} md={8} lg={6} className="menu">
                <CountryDetail 
                  country={country} 
                  signInProvider={(
                    signInProvider && !loggedIn && 
                      <div className="sign-in-provider">
                        <label htmlFor="sign-in">
                          <FormattedMessage 
                            id="country.signInWithProvider" 
                            values={{
                              name: signInProvider.name
                            }}
                          />
                        </label>
                        <Button
                          type="primary"
                          id="sign-in"
                          onClick={openSignInWithProviderModal}
                        >
                          {signInProvider.imageURL ? (
                            <div>
                              <img src={signInProvider.imageURL} width="100rem" />
                            </div>
                          ) : (
                            <FormattedMessage 
                              id="country.signInWithProvider" 
                              values={{
                                name: signInProvider.name
                              }}
                            />
                          )}
                        </Button>
                      </div>
                  )}
                >
                  <div className="country-actions">
                    {!isResident ? (
                      <Button 
                        onClick={joinCountry} 
                        disabled={!loggedIn || residencyType == residencyTypes.CLOSED}
                        loading={loadingResidency}
                        type="primary"
                      >
                        <span>
                          { residencyType == residencyTypes.PUBLIC ? (
                            <FormattedMessage id="country.becomeResident" />
                          ) : residencyType == residencyTypes.INVITATION_ONLY ? (
                            <FormattedMessage id="country.invitationOnly" />
                          ) : residencyType == residencyTypes.APPLICATION ? (
                            <FormattedMessage id="country.applicationOnly" />
                          ) : (
                            <FormattedMessage id="country.residencyClosed" />
                          )}
                        </span>
                      </Button>
                    ) : (
                      <Button
                        disabled={isOwner}
                        onClick={leaveCountry}
                        loading={loadingResidency}
                      >
                        <FormattedMessage id="country.leaveResident" />
                      </Button>
                    )}
                  </div>
                </CountryDetail>
                <Menu
                  onClick={this.handleClick}
                  mode="inline"
                  selectedKeys={drawer.key}
                >
                  <Menu.Item key="map" onClick={this.onClose}>
                    <FormattedMessage id="country.map" />
                  </Menu.Item>
                  {loggedIn && (
                    <Menu.Item
                      key="invite"
                    >
                      <FormattedMessage id="country.invitePeople" />
                    </Menu.Item>
                  )}
                  <Menu.Item
                    key="rules"
                  >
                    <FormattedMessage id="country.activityRules" />
                  </Menu.Item>
                  <Menu.Item
                    key="governing"
                  >
                    <Link to="governing">
                      <FormattedMessage id="country.governing" />
                    </Link>
                  </Menu.Item>
                </Menu>
              </Col>
              <Col xs={24} md={16} lg={18} className="map">
                <Drawer
                  title={drawer.title}
                  placement="left"
                  closable={true}
                  maskClosable={true}
                  onClose={this.onClose}
                  visible={drawer.visible}
                  getContainer={false}
                  width={800}
                  className="drawer"
                >
                  {this.renderDrawer()}
                </Drawer>
                <BlockGrid
                  country={country}
                  blockDetails={blockDetails}
                  isOwner={isOwner}
                  isResident={isResident}
                  hasPurchasePermission={hasBlockPurchasePermission}
                  navigate={navigate}
                  onBlockUpdate={refreshBlocks}
                />
              </Col>
            </Row>
          </div>
        )}
      </>
    );
  }
}

export default AuthConnect(CountryConnect(Country));
