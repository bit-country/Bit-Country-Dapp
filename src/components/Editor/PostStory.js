import React from "react";
import { CountryConnect } from "../HOC/Country/CountryWrapper";
import { AuthConnect } from "../HOC/Auth/AuthContext";
import Notification from "../../utils/Notification";
import postTypes from "../../config/postCreationTypes";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import slugify from "../../utils/Slugify";
import EditorStory from "./EditorStory";
import EditorShare from "./EditorShare";
import EditorArticle from "./EditorArticle";
import "./PostStory.styles.css";
import "react-quill/dist/quill.snow.css";
import "./../../css/NewsFeed.css";
import "./../../css/NewArticle.css";
import Selector from "./Selector";
import ENDPOINTS from "../../config/endpoints";
import { fetchManual } from "../../utils/FetchUtil";
import Logging from "../../utils/Logging";


const defaultArticleState = {
  title: "",
  summary: "",
  content: "",  
  featuredImage: null,
  featuredImageUrl: null,
};

const defaultShareState ={
  url: "",
};

const defaultState = {
  postType: postTypes.STORY,
  visibility: "Public",
  story: "",
  busy: false,
  ...defaultShareState,
  ...defaultArticleState,
};

class PostStory extends React.PureComponent {
  state = defaultState;

  postTypeChange = type => {
    const {
      postType
    } = this.state;

    if (postType == type) {
      return;
    }

    this.setState({
      postType: type,
    });
  };

  handleEditorChange = content => {
    this.setState({
      content,
    });
  };

  handleInputChange = ({ target: { value, name } }) => {
    this.setState({
      [name]: value,
    });
  };

  handleSelectChange = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  disabledDate = current => {
    return current && current < moment().startOf("day");
  };

  addNewPost = async newStory => {
    const { refreshPosts } = this.props;

    try {
      const formData = new FormData();

      for (const [ key, value ] of Object.entries(newStory)) {
        formData.set(key, value);
      }

      const response = await fetchManual(ENDPOINTS.CREATE_POST, "POST", formData);

      if (!response?.isSuccess) {
        throw Error("Error creating new post");
      }

      refreshPosts();

      return true;
    } catch (error) {
      Logging.Error(error);

      return false;
    }
  };

  createStory = async () => {
    const { country, blockDetail } = this.props;
    const { story, busy, visibility } = this.state;

    if (busy) {
      return;
    }    

    this.setState({
      busy: true,
    });

    const newStory = {
      content: story,
      countryId: country.id,
      blockId: blockDetail.id,
      visibility: visibility,
      postType: "story",
    };

    const addedPost = await this.addNewPost(newStory);

    this.setState({
      busy: false,
    });

    if (!addedPost) {
      Notification.displayErrorMessage("Error while creating new post!");

      return;
    }

    Notification.displaySuccessMessage(
      "New post has been created successfully..."
    );

    this.setState(defaultState);
  };

  createShare = async () => {
    const { country, blockDetail } = this.props;
    const { title, summary, url, busy, visibility } = this.state;

    if (busy) {
      return;
    }    

    this.setState({
      busy: true,
    });

    const newStory = {
      title,
      content: summary,
      url: url,
      countryId: country.id,
      blockId: blockDetail.id,
      visibility,
      postType: "share",
    };

    const addedPost = await this.addNewPost(newStory);

    this.setState({
      busy: false,
    });

    if (!addedPost) {
      Notification.displayErrorMessage("Error while creating new share!");

      return;
    }

    Notification.displaySuccessMessage(
      "New share has been created successfully..."
    );

    this.setState(defaultState);
  };

  createArticle = async () => {
    const { country, blockDetail } = this.props;
    const { 
      title, 
      summary, 
      content,
      busy,
      visibility,
      publishTime,
      expirationTime,
      featuredImageFile,
    } = this.state;
    
    if (busy) {
      return;
    }

    this.setState({
      busy: true,
    });

    const slug = slugify(title);

    const postObj = {
      title,
      summary,
      content,
      countryId: country.id,
      blockId: blockDetail.id,
      postType: "article",
      visibility,
      publishTime,
      expirationTime,
      featuredImage: featuredImageFile,
      slug: slug ? slug : ""
    };

    const addedPost = await this.addNewPost(postObj);

    this.setState({
      busy: false,
    });

    if (!addedPost) {
      Notification.displayErrorMessage("Error while creating new post!");

      return;
    }

    Notification.displaySuccessMessage(
      "New post has been created successfully..."
    );

    this.postTypeChange(postTypes.STORY);

    this.setState(defaultState);
  };

  cancelShare = () => {
    this.postTypeChange(postTypes.STORY);
    this.setState(state => ({
      ...state,
      defaultShareState
    }));
  };

  cancelArticle = () => {
    this.postTypeChange(postTypes.STORY);
    this.setState(state => ({
      ...state,
      defaultArticleState
    }));
  };

  handleBeforeUpload = async file => {
    this.setState({
      featuredImage: URL.createObjectURL(file),
      featuredImageFile: file
    });
    
    return false;
  }

  renderBody = () => {
    const {
      postType,
      story,
      title,
      summary,
      content,
      url,
      visibility,
      busy,
      featuredImage,
    } = this.state;

    switch (postType) {
      case postTypes.STORY:
        return (
          <EditorStory
            story={story}
            busy={busy}
            handleInputChange={this.handleInputChange}
            handleCreate={this.createStory}
          />
        );

      case postTypes.SHARE:
        return (
          <EditorShare
            title={title}
            summary={summary}
            url={url}
            busy={busy}
            handleInputChange={this.handleInputChange}
            handleCancel={this.cancelShare}
            handleCreate={this.createShare}
          />
        );

      case postTypes.ARTICLE:
        return (
          <EditorArticle
            title={title}
            summary={summary}
            featuredImage={featuredImage}
            content={content}
            visibility={visibility}
            busy={busy}
            handleEditorChange={this.handleEditorChange}
            handleBeforeUpload={this.handleBeforeUpload}
            handleInputChange={this.handleInputChange}
            handleSelectChange={this.handleSelectChange}
            handleCancel={this.cancelArticle}
            handleCreate={this.createArticle}
          />
        );
    }
  };

  render() {
    const { postType } = this.state;

    const keys = [
      {
        active: postType == postTypes.STORY,
        value: postTypes.STORY,
        text: <FormattedMessage id="newsfeed.createStory" />
      },
      {
        active: postType == postTypes.SHARE,
        value: postTypes.SHARE,
        text: <FormattedMessage id="newsfeed.createShare" />
      },
      {
        active: postType == postTypes.ARTICLE,
        value: postTypes.ARTICLE,
        text: <FormattedMessage id="newsfeed.createArticle" />
      }
    ];

    return (
      <div className="composer">
        <Selector 
          keys={keys}
          handleSelection={this.postTypeChange}
        />
        <div className="com-content">{this.renderBody()}</div>
      </div>
    );
  }
}

export default CountryConnect(AuthConnect(PostStory));
