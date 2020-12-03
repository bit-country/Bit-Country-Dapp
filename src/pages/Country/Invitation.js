import React, { Component } from "react";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import { Button, Form, Input } from "antd";
import Notification from "../../utils/Notification";
import { FormattedMessage } from "react-intl";
import { Link } from "@reach/router";
const { TextArea } = Input;

class Invitation extends Component {
  state = {
    welcomeMessage: "",
    welcomeMessageHistory: "",
    invitationLink: "",
    emailAddresses: "",
  };

  componentDidMount() {
    if (this.props && this.props.loggedIn) {
      this.setState({
        invitationLink: `${window.location.origin}/c/${this.props.id}/welcome/${this.props.user.id}`,
      });
    }

    this.loadWelcomeMessage();
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  loadWelcomeMessage = async () => {
    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_WELCOME_MESSAGE}?countryId=${this.props.id}`
      );

      if (!response?.isSuccess) {
        throw Error("Error loading welcome message");
      }

      this.setState({
        welcomeMessage: response.welcomeMessage,
        welcomeMessageHistory: response.welcomeMessage
      });
    } catch (error) {
      throw false;
    }
  };

  updataWelcomeMessage = async () => {
    const data = {
      message: this.state.welcomeMessage,
      countryId: this.props.id
    };

    try {
      const response = await fetchAPI(
        ENDPOINTS.UPDATE_WELCOME_MESSAGE,
        "POST",
        data
      );

      if (!response) {
        throw Error("Error updating welcome message");
      } else {
        this.setState({ welcomeMessageHistory: data.message });
        Notification.displaySuccessMessage("Message saved");
      }
    } catch (error) {
      throw false;
    }
  };

  copyLink = () => {
    var copyText = document.getElementById("invitation-link");
    
    copyText.select();
    document.execCommand("copy");

    Notification.displaySuccessMessage("Link copied");
  }

  sendInvitationEmail = async () => {
    const data = {
      invitationLink: this.state.invitationLink,
      emailAddresses: this.state.emailAddresses,
      countryName: this.props.country.name
    };

    try {
      const response = await fetchAPI(
        `${ENDPOINTS.SEND_INVITATION_EMAIL}?countryUid=${this.props.id}`,
        "POST",
        data
      );

      if (!response) {
        throw Error("Error sendind invitation email");
      } else {
        this.setState({ emailAddresses: "" });
        Notification.displaySuccessMessage("Email sent");
      }
    } catch (error) {
      throw false;
    }
  };

  render() {
    const { isOwner, isModerator } = this.props;

    return (
      <div id="invitation">
        <div className="ui container hero-content">
          <div className="ui header center aligned">
            <Form layout="vertical">
              <Form.Item label="Invitation Message">
                <TextArea
                  rows={4}
                  disabled={!(isOwner || isModerator)}
                  placeholder="Enter Welcome Message"
                  value={this.state.welcomeMessage}
                  name="welcomeMessage"
                  onChange={this.handleChange}
                />
                <Link to={this.props.loggedIn ? `welcome/${this.props.user.id}` : ""}> {/* Can we get the desired style here? */}
                  <Button>
                    <FormattedMessage id="form.preview" />
                  </Button>
                </Link>
                <Button
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={this.updataWelcomeMessage}
                  disabled={
                    this.state.welcomeMessage ==
                    this.state.welcomeMessageHistory
                  }
                >
                  <FormattedMessage id="form.save" />
                </Button>
              </Form.Item>
              <Form.Item label="Invitation Link">
                <Input
                  id="invitation-link"
                  placeholder="Invitation Link"
                  value={this.state.invitationLink}
                  addonAfter={(
                    <a onClick={this.copyLink}>
                      Copy link  
                    </a>
                  )}
                />
              </Form.Item>
              <Form.Item label="Invitation Email">
                <TextArea
                  rows={4}
                  placeholder={
                    "Enter user emails, please separate them with \",\""
                  }
                  value={this.state.emailAddresses}
                  name="emailAddresses"
                  onChange={this.handleChange}
                />
                <Button
                  onClick={() => {
                    this.setState({ emailAddresses: "" });
                  }}
                >
                  <FormattedMessage
                    id="form.cancel"
                  />
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={this.sendInvitationEmail}
                  disabled={!this.state.emailAddresses}
                >
                  <FormattedMessage
                    id="form.send"
                  />
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthConnect(Invitation);
