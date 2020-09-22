import React from "react";
import "./index.css";

export default function Scroller({ children }) {
  return (
    <>
      <div className="scroller">
        {children}
      </div>
    </>
  );
}
