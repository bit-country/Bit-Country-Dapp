import { Modal } from "antd";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import Notification from "../../utils/Notification";
import {
  approvePost,
  unapprovePost,
  deletePost
} from "../../utils/ActivityUtil";
import Logging from "../../utils/Logging";

export default class PostApproveUnapproveOrDeleteModal extends Component {
  state = {
    modalTitle: "",
    modalContent: "",
    modalOkText: ""
  };

  componentDidUpdate(prevProps) {
    if (prevProps.modalType != this.props.modalType) {
      this.setupModal();
    }
  }

  setupModal = () => {
    let modalTitle = "";
    let modalContent = "";
    let modalOkText = "";

    switch (this.props.modalType) {
      case "approve":
        modalTitle = <FormattedMessage id="post.approvePost.title" />;
        modalContent = <FormattedMessage id="post.approvePost.confirm.message" />;
        modalOkText = <FormattedMessage id="post.approvePost.confirm" />;
        break;
      case "unapprove":
        modalTitle = <FormattedMessage id="post.unapprovePost.title" />;
        modalContent = <FormattedMessage id="post.unapprovePost.confirm.message" />;
        modalOkText = <FormattedMessage id="post.unapprovePost.confirm" />;
        break;
      case "delete":
        modalTitle = <FormattedMessage id="post.deletePost.title" />;
        modalContent = <FormattedMessage id="post.deletePost.confirm.message" />;
        modalOkText = <FormattedMessage id="post.deletePost.confirm" />;
        break;
    }

    this.setState({
      modalTitle: modalTitle,
      modalContent: modalContent,
      modalOkText: modalOkText
    });
  }

  submitPostModeration = async () => {
    let deletedId = null;
    
    try {
      let response = "";
      let errorMessage = "";
      let successMessage = "";

      switch (this.props.modalType) {
        case "approve":
          response = await approvePost(this.props.post.id);
          errorMessage = <FormattedMessage id="post.approvePost.notification.error" />;
          successMessage = <FormattedMessage id="post.approvePost.notification.success" />;
          break;
        case "unapprove":
          response = await unapprovePost(this.props.post.id);
          errorMessage = <FormattedMessage id="post.unapprovePost.notification.error" />;
          successMessage = <FormattedMessage id="post.unapprovePost.notification.success" />;
          break;
        case "delete":
          deletedId = this.props.post.id;
          response = await deletePost(this.props.post.id);
          errorMessage = <FormattedMessage id="post.deletePost.notification.error" />;
          successMessage = <FormattedMessage id="post.deletePost.notification.success" />;
          break;
      }

      if (!response?.isSuccess) {
        Notification.displayErrorMessage(errorMessage);
        return;
      }
      Notification.displaySuccessMessage(successMessage);

      this.props.onCancel();

    } catch (error) {
      Logging.Error(error);
    } finally {
      this.props.refreshComponentAfterPostModeration == null ?
        window.location.reload() :
        this.props.refreshComponentAfterPostModeration(deletedId);
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        title={this.state.modalTitle}
        okText={this.state.modalOkText}
        onOk={this.submitPostModeration}
        cancelText={(
          <FormattedMessage
            id="post.cancelModeration"
          />
        )}
        onCancel={this.props.onCancel}
      >
        {this.state.modalContent}
      </Modal>
    );
  }
}