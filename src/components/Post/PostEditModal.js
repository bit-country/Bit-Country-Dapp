import { Modal, Layout } from "antd";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import Notification from "../../utils/Notification";
import { editPost } from "../../utils/ActivityUtil";
import Logging from "../../utils/Logging";
import EditorArticle from "../Editor/EditorArticle";
import postTypes from "../../config/postTypes";
import EditorShare from "../Editor/EditorShare";
import EditorStory from "../Editor/EditorStory";


export default class PostEditModal extends Component {
  state = {
    post: {
      postId: "",
      blockId: "",
      countryId: "",
      title: "",
      summary: "",
      content: "",
      postType: "",
      visibility: "",
      publishTime: "",
      expirationTime: ""
    },
    isBusy: false
  };

  componentDidMount() {
    this.setupModal();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post != this.props.post) {
      this.setupModal();
    }
  }

  setupModal = () => {
    this.setState({
      post: {
        ...this.props.post
      }
    });
  }

  handleInputChange = ({ target: { value, name } }) => {
    if (this.props.post.postType == 0) {
      this.setState( state => ({
        post: {
          ...state.post,
          title: value,
          summary: value,
          content: value
        }
      }));
    } else {
      this.setState( state => ({
        post: {
          ...state.post,
          [name]: value
        }
      }));
    }
  }

  handleEditorChange = content => {
    this.setState( state => ({
      post: {
        ...state.post,
        content: content
      }
    }));
  }

  handleSelectChange = (value, name) => {
    this.setState( state => ({
      post: {
        ...state.post,
        [name]: value
      }
    }));
  };

  handleRadioGroupChange = e => {
    this.setState( state => ({
      post: {
        ...state.post,
        [e.target.name]: e.target.value
      }
    }));
  }

  handleBeforeUpload = async file => {
    this.setState(state => ({
      post: {
        ...state.post,
        featuredImageFile: file,
        featuredImage: URL.createObjectURL(file)
      }
    }));
    
    return false;
  }

  submitPostModeration = async () => {
    const { post } = this.state;

    if (
      post.title == "" ||
      post.summary == "" ||
      post.content == "<p><br></p>" ||
      post.publishTime == null
    ) {
      // TODO internationalise this
      Notification.displayErrorMessage(
        "Please enter all fields except Expiration Time"
      );

      return;
    }

    this.setState({ isBusy: true });

    try {
      const formData = new FormData();

      for (const [ key, value ] of Object.entries(post)) {
        formData.set(key, value);
      }

      if (post.postType == postTypes.SHARE) {
        if (!post.url) {
          formData.set("url", post.metadata.url);
        }
        
        formData.delete("summary");
        formData.set("content", post.summary || post.content);
      }

      const response = await editPost(this.props.post.id, formData);

      if (!response?.isSuccess) {
        throw Error("Error while editing post");
      }

      Notification.displaySuccessMessage(
        <FormattedMessage id="post.editPost.notification.success" />
      );

      this.props.onCancel();
      this.props.refreshComponentAfterPostModeration == null ?
        window.location.reload() :
        this.props.refreshComponentAfterPostModeration();
    } catch (error) {
      Notification.displayErrorMessage(
        <FormattedMessage id="post.editPost.notification.error" />
      );

      Logging.Error(error);
    } finally {
      this.setState({ isBusy: false });
    }
  }

  renderBody = () => {
    const {
      postType,
      title,
      summary,
      content,
      url,
      visibility,
      busy,
      featuredImage,
      metadata,
    } = this.state.post;

    switch (postType) {
      case postTypes.STORY:
        return (
          <EditorStory
            story={content}
            busy={busy}
            handleInputChange={this.handleInputChange}
            hideButtons
          />
        );

      case postTypes.SHARE:
        return (
          <EditorShare
            title={title}
            summary={summary || content}
            url={url || metadata?.url}
            busy={busy}
            handleInputChange={this.handleInputChange}
            hideButtons
          />
        );

      case postTypes.ARTICLE:
        return (
          <EditorArticle
            title={title}
            summary={summary}
            featuredImage={featuredImage}
            content={content}
            visibility={visibility}
            busy={busy}
            handleEditorChange={this.handleEditorChange}
            handleBeforeUpload={this.handleBeforeUpload}
            handleInputChange={this.handleInputChange}
            handleSelectChange={this.handleSelectChange}
            hideButtons
          />
        );
    }
  };

  render() {
    return (
      <Modal
        width="100%"
        visible={this.props.visible}
        title={<FormattedMessage id="post.editPost.title" />}
        okText={<FormattedMessage id="post.editPost.confirm" />}
        okButtonProps={{ disabled: this.state.isBusy }}
        onOk={this.submitPostModeration}
        afterClose={this.setupModal}
        cancelText={(
          <FormattedMessage
            id="post.cancelModeration"
          />
        )}
        onCancel={this.props.onCancel}
        className="post-modal-container"
        mask={false}
        maskTransitionName={null}
        transitionName={null}
      >
        <Layout.Content>
          {this.renderBody()}
        </Layout.Content>
      </Modal>
    );
  }
}