import React from "react";
import Spinner from "../Spinner";

export const wrappedComponentRenderer = (Component, requiredValueFromContext, props, value, invert, onContextValue) => {
  if (!requiredValueFromContext) {
    return <Component {...value} {...props} />;
  }
  
  const prop = value[requiredValueFromContext];

  if (requiredValueFromContext && typeof onContextValue == "function") {
    onContextValue(prop);
  }

  return (invert ? !prop : prop) ? (
    <Component {...value} {...props} />
  ) : (
    <Spinner />
  );
};