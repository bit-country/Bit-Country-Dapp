import React from "react";
import { Icon } from "antd";

export default function SocialLinks() {
  return (
    <>
      <a href="https://www.facebook.com/bitcountry/" target="_blank" rel="noopener noreferrer">
        <Icon
          type="facebook"
        />
      </a>
      <a href="https://twitter.com/bitdotcountry  " target="_blank" rel="noopener noreferrer">
        <Icon
          type="twitter"
        />
      </a>
      <a href="https://www.linkedin.com/company/bit-country" target="_blank" rel="noopener noreferrer">
        <Icon
          type="linkedin"
        />
      </a>
      <a href="https://medium.com/@bitcountry" target="_blank" rel="noopener noreferrer">
        <Icon
          type="medium"
        />
      </a>
      <a href="https://t.me/bitcountryofficial" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-telegram"></i>
      </a>
    </>
  );
}
