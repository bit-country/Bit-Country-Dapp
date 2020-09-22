import { Button, Card, Popover } from "antd";
import React, { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";
import "./index.css";

export default function LinkPreviewer({ metadata }) {
  let {
    url,
    image,
    imageAlt,
    description,
    title,
  } = metadata;

  const [ open, setOpen ] = useState(false);
  const handleToggle = useCallback(() => {
    setOpen(!open);
  }, [ open ]);

  const handleChange = useCallback(visible => {
    setOpen(visible);
  }, []);

  return (
    <Popover
      visible={open}
      trigger="click"
      onVisibleChange={handleChange}
      title={(
        <FormattedMessage
          id="platform.redirect.title"
          defaultMessage="You are leaving Bit.Country."
        />
      )}
      content={
        <div className="redirect-confirm">
          <p>
            <FormattedMessage
              id="platform.redirect.confirmationMessage"
              defaultMessage="Are you sure you want to continue?"
            />
          </p>
          <div
            className="actions"
          >
            <Button onClick={handleToggle}>
              <FormattedMessage
                id="platform.redirect.no"
                defaultMessage="No"
              />
            </Button>
            <Button 
              href={url} 
              rel="noopener noreferrer" 
              target="_blank"
              type="primary"
            >
              <FormattedMessage
                id="platform.redirect.yes"
                defaultMessage="Yes"
              />
            </Button>
          </div>
        </div>
      }
      className="share-container"
    >
      <Card 
        onClick={handleToggle}
        style={{ cursor: "pointer" }}
        cover={(<div className="image-container"><img src={image} alt={imageAlt} /></div>)}
      >
        <Card.Meta
          title={title}
          description={description}
        />
      </Card>
    </Popover>
  );
}