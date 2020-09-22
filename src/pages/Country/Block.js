import React, { Component } from "react";
import { Modal, Spin, Popover, Form, Input, Icon, Card } from "antd";
import Notification from "../../utils/Notification";
import Utils from "../../utils/Utils";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import "./Block.styles.css";
import { FormattedMessage } from "react-intl";
import OptionalLink from "../../components/OptionalLink";
import TextArea from "antd/lib/input/TextArea";

function OptionalPopover({ children, content, active, ...rest }) {
  if (active) {
    return (
      <Popover content={content} {...rest}>
        {children}
      </Popover>
    );
  }

  return children;
}

export class Block extends Component {
  state = {
    isTopicModalOpen: false,
    isPurchaseBlockModalOpen: false,
    topicName: "",
    topicDescription: "",
    sections : [ 
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
    ]
  };

  createTopic = async () => {
    if (this.state.topicName.length < 2
      || this.state.topicName.length > 20) {
      Notification.displayErrorMessage(
        <FormattedMessage
          id="country.topic.notifications.invalidNameLength"
        />
      );

      return;
    } else if (this.state.uniqueId.length < 2
      || this.state.uniqueId.length > 20) {
      Notification.displayErrorMessage(
        <FormattedMessage
          id="country.topic.notifications.invalidUniqueNameLength"
        />
      );
      
      return;
    } else if (this.state.topicDescription.length < 10
      || this.state.topicDescription.length > 200) {
      Notification.displayErrorMessage(
        <FormattedMessage
          id="country.topic.notifications.invalidDescriptionLength"
        />
      );
      
      return;
    }

    let topicObj = {
      blockAxis: this.props.axis,
      blockYxis: this.props.yxis,
      countryName: this.props.country.name,
      countryId: this.props.country.id,
      name: this.state.topicName,
      description: this.state.topicDescription,
      blockNumber: this.props.blockNumber,
      uniqueId: this.state.uniqueId
    };

    try {
      const response = await fetchAPI(ENDPOINTS.CREATE_TOPIC, "POST", topicObj);

      if (!response?.isSuccess) {

        Notification.displayErrorMessage(
          <FormattedMessage
            id={response.message}
          />
        );

        return;
      }

      Notification.displaySuccessMessage("Topic created");

      this.props.navigate(`b/${response.id}`);
    } catch (error) {

      Notification.displayErrorMessage("Error creating topic");
    }
  };

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  toggleTopicModal = () => {
    const {
      enabled,
      isOwner,
      hasTopic
    } = this.props;

    if (enabled && !hasTopic && isOwner) {
      this.setState(state => ({
        isTopicModalOpen: !state.isTopicModalOpen
      }));
    }
  };

  togglePurchaseBlockModal = () => {
    const { enabled, isOwner } = this.props;

    if (!enabled && isOwner) {
      this.setState(state => ({
        isPurchaseBlockModalOpen: !state.isPurchaseBlockModalOpen
      }));
    }
  };

  getCostOfBlockPurchase() {
    return (
      Utils.getCostPerBlockInEther() +
      Utils.getTokenRequiredPerBlock(1) * Utils.getCostPerTokenInEther()
    ).toFixed(5);
  }

  getCostOfBlockPurchaseInWei() {
    return (
      Utils.getCostPerBlockInWei() +
      Utils.getTokenRequiredPerBlock(1) * Utils.getCostPerTokenInWei() +
      100
    );
  }

  purchaseBlock = async () => {
    let additionalBlock = {
      axis: this.props.axis,
      yaxis: this.props.yxis,
      countryId: this.props.country.id,
      countryIndex: this.props.country.countryIndex
    };

    try {
      const response = await fetchAPI(
        ENDPOINTS.PURCHASE_BLOCK,
        "POST",
        additionalBlock
      );

      if (!response?.isSuccess) {
        Notification.displayErrorMessage(response.message);

        return;
      }

      Notification.displaySuccessMessage(
        "Adding new block transaction is pending..."
      );

      this.setState({
        isPurchaseBlockModalOpen: false
      });

      window.setTimeout(this.props.onUpdate, 200);
    } catch (error) {
      Notification.displayErrorMessage(error);
    }
  };

