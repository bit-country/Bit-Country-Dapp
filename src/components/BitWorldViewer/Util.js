/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Color3, StandardMaterial, Texture } from "@babylonjs/core";
import { Modal } from "antd";
import { truncate } from "lodash";
import Notification from "../../utils/Notification";
import TransactionUtil from "../HOC/DApp/Transaction";
import luckydrawABI from "../../contracts/luckydraw-metadata.json";
import { Abi } from "@polkadot/api-contract";
import Logging from "../../utils/Logging";

export function MaterialBuilder (name, texture, colour, scene) {
  const material = new StandardMaterial("Buildable", scene);

  material.diffuseTexture = new Texture(texture, scene, false, false, Texture.TRILINEAR_SAMPLINGMODE);
  material.specularColor = new Color3(0, 0, 0);

  return material;
}

export function DimensionAppSetup(props, asset, appName, eventListener, onClose) {
  return () => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  
    props.setDimensionAppVisible(!props.dimensionAppVisible);
  
    const listener = event => {
      const element = document.getElementById("smartasset-iframe");

      eventListener(handleClose, event, element);
    };

    function handleClose() {
      if (onClose) {
        onClose();
      }

      const oldElement = document.getElementById("smartasset-iframe");
  
      if (oldElement) {
        document.getElementById("smartasset-app-root").removeChild(oldElement);
      }
  
      props.setDimensionAppVisible(false);
  
      window.removeEventListener(appName, listener);
    }
  
    props.setDimensionAppOnClose(handleClose);
  
    if (!props.dimensionAppVisible) {
      const newScriptElement = document.createElement("iframe");
  
      newScriptElement.id = "smartasset-iframe";
      newScriptElement.frameBorder = false;
      newScriptElement.style.cssText =
        "width: 100%; height:inherit; padding: 1%;";
      newScriptElement.srcdoc = `<div id="smartasset-app" style="overflow-x:hidden" app-id="${appName}" ${asset.smartAsset.attributes ?? ""}><script src="${asset.smartAsset.bundleURL}"></script></div>`;
  
      window.addEventListener(appName, listener);
  
      document.getElementById("smartasset-app-root").appendChild(newScriptElement);
    } else {
      handleClose();
    }
  };
}

export function SetupSmartAsset(noa, props, asset, entityId) {
  if (asset.smartAsset && entityId) {
    noa.entities.addComponent(entityId, "triggerVolume", {
      callback: DimensionAppSetup(props, asset, "app-01", (onClose, event, appFrame) => {
        switch (event.detail.appType) {
          case "airdrop":
            Modal.confirm({ 
              content: `Are you sure you want to dispense ${event.detail.appParams.value}?`, 
              onOk: async () => { 
                // Read event for params
                // TODO: Use actual pallet
                try {
                  appFrame.contentWindow.dispatchEvent(new CustomEvent("txPending"));

                  const result = await TransactionUtil.Transaction({
                    accountPair: props.substrate.keyring.getPairs()[8],
                    setStatus: value => console.log(value),
                    type: "SIGNED-TX",
                    setLoading: value => console.log(`Loading: ${value}`),
                    attrs: {
                      palletRpc: "balances",
                      callable: "transfer",
                      inputParams: [ props.substrate.keyring.getPairs()[0].address, 100 ],
                      paramFields: [ true, true ]
                    },
                    api: props.substrate.api
                  });

                  // TODO Setup synced airdrop.
                  appFrame.contentWindow.dispatchEvent(new CustomEvent("AirdropConfirmed"));
      
                  props.startAirdrop(event.detail.appParams.value); 
      
                  onClose(); 
                } catch (error) {
                  Logging.Error(error);

                  Notification.displayErrorMessage("Failed to transfer");

                  appFrame.contentWindow.dispatchEvent(new CustomEvent("txFailedOrCancelled"));
                }
              } 
            });
    
            break;
          
          case "luckydraw":
            Modal.confirm({ 
              content: `Enter into the luck draw for ${event.detail.appParams.value}?`, 
              onOk: async () => { 
                // Read event for params
                // TODO: Use actual pallet
                try {
                  appFrame.contentWindow.dispatchEvent(new CustomEvent("txPending"));

                  const result = await TransactionUtil.ExecuteContract({
                    accountPair: props.substrate.keyring.getPairs()[8],
                    setStatus: value => Logging.Log(value),
                    type: "SIGNED-TX",
                    setLoading: value => Logging.Log(`Loading: ${value}`),
                    attrs: {
                      contractRpc: "",
                      callable: "openLuckyDraw",
                      inputParams: [ "openLuckyDraw", 10000000, 200000000000, event.detail.appParams.value ],
                      paramFields: [ true, true, true, true ]
                    },
                    api: props.substrate.api,
                    abi: new Abi(luckydrawABI),
                    address: "3oJLhiwtkokPV2PVBiSwbfEHwCeEszUP2oeUh1VXoaXEiXpY"
                  });

                  const luckyDrawResult = await TransactionUtil.GetEventDetail(props.substrate.api, result, "ContractExecution", null, new Abi(luckydrawABI));

                  appFrame.contentWindow.dispatchEvent(new CustomEvent("LuckyDraw", { detail: { [luckyDrawResult[0].type]: true, LuckyNumber: luckyDrawResult[0].value[1].toString() } }));
                } catch (error) {
                  Logging.Error(error);
                  
                  Notification.displayErrorMessage("Error during transfer");

                  appFrame.contentWindow.dispatchEvent(new CustomEvent("txFailedOrCancelled"));
                }
              } 
            });
    
            break;
        }
      }),
      trigger: {
        x: asset.smartAsset.offset.x,
        y: asset.smartAsset.offset.y,
        z: asset.smartAsset.offset.z,
        width: asset.smartAsset.scale.x,
        height: asset.smartAsset.scale.y,
        length: asset.smartAsset.scale.z,
        text: asset.smartAsset.activationText,
      },
    });
  }
}