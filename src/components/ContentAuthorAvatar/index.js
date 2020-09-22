import React from "react";
import { Avatar, Badge } from "antd";
import OptionalLink from "../OptionalLink";

export default function ContentAuthorAvatar({ author, size = "large" }) {
  const authorAvatar = author?.profileImageUrl ? (
    <Avatar size={size} src={author.profileImageUrl} alt={author.nickName} />
  ) : (
    <Avatar size={size} icon="user" alt="Default profile picture" />
  );

  return (
    <div className="author-image">
      <OptionalLink
        to={`/m/${author.mind}`}
        enabled={author.mind}
      >
        <Badge dot={!!author.mind} color={author.mind ? "#39a142" : null}>
          {authorAvatar}
        </Badge>
      </OptionalLink>
    </div>
  );
}
