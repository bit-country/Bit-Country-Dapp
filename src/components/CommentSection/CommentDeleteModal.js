import { Modal } from "antd";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import Notification from "../../utils/Notification";
import { deleteComment } from "../../utils/ActivityUtil";
import Logging from "../../utils/Logging";

export default class CommentDeleteModal extends Component {
  state = {
    modalTitle: "",
    modalContent: "",
    modalOkText: ""
  };

  componentDidMount() {
    this.setupModal();
  }

  setupModal = () => {
    const modalTitle = <FormattedMessage id="post.comments.deleteComment.title" />;
    const modalContent = <FormattedMessage id="post.comments.deleteComment.confirm.message" />;
    const modalOkText = <FormattedMessage id="post.comments.deleteComment.confirm" />;

    this.setState({
      modalTitle: modalTitle,
      modalContent: modalContent,
      modalOkText: modalOkText
    });
  }

  submitCommentModeration = async () => {
    try {
      const response = await deleteComment(this.props.postId, this.props.comment.id);
      const errorMessage = <FormattedMessage id="post.comments.deleteComment.notification.error" />;
      const successMessage = <FormattedMessage id="post.comments.deleteComment.notification.success" />;

      if (!response?.isSuccess) {
        Notification.displayErrorMessage(errorMessage);
        return;
      }
      Notification.displaySuccessMessage(successMessage);

      this.props.onCancel();

    } catch (error) {
      Logging.Error(error);
    } finally {
      this.props.refreshComponentAfterCommentModeration == null ?
        window.location.reload() :
        this.props.refreshComponentAfterCommentModeration();
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        title={this.state.modalTitle}
        okText={this.state.modalOkText}
        onOk={this.submitCommentModeration}
        cancelText={(
          <FormattedMessage
            id="post.comments.cancelModeration"
          />
        )}
        onCancel={this.props.onCancel}
      >
        {this.state.modalContent}
      </Modal>
    );
  }
}