import React from "react";
import loadingIcon from "./../../assets/images/rolling.gif";

export const Loading = () => {
  return (
    <p id="load-more-loading">
      <img src={loadingIcon} alt="Loading…" />
    </p>
  );
};

export default Loading;
