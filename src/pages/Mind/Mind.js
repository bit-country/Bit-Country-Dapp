import React, { Component } from "react";
import { List, Row, Col, Avatar, Collapse } from "antd";
import Post from "../../components/Post/Post";
import ENDPOINTS from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import { DAppConnect } from "../../components/HOC/DApp/DAppWrapper";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import "./Mind.css";
import Logging from "../../utils/Logging";
import { navigate, Link } from "@reach/router";

const { Panel } = Collapse;

let currentRequestId = 0;

class Mind extends Component {
  state = {
    story: "",
    loading: false,
    offset: 0,
    posts: [],
    isBusy: false,
    term: "",
    limit: 4,
    filters: { countryIds: [], blockId: "", visibility: 0, status: "published" },
    anyCountry: true,
    loadingBlocks: false,
    countries: [ ],
    blocks: [ ],
    newSearch: false,
    profile: {}
  };

  async componentDidMount() {
    if (!this.props.loggedIn && this.props.personal) {
      navigate("/401");

      return;
    }

    await this.loadProfile();
    await this.loadCountries();
    this.refreshPosts();
    document.getElementById("auth-content").addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    document.getElementById("auth-content").removeEventListener("scroll", this.handleScroll);
  }

  refreshPosts = ()=> {
    this.loadPosts(0);
  };

  loadMorePosts = () => {
    if (this.state.allLoaded) {
      return;
    }

    this.setState({ newSearch: false });
    this.loadPosts(this.state.offset);
  };

  searchPosts = () => {
    this.setState({ newSearch: true, posts: [] });
    this.loadPosts(0);
  }

  loadPosts = async offset => {
    if (this.state.isBusy) {
      return false;
    }

    const { term, limit, filters, newSearch } = this.state;
    const { countryIds, blockId, visibility, status } = filters;
    const { userId } = this.state.profile;

    this.setState({
      loading: true,
      isBusy: true,
    });
    
    let postObj = {
      term,
      skip: offset,
      limit,
      countryIds,
      blockId,
      visibility,
      status,
      userId,
    };
    
    const requestId = Math.random();
    
    try {
      currentRequestId = requestId;

      const response = await fetchAPI(ENDPOINTS.GET_MIND, "POST", postObj);

      if (!response?.isSuccess) {
        throw Error("Error retrieving posts");
      }

      if (currentRequestId != requestId) {
        return;
      }

      if (response.posts.length > 0 || newSearch) {
        this.setState(state => ({
          offset: offset + response.posts.length,
          posts:
            offset > 0 ? state.posts.concat(response.posts) : response.posts,
          allLoaded: false,
        }));
      } else {
        this.setState({
          allLoaded: true,
        });
      }
    } catch (error) {
      Logging.Error(error);

      this.setState({
        posts: [],
        offset: 0,
      });
    } finally {
      this.setState({
        loading: false,
        isBusy: false,
      });
    }
  };

  handleScroll = () => {
    const objDiv = document.getElementById("auth-content");

    if (
      Math.abs((objDiv.scrollTop + objDiv.clientHeight) - objDiv.scrollHeight) <= 5
    ) {
      if (this.state.allLoaded) {
        return false;
      }

      this.loadMorePosts();
    }
  };

  handlePostUpdate = async postUpdate => {
    this.setState(state => {
      const updatedPosts = state.posts.map(post => {
        if (post.id != postUpdate.id) {
          return post;
        }

        return postUpdate;
      });

      return {
        posts: updatedPosts,
      };
    });
  };

  handleInputChange = e => {
    const { value, name } = e.target;

    this.setState({
      [name]: value,
      offset: 0,
      newSearch: true
    });
  };

  handleBlockChange = blockId => {
    var { filters } = this.state;

    filters.blockId = blockId;
    this.setState({ filters }, this.searchPosts);
  }

  loadProfile = async () => {
    try {
      const { blogUid, personal, user } = this.props;

      let responseProfile = null;

      if (personal) {
        responseProfile = await fetchAPI(
          `${ENDPOINTS.GET_USER_PROFILE}?userId=${user.id}`
        );
      } else {
        responseProfile = await fetchAPI(
          `${ENDPOINTS.GET_USER_PROFILE_BY_BLOGUID}?blogUid=${blogUid}`
        );
      }

      if (responseProfile?.status == 404) {
        navigate("/404/m");

        return;
      } else if (!responseProfile?.isSuccess) {
        throw Error("Error while retrieving current profile");
      }

      this.setState({
        profile: responseProfile.profile,
      });
    } catch (error) {
      Logging.Error(error);
    }
  }
  
  loadCountries = async () => {
    const { showCountries } = this.state.profile;

    try {
      const responseCountry = await fetchAPI(
        `${ENDPOINTS.GET_COUNTRIES_BY_UIDS}?countryUids=${showCountries}`
      );


      var { filters } = this.state;
      var countryIds = [];

      responseCountry.countries.forEach(country => { 
        countryIds.push(country.id);
      });

      filters.countryIds = countryIds;

      this.setState(state => ({
        countries:
          state.countries.concat(responseCountry.countries || []),
        filters
      }));
    } catch (error) {
      Logging.Error(error);
    }
  }

