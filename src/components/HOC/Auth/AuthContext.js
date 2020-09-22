import React from "react";
import { wrappedComponentRenderer } from "../WrappedComponentRenderer";
import { navigate } from "@reach/router";

export const AuthContext = React.createContext();

const redirectOnFailure = loggedIn => { 
  if (!loggedIn) {
    navigate("/401");
  } 
};

// eslint-disable-next-line react/display-name
export const AuthConnect = (WrappedComponent, requiresLogin) => props => (
  <AuthContext.Consumer>
    {value => wrappedComponentRenderer(WrappedComponent, requiresLogin ? "loggedIn" : null, props, value, false, redirectOnFailure)}
  </AuthContext.Consumer>
);
