import { Button, Col, Collapse, DatePicker, Form, Input, Row, Select, Upload } from "antd";
import React from "react";
import { FormattedMessage } from "react-intl";
import ReactQuill from "react-quill";

const { Panel } = Collapse;
const { Option } = Select;

const colourSet = [
  "black",
  "darkgrey",
  "grey",
  "lightgrey",
  "white",
  "darkred",
  "red",
  "brown",
  "orange",
  "yellow",
  "olive",
  "darkgreen",
  "green",
  "lightgreen",
  "turquoise",
  "cyan",
  "darkblue",
  "blue",
  "lightblue",
  "purple",
  "pink",
];

const toolbarOptions = [
  [ "bold", "italic", "underline", "strike" ],
  [ { "list": "ordered" }, { "list": "bullet" } ],
  [ { "script": "sub" }, { "script": "super" } ],
  [ "blockquote", "code-block" ],
  [ { "header": [ 1, 2, 3, 4, 5, 6, false ] } ],
  [ { "color": colourSet }, { "background": colourSet } ],
  [ { "font": [] } ],
  [ { "align": "justify" }, { "align": "center" }, { "align": "right" } ],
  [ { "direction": "rtl" } ],
  [ "link" ],
  [ "image" ],
  [ "clean" ]
];

function EditorArticle({ 
  title, 
  summary, 
  featuredImage, 
  content, 
  visibility, 
  busy, 
  disabledDate, 
  handleInputChange, 
  handleSelectChange, 
  handleBeforeUpload, 
  handleEditorChange, 
  handleCancel, 
  handleCreate, 
  hideButtons
}) {
  return (
    <Form className="cmp-form-status">
      <Form.Item label="Title">
        <Input
          name="title"
          value={title}
          maxLength={100}
          onChange={handleInputChange}
          className="input-text"
        />
      </Form.Item>
      <Form.Item label="Summary">
        <Input.TextArea
          name="summary"
          value={summary}
          maxLength={400}
          onChange={handleInputChange}
          className="input-text"
          rows="4"
          autoSize
        />
      </Form.Item>
      <Form.Item label="Featured Image">
        <Upload
          name="featuredImage"
          accept=".png,.jpg,.jpeg"
          listType="picture-card"
          className="image-uploader"
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
        >
          {featuredImage ? (
            <img src={featuredImage} style={{ minWidth: "20em", maxWidth: "100%", maxHeight: "20em", objectFit: "contain", objectPosition: "center" }} />
          ) : (
            <FormattedMessage
              id="newsfeed.post.featuredImage"
              defaultMessage="Upload a featured image for your post"
            />
          )}
        </Upload>
      </Form.Item>
      <Form.Item label="Content">
        <ReactQuill
          modules={{
            toolbar: toolbarOptions,
          }}
          value={content}
          onChange={handleEditorChange}
        />
      </Form.Item>
      <Collapse
        bordered={false}
        className="site-collapse-custom-collapse"
      >
        <Panel header="Advanced options" id="advanced-options">
          <Row className="form-row">
            <label className="field-label">
              <FormattedMessage id="newsfeed.visibility" />
            </label>
            <Select
              style={{ width: 200 }}
              className="select"
              defaultValue="Public"
              name="visibility"
              value={visibility}
              onChange={value =>
                handleSelectChange(value, "postVisibility")
              }
            >
              <Option value="Public"><FormattedMessage id="post.visibility.public" /></Option>
              {/* <Option value="Restricted"><FormattedMessage id="post.visibility.restricted" /></Option>
              <Option value="Unlisted"><FormattedMessage id="post.visibility.unlisted" /></Option> */}
              <Option value="Private"><FormattedMessage id="post.visibility.private" /></Option>
            </Select>
          </Row>
          <Row className="form-row">
            <Col sm={24} md={12}>
              <label className="field-label">
                <FormattedMessage id="newsfeed.publishTime" />
              </label>
              <DatePicker
                showTime
                disabledDate={disabledDate}
                onChange={value =>
                  handleSelectChange(
                    value ? value.toISOString() : value,
                    "publishTime"
                  )
                }
              />
            </Col>
            <Col sm={24} md={12}>
              <label className="field-label">
                <FormattedMessage id="newsfeed.expirationTime" />
              </label>
              <DatePicker
                showTime
                disabledDate={disabledDate}
                onChange={value =>
                  handleSelectChange(
                    value ? value.toISOString() : value,
                    "expirationTime"
                  )
                }
              />
            </Col>
          </Row>
        </Panel>
      </Collapse>

      {!hideButtons && (
        <Form.Item className="buttons">
          <Button onClick={handleCancel} disabled={busy}>
            <FormattedMessage id="form.cancel" />
          </Button>
          <Button
            onClick={handleCreate}
            type="primary"
            loading={busy}
            disabled={busy}
          >
            <span>
              <FormattedMessage id="newsfeed.post" />
            </span>
          </Button>
        </Form.Item>
      )}
    </Form>
  );
}

export default EditorArticle;
