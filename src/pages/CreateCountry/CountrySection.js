import React from "react";
import { Input, List, Card, Modal, Tooltip, Icon } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import DataDrivenTable from "../../components/DataDrivenTable";
const { TextArea } = Input;

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
  const data = dummyData;

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
                return { ...x, selected: false} ;
              } else {
                return x;
              }
            });

            const content = intl.formatMessage({ id: "createCountry.uniqueName.confirm", defaultMessage: "Are you sure you want to use this name?" });

            Modal.confirm({ 
              content,
              onOk: () => {
                handleUpdateData(items);

                onInputChange({ target: { name: "countryUniqueId", value: item.id }});
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
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 6,
            xxl: 6,
          }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
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