  content() {
    if (!this.props.enabled) {
      return this.props.isOwner
        ? "Purchase this block"
        : "Only owner can purchase this block";
    }

    if (this.props.status == "Completed") {
      return "Topic: " +
      this.props.topicName;
    }
    
    return "Status: Pending";
  }

  toggleSectionCheckbox = index => {
    let { sections } = this.state;

    sections[index].isSelected = !sections[index].isSelected;

    this.setState({ sections });

  }

  render() {
    const {
      hasTopic,
      enabled,
      status,
      blockId,
      lock,
      axis,
      yxis
    } = this.props;

    const colorBlock =
      this.props.topicName == "No topic" ? "white" : "rgb(215,235,255)";

    return (
      <Spin spinning={status == "Pending"} tip={<FormattedMessage id="country.block.pending" />}>
        <OptionalPopover active={!enabled} content={this.content()} arrowPointAtCenter>
          <OptionalLink
            to={`b/${blockId}`}
            enabled={enabled && hasTopic && status == "Completed" && !lock}
          >
            <div
              className={
                "block-box " +
                (enabled ? "enabled" : "disabled") +
                (status == "Pending" ? " pending" : "")
              }
            >
              {enabled ? (
                status == "Completed" ? (
                  <div
                    className="block-item"
                    onClick={this.toggleTopicModal}
                    style={{ backgroundColor: colorBlock }}
                  >
                    {hasTopic ? (
                      <>
                        <div className="topic">
                          {this.props.topicName}
                        </div>
                        <div className="post-count">
                          {this.props.totalPosts}
                        </div>
                      </>
                    ) : ""}
                  </div>
                ) : (
                  <div
                    className="block-item"
                    onClick={this.toggleTopicModal}
                  />
                )
              ) : (
                <div
                  className="block-item"
                  onClick={this.togglePurchaseBlockModal}
                />
              )}
            </div>
          </OptionalLink>
        </OptionalPopover>
        {lock && (
          <Popover 
            content={<FormattedMessage id="country.block.lock.noResident" />} 
            arrowPointAtCenter
          >
            <div className="locked-block">
              <Icon type="lock" />
            </div>
          </Popover>
        )}
        <Modal
          className="create-topic-modal"
          title="Block planning"
          visible={this.state.isTopicModalOpen}
          okText="Save"
          onOk={this.createTopic}
          cancelText="Cancel"
          onCancel={this.toggleTopicModal}
          width={800}
        >
          This is an empty new block. You can set a topic and the buildable area for this block.
          <Form 
            className="topic-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label="Topic name">
              <Input
                type="text"
                name="topicName"
                placeholder="Topic name"
                required
                onChange={this.handleInputChange}
              />
            </Form.Item>
            <Form.Item label="Topic unique identifer">
              <Input
                type="text"
                name="uniqueId"
                placeholder="Unique Id"
                required
                onChange={this.handleInputChange}
              />
            </Form.Item>
            <Form.Item label="Topic description">
              <TextArea
                name="topicDescription"
                placeholder="Topic description"
                rows="2"
                required
                onChange={this.handleInputChange}
              />
            </Form.Item>
            <Form.Item label="Buildable Sections Selection">
              <div className="section-container">
                <div className="section-selector ">
                  {this.state.sections? (this.state.sections.map( (section, index) => 
                    <Card
                      hoverable
                      key={index}
                      className={`block-section ${section.isSelected? "selected" : ""}`}
                      onClick={() => this.toggleSectionCheckbox(index)}
                    >
                      {/* {x + "," + y} */}
                      {/* <Checkbox /> */}
                    </Card>
                  )) : null}
                </div>
              </div>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          className="purchase-block-modal"
          title="Available block to purchase"
          visible={this.state.isPurchaseBlockModalOpen}
          okText={`Purchase block ( ${this.getCostOfBlockPurchase()} BCG )`}
          onOk={this.purchaseBlock}
          cancelText="Cancel"
          onCancel={this.togglePurchaseBlockModal}
        >
          You can extend the capacity of your country by purchasing this block
          <div className="details">
            <b>Block position:</b>
            <div className="item">Axis: {axis}</div>
            <div className="item">Yxis: {yxis}</div>
          </div>
        </Modal>
      </Spin>
    );
  }
}
