import { Button, Form, Input } from "antd";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";

function EditorStory({ intl, story, busy, handleInputChange, handleCreate, hideButtons }) {
  return (
    <Form className="cmp-form-status">
      <Form.Item className="story">
        <Input.TextArea
          placeholder={intl.formatMessage(
            { id: "newsfeed.story.placeholder" }
          )}
          name="story"
          value={story}
          onChange={handleInputChange}
          autoSize
        />
      </Form.Item>
      {!hideButtons && (
        <Form.Item className="buttons">
          {/* <div className="privacy-settings">
            <div className="privacy is-public">Public</div>
          </div> */}
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

export default injectIntl(EditorStory);
