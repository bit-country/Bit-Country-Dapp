import React, { Component } from "react";
import { Layout, List, Divider, Input, Select } from "antd";
import Post from "../../components/Post/Post";
import ENDPOINTS from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import { DAppConnect } from "../../components/HOC/DApp/DAppWrapper";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import "./MyPosts.styles.css";
import { FormattedMessage } from "react-intl";
import Logging from "../../utils/Logging";

const { Search } = Input;
const { Option } = Select;

let currentRequestId = 0;

class MyPosts extends Component {
    state = {
      story: "",
      loading: false,
      offset: 0,
      posts: [],
      isBusy: false,
      term: "",
      limit: 4,
      filters: { countryId: "", blockId: "", visibility: "", status: "" },
      anyCountry: true,
      loadingBlocks: false,
      countries: [ { id: "", uniqueId: "", name: "Any" } ],
      blocks: [ { id: "", uniqueId: "", name: "Any" } ],
      newSearch: false
    };

    componentDidMount() {
      this.refreshPosts();
      this.loadCountries();
      document.getElementById("auth-content").addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
      document.getElementById("auth-content").removeEventListener("scroll", this.handleScroll);
    }

    refreshPosts = () => {
      this.loadPosts(0);
    };

    loadMorePosts = () => {
      const { allLoaded, offset } = this.state;

      if (allLoaded) {
        return;
      }

      this.setState({ newSearch: false });
      this.loadPosts(offset);
    };

    searchPosts = () => {
      this.setState({ newSearch: true,  posts: [] });
      this.loadPosts(0);
    }

