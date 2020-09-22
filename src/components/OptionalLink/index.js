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
      <div {...restProps}>
        <Link
          to={to}
        >
          {children}
        </Link>
      </div>
    );
  }

  return (
    <div {...restProps}>
      {children}
    </div>
  );
}
