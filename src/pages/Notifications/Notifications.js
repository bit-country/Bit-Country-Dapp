import React, { useState, useEffect } from "react";
import { Row, Col, Divider, List } from "antd";
import "./Notifications.style.css";
import { FormattedMessage } from "react-intl";
import { navigate } from "@reach/router";
import { fetchAPI } from "../../utils/FetchUtil";
import ENDPOINTS from "../../config/endpoints";
import { timeAgo } from "../../utils/DateTime";

export default function Notifications() {
  const [ notifications, setNotifications ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    (async function() {
      const response = await fetchAPI(ENDPOINTS.GET_NOTIFICATIONS);
  
      if (response?.isSuccess) {
        setIsLoading(false);
        setNotifications(response.notifications);
      }
    })();
  }, []);

  const notificationItem = notification => {
    const { id, type, author, body, createdOn, post, isRead } = notification;
    var title = "", link ="";

    switch (type) {
    case 0:
      title = `${author.nickName} commented your post: ${post.title}`;
      link = post.link;
      break;
    case 1:
      title = `${author.nickName} liked your post: ${post.title}`;
      link = post.link;
      break;
    case 2:
      title = `${author.nickName} sent you a message`;
      break;
    default:
      break;
    }

    return (
      <List.Item
        key={id}
        className={isRead ? "notification" : "unread notification"} 
      >
        <List.Item.Meta
          title={title}
          description={
            <>
              {body} 
              <span className="time">{timeAgo(createdOn)}</span>
            </>
          }
          onClick={() => navigate(link)}
          className="body"
        />
      </List.Item>
    );
  };

  return (
    <Row>
      <Col 
        id="notifications"
        push={4}
        span={16}
      >
        <h2>
          <FormattedMessage id="notifications.title" />
        </h2>
        <Divider />
        <div className="content">
          <List
            dataSource={notifications}
            renderItem={notification => notificationItem(notification)}
            loading={isLoading}
          />
        </div>
      </Col>
    </Row>
  );
}
