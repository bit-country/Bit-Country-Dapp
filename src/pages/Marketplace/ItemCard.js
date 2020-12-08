import React from "react";
import "./Marketplace.styles.css";
import { Link } from "@reach/router";
import CountryBG from "../../assets/images/bg_country.png";
import BlockBG from "../../assets/images/bg_block.png";
import Currency from "../../components/CurrencyIcon";

const ItemCard = ({ item }) => {
  if (!item) return null;

  const { title, price, description, id, category, itemImage } = item;

  return (
    <Link className="CardLink" to={`/marketplace/item/${id}`}>
      <div
        className="CardBody"
        style={{
          boxShadow:
            "rgb(234, 234, 234) 0px 2px 12px, rgba(0, 0, 0, 0.22) 0px 10px 10px 0px",
          borderRadius: "5px",
          padding: "10px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ textAlign: "center", padding: "0 0 20px", flex: 1 }}>
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "scale-down",
              borderRadius: "5px",
            }}
            src={category === "country" ? CountryBG : category === "asset" ? itemImage : BlockBG}
          />
        </div>
        <div
          style={{
            padding: "2%",
            margin: "0",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <h2>{title}</h2>
          <span style={{ color: "grey" }}>{description}</span>
        </div>
        <br />
        <div style={{ display: "grid" }}>
          <div>
            <Currency price={price} size="mini" />
          </div>
          <div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