  loadBlocks = async countryId => {
    if (!countryId) {
        return;
    }

    this.setState({
      loadingBlocks: true,
      blocks: []
    });
    
    try {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_BLOCKS_BY_COUNTRY}?countryId=${countryId}`
      );

      this.setState({
        loadingBlocks: false,
        blocks: response.blocks
      });
    } catch (error) {
      Logging.Error(error);
    }
  }

  render() {
    const { country, blockDetail, personal, location } = this.props;
    const { profile, countries, blocks, posts } = this.state;

    if (!this.props.loggedIn && this.props.personal) {
      return false;
    }

    const authorAvatar = profile?.profileImageUrl ? (
      <Avatar id="blogger-profile-img" shape="square" src={profile.profileImageUrl} alt={profile.nickName} />
    ) : (
      <Avatar id="blogger-profile-img" shape="square" icon="user" alt="Default profile picture" />
    );

    return (
      <div id="mind">
        <div id="mind-banner">
          <Row>
            <Col                   
              xs={1}
              sm={2}
              md={3}
              lg={1}
              xl={3}
              xxl={4}
            />
            <Col 
              xs={22}
              sm={20}
              md={18}
              lg={22}
              xl={18}
              xxl={16}
            >
              <h2>{profile.blogTitle ? profile.blogTitle : "Your Mind"}</h2>
              {personal && (
                <>
                  <div id="profile-edit">
                    <span>Edit mind configuration in </span>
                    <Link to="/profile">
                      your profile
                    </Link>
                  </div>
                  {profile.blogUID ? (
                    <div id="mind-url">
                      <h3>
                        Your public URL:&nbsp;
                        <Link to={`/m/${profile.blogUID}`}>
                          {`${location.origin}/m/${profile.blogUID}`}
                        </Link>
                      </h3>
                    </div>
                  ) : (
                    <div id="mind-url">
                      Set your mind unique name in your profile to get a public url
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </div>
        {/* <Row>
          <Col span={24}>
            {personal && (
              <>
                <div id="profile-edit">
                  <span>Edit mind configuration in </span>
                  <Link to="/profile">
                    your profile
                  </Link>
                </div>
                {profile.blogUID ? (
                  <div id="mind-url">
                    <h3>
                      Your public URL:&nbsp;
                      <Link to={`/m/${profile.blogUID}`}>
                        {`${location.origin}/m/${profile.blogUID}`}
                      </Link>
                    </h3>
                  </div>
                ) : (
                  <div id="mind-url">
                    Set your mind unique name in your profile to get a public url
                  </div>
                )}
              </>
            )}
          </Col>
        </Row> */}
        <Row type="flex" style={{ flexWrap: "wrap-reverse" }} gutter={[ 16, 0 ]}>
          <Col
            className="col-push"
            xs={1}
            sm={2}
            md={3}
            lg={1}
            xl={3}
            xxl={4}
          />
          <Col
            xs={22}
            sm={20}
            md={18}
            lg={14}
            xl={12}
            xxl={11}
          >
            <div className="posts">
              <List
                dataSource={posts}
                split={false}
                renderItem={item => (
                  <Post
                    key={item.id}
                    post={item}
                    blockDetail={blockDetail}
                    country={country}
                    onUpdate={this.handlePostUpdate}
                    navigate={this.props.navigate}
                    path={this.props.path}
                  />
                )}
              />
            </div>
          </Col>
          <Col
            xs={1}
            sm={2}
            md={3}
            lg={0}
          />
          <Col
            xs={1}
            sm={2}
            md={3}
            lg={0}
          />
          <Col 
            id="sidebar"
            xs={22}
            sm={20}
            md={18}
            lg={8}
            xl={6}
            xxl={5}
          >
            <div id="mind-title">
              <h3>{profile.nickname || ""}</h3>
            </div>
            <div id="profile-photo">
              {authorAvatar}
            </div>
            <div id="mind-author-details">
              <p>{profile.firstName} {profile.lastName}</p>
            </div>
            <div id="mind-author-introduction">
              <p>{profile.introduction ? profile.introduction : "Please set the self-intro in your profile settings"}</p>
            </div>
            <div id="block-navigation">
              <Collapse 
                accordion
                bordered={false} 
                onChange={this.loadBlocks}
              >
                {countries.map(country => (
                  <Panel 
                    header={country.name} 
                    key={country.uniqueId} 
                  >
                    {blocks && blocks.map(block => (
                      <div className="block" key={block.id}>
                        <a  onClick={()=>this.handleBlockChange(block.id)}>{block.name}</a>
                      </div>
                    ))}
                  </Panel>
                ))}
              </Collapse>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DAppConnect(AuthConnect(Mind));