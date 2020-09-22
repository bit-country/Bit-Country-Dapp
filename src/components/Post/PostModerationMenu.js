import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { FormattedMessage } from "react-intl";
import PostApproveUnapproveOrDeleteModal from "./PostApproveUnapproveOrDeleteModal";
import PostEditModal from "./PostEditModal";
import "./PostModerationMenu.styles.css";

const { SubMenu } = Menu;

export default class PostModerationMenu extends Component {
  state = {
    showEditModal: false,
    showApproveUnapproveDeleteModal: false,
    modalType: "",
    isMenuHidden: true,
    isEditPostHidden: true
  };

  componentDidMount() {
    this.setupMenu();
  }

  setupMenu = () => {
    const { post, user } = this.props;

    const isPostOwner = post.owner.id == user?.id;

    if (this.props.isOwner || this.props.isModerator || isPostOwner) {
      this.setState({
        isMenuHidden: false
      });
    }
    if (isPostOwner) {
      this.setState({
        isEditPostHidden: false
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

  showApproveUnapproveDeleteModal = modalType => {
    if (!this.state.showApproveUnapproveDeleteModal) {
      this.setState({
        showApproveUnapproveDeleteModal: true,
        modalType: modalType
      });
    }
  }

  cancelEditConfirm = () => {
    this.setState({ showEditModal: false });
  }

  cancelApproveUnapproveDeleteConfirm = () => {
    this.setState({ showApproveUnapproveDeleteModal: false });
  }

  render() {
    return (
      <div onClick={e => e.stopPropagation()}>
        {!this.state.isMenuHidden &&
          <Menu 
            mode="horizontal" 
            style={{
              lineHeight: "15px",
              border: "none",
              fontSize: "20px",
              float: "right"
            }}
            className="post-content-menu"
          >
            <SubMenu key="test" title={<Icon type="ellipsis" />}>
              {!this.state.isEditPostHidden &&
                <Menu.Item key="editPost" onClick={() => this.showEditModal()}>
                  <FormattedMessage id="post.editPost.title" />
                </Menu.Item>
              }
              {/* <Menu.Item key="approvePost" onClick={() => this.showApproveUnapproveDeleteModal("approve")}>
                <FormattedMessage id="post.approvePost.title" />
              </Menu.Item>
              <Menu.Item key="unapprovePost" onClick={() => this.showApproveUnapproveDeleteModal("unapprove")}>
                <FormattedMessage id="post.unapprovePost.title" />
              </Menu.Item> */}
              <Menu.Item key="deletePost" onClick={() => this.showApproveUnapproveDeleteModal("delete")}>
                <FormattedMessage id="post.deletePost.title" />
              </Menu.Item>
            </SubMenu>
          </Menu>
        }
        <PostEditModal
          post={this.props.post}
          visible={this.state.showEditModal}
          onCancel={this.cancelEditConfirm}
          refreshComponentAfterPostModeration={this.props.refreshComponentAfterPostModeration}
        />
        <PostApproveUnapproveOrDeleteModal
          post={this.props.post}
          visible={this.state.showApproveUnapproveDeleteModal}
          modalType={this.state.modalType}
          onCancel={this.cancelApproveUnapproveDeleteConfirm}
          refreshComponentAfterPostModeration={this.props.refreshComponentAfterPostModeration}
        />
      </div>
    );
  }
}