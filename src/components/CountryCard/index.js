import React from "react";
import { Card, Row, Divider } from "antd";
import Utils from "../../utils/Utils";
import "./index.css";
import { FormattedMessage } from "react-intl";
import TokenDetailsPopover from "../../components/TokenDetailsPopover";
import { Link } from "@reach/router";

export default function CountryCard({ country }) {
  const {
    name,
    theme,
    president,
    description,
    population,
    token
  } = country;

  const symbol = token?.symbol;
  const quantity = token?.totalSupply;

  const isPending = country.status == "Pending";
  let styleClasses = [ "country-card" ];

  return (
    <>
      <Link 
        to={country.uniqueId ? `/c/${country.uniqueId}` : ""}
        className={styleClasses.join(" ")}
      >
        <Card
          cover={<img src={Utils.getTheme(theme)} className="cover" />}
          size="small"
        >
          <Card.Meta
            title={name}
            description={description}
          />
          <div className="details">
            <Divider />
            <Row>
              <FormattedMessage
                id="country.card.details.president"
                values={{
                  president
                }}
              />
            </Row>
            <Row>
              <FormattedMessage
                id="country.card.details.population"
                values={{
                  population: population.toLocaleString()
                }}
              />
            </Row>
            {token?.symbol ? (
              <Row>
                <TokenDetailsPopover token={token}>
                  <span className="token-popover-hint">
                    <FormattedMessage
                      id="country.card.details.token"
                      values={{
                        quantity: quantity.toLocaleString(),
                        symbol
                      }}
                    />
                  </span>
                </TokenDetailsPopover>
              </Row>
            ) : (
              <Row>
                <TokenDetailsPopover>
                  <span className="token-popover-hint">
                    <FormattedMessage
                      id="country.card.details.token.empty"
                    />
                  </span>
                </TokenDetailsPopover>
              </Row>
            )}
          </div>
        </Card>
      </Link>
      {isPending && (
        <h3 className="pending-card">
          <FormattedMessage
            id="country.card.pending"
          />
        </h3>
      )}
    </>
  );
}
