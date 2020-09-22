import React, { Component } from "react";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import { Row, Col, Input, Tooltip, List } from "antd";
import { FormattedMessage } from "react-intl";
import "./CountryActivityRules.styles.css";
import Logging from "../../utils/Logging";
import Notification from "../../utils/Notification";

class CountryActivityRules extends Component {
  state = {
    rules: {}
  };

  componentDidMount() {
    this.loadRulesByCountryId();
    this.loadCountryInsights();
  }

  loadRulesByCountryId = async () => {
    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_RULES_BY_COUNTRY}?countryId=${this.props.id}`
      );

      if (response?.isSuccess) {
        const rulesObject = Object.assign({}, response.rules);

        this.setState({ rules: rulesObject });
      }
    } catch (error) {
      Logging.Error(new Error("Error while retrieving activity rules"), error);

      Notification
        .displayErrorMessage(
          <FormattedMessage id="country.activity.rules.notification.error" />
        );
    }
  };

  loadCountryInsights = async () => {
    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_COUNTRY_INSIGHTS}?countryUid=${this.props.id}`
      );

      if (response?.isSuccess) {
        this.setState({ insights: response.countryInsights });
      }
    } catch (error) {
      Logging.Error(new Error("Error while retrieving activity rules"), error);

      Notification
        .displayErrorMessage(
          <FormattedMessage id="country.activity.rules.notification.error" />
        );
    }
  }

  onBlur = async (e, title) => {
    let { value } = e.target;

    if (value.charAt(value.length - 1) === "." || value === "-") {
      value = value.slice(0, -1);
      // eslint-disable-next-line react/no-access-state-in-setstate
      const newRules = Object.assign({}, this.state.rules);

      newRules[title] = value;
      this.setState({ rules: newRules });
    }

    try {
      await fetchAPI(
        ENDPOINTS.UPDATE_RULES,
        "POST",
        this.state.rules
      );
    } catch (error) {
      Logging.Error("DEBUG--CountryActivityRules: " + error);
    }
  };

  onChange = (e, title) => {
    let { value } = e.target;
    const reg = /^[+]?([.]\d+|\d+[.]?\d*)$/; ///no need of sign

    if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
      // eslint-disable-next-line react/no-access-state-in-setstate
      const newRules = Object.assign({}, this.state.rules);

      newRules[title] = value;
      this.setState({ rules: newRules });
    }
  };

  getLocalisedTitle = title => (
    <FormattedMessage
      id={`country.activity.rules.${title}`}
    />
  )

  render() {
    const rulesObject = this.state.rules;
    const { insights } = this.state;
    const rulesTitles = Object.keys(rulesObject);
    const { isOwner, isModerator } = this.props;

    const content = rulesTitles.map((title, index) => {
      if (title !== "id" && title !== "countryId" && title !== "isDeleted") {
        return (
          <Row type="flex" justify="center" key={index} className="rule">
            <Col 
              span={16}
              className="name"
            >
              {this.getLocalisedTitle(title)}
            </Col>
            <Col 
              span={6} 
              className="incentive"
            >
              <Tooltip
                trigger={[ "focus" ]}
                placement="center"
                overlayClassName="numeric-input"
              >
                <Input
                  disabled={!(isOwner || isModerator)}
                  style={{ width: 120 }}
                  value={rulesObject[title]}
                  onChange={e => this.onChange(e, title)}
                  onBlur={e => this.onBlur(e, title)}
                  placeholder="Input a value"
                  maxLength={25}
                />
              </Tooltip>
            </Col>
            <Col span={2} className="symbol">
              {this.props.country?.token?.symbol}
            </Col>
          </Row>
        );
      }

      return false;
    });

    let listItems = [];
    
    for (let i = 1; i < 5; i++) {
      listItems.push(
        <List.Item>
          <List.Item.Meta
            title={(
              <FormattedMessage
                id={`country.activity.rules.reasoning.${i}.title`}
              />
            )}
            description={(
              <FormattedMessage
                id={`country.activity.rules.reasoning.${i}.description`}
              />
            )}
          />
        </List.Item>
      );
    }

    return (
      <div id="activity-rules">
        <Col 
          span={20}
          offset={2}
          className="content"
        >
          {(isOwner || isModerator)? (
          <div className="title">
            <h5>
              <FormattedMessage id="country.activity.rules.title" />
            </h5>
          </div>
          ) : null }
          <div className="activity-rules-info">
            <h2>
              <FormattedMessage
                id="country.activity.rules.incentiveCapTitle"
                defaultMessage="Rewards"
              />
            </h2>
            <Row>
              <Col span={12}>
                <div className="stat">
                  <div className="value">{rulesObject.rewardCap - insights?.availableTokens}</div>
                  <div className="stat-title">
                    <FormattedMessage
                      id="country.activity.rules.incentiveCap.current"
                      defaultMessage="Distributed"
                    />
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="stat">
                  <div className="value">{insights?.availableTokens}</div>
                  <div className="stat-title">
                    <FormattedMessage
                      id="country.activity.rules.incentiveCap.remaining"
                      defaultMessage="Remaining"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            {content}
            {/* <Row type="flex" justify="center" key="rewards-cap" className="rule">
              <Col 
                span={16}
                className="name"
              >
                <FormattedMessage
                  id="country.activity.rules.rewardCap"
                  defaultMessage="Incentives cap"
                />
              </Col>
              <Col 
                span={6} 
                className="incentive"
              >
                <Tooltip
                  trigger={[ "focus" ]}
                  placement="center"
                  overlayClassName="numeric-input"
                >
                  <Input
                    disabled={!(isOwner || isModerator)}
                    style={{ width: 120 }}
                    value={rulesObject["rewardCap"]}
                    onChange={e => this.onChange(e, "rewardCap")}
                    onBlur={e => this.onBlur(e, "rewardCap")}
                    placeholder="Input a value"
                    maxLength={25}
                  />
                </Tooltip>
              </Col>
              <Col span={2} className="symbol">
                {this.props.country?.token?.symbol}
              </Col>
            </Row> */}
          </div>
          <div className="activity-rules-message">
            <List
              header={(
                <h2>
                  <FormattedMessage
                    id="country.activity.rules.reasoning.title"
                    values={{
                      token: this.props.country?.token?.symbol
                    }}
                  />
                </h2>
              )}
            >
              {listItems}
            </List>
          </div>
        </Col>
      </div>
    );
  }
}

export default CountryActivityRules;
