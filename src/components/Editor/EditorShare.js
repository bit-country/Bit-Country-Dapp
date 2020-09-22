import { Button, Form, Input } from "antd";
import React from "react";
import { FormattedMessage } from "react-intl";

function EditorShare({ title, summary, url, busy, handleInputChange, handleCancel, handleCreate, hideButtons }) {
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
      <Form.Item label="Share">
        <Input
          name="url"
          value={url}
          maxLength={600}
          onChange={handleInputChange}
          className="input-text"
        />
      </Form.Item>

      {!hideButtons && (
        <Form.Item className="buttons">
          {/* <div className="privacy-settings">
            <div className="privacy is-public">Public</div>
          </div> */}
          <Button onClick={handleCancel} disabled={busy}>
            <FormattedMessage id="form.cancel" />
          </Button>
          <Button
            className="activity button"
            type="primary"
            onClick={handleCreate}
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

export default EditorShare;