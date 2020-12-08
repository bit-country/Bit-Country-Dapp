import React from "react";
import { Input, List, Card, Modal, Tooltip, Icon } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import DataDrivenTable from "../../components/DataDrivenTable";
import Utils from "../../utils/Utils";
const { TextArea } = Input;

const themes = [
  {
    index: 1,
    theme: "Blocks",
    discription: "Connected blocks of the chain",
    src:
      Utils.getTheme("1"),
  },
  {
    index: 2,
    theme: "AI",
    discription: "AI core",
    src:
      Utils.getTheme("2"),
  },
  {
    index: 3,
    theme: "AI2",
    discription: "AI driven future",
    src:
      Utils.getTheme("3"),
  },
  {
    index: 4,
    theme: "Space",
    discription: "A new frontier, landscape and skyscape",
    src:
      Utils.getTheme("4"),
  },
  {
    index: 5,
    theme: "Space2",
    discription: "A new world, the future",
    src:
      Utils.getTheme("5"),
  },
  {
    index: 6,
    theme: "Hexagonal",
    discription: "Hexagons and a wavey mesh",
    src:
      Utils.getTheme("6"),
  },
  {
    index: 7,
    theme: "Spiral",
    discription: "A technical spiral with core",
    src:
      Utils.getTheme("7"),
  },
];

function CountrySection({ 
  uniqueNames, 
  handleCreate, 
  handleUpdateData, 
  loadingNames, 
  name, 
  description, 
  theme, 
  onInputChange, 
  onThemeChange, 
  intl }) {
  const data = themes;

  return (
    <>
      <div className="field">
        <label>Unique URL</label>
        <p className="label-explaination">
          You must set a Unique URL to allow users to find your country.
        </p>
        <DataDrivenTable
          dataSource={uniqueNames}
          containerClassName="unique-name"
          keyGenerator={item => item.name}
          render={item => {
            let classNames = ["item"];

            if (item.selected) {
              classNames.push("selected");
            }
          
            return (
              <div className={classNames.join(" ")}>
                {item.name}
              </div>
            );
          }}
          onItemClick={(e, item) => {
            const items = uniqueNames.map(x => {
              if (x.name == item.name) {
                return { ...x, selected: true };
              } else if (x.selected) {
                return { ...x, selected: false } ;
              }

              return x;
            });

            const content = intl.formatMessage({ id: "createCountry.uniqueName.confirm", defaultMessage: "Are you sure you want to use this name?" });

            Modal.confirm({ 
              content,
              onOk: () => {
                handleUpdateData(items);

                onInputChange({ target: { name: "countryUniqueId", value: item.id } });
              }
            });
          }}
          renderAddOne={() => (
            <div className="item add">
              <Icon type="plus" />
              &nbsp;
              <FormattedMessage 
                id="createCountry.uniqueName.createButton" 
                defaultMessage="Create" 
              />
            </div>
          )}
          onAddClick={handleCreate}
          loading={loadingNames}
        />
      </div>
      <div className="field">
        <label>Display Name</label>
        <p className="label-explaination">
          A friendly name for your bit country.
        </p>
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
        <label>Description</label>
        <p className="label-explaination">Introduce your bit country.</p>
        <TextArea
          placeholder="What is it about and why would people want
          to join your country?"
          rows="3"
          name="countryDescription"
          type="textarea"
          onChange={onInputChange}
          value={description}
        />
      </div>
      <div className="field">
        <label>Theme</label>
        <p className="label-explaination">
          <Tooltip
            title="This’ll change the display picture and later affect the 
                color scheme of elements while inside your bit country’s 
                timeline view."
          >
            Select from one of the existing themes for your country.
            <sup>
              <Icon type="question-circle-o" />
            </sup>
          </Tooltip>
        </p>
        <List
          dataSource={data}
          className="theme-container"
          bordered={false}
          renderItem={item => (
            <List.Item className="theme-item">
              <Card
                className={theme == item.index ? "selected" : ""}
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

export default injectIntl(CountrySection);
