import React, { Component } from "react";
import { Row, Col, Statistic } from "antd";
import ENDPOINTS from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import country from "../../assets/images/country-01.svg";
import create from "../../assets/images/create-01.svg";
import users from "../../assets/images/people-01.svg";
import money from "../../assets/images/token-01.svg";
import post from "../../assets/images/post-01.svg";
import { FormattedMessage } from "react-intl";
import Logging from "../../utils/Logging";

export default class Activities extends Component {
  state = {
    activities: {}
  };

  componentDidMount() {
    this.loadActivies();
  }

  loadActivies = async () => {
    try {
      const response = await fetchAPI(ENDPOINTS.GET_ACTIVITIES);

      if (response?.isSuccess) {
        this.setState({
          activities: response.activities
        });
      }
    } catch (error) {
      Logging.Error(error);
    }
  };

  render() {
    const { activities } = this.state;

    return (
      <div className="activities center">
        <div className="mask">
          <Row>
            <Col xs={0} md={1} lg={2} xl={3}></Col>
            <Col xs={24} md={22} lg={20} xl={18}>
              <Row>
                <Col span={4}>
                  <img src={country} />
                  <Statistic
                    title={
                      <FormattedMessage id="home.activities.countriesEstablished" />
                    }
                    value={activities.countries}
                  />
                </Col>

                <Col push={1} span={4}>
                  <img src={create} />
                  <Statistic
                    title={
                      <FormattedMessage id="home.activities.blocksCreated" />
                    }
                    value={activities.blocks}
                  />
                </Col>
                <Col push={2} span={4}>
                  <img src={users} />
                  <Statistic
                    title={
                      <FormattedMessage id="home.activities.residentsJoined" />
                    }
                    value={activities.residents}
                  />
                </Col>
                <Col push={3} span={4}>
                  <img src={money} />
                  <Statistic
                    title={
                      <FormattedMessage id="home.activities.tokensTransferred" />
                    }
                    value={activities.tokens}
                  />
                </Col>
                <Col push={4} span={4}>
                  <img src={post} />
                  <Statistic
                    title={
                      <FormattedMessage id="home.activities.storiesPosted" />
                    }
                    value={activities.stories}
                  />
                </Col>
              </Row>
              {/* <h2 className="duration inverted">In the last 7 days</h2> */}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
