import React, { useState, useCallback, useEffect } from "react";
import {
  Comment as AntComment, Icon, Spin
} from "antd";
import {
  likeComment,
  unlikeComment,
  dislikeComment,
  undislikeComment,
} from "../../utils/ActivityUtil";
import CommentModerationMenu from "./CommentModerationMenu";
import { dateToLocale } from "../../utils/DateTime";
import ContentAuthorAvatar from "../ContentAuthorAvatar";

export default function Comment({ postId, comment, user, isOwner, isModerator, refreshComments }) {
  const [ updating, setUpdating ] = useState(false);  
  const [ liked, setLiked ] = useState(false);
  const [ disliked, setDisliked ] = useState(false);

  useEffect(() => {
    setLiked(comment.isLiked);
    setDisliked(comment.isDisliked);
  }, [ comment ]);

  const onLike = useCallback(commentId => {
    (async () => {
      setUpdating(true);

      const success = await likeComment(postId, commentId);
  
      if (success) {
        setLiked(true);
        setDisliked(false);
      }

      setUpdating(false);
    })();
  });

  const onUnlike = useCallback(commentId => {
    (async () => {
      setUpdating(true);

      const success = await unlikeComment(postId, commentId);
  
      if (success) {
        setLiked(false);
        setDisliked(false);
      }

      setUpdating(false);
    })();
  });

  const onDislike = useCallback(commentId => {
    (async () => {
      setUpdating(true);

      const success = await dislikeComment(postId, commentId);
  
      if (success) {
        setLiked(false);
        setDisliked(true);
      }

      setUpdating(false);
    })();
  });

  const onUndislike = useCallback(commentId => {
    (async () => {
      setUpdating(true);

      const success = await undislikeComment(postId, commentId);
  
      if (success) {
        setLiked(false);
        setDisliked(false);
      }

      setUpdating(false);
    })();
  });


  let likes = comment.likes;

  if (liked != comment.isLiked) {
    if (liked) {
      likes += 1;
    } else {
      likes -= 1;
    }
  }


  let dislikes = comment.dislikes;

  if (disliked != comment.isDisliked) {
    if (disliked) {
      dislikes += 1;
    } else {
      dislikes -= 1;
    }
  }

  return (
    <AntComment 
      key={comment.id}
      author={comment.author.nickName}
      avatar={(
        <ContentAuthorAvatar
          author={comment.author}
          size="default"
        />
      )}
      content={
        <div>
          <CommentModerationMenu
            user={user}
            comment={comment}
            postId={postId}
            isOwner={isOwner}
            isModerator={isModerator}
            refreshComponentAfterCommentModeration={refreshComments}
          />
          {comment.content}
        </div>
      }
      datetime={dateToLocale(comment.createdOn)}
      actions={[
        <span key="like" className="btn-action">
          <a 
            onClick={updating ? null : () => { liked ? onUnlike(comment.id) : onLike(comment.id); }} 
          >
            {updating ? (
              <Spin size="small" /> 
            ) : ( 
              <Icon type="like" theme={liked ? "filled" : "outlined"} />
            )} {likes || 0}
          </a>
        </span>,
        <span key="dislike" className="btn-action">
          <a 
            onClick={updating ? null : () => { disliked ? onUndislike(comment.id) : onDislike(comment.id); }} 
          >
            {updating ? (
              <Spin size="small" /> 
            ) : ( 
              <Icon type="dislike" theme={disliked ? "filled" : "outlined"} />
            )} {dislikes || 0}
          </a>
        </span>
      ]}
    />
  );
}
