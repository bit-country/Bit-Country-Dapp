import React, { useState, useCallback } from "react";
import {
  List,
  Comment as AntComment,
  Divider,
  Form,
  Button,
  Input,
  Empty,
  Avatar,
} from "antd";
import { AuthConnect } from "../HOC/Auth/AuthContext";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import Notification from "../../utils/Notification";
import { injectIntl, FormattedMessage } from "react-intl";
import Logging from "../../utils/Logging";
import Comment from "./Comment";

const {
  TextArea
} = Input;

class CommentSection extends React.PureComponent {
  state = {
    loading: false,
    posting: false,
    comments: [],
    offset: 0,
    allLoaded: false,
    liked: false,
    disliked: false,
  }

  componentDidMount() {
    const {
      post,
      visible,
    } = this.props;

    if (post?.id && visible) {
      this.refreshComments();
    }
  }

  componentDidUpdate() {
    const {
      allLoaded,
      comments
    } = this.state;

    const {
      post,
      visible,
      loading,
    } = this.props;

    if (allLoaded) {
      return;
    }

    if (post?.id && comments.length == 0 && visible && !loading) {
      this.refreshComments();
    }
  }

  refreshComments = () => {
    this.loadMoreComments(0);
  }

  loadComments = () => {
    if (this.state.allLoaded) {
      return;
    }

    this.loadMoreComments(this.state.offset);
  }

  loadMoreComments = async offset => {
    if (this.state.loading) {
      return;
    }

    const {
      post
    } = this.props;

    this.setState({
      loading: true
    });

    try {
      const response = await fetchAPI(`${ENDPOINTS.GET_COMMENTS_BY_POST}?postId=${post.id}&offset=${offset}`);

      if (!response?.isSuccess) {
        Notification.displayErrorMessage("Error retrieving comments");

        return;
      }

      // Note for line below:
      // Since comments are ordered chronologically (newest at top) and we fetch from the end.
      // When a new post is added and we try to load more, we'll end up with the last posts
      // being duplicated.
      if (response.comments.length > 0) {
        this.setState(state => ({
          offset: offset + response.comments.length, // See note above.
          comments: offset > 0 ? state.comments.concat(response.comments) : response.comments,
          allLoaded: false
        }));
      } else {
        this.setState({
          allLoaded: true,
        });
      }
    } catch (error) {
      Logging.Error(error);

      this.setState({
        allLoaded: true,
      });
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  createComment = async content => {
    if (this.state.posting) {
      return false;
    }

    const {
      post
    } = this.props;

    this.setState({
      posting: true
    });

    try {
      const response = await fetchAPI(
        `${ENDPOINTS.CREATE_COMMENT}?postId=${post.id}`,
        "POST",
        { postId: post.id, content }
      );

      if (!response?.isSuccess) {
        if (response?.message || response?.json?.message) {
          Notification.displayErrorMessage(
            <FormattedMessage id={response.message || response.json.message} />
          );
  
          throw Error(response.message || response.json.message);
        }

        // TODO Add default error message

        return false;
      }

      Notification.displaySuccessMessage("New comment has been created successfully...");
      
      this.refreshComments();

      return true;
    } catch (error) {
      Logging.Error(error);
    } finally {
      this.setState({
        posting: false
      });
    }

    return false;
  }

  render() {
    const { user, visible, intl, isOwner, isModerator, post, loggedIn } = this.props;
    const { comments, posting, loading, allLoaded } = this.state;

    return visible && (
      <>
        <List
          dataSource={comments}
          locale={{
            emptyText: (
              <Empty
                description={intl.formatMessage({ id: "post.comments.noComments" })}
              />
            )
          }}
          renderItem={comment => (
            <Comment
              postId={post.id}
              comment={comment}
              user={user}
              isOwner={isOwner}
              isModerator={isModerator}
              refreshComments={this.refreshComments}
            />
          )}
          loading={posting || loading}
          footer={!allLoaded && (
            <a onClick={this.loadComments}>
              <FormattedMessage id="post.comments.loadMore" />
            </a>
          )}
        />
        {loggedIn && (
          <>
            <Divider orientation="left">
              <FormattedMessage id="post.comments.postAComment" />
            </Divider>
            <CommentForm user={user} busy={posting} createComment={this.createComment} />
          </>
        )}
      </>
    );
  }
}

const CommentForm = ({ user, busy, createComment }) => {
  const [ content, setContent ] = useState("");
  const handleChange = useCallback(({ target: { value } }) => {
    setContent(value);
  }, [ setContent ]);

  const handleComment = useCallback(async () => {
    const result = await createComment(content);

    if (result) {
      setContent("");
    }
  }, [ content, createComment ]);

  const authorAvatar = user?.profileImageUrl ? (
    <Avatar src={user.profileImageUrl} alt={user.nickName} />
  ) : (
    <Avatar icon="user" alt="Default profile picture" />
  );

  return (
    <AntComment
      avatar={authorAvatar}
      content={(
        <Form>
          <Form.Item>
            <TextArea
              rows={4}
              maxLength={500}
              value={content}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item className="post-comment-actions">
            <Button
              type="primary"
              icon="edit"
              loading={busy}
              disabled={busy}
              onClick={handleComment}
            >
              <span>
                <FormattedMessage id="post.comments.comment" />
              </span>
            </Button>
          </Form.Item>
        </Form>
      )}
    />
  );
};

export default AuthConnect(injectIntl(CommentSection));
