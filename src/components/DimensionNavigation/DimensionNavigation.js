import React, { Component } from "react";
import BlockCard from "./BlockCard";
import "./DimensionNavigation.styles.css";

export default class DimensionNavigation extends Component {
  getTopicByBlockCoordinate(x, y) {
    const { surroundingBlocks } = this.props;

    if (surroundingBlocks) {
      let topic = surroundingBlocks.filter(topic => { return topic.blockAxis == x && topic.blockYxis == y; })[0];

      return topic || null;
    }

    return null;
  }

  render() {
    const { blockAxis: Axis, blockYxis: Yxis } = this.props.blockDetail;

    return (
      <div className="block-navigation-container">
        <div className="block-navigation">
          <BlockCard
            topic={this.getTopicByBlockCoordinate(Axis- 1, Yxis + 1)}
          />
          <BlockCard
            topic={this.getTopicByBlockCoordinate(Axis, Yxis + 1)}
          />
          <BlockCard
            topic={this.getTopicByBlockCoordinate(Axis + 1, Yxis + 1)}
          />
          <BlockCard
            topic={this.getTopicByBlockCoordinate(Axis - 1, Yxis)}
          />
          <BlockCard
            disabled
            topic={this.getTopicByBlockCoordinate(Axis, Yxis)}
          />
          <BlockCard
            topic={this.getTopicByBlockCoordinate(Axis + 1, Yxis)}
          />
          <BlockCard
            topic={this.getTopicByBlockCoordinate(Axis - 1, Yxis - 1)}
          />
          <BlockCard
            topic={this.getTopicByBlockCoordinate(Axis, Yxis - 1)}
          />
          <BlockCard
            topic={this.getTopicByBlockCoordinate(Axis + 1, Yxis - 1)}
          />
        </div>
      </div>
    );
  }
}

