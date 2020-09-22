import React from "react";
import CountryBreadcrumb from "../../components/CountryBreadcrumb";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import { CountryConnect } from "../../components/HOC/Country/CountryWrapper";

function CountryShop({ country }) {
  return (
    <>
      <div className="l-home">
        <CountryBreadcrumb
          country={country}
          crumbs={[
            {
              name: "Shop"
            }
          ]}
        />
        <h1 className="center aligned">
          Shop is coming soon!
        </h1>
        <ul>
          <li>
            digital assets
          </li>
          <li>
            services
          </li>
        </ul>
      </div>
    </>
  );
}

export default AuthConnect(CountryConnect(CountryShop));
