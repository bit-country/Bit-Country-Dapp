/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-parens */

import React, { useState, useEffect } from "react";
import { Col, Form, Input, Upload, Button, Checkbox, Spin, Icon, Modal, Select, InputNumber } from "antd";
import { injectIntl } from "react-intl";
import { fetchAPI, fetchManual } from "../../utils/FetchUtil";
import Notification from "../../utils/Notification";
import ENDPOINTS, { BASE_URL } from "../../config/endpoints";
import { AuthConnect } from "../../components/HOC/Auth/AuthContext";
import TxButton from "../../components/HOC/DApp/TxButton";
import { useSubstrate } from "../../components/HOC/DApp/useSubstrate";
import "./Create.styles.css";
import Logging from "../../utils/Logging";
import { FormattedMessage } from "react-intl";
import TransactionUtil from "../../components/HOC/DApp/Transaction";

const { TextArea } = Input;
const { Option } = Select;

const fakeData = {
  assets: [
    {
      asset: {
        symbol: "👑",
        name: "Monarch Title",
      },
      balance: 1
    },
    {
      asset: {
        symbol: "📜",
        name: "Libreland Decree",
      },
      balance: 1
    },
    {
      asset: {
        symbol: "🚀",
        name: "Far-traveller",
      },
      balance: 1
    }
  ]
};

