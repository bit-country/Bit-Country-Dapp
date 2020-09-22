import { ApplicationInsights } from "@microsoft/applicationinsights-web";

/* eslint-disable no-console */
/* eslint-disable no-undef */
export default {
  Log: (...args) => {
    if (process.env.NODE_ENV != "production") {
      console.log(...args);
    }
  },
  Error: (...args) => {
    if (process.env.NODE_ENV != "production") {
      console.error(...args);
    }

    const [
      error,
      ...rest
    ] = args;

    appInsights.trackException({ error,  data: rest  });
  }
};

let appKey = process.env.REACT_APP_INSIGHTS_KEY;

export const appInsights = new ApplicationInsights({ config: {
  instrumentationKey: appKey,
  enableAutoRouteTracking: true,
  autoTrackPageVisitTime: true
  /* ...Other Configuration Options... */
} });
