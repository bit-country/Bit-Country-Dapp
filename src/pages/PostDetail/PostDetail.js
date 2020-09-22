import React, { Component } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./../../css/NewsFeed.css";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import { CountryConnect } from "../../components/HOC/Country/CountryWrapper";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import "./PostDetail.styles.css";
import Logging from "../../utils/Logging";
import Spinner from "../../components/Spinner";
import PostDetailModal from "../../components/Post/PostDetailModal";
import { navigate } from "@reach/router";


class PostDetail extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      post: null,
      loading: true,
    };
  }  

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    await this.loadPostData();
  }

  loadPostData = async () => {
    const {
      shortCode,
      slug,
      countryId,
      id,
      blogUid
    } = this.props;

    try {
      this.setState({
        loading: true
      });

      const response = await fetchAPI(`${ENDPOINTS.GET_POST_BY_SHORTCODE}?postShortCode=${shortCode}${slug ? "&slug="+slug : ""}${countryId ? "&country="+countryId : ""}${id ? "&block="+id : ""}${blogUid ? "&mind="+blogUid : ""}`);

      if (response?.status == 404) {
        navigate("/404/p");

        return;
      } else if (!response?.isSuccess) {
        throw Error("Error retrieving post data");
      }

      this.setState({
        post: response.post,
        loading: false
      });
    } catch (error) {
      Logging.Error(error);

      throw error;
    }
  }

  handleModalClose = () => {
    navigate("../");
  }

  render() {
    const {
      loading,
      post, 
    } = this.state;

    if (loading) {
      return (
        <div className="post-detail-loader">
          <Spinner />
        </div>
      );
    }      

    return (
      <PostDetailModal 
        post={post}
        showModal={true}
        handleModalClose={this.handleModalClose}
      />
    );
  }
}

export default AuthConnect(CountryConnect(PostDetail));
