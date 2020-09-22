import React, { createContext } from "react";
import { CountryConnect } from "../Country/CountryWrapper";
import { AuthConnect } from "../Auth/AuthContext";
import { fetchAPI, setCustomHeader } from "../../../utils/FetchUtil";
import ENDPOINTS from "../../../config/endpoints";
import Logging from "../../../utils/Logging";
import { wrappedComponentRenderer } from "../WrappedComponentRenderer";
import { navigate } from "@reach/router";

const defaultState = {
  blockDetail: {},
  loadingBlock: true,
  loadingPosts: true,
  offset: 0,
  posts: [],
  isBusy: false,
};

const BlockContext = createContext(defaultState);

let currentRequestId = 0;

class BlockWrapper extends React.Component {
  state = defaultState

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id != this.props.id) {
      this.setState({
        isBusy: false
      }, this.loadData);
    }
  }

  loadData = async () => {
    try {
      await this.loadCountryBlockDetails(this.refreshPosts);
    } catch (error) {
      Logging.Error(error);
    }
  }

  loadCountryBlockDetails = async callback => {
    this.setState({
      loadingBlock: true
    });

    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_BLOCK_BY_ID}?countryId=${this.props.countryId}&blockId=${this.props.id}`
      );

      if (response?.status == 404) {
        navigate("/404/b");
      } else if (!response?.isSuccess) {
        throw Error("Error while retrieving block data");
      }
      
      setCustomHeader("blockId", response.block.uniqueId);
      
      this.setState({
        blockDetail: response.block,
      }, callback);
    } catch (error) {
      Logging.Error(error);
    } finally {
      this.setState({
        loadingBlock: false
      });
    }    
  }

  refreshPosts = () => {
    this.loadPosts(0);
  };

  loadMorePosts = () => {
    const {
      allLoaded,
      offset
    } = this.state;

    if (allLoaded) {
      return;
    }

    this.loadPosts(offset);
  };

  loadPosts = async offset => {
    const {
      blockDetail,
      posts,
      isBusy
    } = this.state;

    const {
      country
    } = this.props;
    
    if (isBusy) {
      return false;
    }

    this.setState({
      loadingPosts: true,
      isBusy: true,
    });

    let postObj = {
      countryId: country.id,
      blockId: blockDetail.id,
      lastPostTime: posts.length > 0 && offset > 0 ? posts[posts.length - 1].createdOn : "",
    };

    const requestId = Math.random();

    try {
      currentRequestId = requestId;

      const response = await fetchAPI(ENDPOINTS.GET_POSTS, "POST", postObj);

      if (!response?.isSuccess) {
        throw Error("Error retrieving posts");
      }

      if (currentRequestId != requestId) {
        return;
      }

      if (response.posts.length > 0) {
        this.setState(state => ({
          offset: offset + response.posts.length,
          posts:
            offset > 0 ? state.posts.concat(response.posts) : response.posts,
          allLoaded: false,
        }));
      } else {
        this.setState(state => ({
          allLoaded: true,
          posts: offset > 0 ? state.posts : []
        }));
      }
    } catch (error) {
      Logging.Error(error);
      
      this.setState({
        posts: [],
        offset: 0,
      });
    } finally {
      if (currentRequestId == requestId) {
        this.setState({
          loadingPosts: false,
          isBusy: false
        });
      }
    }
  };

  refreshComponentAfterPostModeration = () => {
    this.refreshPosts();
  }

  render() {
    const {
      children,
      id
    } = this.props;

    return (
      <BlockContext.Provider 
        value={{
          ...this.state,
          blockId: id,
          refreshPosts: this.refreshPosts,
          refreshComponentAfterPostModeration: this.refreshComponentAfterPostModeration,
          loadMorePosts: this.loadMorePosts
        }}
      >
        {children}
      </BlockContext.Provider>
    );
  }
}

export default AuthConnect(CountryConnect(BlockWrapper, true));

// eslint-disable-next-line react/display-name
export const BlockConnect = (WrappedComponent, requiresBlock) => props => (
  <BlockContext.Consumer>
    {value => wrappedComponentRenderer(WrappedComponent, requiresBlock ? "loadingBlock" : null, props, value, true)}
  </BlockContext.Consumer>
);
