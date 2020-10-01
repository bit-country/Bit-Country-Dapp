import React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Divider, Input, Row, Button, Checkbox, Spin, Upload, Select, Form } from "antd";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import "./Profile.styles.css";
import { fetchAPI, fetchManual } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import Notification from "../../utils/Notification";
import Logging from "../../utils/Logging";

const { Option } = Select;

const ProfileField = ({ label, input }) => (
  <Row>
    {label && (
      <div>
        <label>
          {label}
        </label>
      </div>
    )}

    <Col
      xs={24}
      md={18}
      lg={12}
      xl={8}
    >
      {input}
    </Col>
  </Row>
);

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: {},
      image: null,
      imageUrl: null,
      loading: true,
      countries: [],
      promotedUrlPrefix: "http://",
      uidIsAvailable: true
    };
  }

  componentDidMount() {
    this.loadProfile();
  }

  loadProfile = async () => {
    try {
      const response = await fetchAPI(ENDPOINTS.GET_OWN_PROFILE);
      
      if (!response?.isSuccess) {
        throw Error("Error while retrieving current profile");
      }

      this.handleUrlChange({ target: { value: response.profile?.promotedUrl } });

      this.setState({
        profile: response.profile,
        loading: false,
        blogUID: response.profile.blogUID
      }, this.loadCountries);
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        <FormattedMessage
          id="user.profile.notification.error"
        />
      );
    }
  }

  checkMindUidAvailability = async blogUid => {
    try {
      const response = await fetchAPI(
        `${ENDPOINTS.CHECK_MINDUID_AVAILABILITY}?blogUid=${blogUid}`
      );

      if (response.isSuccess) {
        this.setState({
          uidIsAvailable: response.isAvailable
        });
      }
    } catch (error) {
      Logging.Error(error);
    }
  }

  loadCountries = async () => {
    const { userId } = this.state.profile;

    try {
      const responseCountry = await fetchAPI(
        `${ENDPOINTS.GET_COUNTRIES_BY_USER}?userId=${userId}&isOwner=false`
      );

      this.setState(state => ({
        countries:
          state.countries.concat(responseCountry.countries || [])
      }));
    } catch (error) {
      Logging.Error(error);
    }
  }

  handleBeforeUpload = async file => {
    this.setState({
      image: file,
      imageUrl: URL.createObjectURL(file)
    });
    
    return false;
  }

  handleChange = ({ target: { name, value } }) => {
    if (name == "blogUID") {
      window.clearTimeout(this.state.TimeoutId);
      var TimeoutId = window.setTimeout(() => this.checkMindUidAvailability(value), 500);
    }

    this.setState(state => ({
      profile: {
        ...state.profile,
        [name]: value
      },
      TimeoutId
    }));
  }

  handleUrlChange = ({ target: { value } }) => {
    if (!value) {
      return;
    }

    let { promotedUrlPrefix, promotedUrl } = this.state; 

    if (value.toLowerCase().startsWith("http://")) {
      promotedUrlPrefix = "http://";
      promotedUrl = value.replace("http://","");
    }
    else if (value.toLowerCase().startsWith("https://")) {
      promotedUrlPrefix = "https://";
      promotedUrl = value.replace("https://","");
    }
    else{
      promotedUrl = value;
    }

    this.setState(state => ({ 
      promotedUrlPrefix, 
      promotedUrl, 
      profile: {
        ...state.profile,
        promotedUrl: promotedUrlPrefix + promotedUrl
      } 
    }));
  }

  handleUrlPrefixChange = promotedUrlPrefix => {
    let { promotedUrl } = this.state; 

    this.setState(state => ({ 
      promotedUrlPrefix, 
      profile: {
        ...state.profile,
        promotedUrl: promotedUrlPrefix + promotedUrl
      } 
    }));
  }

  handleCountriesChange = value => {
    this.setState(state => ({
      profile: {
        ...state.profile,
        showCountries: value
      }
    }));
  }

  handleSave = async () => {
    const {
      profile,
      image
    } = this.state;

    const rule = /^[A-Za-z0-9_-]+$/;

    if ( profile.blogUID && !rule.test(profile.blogUID))
    {
      Notification.displayErrorMessage(
        <FormattedMessage
          id="user.profile.field.blogUID.error"
        />
      );

      return false;
    }

    this.setState({
      loading: true
    });

    try {
      const response = await fetchAPI(
        ENDPOINTS.UPDATE_PROFILE,
        "POST",
        profile
      );

      if (!response?.isSuccess) {
        throw Error("Error while updating profile");
      }

      if (image) {
        let formData = new FormData();

        formData.append("profileImage", image, image.name);
  
        const imageResponse = await fetchManual(
          ENDPOINTS.UPDATE_PROFILE_IMAGE,
          "POST",
          formData
        );

        if (!imageResponse?.isSuccess) {
          throw Error("Error while updating profile image");
        }

        this.setState({
          image: null,
        });
      }

      Notification.displaySuccessMessage(
        <FormattedMessage
          id="user.profile.notification.save.success"
        />
      );

      this.setState({
        blogUID: profile.blogUID
      }, this.props.reloadProfile);
    } catch (error) {
      Logging.Error(error);

      Notification.displayErrorMessage(
        <FormattedMessage
          id="user.profile.notification.save.failure"
        />
      );
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { 
      profile, 
      imageUrl,
      loading,
      blogUID,
      promotedUrlPrefix,
      promotedUrl
    } = this.state;

    const profileImage = imageUrl || profile.profileImageUrl;

    const selectBefore = (
      <Select 
        value={promotedUrlPrefix ? promotedUrlPrefix : "http://" }
        onChange={this.handleUrlPrefixChange}
      >
        <Option value="http://">Http://</Option>
        <Option value="https://">Https://</Option>
      </Select>
    );

    return (
      <Row id="skin" className={profile.skin}>
        <Spin
          spinning={loading}
        >
          <Col
            push={1}
            span={22}
            id="profile"
          >
            <Row
              gutter={[ 16, 16 ]}
              className="content"
            >
              <Col
                xs={24}
                md={8}
                lg={6}
                xl={4}
                className="left-col"
              >
                <div className="navigator">
                  <a href="#section-details">
                    <FormattedMessage id="profile.menu.details" />
                  </a>
                  <a href="#section-contact">
                    <FormattedMessage id="profile.menu.contact" />
                  </a>
                  <a href="#section-security">
                    <FormattedMessage id="profile.menu.security" />
                  </a>
                  <a href="#section-wallet">
                    <FormattedMessage id="profile.menu.wallet" />
                  </a>
                  <a href="#section-blog">
                    <FormattedMessage id="profile.menu.blog" />
                  </a>
                  <a href="#section-promotion">
                    <FormattedMessage id="profile.menu.promotion" />
                  </a>
                </div>
              </Col>
              <Col
                xs={24}
                md={16}
                lg={18}
                xl={20}
              >
                <h2>
                  <FormattedMessage
                    id="profile.title"
                  />
                </h2>
                <Divider orientation="left">
                  <span id="section-details">
                    <FormattedMessage
                      id="user.profile.section.details"
                    />
                  </span>
                </Divider>
                <Row>
                  <Col
                    xs={24}
                    md={18}
                    lg={12}
                    xl={8}
                    className="details"
                  >
                    <div>
                      <Upload
                        name="profileImage"
                        accept=".png,.jpg,.jpeg"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={this.handleBeforeUpload}
                      >
                        {profileImage ? (
                          <img src={profileImage} />
                        ) : (
                          <FormattedMessage
                            id="user.profile.field.profileImage"
                          />
                        )}
                      </Upload>
                    </div>
                    <div className="fields">
                      <div>
                        <div>
                          <label>
                            <FormattedMessage
                              id="user.profile.field.firstName"
                            />
                          </label>
                        </div>
                        <div>
                          <Input
                            name="firstName"
                            value={profile.firstName}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div>
                        <div>
                          <label>
                            <FormattedMessage
                              id="user.profile.field.lastName"
                            />
                          </label>
                        </div>
                        <div>
                          <Input
                            name="lastName"
                            value={profile.lastName}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div>
                        <div>
                          <label>
                            <FormattedMessage
                              id="user.profile.field.nickName"
                            />
                          </label>
                        </div>
                        <div>
                          <Input
                            name="nickname"
                            value={profile.nickname}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Divider orientation="left">
                  <span id="section-contact">
                    <FormattedMessage
                      id="user.profile.section.contact"
                    />
                  </span>
                </Divider>
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.emailAddress"
                    />
                  }
                  input={
                    <Input
                      name="emailAddress"
                      disabled={true}
                      value={profile.emailAddress}
                      onChange={this.handleChange}
                    />
                  }
                />
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.phoneNumber"
                    />
                  }
                  input={
                    <Input
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={this.handleChange}
                    />
                  }
                />
                <Divider orientation="left">
                  <span id="section-security">
                    <FormattedMessage
                      id="user.profile.section.security"
                    />
                  </span>
                </Divider>
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.currentPassword"
                    />
                  }
                  input={
                    <Input
                      name="currentPassword"
                      value={profile.currentPassword}
                      onChange={this.handleChange}
                    />
                  }
                />
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.newPassword"
                    />
                  }
                  input={
                    <Input
                      name="newPassword"
                      value={profile.newPassword}
                      onChange={this.handleChange}
                    />
                  }
                />
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.confirmPassword"
                    />
                  }
                  input={
                    <Input
                      name="confirmPassword"
                      value={profile.confirmPassword}
                      onChange={this.handleChange}
                    />
                  }
                />
                <Divider orientation="left">
                  <span id="section-wallet">
                    <FormattedMessage
                      id="user.profile.section.wallet"
                    />
                  </span>
                </Divider>
                <p>
                  <FormattedMessage
                    id="user.profile.section.wallet.description"
                  />
                </p>
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.walletAddress"
                    />
                  }
                  input={
                    <Input
                      name="walletAddress"
                      value={profile.walletAddress}
                      onChange={this.handleChange}
                    />
                  }
                />
                <Divider orientation="left">
                  <span id="section-blog">
                    <FormattedMessage
                      id="user.profile.section.blog"
                    />
                  </span>
                </Divider>
                <p>
                  <FormattedMessage
                    id="user.profile.section.blog.description"
                  />
                </p>
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.blogTitle"
                    />
                  }
                  input={
                    <Input
                      name="blogTitle"
                      value={profile.blogTitle}
                      onChange={this.handleChange}
                    />
                  }
                />
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.blogUID"
                    />
                  }
                  input={
                    <Form.Item
                      validateStatus={this.state.uidIsAvailable? "success" : "error"}
                      help={this.state.uidIsAvailable? null : "This uid is taken, please use another one"}
                    >
                      <Input
                        disabled={!!blogUID}
                        name="blogUID"
                        value={profile.blogUID}
                        onChange={this.handleChange}
                      />
                    </Form.Item>

                  }
                />
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.introduction"
                    />
                  }
                  input={
                    <Input
                      name="introduction"
                      value={profile.introduction}
                      onChange={this.handleChange}
                    />
                  }
                />
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.showCountries"
                    />
                  }
                  input={
                    <Select
                      style={{ width: "100%" }}
                      allowClear={true}
                      mode="multiple"
                      name="showCountries"
                      value={profile.showCountries ?? []}
                      onChange={this.handleCountriesChange}
                    >
                      {this.state.countries.map(country => (
                        <Select.Option key={country.id} value={country.uniqueId}>{country.name}</Select.Option>
                      ))}
                    </Select>
                  }
                />
                <Divider orientation="left">
                  <span id="section-promotion">
                    <FormattedMessage
                      id="user.profile.section.promotion"
                    />
                  </span>
                </Divider>
                <p>
                  <FormattedMessage
                    id="user.profile.section.promotion.description"
                  />
                </p>
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.promotionLink.title"
                    />
                  }
                  input={
                    <Input
                      name="promotedUrlName"
                      maxLength={80}
                      value={profile.promotedUrlName}
                      onChange={this.handleChange}
                    />
                  }
                />
                <ProfileField
                  label={
                    <FormattedMessage
                      id="user.profile.field.promotion.title"
                    />
                  }
                  input={
                    <Input
                      name="promotedUrl"
                      maxLength={500}
                      value={promotedUrl}
                      onChange={this.handleUrlChange}
                      addonBefore={selectBefore}
                    />
                  }
                />
                <Divider orientation="left">
                  <span id="section-notifications">
                    <FormattedMessage
                      id="user.profile.section.notifications"
                    />
                  </span>
                </Divider>
                <p>
                  <FormattedMessage
                    id="user.profile.section.notifications.description"
                  />
                </p>
                <ProfileField
                  input={(
                    <>
                      <Checkbox
                        checked={profile.consentToBeContacted}
                        onChange={
                          ({ target: { checked } }) => 
                            this.handleChange({ target: { name: "consentToBeContacted", value: checked } })
                        }
                      />
                      <label>
                        <FormattedMessage
                          id="user.profile.field.consentToContact"
                        />
                      </label>
                    </>
                  )}
                />
                <ProfileField
                  input={(
                    <>
                      <Checkbox
                        checked={profile.consentToBeNotifiedAboutComments}
                        onChange={
                          ({ target: { checked } }) => 
                            this.handleChange({ target: { name: "consentToBeNotifiedAboutComments", value: checked } })
                        }
                      />
                      <label>
                        <FormattedMessage
                          id="user.profile.field.consentToBeNotifiedAboutComments"
                        />
                      </label>
                    </>
                  )}
                />
                <ProfileField
                  input={(
                    <>
                      <Checkbox
                        checked={profile.consentToBeNotifiedAboutLikes}
                        onChange={
                          ({ target: { checked } }) => 
                            this.handleChange({ target: { name: "consentToBeNotifiedAboutLikes", value: checked } })
                        }
                      />
                      <label>
                        <FormattedMessage
                          id="user.profile.field.consentToBeNotifiedAboutLikes"
                        />
                      </label>
                    </>
                  )}
                />
                <Divider />
                <div className="actions">
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={this.handleSave}
                  >
                    <FormattedMessage
                      id="user.profile.actions.save"
                    />
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Spin>
      </Row>
    );
  }
}

export default AuthConnect(Profile, true);
