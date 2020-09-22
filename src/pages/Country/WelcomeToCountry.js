import React, { Component } from "react";
import BlockGrid from "./BlockGrid";

export default class WelcomeToCountry extends Component {
  getTotalResidentsByBlock(blockNumber) {
    return blockNumber * 256;
  }

  getEstimateValueByBlock(blockNumber) {
    return (blockNumber * 0.01 + blockNumber * 0.01 * 0.2).toFixed(2);
  }

  render() {
    return (
      <div id="country-splash">
        <div className="top-header" data-text="Billboard">
          <div className="banner-theme">Banner of country theme</div>
        </div>
        <div className="ui container hero-content">
          <div className="ui header center aligned">
            <h2>Welcome to your new ownership of {25}</h2>
          </div>
        </div>
        <div className="ui grid country-detail">
          <div className="four wide column">
            <div className="ui card">
              <div className="image">
                <img src="https://cdn.dribbble.com/users/5031/screenshots/3232835/owl-mikael-gustafsson-dribbble.gif" />
              </div>
              <div className="ui header center aligned">
                <h2>{"Country name"}</h2>
              </div>
              <div className="ui list">
                <div className="item">
                  <div className="content">
                    <span>
                      President:{" "}
                      <span className="ui link owner">Code.King</span>
                    </span>
                    <div className="description">{"Country Description"}</div>
                  </div>
                  <div className="extra content value-content">
                    <div role="list" className="ui list">
                      <div className="listitem item">
                        <div className="content">
                          <div className="right floated">{"Country theme"}</div>
                          <div>Country theme</div>
                        </div>
                      </div>
                      <div className="listitem item">
                        <div className="content">
                          <div className="right floated">0</div>
                          <div>Population</div>
                        </div>
                      </div>
                      <div className="listitem item">
                        <div className="content">
                          <div className="right floated">
                            {this.getTotalResidentsByBlock(25)} residents
                          </div>
                          <div>Max capacity</div>
                        </div>
                      </div>
                      <div className="listitem item">
                        <div className="content">
                          <div className="right floated">Bit: 10,0000</div>
                          <div>Reserved bank</div>
                        </div>
                      </div>
                      <div className="listitem item">
                        <div className="content">
                          <div className="right floated">15 more days</div>
                          <div>Next digital assets airdrop</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ui basic segment button-group-section">
                <a className="ui black button" href="/create-country">
                  Invite resident
                  <i
                    aria-hidden="true"
                    className="angle right icon"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="twelve wide column ui segment">
            <BlockGrid numberOfBlock={6} navigate={this.props.navigate} />
          </div>
        </div>
      </div>
    );
  }
}
