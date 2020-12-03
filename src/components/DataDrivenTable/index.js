import { Spin } from "antd";
import * as React from "react";

export default function DataDrivenTable(props) {
  const { 
    loading,
    containerClassName,
    dataSource,
    keyGenerator,
    render,
    onItemClick,
    renderAddOne,
    onAddClick,
  } = props;

  const [ items, setItems ] = React.useState([]);

  React.useMemo(() => {
    const rendered = dataSource?.map(item => 
      React.cloneElement(
        render(item), 
        { 
          onClick: e => onItemClick(e, item), 
          key: keyGenerator(item) 
        }
      ));

    rendered.push(
      React.cloneElement(
        renderAddOne(), 
        { 
          onClick: e => onAddClick(e), 
          key: "add-one" 
        }
      ));

    setItems(rendered);
  }, [ dataSource ]);

  if (loading) {
    return (
      <Spin size="large" />
    );
  }

  return (
    <div className={containerClassName}>
      {items}
    </div>
  );
}