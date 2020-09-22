import React from "react";
import { Input, List, Card } from "antd";
const { TextArea } = Input;

const dummyData = [
  {
    index: 1,
    theme: "Forest",
    discription: "Some description about this theme",
    src:
      "https://cdn.dribbble.com/users/329207/screenshots/4232597/2001_bemocs_sp_lunar_woods_dribbble_1x.jpg"
  },
  {
    index: 2,
    theme: "Mountain",
    discription: "Some description about this theme",
    src:
      "https://cdn.dribbble.com/users/329207/screenshots/3364859/bemocs_rei_end_of_season_dribbble_1x.jpg"
  },
  {
    index: 3,
    theme: "Snow Mountain",
    discription: "Some description about this theme",
    src:
      "https://cdn.dribbble.com/users/329207/screenshots/3222707/bemocs_rei_january_clearance_dribbble_1x.jpg"
  },
  {
    index: 4,
    theme: "Space",
    discription: "Some description about this theme",
    src:
      "https://cdn.dribbble.com/users/329207/screenshots/1805103/bemocs_space_dribbble_1x.jpg"
  },
  {
    index: 5,
    theme: "Ocean",
    discription: "Some description about this theme",
    src:
      "https://cdn.dribbble.com/users/329207/screenshots/1928498/bemocs_nhm_seamobile_dribbble_1x.jpg"
  },
  {
    index: 6,
    theme: "Jungle Kingdom",
    discription: "Some description about this theme",
    src:
      "https://cdn.dribbble.com/users/5031/screenshots/3232835/owl-mikael-gustafsson-dribbble.gif"
  }
];

export default function CountrySection({ uniqueId, name, description, theme, onInputChange, onThemeChange }) {
  const data = dummyData;

  return (
    <>
      <div className="field">
        <label>Country unique identifier</label>
        <p className="label-explaination">
          This unique name use to distingush your country
        </p>
        <Input
          placeholder="e.g liberworld"
          name="countryUniqueId"
          onChange={onInputChange}
          value={uniqueId}
          type="text"
          size="large"
        />
      </div>
      <div className="field">
        <label>Country display name</label>
        <p className="label-explaination">This country display name</p>
        <Input
          placeholder="e.g Liberland"
          type="text"
          name="countryName"
          onChange={onInputChange}
          value={name}
          size="large"
        />
      </div>
      <div className="field">
        <label>Country description</label>
        <p className="label-explaination">
          Write some words about your country and attract new residents
        </p>
        <TextArea
          placeholder="Country description"
          rows="3"
          name="countryDescription"
          type="textarea"
          onChange={onInputChange}
          value={description}
        />
      </div>
      <div className="field">
        <label>Choose your theme</label>
        <p className="label-explaination">
          Add the favour to your country
        </p>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 6,
            xxl: 6
          }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card
                className={
                  theme == item.index ? "selected" : ""
                }
                cover={<img src={item.src} />}
                hoverable
                onClick={() => onThemeChange(item.index)}
              >
                <h4>{item.theme}</h4>
                <div className="description">{item.discription}</div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </>
  );
}