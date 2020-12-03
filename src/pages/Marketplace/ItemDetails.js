/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Icon, Col, Button, Layout, Row, Divider, Breadcrumb, Collapse, Affix, InputNumber, Modal, Spin } from 'antd';
import "./Marketplace.styles.css";
import DefaultImage from "../../assets/images/country.jpg";
import CurrencyIcon from "../../assets/digital-asset-icon/BC-icon-circle.png";
import Ownership from "./Ownership";
import Supporter from "./Supporter";
import Insights from "./Insights";
import endpoints from "../../config/endpoints";
import Notification from "../../utils/Notification";
import { fetchAPI } from "../../utils/FetchUtil";
import moment from 'moment';
import countdown from 'countdown';
import { useSubstrate } from "../../components/HOC/DApp/useSubstrate";
import TransactionUtil from "../../components/HOC/DApp/Transaction";
import { useMyAccount, useMyAddress, readMyAddress } from "../../components/HOC/DApp/SubstrateAccountProvider";


const { Panel } = Collapse;

const ItemDetails = ({ itemId }) => {
    const [item, setItem] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [bidPrice, setBidPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { api, keyring, account, apiState } = useSubstrate();
    const savedAddress = readMyAddress();
    const [status, setStatus] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingType, setProcessingType] = useState("bid");
    const [supporter, setSupporter] = useState([]);


    useEffect(() => {
        if (itemId) {
            fetchAPI(`${endpoints.MARKETPLACE_GETITEM}/${itemId}`)
                .then((res) => {
                    if (res?.isSuccess) {
                        setItem(res.item);

                        setBidPrice(res.item.price + 1);
                        let currentDateTime = moment.utc();
                        let currentDateTimeStamp = moment.utc().unix();
                        let expiryDateTimeStamp = moment().add(res.item.remainingSecond, 'seconds').unix();
                        let diffTime = expiryDateTimeStamp - currentDateTimeStamp;
                        let duration = moment.duration(diffTime * 1000, 'milliseconds');
                        const interval = 1000;
                        setInterval(() => {
                            duration = moment.duration(duration - interval, 'milliseconds');

                            setTimeLeft(`${duration.days()} ${duration.days() > 1 ? "days" : "day"} ${duration.hours()} ${duration.hours() > 1 ? "hours" : "hour"} ${duration.minutes()} ${duration.minutes() > 1 ? "minutes" : "minute"} ${duration.seconds()} ${duration.seconds() > 1 ? "seconds" : "second"}`);
                        }, interval);
                    }
                    else
                        Notification.displayErrorMessage("Something went wrong, please try again later.");
                })
        }
    }, []);

    const fetchItemDetail = (itemId) => {
        fetchAPI(`${endpoints.MARKETPLACE_GETITEM}/${itemId}`)
            .then((res) => {
                if (res?.isSuccess) {
                    setItem(res.item);

                    setBidPrice(res.item.price + 1);
                    let currentDateTime = moment.utc();
                    let currentDateTimeStamp = moment.utc().unix();
                    let expiryDateTimeStamp = moment().add(res.item.remainingSecond, 'seconds').unix();
                    let diffTime = expiryDateTimeStamp - currentDateTimeStamp;
                    let duration = moment.duration(diffTime * 1000, 'milliseconds');
                    const interval = 1000;
                    console.log("duration", duration);
                    setInterval(() => {
                        duration = moment.duration(duration - interval, 'milliseconds');

                        setTimeLeft(`${duration.days()} ${duration.days() > 1 ? "days" : "day"} ${duration.hours()} ${duration.hours() > 1 ? "hours" : "hour"} ${duration.minutes()} ${duration.minutes() > 1 ? "minutes" : "minute"} ${duration.seconds()} ${duration.seconds() > 1 ? "seconds" : "second"}`);
                    }, interval);
                }
                else
                    Notification.displayErrorMessage("Something went wrong, please try again later.");
            })
    }

    const onBidPriceChange = (e) => {
        // if (item.price < e.target.value) {
        setBidPrice(e);
        // }
    };

    const bidAuction = () => {
        //Get assetId from blockhash
        setStatus("Signing transaction...");
        setIsLoading(true);
        setProcessingType("bid");
        if (apiState == "READY") {
            const accountPair = keyring.getPair(savedAddress);
            TransactionUtil.Transaction({
                accountPair: accountPair,
                type: "SIGNED-TX",
                setStatus: setStatus,
                attrs: {
                    palletRpc: "auction",
                    callable: "bid",
                    inputParams: [0, bidPrice],
                    paramFields: [true, true]
                },
                api: api,
                setLoading: setIsProcessing
            }).then(async hash => {
                //TODO Save Hash

                fetchAPI(`${endpoints.MARKETPLACE_BID}/?auctionId=${item.id}&bid=${bidPrice}`, "POST").then(res => {
                    if (res.isSuccess) {
                        fetchItemDetail(itemId);
                        setIsLoading(false);
                        setIsProcessing(false);
                        Notification.displaySuccessMessage("You have bidded for this item successful.");
                    }
                    else {
                        setIsLoading(false);
                        setIsProcessing(false);
                        Notification.displayErrorMessage("Something went wrong while bidding, please make sure you have enough balance for bidding");
                    }
                });
            });
        }

    };

    const signSupportOnChain = () => {
        setProcessingType("support");
        setStatus("Signing transaction...");

        if (apiState == "READY") {
            const accountPair = keyring.getPair(savedAddress);
            TransactionUtil.Transaction({
                accountPair: accountPair,
                type: "SIGNED-TX",
                setStatus: setStatus,
                attrs: {
                    palletRpc: "nftModule",
                    callable: "sign",
                    inputParams: [0],
                    paramFields: [true]
                },
                api: api,
                setLoading: setIsProcessing
            }).then(async hash => {
                //TODO Save Hash
                Notification.displaySuccessMessage("You have signed to support this asset successful.");
                setIsLoading(false);
                setIsProcessing(false);

                let newSupporters = supporter;
                newSupporters.push({
                    key: '1',
                    address: savedAddress,
                    identity: accountPair.meta.name,
                    balance: 1000,
                });

                setSupporter(newSupporters);
            });
        }
    }

    const renderBody = () => {
        const { views, title, description, itemImage, price, createdOn, owner, ownership, insights, remainingSecond, isExpired } = item;

        return (
            <>
                <Row>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <a href="/marketplace/browse">Marketplace</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <a href="">{item.title}</a>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Row>
                <div style={{ borderRadius: '10px', padding: '10px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <img style={{ width: "200px", objectFit: 'scale-down', borderRadius: "5px" }} src={itemImage ?? DefaultImage} />
                    </div>

                    <div style={{ textAlign: 'end' }}>

                        <span style={{ padding: '5px' }}><Icon type='eye' theme='filled' />&nbsp;{views}</span>
                    </div>

                </div>
                <Divider />

                <Row >
                    <Row>
                        <Col span={12}>
                            <h1 style={{ fontSize: '2em', fontWeight: '600' }}>{title}</h1>
                        </Col>
                        <Col span={12}>
                            <h2 style={{ float: 'right', fontSize: '1.1em' }}>Owner: {owner ?? 'Unknown User'}</h2>
                        </Col>
                    </Row>
                    <Row gutter={[24, 24]}>
                        <Col span={12}>
                            <Row gutter={[24, 24]}>
                                <Col span={8} >
                                    <h2 style={{ display: 'block', fontSize: '0.9em', color: 'grey' }}>PRICE</h2>
                                    <Row>
                                        <img style={{ width: '22px', top: '24%', position: 'absolute' }} src={CurrencyIcon} />

                                        <span style={{ fontSize: '1.8em', padding: '4px', paddingLeft: '28px', fontWeight: '600' }}>{price}</span>
                                    </Row>
                                </Col>
                                <Col span={8} >
                                    <h2 style={{ display: 'block', fontSize: '0.9em', color: 'grey' }}>POSTED ON</h2>
                                    <span style={{ fontSize: '1.2em', color: 'black' }}>{moment(createdOn).format('DD MMM YYYY')}</span>
                                </Col>
                                {isExpired ?
                                    (
                                        <Col span={8} >
                                            <h2 style={{ display: 'block', fontSize: '0.9em', color: 'grey', textTransform: 'capitalize' }}>THIS AUCTION IS EXPIRED</h2>
                                        </Col>
                                    ) :
                                    (
                                        <Col span={8} >
                                            <h2 style={{ display: 'block', fontSize: '0.9em', color: 'grey', textTransform: 'capitalize' }}>AUCTION EXPIRES IN</h2>
                                            <span style={{ fontSize: '1.2em', color: 'black' }}>{timeLeft}</span>
                                        </Col>
                                    )}
                            </Row>
                            <Divider />

                            <Row>
                                <h2 style={{ display: 'block', fontSize: '0.9em', color: 'grey' }}>DESCRIPTION</h2>
                                <p style={{ fontSize: '1.2em', color: 'black' }}>{description}</p>
                            </Row>
                            <Row>
                                <h2 style={{ display: 'block', fontSize: '0.9em', color: 'grey' }}>CURRENT PRICE</h2>
                                <p style={{ fontSize: '1.2em', color: 'black', fontWeight: 800 }}>{price}
                                    <img style={{ width: '22px', marginLeft: "0.3em", position: 'absolute' }} src={CurrencyIcon} />
                                </p>
                            </Row>
                            {!isExpired ? (
                                <Row>
                                    <h2 style={{ display: 'block', fontSize: '0.9em', color: 'grey' }}>BID PRICE</h2>
                                    <div>
                                        <InputNumber defaultValue={price + 1} min={price} onChange={onBidPriceChange} /> &nbsp; &nbsp;<strong>BCG</strong>
                                    </div>
                                    <div className="button-groups">
                                        <Button style={{ height: '38px' }} type='primary' loading={isLoading} onClick={bidAuction}>Bid</Button>
                                        <a href="/marketplace" className="ant-btn ant-btn-link" style={{ height: '38px' }}>Go Back</a>
                                    </div>

                                &nbsp;
                                </Row>
                            ) : (
                                    <div className="button-groups">
                                        <a href="/marketplace" className="ant-btn ant-btn-link" style={{ height: '38px' }}>Go Back</a>
                                    </div>
                                )}
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Collapse
                                    bordered={false}
                                    defaultActiveKey={['1']}
                                >
                                    <Panel header={<h2 style={{ fontSize: '0.9em', color: 'grey' }}>NFT SUPPORTERS</h2>
                                    } key="1" >
                                        <Supporter supporters={supporter} signSupport={signSupportOnChain} />
                                    </Panel>
                                    <Panel header={<h2 style={{ fontSize: '0.9em', color: 'grey' }}>OWNERSHIP</h2>
                                    } key="2" >
                                        <Ownership ownership={ownership} />
                                    </Panel>
                                    <Panel header={<h2 style={{ fontSize: '0.9em', color: 'grey' }}>INSIGHTS</h2>
                                    } key="3" className="site-collapse-custom-panel">
                                        <Insights insights={insights} />
                                    </Panel>

                                </Collapse>
                            </Row>

                        </Col>
                    </Row>
                </Row >
                <Modal
                    visible={isProcessing}
                    title={processingType == "bid" ? "Bidding auction" : "Signing to support NFT"}
                    footer={null}>
                    <Spin indicator={<Icon type="loading" style={{ fontSize: 24, textAlign: "center" }} spin />} tip={status} />
                </Modal>
            </>
        )
    }
    return (
        <Layout.Content>
            {item ? renderBody() : null}
        </Layout.Content >
    );
};

export default ItemDetails;
