import React, { Component } from "react";
import BlockCard from "./BlockCard";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import "./BlockNavigation.styles.css";
import Logging from "../../utils/Logging";

export default class BlockNavigation extends Component {
  state = {
    blockDetail: {},
    surroundingBlocks: [],
  }

  componentDidMount() {
    this.loadSurroundingBlocks();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.blockDetail.id !== this.props.blockDetail.id) {
      this.loadSurroundingBlocks();
    }
  }

  loadSurroundingBlocks = async () => {
    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_SURROUNDING_BLOCKS_BY_BLOCK}?countryId=${this.props.countryId}&blockId=${this.props.blockId}`
      );

      if (!response?.isSuccess) {
        throw Error("Error while retrieving block navigation data");
      }
      var blockDetail = response.blocks.filter(block => { return block.id == this.props.id; })[0];

      this.setState({
        surroundingBlocks: response.blocks,
        blockDetail
      });
    } catch (error) {
      Logging.Error(error);
    }
  }


  getTopicByBlockCoordinate(x, y) {
    const { surroundingBlocks } = this.state;

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

