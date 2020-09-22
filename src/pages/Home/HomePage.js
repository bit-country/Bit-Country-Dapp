import React from "react";
import "../../App.css";
import TopBanner from "./TopBanner";
import CountryFeature from "./CountryFeature";
import TopCountry from "./TopCountry";
import Roadmap from "./Roadmap";
import BuyNow from "./BuyNow";
import Footer from "../../components/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import "./HomePage.styles.css";

export default function HomePage() {
  return (
    <>
      <div id="home">
        <div className="container">
          <TopBanner />
          <CountryFeature />
          {/* <MarketPlace /> */}
          {/* <SectionSnapper>
            <Activities />
          </SectionSnapper> */}
          {/* <FeatureOne /> */}
          <TopCountry />
          <Roadmap />
          <BuyNow />
          <Footer />
        </div>
      </div>
    </>
  );
}
