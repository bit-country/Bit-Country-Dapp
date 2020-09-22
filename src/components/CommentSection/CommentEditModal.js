import { Modal, Form, Input, Layout } from "antd";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import Notification from "../../utils/Notification";
import { editComment } from "../../utils/ActivityUtil";
import Logging from "../../utils/Logging";

const { TextArea } = Input;

export default class CommentEditModal extends Component {
  state = {
    comment: {
      commentId: "",
      content: ""
    },
    modalTitle: "",
    modalOkText: ""
  };

  componentDidMount() {
    this.setupModal();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.comment != this.props.comment) {
      this.setupModal();
    }
  }

  setupModal = () => {
    const comment = Object.assign({
      commentId: this.props.comment.id,
      content: this.props.comment.content
    });
    let modalTitle = <FormattedMessage id="post.comments.editComment.title" />;
    let modalOkText = <FormattedMessage id="post.comments.editComment.confirm" />;

    this.setState({
      comment: comment,
      modalTitle: modalTitle,
      modalOkText: modalOkText
    });
  }

  handleInputChange = ({ target: { value } }) => {
    this.setState(state => ({ 
      ...state,
      comment: {
        ...state.comment,
        content: value
      }
    }));
  }

  submitCommentModeration = async () => {
    try {
      let response = await editComment(this.props.postId, this.state.comment);
      let errorMessage = <FormattedMessage id="post.comments.editComment.notification.error" />;
      let successMessage = <FormattedMessage id="post.comments.editComment.notification.success" />;

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
        width="100%"
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
        className="post-modal-container"
        mask={false}
        maskTransitionName={null}
        transitionName={null}
      >
        <Layout.Content>
          <Form>
            <Form.Item>
              <TextArea
                rows={4}
                value={this.state.comment.content}
                onChange={this.handleInputChange}
              />
            </Form.Item>
          </Form>
        </Layout.Content>
      </Modal>
    );
  }
}