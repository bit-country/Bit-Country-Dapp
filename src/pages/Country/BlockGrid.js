import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { DAppConnect } from "../../components/HOC/DApp/DAppWrapper";
import endpoints from "../../config/endpoints";
import { UseRatesWrapper } from "../../hooks/useRates";
import { fetchAPI } from "../../utils/FetchUtil";
import Logging from "../../utils/Logging";
import Notification from "../../utils/Notification";
import { Block } from "./Block";
import "./BlockGrid.styles.css";

class BlockGrid extends Component {
  state = {
    loading: false,
  }

  componentDidMount() {
    this.loadThemesAndTemplates();
  }

  loadThemesAndTemplates = async () => {
    try {
      this.setState({
        loading: true
      });

      const themesPromise = fetchAPI(endpoints.GET_BLOCK_THEMES);
      const templatesPromise = fetchAPI(endpoints.GET_BLOCK_TEMPLATES);

      const [ themes, templates ] = await Promise.all([ themesPromise, templatesPromise ]);

      if (!themes?.isSuccess) {
        if (themes?.json?.message) {
          Notification.displayErrorMessage(
            <FormattedMessage
              id={themes.json.message}
            />
          );

          throw Error(themes.json.message);
        }

        Notification.displayErrorMessage(
          <FormattedMessage
            id="country.blockGrid.notification.errorThemes"
            defaultMessage="Error while retrieving block themes"
          />
        );

        throw Error("Error while retrieving block themes");
      }

      if (!templates?.isSuccess) {
        if (templates?.json?.message) {
          Notification.displayErrorMessage(
            <FormattedMessage
              id={templates.json.message}
            />
          );

          throw Error(templates.json.message);
        }

        Notification.displayErrorMessage(
          <FormattedMessage
            id="country.blockGrid.notification.errorThemes"
            defaultMessage="Error while retrieving block templates"
          />
        );

        throw Error("Error while retrieving block templates");
      }

      this.setState({
        themes: themes.themes,
        templates: templates.templates
      });
    } catch (error) {
      Logging.Error(error);
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  blockInTopic(obj, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].blockAxis === obj.x && list[i].blockYxis == obj.y) {
        return true;
      }
    }

    return false;
  }

  render() {
    const {
      isResident,
      isOwner,
      hasPurchasePermission,
      country,
      navigate,
      onBlockUpdate,
      rates
    } = this.props;

    const {
      templates,
      themes
    } = this.state;

    let blockDetails = this.props.blockDetails || [];

    let blocks = country?.blocks || [];

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
            key={`${j}${i}`}
          >
            <Block
              axis={j}
              yxis={i}
              country={country}
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
              canPurchase={hasPurchasePermission}
              status={status}
              rates={rates}
              navigate={navigate}
              onUpdate={onBlockUpdate}
              templates={templates}
              themes={themes}
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

export default DAppConnect(UseRatesWrapper(BlockGrid));
