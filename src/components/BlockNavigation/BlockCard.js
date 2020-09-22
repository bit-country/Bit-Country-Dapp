import React from "react";
import { Card } from "antd";
import { Link } from "@reach/router";

export default function BlockCard({ topic, disabled }) {
  return (
    <Link 
      to={topic ? `../${topic.uniqueId}` : ""} disabled={!topic || disabled}
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
    </Link>
  );
}
