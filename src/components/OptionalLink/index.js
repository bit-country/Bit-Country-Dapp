import React from "react";
import { Link } from "@reach/router";

export default function OptionalLink(props) {
  const { 
    to, 
    enabled, 
    children,
    ...restProps
  } = props;

  if (enabled) {
    return (
      <div {...restProps} className="optional-link">
        <Link
          to={to}
        >
          {children}
        </Link>
      </div>
    );
  }

  return (
    <div {...restProps} className="optional-link">
      {children}
    </div>
  );
}
