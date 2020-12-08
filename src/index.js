import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import "./css/App.css";
import App from "./App";
//import registerServiceWorker from "./registerServiceWorker";
import moment from "moment";
import { IntlProvider } from "react-intl";
import message_en from "./i18n/translations/en.json";
import message_cn from "./i18n/translations/cn.json";
import message_vn from "./i18n/translations/vn.json";

moment.locale(window.navigator.language);
//English and Spanish (add more langs here)
//Get the localfile here

const messages = {
  "en": message_en,
  "cn": message_cn,
  "vn": message_vn
};

const language = navigator.language.split(/[-_]/)[0];

ReactDOM.render(<IntlProvider
  locale={language}
  defaultLocale="en"
  messages={messages[language]}>
  <App />
</IntlProvider>, document.getElementById("root"));

//registerServiceWorker();
