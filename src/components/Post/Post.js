import React, { Component } from "react";
import {
  List,
  Card,
  Divider,
} from "antd";
import { dateToLocale } from "../../utils/DateTime";
import CommentSection from "../CommentSection";
import { AuthConnect } from "../HOC/Auth/AuthContext";
import PostActivity from "../PostActivity";
import { FormattedMessage } from "react-intl";
import PostModerationMenu from "./PostModerationMenu";
import postTypes from "../../config/postTypes";
import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Logging from "../../utils/Logging";
import "./Post.styles.css";
import PostDetailModal from "./PostDetailModal";
import ContentAuthorAvatar from "../ContentAuthorAvatar";
import slugify from "../../utils/Slugify";
import shortCodes from "../../utils/shortCodes";
import LinkPreviewer from "../LinkPreviewer";

class Post extends Component {
  state = {
    showComments: false,
    showModal: false,
  };

  toggleComments = () => {
    this.setState(state => ({
      showComments: !state.showComments
    }));
  }

  toggleModal = async () => {
    if (this.state.showModal) {
      return;
    }

    window.onpopstate = this.handleBack;

    const { post } = this.props;
    const state = { postId: post.id };
    const title = "Post Detail";
    const shortCode = shortCodes(post.id + post.owner.id)[0];
    const postSlug = slugify(post.title);

    let url;

    if (this.props.path == "/my-mind") {
      url = window.location;
    }
    else if (window.location.href.endsWith("/")) {
      url = `${window.location}${shortCode}/${postSlug}`;
    }
    else {
      url = `${window.location}/${shortCode}/${postSlug}`;
    }

    window.history.pushState(state, title, url);

    window.dispatchEvent(new CustomEvent("postopen"));

    this.setState({
      showModal: true
    });

    try {
      const response = await fetchAPI(
        `${endpoints.ADD_VIEW_TO_POST}?postId=${this.props.post.id}`,
        "PUT"
      );

      if (!response?.isSuccess) {
        throw Error(response.message);
      }
    } catch (error) {
      Logging.Error(new Error("Error while adding view to post"), error.message);
    }
  }

  handleModalClose = () => {
    this.setState({
      showModal: false
    });

    window.history.back();
  }

  handleBack = () => {
    this.setState({
      showModal: false
    });
  }

  render() {
    const {
      user,
      post,
      isOwner,
      isModerator,
      refreshComponentAfterPostModeration,
      showAllPostMeta
    } = this.props;
    const { showComments, showModal } = this.state;

    const isStory = post?.postType != null && post?.postType == postTypes.STORY;

    let content = "";

    switch (post?.postType) {
      case postTypes.ARTICLE:
        content = post.summary;
        break;

      case postTypes.STORY:
        content = post.content;
        break;

      case postTypes.SHARE:
        content = post.content;
        break;

      default:
        content = post.content;
        break;
    }

    const postContent = (
      <Card
        className="post"
        cover={post.featuredImage && (
          <div className="image">
            <img src={post.featuredImage} alt={post.summary} />
          </div>
        )}
        title={(
          <PostHeader
            user={user}
            post={post}
            refreshPosts={this.refreshPosts}
            isOwner={isOwner}
            isModerator={isModerator}
            refreshComponentAfterPostModeration={refreshComponentAfterPostModeration}
            showAllPostMeta={showAllPostMeta}
          />
        )}
        onClick={this.toggleModal}
      >
        <div className="post-content">
          <div
            className={
              isStory
                ? "story-post"
                : null
            }
          >
            {content}
          </div>
        </div>
        <div className="no-cursor" onClick={event => event.stopPropagation()}>
          {post?.postType == postTypes.SHARE && (
            <LinkPreviewer
              metadata={post.metadata}
            />
          )}
          <PostActivity
            post={post}
            isComments={showComments}
            onComments={this.toggleComments}
          />
          {showComments && (
            <div className="post-comment">
              <Divider />
            </div>
          )}
          <div className="comments">
            <CommentSection post={post} visible={showComments} isOwner={isOwner} isModerator={isModerator} />
          </div>
        </div>
      </Card>
    );

    return (
      <List.Item>
        {postContent}
        <PostDetailModal
          post={post}
          showModal={showModal}
          handleModalClose={this.handleModalClose}
        />
      </List.Item>
    );
  }
}

function PostHeader({ user, post, isOwner, isModerator, refreshComponentAfterPostModeration, showAllPostMeta }) {
  const isStory = post?.postType != null && post?.postType == postTypes.STORY;
  const titleStyles = ["post-title"];

  if (isStory) {
    titleStyles.push("empty");
  }

  let promotedLinkName;
  let promotedLink;

  if (post.owner.promoLinks?.length > 0) {
    promotedLinkName = post.owner.promoLinks[0].name;
    promotedLink = post.owner.promoLinks[0].value;
  }

  return (
    <>
      <div className="post-header">
        <ContentAuthorAvatar
          author={post?.owner}
        />
        <div className="post-details">
          <PostModerationMenu
            user={user}
            post={post}
            isOwner={isOwner}
            isModerator={isModerator}
            refreshComponentAfterPostModeration={refreshComponentAfterPostModeration}
          />
          <div className={titleStyles.join(" ")}>
            {!isStory ? post?.title : false}
          </div>

          <PostMeta
            post={post}
            showAllPostMeta={showAllPostMeta}
          />
        </div>
      </div>
      <div className="my-links" onClick={event => event.stopPropagation()}>
        {promotedLink && (
          <a href={promotedLink} target="_blank" rel="noopener noreferrer">
            {promotedLinkName ? (
              promotedLinkName
            ) : (
                <FormattedMessage
                  id="post.my-links"
                />
              )}
          </a>
        )}
      </div>
    </>
  );
}

function PostMeta({ post, showAllPostMeta }) {
  const publishTime = dateToLocale(post.publishTime);

  if (showAllPostMeta) {
    const createdOn = dateToLocale(post.createdOn);
    const expirationTime = post.expirationTime ? dateToLocale(post.expirationTime) : "";
    let postVisibility;

    switch (post.visibility) {
      case 0:
        postVisibility = "Public";
        break;
      case 1:
        postVisibility = "Restricted";
        break;
      case 2:
        postVisibility = "Unlisted";
        break;
      case 3:
        postVisibility = "Private";
        break;
      default:
        postVisibility = "Unknown";
        break;
    }

    return (
      <div>
        <div className="post-meta">
          <div className="meta-details">{post.owner.nickName}</div>
          <div className="post-date"><FormattedMessage id="post.meta.createOn" /> {createdOn}</div>
        </div>
        <div className="post-meta">
          <div className="meta-details">{postVisibility}</div>
          <div className="post-date"><FormattedMessage id="post.meta.available" /> {publishTime} - {expirationTime}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-meta">
      <div className="meta-details">{post.owner.nickName}</div>
      <div className="post-date">{publishTime}</div>
    </div>
  );
}

export default AuthConnect(Post);