    loadPosts = async offset => {
      const { isBusy } = this.state;

      if (isBusy) {
        return false;
      }

      const { term, limit, filters, newSearch } = this.state;
      const { countryId, blockId, visibility, status } = filters;

      this.setState({
        loading: true,
        isBusy: true,
      });

      let postObj = {
        term,
        skip: offset,
        limit,
        countryId,
        blockId,
        visibility,
        status
      };

      const requestId = Math.random();

      try {
        currentRequestId = requestId;

        const response = await fetchAPI(ENDPOINTS.SEARCH_POSTS, "POST", postObj);

        if (!response?.isSuccess) {
          throw Error("Error retrieving posts");
        }

        if (currentRequestId != requestId) {
          return;
        }

        if (response.posts.length > 0 || newSearch) {
          this.setState(state => ({
            offset: offset + response.posts.length,
            posts: offset > 0 ? state.posts.concat(response.posts) : response.posts,
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
      const { allLoaded } = this.state;
      const objDiv = document.getElementById("auth-content");

      if (
        Math.abs((objDiv.scrollTop + objDiv.clientHeight) - objDiv.scrollHeight) <= 5
      ) {
        if (allLoaded) {
          return false;
        } 
            
        this.loadMorePosts();
      }
        
    };

    handleInputChange = e => {
      const { value, name } = e.target;

      this.setState({
        [name]: value,
        offset: 0,
        newSearch: true
      });
    };

    handleSelectChange = (value, name) => {
      const { filters, 
        countries 
      } = this.state;

      filters[name] = value;
      this.setState({
        filters,
        offset: 0,
        newSearch: true,
      });

      if (name == "countryId") {
        const { fileters } = this.state;

        filters.blockId = "";

        this.setState({ blocks: [ { id: "", name: "Any" } ], fileters });

        if (value == "") {
          this.setState({ anyCountry: true, loadingBlocks: false });
        }
        else {
          let country = countries.find( c => c.id == value);
          
          this.setState({ anyCountry: false, loadingBlocks: true });
          this.loadBlocks(country.uniqueId);
        }
      }
    };

    loadCountries = async () => {
      try {
        const {
          user
        } = this.props;

        const responseCountry = await fetchAPI(
          `${ENDPOINTS.GET_COUNTRIES_BY_USER}?userId=${user.id}`
        );

        this.setState(state => ({
          countries: state.countries.concat(responseCountry.countries || [])
        }));
      } catch (error) {
        Logging.Error(error);
      }
    }

    loadBlocks = async countryUid => {
      try {
        const response = await fetchAPI(
          `${ENDPOINTS.GET_BLOCKS_BY_COUNTRY}?countryId=${countryUid}`
        );

        this.setState(state => ({
          loadingBlocks: false,
          blocks: state.blocks.concat(response.blocks || [])
        }));
      } catch (error) {
        Logging.Error(error);
      }
    }

    render() {
      const { country, blockDetail, navigate } = this.props;
      const { posts, countries, blocks, filters, loading, anyCountry, loadingBlocks } = this.state;

      return (
        <Layout.Content>
          <Divider orientation="left">
            <FormattedMessage
              id="myPosts.section.myPosts"
            />
          </Divider>

          <div id="search">
            <Search
              placeholder="Search"
              size="large"
              name="term"
              onChange={this.handleInputChange}
              onSearch={this.searchPosts}
              enterButton
            />
            <div className="filters">
              <span className="filter-field">
                <label>
                  <FormattedMessage id="myPosts.filter.country" />
                </label>
                <Select
                  defaultValue={""}
                  style={{ width: 200 }}
                  onChange={value =>
                    this.handleSelectChange(value, "countryId")
                  }
                >
                  {countries.map(country => (
                    <Option 
                      key={country.id} 
                      value={country.id}
                    >
                      {country.name}
                    </Option>
                  ))}
                </Select>
              </span>

              <span className="filter-field">
                <label>
                  <FormattedMessage id="myPosts.filter.block" />
                </label>
                <Select
                  disabled={anyCountry}
                  loading={loadingBlocks}
                  defaultValue={""}
                  value={filters.blockId}
                  style={{ width: 200 }}
                  onChange={value => this.handleSelectChange(value, "blockId")}
                >
                  {blocks.map(block => (
                    <Option key={block.id} value={block.id}>
                      {block.name}
                    </Option>
                  ))}
                </Select>
              </span>
              <span className="filter-field">
                <label>
                  <FormattedMessage id="myPosts.filter.visibility" />
                </label>
                <Select
                  defaultValue={""}
                  style={{ width: 200 }}
                  onChange={value => this.handleSelectChange(value, "visibility")}
                >
                  <Option value="">
                    <FormattedMessage id="myPosts.filter.any" />
                  </Option>
                  <Option value="Public">
                    <FormattedMessage id="post.visibility.public" />
                  </Option>
                  {/* <Option value="Restricted">
                    <FormattedMessage id="post.visibility.restricted" />
                  </Option>
                  <Option value="Unlisted">
                    <FormattedMessage id="post.visibility.unlisted" />
                  </Option> */}
                  <Option value="Private">
                    <FormattedMessage id="post.visibility.private" />
                  </Option>
                </Select>
              </span>
              <span className="filter-field">
                <label>
                  <FormattedMessage id="myPosts.filter.status" />
                </label>
                <Select
                  defaultValue={""}
                  style={{ width: 200 }}
                  onChange={value => this.handleSelectChange(value, "status")}
                >
                  <Option value="">
                    <FormattedMessage id="myPosts.filter.any" />
                  </Option>
                  <Option value="published">
                    <FormattedMessage id="myPosts.filter.status.published" />
                  </Option>
                  <Option value="unpublished">
                    <FormattedMessage id="myPosts.filter.status.unpublished" />
                  </Option>
                  <Option value="expired">
                    <FormattedMessage id="myPosts.filter.status.expired" />
                  </Option>
                </Select>
              </span>
            </div>
          </div>

          <div className="posts">
            <List
              dataSource={posts}
              split={false}
              loading={loading}
              renderItem={item => (
                <Post
                  key={item.id}
                  post={item}
                  blockDetail={blockDetail}
                  country={country}
                  navigate={navigate}
                  showAllPostMeta={true}
                />
              )}
            />
          </div>
        </Layout.Content >
      );
    }
}

export default DAppConnect(AuthConnect(MyPosts, true));