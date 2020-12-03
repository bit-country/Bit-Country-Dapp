import React from "react";
import { Button, Col, Row } from "antd";
import "./Marketplace.styles.css";
import CountryBG from "../../assets/images/bg_country.png";
import BlockBG from "../../assets/images/bg_block.png";

const SellingItemCard = ({ item, setSelectedItem, isSelected, category }) => {
  if (!item) return null;
  const {
    name,
    uniqueId,
    description,
    totalBlocks,
    bankBalance,
    population,
    countryUniqueName,
    totalResidents,
    totalPost,
    president,
  } = item;

  const renderDetail = value => {

    const key = Object.keys(value)[0];

    if (value[key]) {
      return (
        <Row>
          <span style={{ textTransform: "capitalize" }}>
            {key?.split(/(?=[A-Z])/).join(" ")}:
          </span>{" "}
          {value[key]}
        </Row>
      );
    }
  };

  const getHref = () =>
    category === "block"
      ? `/c/${countryUniqueName}/b/${uniqueId}`
      : `/c/${countryUniqueName}`;


  return (
    <div
      className="CardBody"
      style={{
        boxShadow:
          "rgb(234, 234, 234) 0px 2px 12px, rgba(0, 0, 0, 0.22) 0px 10px 10px 0px",
        margin: "auto",
        borderRadius: "5px",
        padding: "10px",
        maxWidth: "520px",
      }}
    >
      <div style={{ textAlign: "center", padding: "0 0 20px" }}>
        <img
          style={{
            width: "100%",
            objectFit: "scale-down",
            borderRadius: "5px",
          }}
          src={category === "country" ? CountryBG : BlockBG}
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
        <h2 style={{ textTransform: "capitalize" }}>{name}</h2>
        <span style={{ color: "grey" }}>{description}</span>
      </div>
      <br />
      <div
        style={{
          padding: "2%",
          margin: "0",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {renderDetail({ president })}
        {renderDetail({ totalBlocks })}
        {renderDetail({ bankBalance })}
        {renderDetail({ population })}
        {renderDetail({ totalPost })}
        {renderDetail({ totalResidents })}
      </div>
      <br />
      <Row justify="end" gutter={12}>
        <Col span={16}>
          <a href={getHref()} target="_blank" rel="noopener noreferrer" >
            <Button style={{ width: "100%" }}>View </Button>
          </a>
        </Col>
        <Col span={8}>
          {isSelected ? (
            <Button
              type="danger"
              style={{ width: "100%" }}
              onClick={() => setSelectedItem(null)}
            >
              Cancel
            </Button>
          ) : (
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={() => setSelectedItem(item)}
              >
                Select
              </Button>
            )}
        </Col>
      </Row>
    </div>
  );
};

export default SellingItemCard;