function Create({ user, intl, form }) {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [substrate, setSubstrate] = useState(null);
  const { api, keyring, account } = useSubstrate();
  const [status, setStatus] = useState(null);
  const [blockHash, setBlockHash] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [assetType, setAssetType] = useState(null);
  const [abi, setAbi] = useState(null);

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };

  useEffect(() => {
    (async function () {
      const response = await fetchAPI(
        `${ENDPOINTS.GET_USER_DIGITAL_ASSETS}?userId=${user.id}`
      );

      if (!response?.isSuccess) {
        Notification.displayErrorMessage(intl.formatMessage({ id: "wallet.assets.fetch.error" }));
      }

      setAssets(response.assets.length > 0 ? response.assets : fakeData.assets);
      setSubstrate({ api, keyring });
      setIsLoading(false);
    })();
  }, []);

  const handleBeforeUpload = async file => {
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
    return false;
  };

  const onFinish = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        Logging.Log("Received values of form: ", values);
      }
    });
  };

  const onCheckBoxChange = e => {
    Logging.Log(`checked = ${e.target.checked}`);
  };

  const handleAssetType = e => {
    setAssetType(e);
  };

  useEffect(() => {
    if (api && account != "") {

      let unsubscribe;

      api.query.assetModule.assetsForAccount(account, (userAsset) => {
        const jsonUserAsset = userAsset.toJSON();


        if (jsonUserAsset) {

          jsonUserAsset.map(uAsset => {
            return getNftInfo(0);
          });
        }

      }).then((unsub) => {
        unsubscribe = unsub;
      });

      return () => unsubscribe && unsubscribe();
    }
  }, [account]);

  const getNftInfo = (assetId) => {

    let unsubscribe;

    api.query.assetModule.assets(2, (nftInfo) => {

      Logging.Log("raw obj", nftInfo);
      Logging.Log("nftInfo", nftInfo.unwrapOrDefault());
      Logging.Log("owner", nftInfo.unwrapOrDefault().owner.toJSON());
      Logging.Log("assetData", nftInfo.unwrapOrDefault().data.toJSON());

    }).then((unsub) => {

      unsubscribe = unsub;

    });
  };

  // const normFile = (e) => {
  //   console.log("Upload event:", e);

  //   if (Array.isArray(e)) {
  //     return e;
  //   }

  //   return e && e.fileList;
  // };

  const { getFieldDecorator } = form;

  const createAssetOnDb = async () => {
    setIsButtonLoading(true);
    form.validateFields(async (err, values) => {
      if (!err) {

        let asset = {
          name: values.name,
          description: values.description,
          accountId: account,
          assetType: values.assetType,
          rentalPrice: values.rentalPrice,
          abi: abi,
          contractAddress: values.contractAddress
        };

        try {

          const response = await fetchAPI(
            ENDPOINTS.CREATE_ASSET,
            "POST",
            asset
          );

          if (!response?.isSuccess) {
            throw Error("Error while updating profile");
          }

          if (image) {
            let formData = new FormData();

            formData.append("assetImage", image, image.name);

            const imageResponse = await fetchManual(
              ENDPOINTS.UPDATE_ASSET_IMAGE + `?assetId=${response.asset.id}`,
              "POST",
              formData
            );

            if (!imageResponse?.isSuccess) {
              throw Error("Error while updating asset image");
            }

            const accountPair = substrate.keyring.getPair(account);

            TransactionUtil.Transaction({
              accountPair: accountPair,
              type: "SIGNED-TX",
              setStatus: setStatus,
              attrs: {
                palletRpc: "nftModule",
                callable: "mint",
                inputParams: [values.name, values.description, imageResponse.imageUrl],
                paramFields: [true, true, true]
              },
              api: api,
              setLoading: setIsLoading
            }).then(async hash => {

              //Update blockhash from asset
              const blockHashResponse = await fetchAPI(
                ENDPOINTS.UPDATE_ASSET_HASH + `?assetId=${response.asset.id}&blockHash=${hash}`,
                "POST",
                asset
              );

              if (blockHashResponse.isSuccess) {
                Notification.displaySuccessMessage(
                  <FormattedMessage
                    id="user.profile.notification.save.success"
                  />
                );
              }
              else {
                Notification.displayErrorMessage(
                  <FormattedMessage
                    id="user.profile.notification.save.success"
                  />
                );
              }
              setIsButtonLoading(false);
            });

          }



        } catch (error) {
          Logging.Error(error);

          Notification.displayErrorMessage(
            <FormattedMessage
              id="user.profile.notification.save.failure"
            />
          );
        }

        return values;
      }
    });
  };

  return (
    <Col
      push={4}
      span={16}
      className="assets"
    >
      <h1 className="header">
        Create your own NFT asset
      </h1>
      <div>
        <Form
          name="validate_other"
          {...formItemLayout}
          onSubmit={onFinish}
        >
          <Form.Item label="Name">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Asset name is required" }],
            })(
              <Input
                placeholder="Asset Name"
              />,
            )}
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            {getFieldDecorator("description", {
              rules: [],
            })(
              <TextArea placeholder="Asset Description" />
            )}
          </Form.Item>
          <Form.Item
            name="assetType"
            label="Asset type"
          >
            {getFieldDecorator("assetType", {
              initialValue: 3,
              rules: [],
            })(
              <Select style={{ width: 250 }} onChange={handleAssetType}>
                <Option value={3}>Art</Option>
                <Option value={1}>Scene</Option>
                <Option value={4}>Rentable</Option>
                <Option value={2}>Wearable</Option>
                <Option value={5}>Smart Asset</Option>
              </Select>
            )}
          </Form.Item>
          {assetType == 4 ? (
            <Form.Item label="Initial Rental Price" name="rentalPrice">
              {getFieldDecorator("rentalPrice", {
                rules: [],
              })(
                <InputNumber
                  placeholder="Rental Price per Block (6 seconds)"
                  style={{ width: 250 }}
                />,
              )}
            </Form.Item>
          ) : null}
          <Form.Item label="3D Model or Image" name="image" valuePropName="image" noStyle>
            {getFieldDecorator("image", {
              rules: [{ required: true, message: "Asset presentation is required" }],
            })(
              <Upload.Dragger name="file" beforeUpload={handleBeforeUpload}>
                <p className="ant-upload-text">Click or drag model or image to this area to upload</p>
                <p className="ant-upload-hint">(350 x 350 Recommended)</p>
              </Upload.Dragger>
            )}
            {image ? (
              <img className="avatar" src={imageUrl} />
            ) : null}
          </Form.Item>
          {
            assetType == 5 ? (
              <>
                <Form.Item label="Contract Address" name="contractAddress">
                  {getFieldDecorator("contractAddress", {
                    rules: [],
                  })(
                    <Input
                      placeholder="Deployed Contract Address 5xxxxx…xxxxxx"
                    />,
                  )}
                </Form.Item>
                <Form.Item label="Contract ABI" name="abi" valuePropName="abi" noStyle>
                  {getFieldDecorator("abi", {
                    rules: [],
                  })(
                    <Upload.Dragger
                      name="abi"
                      action={BASE_URL + ENDPOINTS.UPLOAD_ABI}
                      onChange={(res) => {
                        const { status } = res.file;

                        if (status == "done") {

                          if (res.file.response.isSuccess) {
                            setAbi(res.file.response.abi);
                          }
                        }

                      }}>
                      <p className="ant-upload-text">Click to select or drag and drop a JSON ABI file</p>
                    </Upload.Dragger>
                  )}
                  {/* {image ? (
                    <img className="avatar" src={imageUrl} />
                  ) : null} */}
                </Form.Item>
              </>
            ) : null
          }
          <Form.Item
            name="isMultipleOwners"
            label="Ownership"
          >
            <Checkbox onChange={onCheckBoxChange}>Allow Joint Ownership</Checkbox>
          </Form.Item>

          <Form.Item
            name="isSupporters"
            label="Supporters"
          >
            <Checkbox onChange={onCheckBoxChange}>Allow Supporters</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            {substrate && account != "" && account && substrate.keyring ? (
              <Button type="primary" loading={isButtonLoading} onClick={createAssetOnDb}>Create Asset</Button>
            ) : null}
            <div style={{ overflowWrap: "break-word" }}>{status}</div>
          </Form.Item>
        </Form>
      </div>
      <Modal
        visible={isLoading}
        title={"Sending transaction"}
        footer={null}>
        <Spin indicator={<Icon type="loading" style={{ fontSize: 24, textAlign: "center" }} spin />} tip={status} />
      </Modal>
    </Col>
  );
}

export default AuthConnect(injectIntl(Form.create()(Create)));
