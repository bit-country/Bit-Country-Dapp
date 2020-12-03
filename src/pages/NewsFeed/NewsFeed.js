import React, { Component } from "react";
import { List } from "antd";
import "./../../css/NewsFeed.css";
import Post from "../../components/Post/Post";
import PostStory from "../../components/Editor/PostStory";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { CountryConnect } from "../../components/HOC/Country/CountryWrapper";
import "./NewsFeed.styles.css";
import { BlockConnect } from "../../components/HOC/Block/BlockWrapper";

class NewsFeed extends Component {
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const {
      loadMorePosts, allLoaded
    } = this.props;

    const objDiv = document.scrollingElement;

    if (
      Math.abs((objDiv.scrollTop + objDiv.clientHeight) - objDiv.scrollHeight) <= 5
    ) {
      if (allLoaded) {
        return false;
      } 

      loadMorePosts();      
    }
  };

  render() {
    const { 
      country, 
      blockDetail, 
      isOwner, 
      isModerator, 
      posts, 
      refreshPosts,
      refreshComponentAfterPostModeration
    } = this.props;

    const canPost = true;

    return (
      <div className="posts">
        <List
          header={
            canPost && (
              <PostStory
                addNewPost={this.addNewPost}
                refreshPosts={refreshPosts}
                country={country}
                blockDetail={blockDetail}
              />
            )
          }
          dataSource={posts}
          split={false}
          rowKey = {item => ( item.id )}
          renderItem={item => (
            <Post
              post={item}
              blockDetail={blockDetail}
              country={country}
              navigate={this.props.navigate}
              refreshPosts={refreshPosts}
              isOwner={isOwner}
              isModerator={isModerator}
              refreshComponentAfterPostModeration={refreshComponentAfterPostModeration}
            />
          )}
        />
      </div>
    );
  }
}

export default AuthConnect(CountryConnect(BlockConnect(NewsFeed)));
