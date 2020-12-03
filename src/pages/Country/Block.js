/* eslint-disable no-debugger */
/* eslint-disable no-console */
import React, { Component } from "react";
import { Modal, Spin, Popover, Form, Input, Icon, Select, Row, Col } from "antd";
import Notification from "../../utils/Notification";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import "./Block.styles.css";
import { FormattedMessage } from "react-intl";
import OptionalLink from "../../components/OptionalLink";
import TextArea from "antd/lib/input/TextArea";
import Block3DPreview from "../../components/Block3DPreview";

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
    confirmLoading: false,
    topicName: "",
    topicDescription: "",
    selectedTheme: null,
    selectedTemplate: null,
    blockTemplateId: null,
    blockThemeId: null,
  };

  createTopic = async () => {
    if (this.state.topicName.length < 2
      || this.state.topicName.length > 20) {
      Notification.displayErrorMessage(
        <FormattedMessage
          id="country.topic.notifications.invalidNameLength"
        />
      );

      this.setState({ confirmLoading: false });
      return;
    } else if (this.state.uniqueId.length < 2
      || this.state.uniqueId.length > 20) {
      Notification.displayErrorMessage(
        <FormattedMessage
          id="country.topic.notifications.invalidUniqueNameLength"
        />
      );

      this.setState({ confirmLoading: false });
      return;
    } else if (this.state.topicDescription.length < 10
      || this.state.topicDescription.length > 200) {
      Notification.displayErrorMessage(
        <FormattedMessage
          id="country.topic.notifications.invalidDescriptionLength"
        />
      );

      this.setState({ confirmLoading: false });
      return;
    } else if (!this.state.selectedTemplate || !this.state.selectedTheme) {
      Notification.displayErrorMessage(
        <FormattedMessage
          id="country.topic.notifications.invalidDimensionSettings"
        />
      );

      this.setState({ confirmLoading: false });
      return;
    }

    const { axis, yxis, country, blockNumber } = this.props;
    const { topicName, topicDescription, uniqueId, createSections, blockThemeId, blockTemplateId } = this.state;

    let topicObj = {
      blockAxis: axis,
      blockYxis: yxis,
      countryName: country.name,
      countryId: country.id,
      name: topicName,
      description: topicDescription,
      blockNumber,
      uniqueId,
      createSections,
      blockTemplateId,
      blockThemeId,
    };

    try {
      const response = await fetchAPI(ENDPOINTS.CREATE_TOPIC, "POST", topicObj);

      if (!response?.isSuccess) {
        Notification.displayErrorMessage(
          <FormattedMessage
            id={response.message}
          />
        );

        this.setState({ confirmLoading: false });
        return;
      }

      Notification.displaySuccessMessage("Topic created");

      this.props.navigate(`b/${response.id}`);
    } catch (error) {
      Notification.displayErrorMessage("Error creating topic");

      this.setState({ confirmLoading: false });
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
        isTopicModalOpen: !state.isTopicModalOpen,
        selectedTemplate: null,
        selectedTheme: null
      }));
    }
  };

  togglePurchaseBlockModal = () => {
    const {
      enabled,
      canPurchase,
      rates: { reloadIfStale }
    } = this.props;

    if (!enabled && canPurchase) {
      this.setState(state => ({
        isPurchaseBlockModalOpen: !state.isPurchaseBlockModalOpen
      }));
    }

    reloadIfStale();
  };

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
  }

  content() {
    const {
      enabled,
      canPurchase,
    } = this.props;

    if (!enabled) {
      return canPurchase
        ? "Purchase this block"
        : "You do not have permission to purchase this block";
    }

    if (this.props.status == "Completed" && this.props.hasTopic) {
      return (
        <a href={`${window.location.origin}/c/${this.props.country.uniqueId}/b/${this.props.blockId}/viewer`}>
          <Icon type="eye" />
        </a>
      );
    }

    return "Status: Pending";
  }

  toggleSectionCheckbox = index => {
    let { createSections } = this.state;

    createSections[index].isBuildable = !createSections[index].isBuildable;

    this.setState({ createSections });

  }

  gridCanvas = null;

  handleSectionCanvasRef = element => {
    this.sectionCanvas = element;
    this.sectionCanvasContext = element.getContext("2d");

    if (!this.gridCanvas) {
      this.gridCanvas = document.createElement("canvas");
      this.gridCanvas.width = 2;
      this.gridCanvas.height = 2;

      const context = this.gridCanvas.getContext("2d");

      context.fillStyle = "lightgrey";
      context.fillRect(0, 0, 1, 1);
      context.fillRect(1, 1, 1, 1);
      context.fillStyle = "white";
      context.fillRect(1, 0, 1, 1);
      context.fillRect(0, 1, 1, 1);
    }

    const pattern = this.sectionCanvasContext.createPattern(this.gridCanvas, "repeat");

    this.sectionCanvasContext.fillStyle = pattern;
    this.sectionCanvasContext.fillRect(0, 0, 100, 100);
  }

  startPos = null;
  endPos = null;
  canvasDown = false;

  handleSectionDown = event => {
    if (this.sectionCanvas) {
      const rect = this.sectionCanvas.getBoundingClientRect();

      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      this.startPos = [x, y];
      this.canvasDown = true;

      const pattern = this.sectionCanvasContext.createPattern(this.gridCanvas, "repeat");

      this.sectionCanvasContext.fillStyle = pattern;
      this.sectionCanvasContext.fillRect(0, 0, 100, 100);
    }
  }

  handleSectionMove = event => {
    if (this.sectionCanvas && this.canvasDown) {
      const rect = this.sectionCanvas.getBoundingClientRect();

      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      this.endPos = [x, y];

      const pattern = this.sectionCanvasContext.createPattern(this.gridCanvas, "repeat");

      this.sectionCanvasContext.fillStyle = pattern;
      this.sectionCanvasContext.fillRect(0, 0, 100, 100);

      const startX = Math.round((this.startPos[0] / rect.width) * 100);
      const startY = Math.round((this.startPos[1] / rect.width) * 100);
      const endX = Math.round(((x - this.startPos[0]) / rect.width) * 100);
      const endY = Math.round(((y - this.startPos[1]) / rect.width) * 100);

      this.sectionCanvasContext.fillStyle = "blue";
      this.sectionCanvasContext.fillRect(
        startX,
        startY,
        endX,
        endY);
    }
  }

  handleSectionUp = event => {
    if (this.sectionCanvas && this.canvasDown) {
      const rect = this.sectionCanvas.getBoundingClientRect();

      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      this.endPos = [x, y];

      const pattern = this.sectionCanvasContext.createPattern(this.gridCanvas, "repeat");

      this.sectionCanvasContext.fillStyle = pattern;
      this.sectionCanvasContext.fillRect(0, 0, 100, 100);

      const startX = Math.round((this.startPos[0] / rect.width) * 100);
      const startY = Math.round((this.startPos[1] / rect.width) * 100);
      const endX = Math.round(((x - this.startPos[0]) / rect.width) * 100);
      const endY = Math.round(((y - this.startPos[1]) / rect.width) * 100);

      this.sectionCanvasContext.fillStyle = "blue";
      this.sectionCanvasContext.fillRect(
        startX,
        startY,
        endX,
        endY);

      this.canvasDown = false;
    }
  }

  handleThemeChange = value => {
    let theme = this.props.themes.find(x => x.id == value);

    this.setState({
      selectedTheme: theme.blockThemeAsset,
      blockThemeId: value,
    });
  }

  handleTemplateChange = value => {
    let template = this.props.templates.find(x => x.id == value);

    this.setState({
      selectedTemplate: template,
      blockTemplateId: value,
    });
  }

  render() {
    const {
      hasTopic,
      enabled,
      status,
      blockId,
      lock,
      axis,
      yxis,
      templates,
      themes,
    } = this.props;

    const {
      selectedTemplate,
      selectedTheme
    } = this.state;

    const colorBlock =
      this.props.topicName == "No topic" ? "white" : "rgb(215,235,255)";

    return (
      <Spin spinning={status == "Pending"} tip={<FormattedMessage id="country.block.pending" />}>
        <OptionalPopover active={!enabled || hasTopic} content={this.content()} arrowPointAtCenter>
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
          confirmLoading={this.state.confirmLoading}
          cancelText="Cancel"
          onCancel={this.toggleTopicModal}
          width={800}
          destroyOnClose={true}
        >
          <FormattedMessage
            id="country.block.setTopic.description"
          />
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
            <Form.Item label="Block Dimension Appearance" wrapperCol={{ span: 24 }}>
              <Row gutter={[ 12, 12 ]}>
                <Col span={12}>
                  <Select loading={templates?.length < 1} onChange={this.handleTemplateChange} placeholder="Theme">
                    {templates?.map(item => (
                      <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={12}>
                  <Select loading={themes?.length < 1} onChange={this.handleThemeChange} placeholder="Template">
                    {themes?.map(item => (
                      <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Row gutter={[ 12, 12 ]}>
                <Block3DPreview 
                  blockTemplate={selectedTemplate} 
                  blockTheme={selectedTheme} 
                  width={600} 
                  height={200} 
                  loading={!selectedTemplate || !selectedTheme}
                />
                {selectedTemplate && selectedTheme && (
                  <div className="legend">
                    <div className="slot">
                      {"Asset Slots "}
                      <Popover trigger="hover" content="These are places where you can place smart assets in your dimension">
                        <Icon type="question-circle" style={{ marginLeft: "0.5em" }} />
                      </Popover>
                    </div>
                  </div>
                )}                
              </Row>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          className="purchase-block-modal"
          title="Available block to purchase"
          visible={this.state.isPurchaseBlockModalOpen}
          okText={`Purchase block ( ${1} BCG )`}
          onOk={this.purchaseBlock}
          confirmLoading={this.state.confirmLoading}
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
