import React from "react";
import CountryCard from "../../components/CountryCard";
import { FormattedMessage } from "react-intl";
import CardColumn from "../../components/CardColumn/CardColumn";

export default function RecommendedCountries() {
  const countries = [
    {
      id: 1,
      name: "Coding Kingdom",
      theme: "1",
      president: "Ray",
      description: "A land of coding. Share your skills and learn from the best.",
      population: 2480,
      token: {
        symbol: "CKD",
        totalSupply: 50000
      }
    },
    {
      id: 2,
      name: "Game Developer Retreat",
      theme: "3",
      president: "Tim",
      description: "Take some time for rest and relaxation. Talk all things game development in a comfortable environment.",
      population: 10001,
      token: {
        symbol: "GDRT",
        totalSupply: 100000
      }
    },
    {
      id: 3,
      name: "Up and coming stars",
      theme: "4",
      president: "Balraj",
      description: "Learn about the latest, greatest and hottest new stars on the block.",
      population: 1338,
      token: {
        symbol: "UACS",
        totalSupply: 10000
      }
    },
    {
      id: 4,
      name: "Lowlands",
      theme: "2",
      president: "Shannon",
      description: "Enjoy the game, equipment and advice for camping in the beautiful plains of the world.",
      population: 847,
      token: {
        symbol: "LwTk",
        totalSupply: 1000000
      }
    }
  ];
  
  return (
    <div className="countries recommended">
      <h1 className="coming-soon">
        <FormattedMessage
          id="app.comingSoon"
        />
      </h1>
      {countries.map(country => 
        <CardColumn key={country.id}>
          <CountryCard
            country={country}
          />
        </CardColumn>
      )}
    </div>
  );
}
