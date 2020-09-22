import React, { Component } from "react";
import Utils from "../../utils/Utils";
import { navigate } from "@reach/router";

export default class Country extends Component {
  state = {
    countryStatus: ""
  };

  componentDidMount() {   
    this.setState({
      countryStatus: "Confirmed"
    });
  }

  gotoCountry = () => {
    navigate(`/c/${this.props.country.id}`);
  }

  render() {
    return (
      <div className="card">
        <div className="image">
          <img src={Utils.getTheme(this.props.country.theme)} />
        </div>
        <div className="content">
          <div className="header">{this.props.country.name}</div>
          <div className="meta">
            <a>
              President:
              <span className="ui link owner">
                {this.props.country.president}
              </span>
            </a>
          </div>
          <div className="description">{this.props.country.description}</div>
        </div>
        <div className="extra content value-content">
          <div className="ui two column grid">
            <div className="column">
              <div role="list" className="ui list">
                <div role="listitem" className="item">
                  <div className="header">Reserve Bank</div>
                  <span className="value-description">
                  </span>
                </div>
                <div role="listitem" className="item">
                  <div className="header">Population</div>
                  <span className="value-description">
                    {this.props.country.population}
                  </span>
                </div>
              </div>
            </div>
            <div className="column">
              <div role="list" className="ui list">
                <div role="listitem" className="item">
                  <div className="header">Estimated value</div>
                  <span className="value-description">
                  </span>
                </div>
                <div role="listitem" className="item">
                  <div className="header">Theme</div>
                  <span className="value-description">
                    {this.props.country.theme}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.countryStatus == "Confirmed" ? (
          <React.Fragment>
            <div className="extra content digital-assets">
              <div className="description">Digital assets:</div>
              <div className="ui tiny images">
              </div>
            </div>
            <div className="ui basic segment button-group-section">
              <div>
                <a className="ui black button" onClick={this.gotoCountry}>
                  Go to country<i
                    aria-hidden="true"
                    className="angle right icon"
                  />
                </a>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="ui blue message transaction-message">
              Your transaction is still pending. <br /> We need at least 2 block
              confirmed
            </div>
            <div className="ui basic segment button-group-section">
              <a className="ui black disabled button">
                Pending<i aria-hidden="true" className="angle right icon" />
              </a>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
