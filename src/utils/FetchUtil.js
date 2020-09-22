import Cookies from "js-cookie";
import { BASE_URL } from "../config/endpoints";
import Logging from "./Logging";

let customHeaders = {};

export function setCustomHeader(key, value) {
  customHeaders[key] = value;

  return true;
}

export async function fetchAPI(endpoint, method = "get", body = null) {
  const newBody = body ? JSON.stringify(body) : null;
  const headers = {
    "Content-Type": "application/json"
  };

  return fetchManual(endpoint, method, newBody, headers);
}

export async function fetchManual(endpoint, method = "get", body = null, headers = {}) {
  try {
    const url = BASE_URL + endpoint;
    const bitToken = Cookies.get("bitToken");

    let options = {
      method,
      headers: {
        authorization: `Bearer ${bitToken}`,
        ...customHeaders,
        ...headers
      }
    };

    if (body) {
      options.body = body;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const responseBody = await response.text();

      try {
        const json = await JSON.parse(responseBody);

        if (response.status == 404 && json.isSuccess == false) {
          return {
            status: 404,
            json: json
          };
        }

        Logging.Error(new Error(`Error with request\nURL: ${url}\nOptions: ${JSON.stringify(options)}\nResponse: ${JSON.stringify(response)}\nResponse body: ${responseBody}`), url, options, response);
  
        return json;
      } catch (error) {
        Logging.Error(new Error(`Error with request\nURL: ${url}\nOptions: ${JSON.stringify(options)}\nResponse: ${JSON.stringify(response)}\nResponse body: ${responseBody}`), url, options, response);
        
        return;
      }
    }
    
    const responseBody = await response.json();

    return responseBody;
  } catch (error) {
    Logging.Error(error);

    return null;
  }
}
