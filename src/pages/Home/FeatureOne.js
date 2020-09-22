import React, { Component } from "react";
import countryCardImage from "../../assets/images/country-card.png";

export default class FeatureOne extends Component {
  render() {
    return (
      <div className="ui segment feature-one noBorder">
        <div className="container">
          <div className="ui grid">
            <div className="row">
              <div className="eight wide column">
                <div className="ui image">
                  <img src={countryCardImage} />
                </div>
              </div>
              <div className="eight wide column column-content">
                <div className="ui header">
                  <h2>Your world is limitless</h2>
                </div>
                <h3>Build your own country and economy</h3>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation
                </p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation
                </p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
