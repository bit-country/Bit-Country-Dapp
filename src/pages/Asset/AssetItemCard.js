/* eslint-disable */
import React from "react";
import { Button, Col, Modal, Row } from 'antd';
// import "./Marketplace.styles.css";
import CountryBG from "../../assets/images/country_bg.png";
import BlockBG from "../../assets/images/block_bg.png";


const AssetItemCard = ({ item, setVisible, setCountryId, setSelectedItem, isSelected, category, isViewable, selectable }) => {

    if (!item) return null;
    const { name, description, id, totalBlocks, bankBalance, population, themeImage, countryUniqueName, totalResidents, totalPost, president } = item;
    const renderDetail = (value) => {
        const key = Object.keys(value)[0];
        if (value[key]) {
            return <Row><span style={{ textTransform: 'capitalize' }}>{key?.split(/(?=[A-Z])/).join(" ")}:</span> {value[key]}</Row>
        }
    }

    const getItemImage = (cat) => {
        switch (cat) {
            case "country":
                return CountryBG;
            case "block":
                return BlockBG;
            case "section":
                return BlockBG;
            case "asset":
                return item.url;
            default:
                break;
        }
    }

    return (

        <div className="CardBody" style={{ boxShadow: 'rgb(234, 234, 234) 0px 2px 12px, rgba(0, 0, 0, 0.22) 0px 10px 10px 0px', margin: 'auto', borderRadius: '5px', padding: '10px', maxWidth: '520px', height: '450px' }}>
            <div style={{ textAlign: 'center', padding: '0 0 20px' }}>
                <img className="thumbnail" style={{ width: "100%", objectFit: 'scale-down', borderRadius: '5px' }} src={getItemImage(category)} />
            </div>
            <div style={{
                padding: '2%',
                margin: '0',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }} >
                <h2 style={{ textTransform: 'capitalize' }}>{name}</h2>
                <span style={{ color: 'grey' }}>{description}</span>
            </div>
            <br />
            <div style={{ height: '85px' }}>
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
                    {selectable ? (
                        <Button style={{ width: '100%' }} onClick={() => {
                            Modal.confirm({
                                content: `Are you sure you want to select ${item.name}?`,
                                onOk: () => {
                                    window.parent.dispatchEvent(new CustomEvent("nftSelection", {
                                        detail: {
                                            nft: item
                                        }
                                    }));
        
                                    window.close();
                                }
                            })
                        }}>
                            Select
                        </Button>
                    ) : isViewable ? category == "country" ?
                        <Button style={{ width: '100%' }} onClick={() => {
                            setCountryId(countryUniqueName);
                            setVisible(true)
                        }}>View </Button>
                        : <Button type='primary' style={{ width: '100%' }} onClick={() => {
                            setSelectedItem(item, category);
                        }}>Sell</Button> : null}
                </Col>
                {/* <Col span={8}>
                    {isSelected ?
                        <Button type='danger' style={{ width: '100%' }} onClick={() => setSelectedItem(null)}>Cancel</Button>
                        :
                        <Button type='primary' style={{ width: '100%' }} onClick={() => setSelectedItem(item)}>Select</Button>}
                </Col> */}
            </Row>
            {/* <Link to={`/c/${name}`}>     </Link> */}

        </div>


    );
};

export default AssetItemCard;