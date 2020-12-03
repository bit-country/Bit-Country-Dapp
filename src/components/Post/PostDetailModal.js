import React from "react";
import { Card, Avatar, Badge, Divider, Modal, Layout, } from "antd";
import PostActivity from "../PostActivity";
import { FormattedMessage } from "react-intl";
import { dateToLocale } from "../../utils/DateTime";
import renderHTML from "react-render-html";
import CommentSection from "../CommentSection";
import postTypes from "../../config/postTypes";
import CopyToClipboard from "../CopyToClipboard";
import LinkPreviewer from "../LinkPreviewer";


export default function PostDetailModal(props) {
  const { 
    post,
    showModal,
    handleModalClose
  } = props;
  const isStory = post?.postType != null && post?.postType == postTypes.STORY;
  
  let promotedLinkName;
  let promotedLink;

  if (post?.owner.promoLinks?.length > 0) {
    promotedLinkName = post.owner.promoLinks[0].name;
    promotedLink = post.owner.promoLinks[0].value;
  }

  return(
    <Modal
      visible={showModal}
      width="100%"
      onCancel={handleModalClose}
      bodyStyle={{ padding: "1em" }}
      footer={null}
      className="post-modal-container"
      maskClosable
      mask={false}
      maskTransitionName={null}
      transitionName={null}
      zIndex={1}
    >
      <Layout.Content>
        <div className="post post-modal">
          <div className="post-header">
            <Card.Meta
              avatar={(
                <Badge count="100" color="#39a142">
                  <Avatar size="large" src={post?.owner.profileImageUrl} alt={post?.owner.nickName} />
                </Badge>
              )}
              title={!isStory ? <h3 className="post-title">{post?.title}</h3> : false}
              description={(
                <>
                  <div className="user-info">
                    <div className="name">{post?.owner.nickName}</div>
                    <div className="presentation">
                      {dateToLocale(post?.createdOn)}
                    </div>
                  </div>
                  <div className="my-links">
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
              )}
            />
            {!window.location.pathname.startsWith("/my-posts") && !window.location.pathname.startsWith("/my-mind") &&<CopyToClipboard />}
          </div>
          <Divider />
          {post.featuredImage && (
            <div className="image">
              <img src={post.featuredImage} alt={post.summary} />
            </div>
          )}
          <div className="post-content">
            {/* {post.featuredImage == null ? null : (
              <div className="image">
                <img src={post.featuredImage} alt={post.summary} />
              </div>
            )} */}
            {post && (
              <div
                className={
                  isStory
                    ? "story-post"
                    : null
                }
              >
                {isStory
                  ? post.content
                  : renderHTML(post?.content)}
              </div>
            )}
          </div>
          {post?.postType == postTypes.SHARE && (
            <LinkPreviewer
              metadata={post.metadata}
            />
          )}
          <PostActivity
            post={post}
          />
          <div>
            <Divider orientation="left">
              <h3><FormattedMessage id="post.comments" values={{ count: post.comments }} /></h3>
            </Divider>
            <CommentSection post={post} visible />
          </div> 
        </div>   
      </Layout.Content> 
    </Modal>
  );
}