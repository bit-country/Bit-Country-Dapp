import React from "react";

export default function Selector({ keys, handleSelection }) {
  return (
    <div className="com-header">
      {keys.map((item, index) => (
        <a
          key={index}
          className={`cmp-btn cmp-btn-status ${
            item.active ? "is-active" : ""
          }`}
          onClick={() => handleSelection(item.value)}
        >
          {item.text}
        </a>
      ))}      
    </div>
  );
}
