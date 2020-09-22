import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { FormattedMessage } from "react-intl";
import CommentDeleteModal from "./CommentDeleteModal";
import CommentEditModal from "./CommentEditModal";
import "./CommentModerationMenu.styles.css";

const { SubMenu } = Menu;

export default class CommentModerationMenu extends Component {
  state = {
    showEditModal: false,
    showDeleteModal: false,
    isMenuHidden: true,
    isEditCommentHidden: true
  };

  componentDidMount() {
    this.setupMenu();
  }

  setupMenu = () => {
    const isCommentOwner = this.props.comment.author.id == this.props.user?.id;

    if (this.props.isOwner || this.props.isModerator || isCommentOwner) {
      this.setState({
        isMenuHidden: false
      });
    }
    if (isCommentOwner) {
      this.setState({
        isEditCommentHidden: false
      });
    }
  }

  showEditModal = () => {
    if (!this.state.showEditModal) {
      this.setState({
        showEditModal: true
      });
    }
  }

  showDeleteModal = () => {
    if (!this.state.showDeleteModal) {
      this.setState({
        showDeleteModal: true,
      });
    }
  }

  cancelEditConfirm = () => {
    this.setState({ showEditModal: false });
  }

  cancelDeleteConfirm = () => {
    this.setState({ showDeleteModal: false });
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.isMenuHidden &&
          <Menu 
            mode="horizontal" 
            style={{ 
              margin: "-20px", 
              lineHeight: "15px", 
              border: "none", 
              fontSize: "20px", 
              float: "right" 
            }}
            className="comment-content-menu"
          >
            <SubMenu title={<Icon type="ellipsis" />}>
              {!this.state.isEditCommentHidden &&
                <Menu.Item key="editComment" onClick={() => this.showEditModal()}>
                  <FormattedMessage id="post.comments.editComment.title" />
                </Menu.Item>
              }
              <Menu.Item key="deleteComment" onClick={() => this.showDeleteModal()}>
                <FormattedMessage id="post.comments.deleteComment.title" />
              </Menu.Item>
            </SubMenu>
          </Menu>
        }
        <CommentEditModal
          comment={this.props.comment}
          postId={this.props.postId}
          visible={this.state.showEditModal}
          onCancel={this.cancelEditConfirm}
          refreshComponentAfterCommentModeration={this.props.refreshComponentAfterCommentModeration}
        />
        <CommentDeleteModal
          comment={this.props.comment}
          postId={this.props.postId}
          visible={this.state.showDeleteModal}
          onCancel={this.cancelDeleteConfirm}
          refreshComponentAfterCommentModeration={this.props.refreshComponentAfterCommentModeration}
        />
      </React.Fragment>
    );
  }
}