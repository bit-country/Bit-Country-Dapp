import React, { useState, useEffect } from "react";
import { Icon, Spin } from "antd";
import { FormattedMessage } from "react-intl";
import {
  likePost,
  unlikePost
} from "../../utils/ActivityUtil";
import { useCallback } from "react";

const buttonClass = "action-btn";
const activeButtonClass = buttonClass + " active";

export default function PostActivity(props) {
  const { 
    post,
    isComments,
    onComments 
  } = props;

  const [ updating, setUpdating ] = useState(false);
  const [ liked, setLiked ] = useState(false);

  useEffect(() => {
    setLiked(post.isLiked);
  }, [ post ]);

  const onLike = useCallback(() => {
    (async () => {
      setUpdating(true);

      const success = await likePost(post.id);

      if (success) {
        setLiked(true);
      }

      setUpdating(false);
    })();
  });
  
  const onUnlike = useCallback(() => {
    (async () => {
      setUpdating(true);

      const success = await unlikePost(post.id);

      if (success) {
        setLiked(false);
      }

      setUpdating(false);
    })();
  });

  let likes = post.likes;

  if (liked != post.isLiked) {
    if (liked) {
      likes += 1;
    } else {
      likes -= 1;
    }
  }

  return (
    <div className="post-bottom">
      <a 
        className={liked ? activeButtonClass : buttonClass} 
        onClick={updating ? null : liked ? onUnlike : onLike}
      >
        {updating ? (
          <Spin size="small" /> 
        ) : ( 
          <Icon type="like" theme={liked ? "filled" : "outlined"} />
        )} <span className="likes">{likes || 0}</span>
      </a>
      <a className="action-btn">
        <Icon type="eye" theme="outlined" /> <span className="views">{post.views || 0}</span>
      </a>
      { onComments &&
        <a className={isComments ? activeButtonClass : buttonClass} onClick={onComments}>
          <Icon type="message" theme={isComments ? "filled" : "outlined"} />
          &nbsp;
          <span className="comments">
            <FormattedMessage 
              id="post.comments" 
              values={{ count: post.comments }}
            />
          </span>
        </a>
      }
    </div>
  );
}
