import React from "react";
import { Card } from "antd";

export default function BlockCard({ topic, disabled }) {
  return (
    <a 
      href={!(!topic || disabled) ? window.location.pathname.replace(/\/b\/.+\/viewer/, `/b/${topic.uniqueId}/viewer`) : ""}
      className="nav-block"
    >
      <Card
        hoverable
      >
        {topic ? (
          <>
            <div className="topic">
              {topic.name}
            </div>
            <div className="post-count">
              {topic.totalPosts}
            </div>
          </>
        ) : null}
      </Card>
    </a>
  );
}
