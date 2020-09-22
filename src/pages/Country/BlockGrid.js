import React, { Component } from "react";
import { DAppConnect } from "../../components/HOC/DApp/DAppWrapper";
import { Block } from "./Block";
import "./BlockGrid.styles.css";

class BlockGrid extends Component {
  blockInTopic(obj, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].blockAxis === obj.x && list[i].blockYxis == obj.y) {
        return true;
      }
    }

    return false;
  }

  render() {
    const { isResident } = this.props;

    let blockDetails = this.props.blockDetails || [];

    let blocks = this.props.country?.blocks || [];

    let isOwner = this.props.isOwner;

    let rows = [];

    for (let i = 6; i >= -6; i--) {
      for (let j = -6; j <= 6; j++) {
        let enabled = false;

        let numberOfResidents = 0;
        let hasTopic = false;
        let topicName = "No topic";
        let totalPosts = 0;
        let blockId = "";
        let blockOwner = "";
        let blockNumber = -1;
        let status = "";

        let block = blocks.find(block => block.axis === j && block.yAxis === i);

        if (block) {
          //Display block detail
          blockOwner = block.blockOwner;
          blockNumber = block.blockNumber;
          enabled = true;
          status = block.status;
        }
        
        let blockDetail = blockDetails.find(block => block.blockAxis === j && block.blockYxis === i);

        if (blockDetail) {
          //Display topic in the block
          numberOfResidents = blockDetail.totalResidents;
          hasTopic = true;
          topicName = blockDetail.name;
          totalPosts = blockDetail.totalPosts;
          blockId = blockDetail.uniqueId;
        }

        rows.push(
          <div 
            className="block-col" 
            key={Math.random()}
          >
            <Block
              axis={j}
              yxis={i}
              country={this.props.country}
              numberOfResidents={numberOfResidents}
              hasTopic={hasTopic}
              topicName={topicName}
              totalPosts={totalPosts}
              blockId={blockId}
              enabled={enabled}
              lock={!isResident}
              blockOwner={blockOwner}
              blockNumber={blockNumber}
              isOwner={isOwner}
              status={status}
              navigate={this.props.navigate}
              onUpdate={this.props.onBlockUpdate}
            />
          </div>        
        );
      }
    }

    return (
      <div
        className="block-grid"
      >
        {rows}
      </div>
    );
  }
}

export default DAppConnect(BlockGrid);
