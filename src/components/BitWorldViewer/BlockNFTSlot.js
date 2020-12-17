/* eslint-disable no-console */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import { SceneLoader, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { Modal } from "antd";
import endpoints from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import Logging from "../../utils/Logging";
import Notification from "../../utils/Notification";
import TransactionUtil from "../HOC/DApp/Transaction";
import { DimensionAppSetup } from "./Util";

const distance = 35;
const width = 6, length = 6, height = 5;

let slots = {};

export default async function BlockNFTSlot(noa, props, HUD) {
  const result = await SceneLoader.ImportMeshAsync("", `${window.location.origin}/dimension/NFTSlot.obj`, null, noa.rendering.getScene());

  const response = await fetchAPI(`${endpoints.GET_SLOTASSETS_BY_BLOCK}?countryId=${props.country.uniqueId}&blockId=${props.blockDetail.uniqueId}`);

  if (!response?.isSuccess) {
    throw Error("Error while loading NFT slot assets");
  }

  const assetsSorted = response.assets.sort(x => x.slotId);
  let mappedAssets = {};

  assetsSorted.forEach(x => {
    mappedAssets[x.slotId] = x;
  });

  let nftIndex = 0, nftSlots = [];

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let index in result.meshes) {
        let entityId;

        if (index != result.meshes.length - 1) {
          const meshInstance = result.meshes[index].createInstance("mesh");
          
          const position = new Vector3(distance - ((distance * 2) * i), 0, distance - ((distance * 2) * j));
          const axis1 = Vector3.Zero().subtract(position);
          const axis3 = Vector3.Cross(axis1, Vector3.Up());
          const rotation = Vector3.RotationFromAxis(axis1, Vector3.Up(), axis3);

          meshInstance.rotation = rotation;
          meshInstance.addRotation(0, 1.57, 0);

          entityId = noa.entities.add(
            [ distance - ((distance * 2) * i), 0, distance - ((distance * 2) * j) ], 
            1, 
            1, 
            meshInstance, 
            null, 
            false, 
            false
          );
        } else {
          const slotMesh = result.meshes[index].clone("mesh");

          const position = new Vector3(distance - ((distance * 2) * i), 0, distance - ((distance * 2) * j));
          const axis1 = Vector3.Zero().subtract(position);
          const axis3 = Vector3.Cross(axis1, Vector3.Up());
          const rotation = Vector3.RotationFromAxis(axis1, Vector3.Up(), axis3);

          slotMesh.rotation = rotation;
          slotMesh.addRotation(0, 1.57, 0);

          slotMesh.material = new StandardMaterial("mesh", noa.rendering.getScene());
          slotMesh.material.diffuseTexture = mappedAssets[nftIndex] ? new Texture(mappedAssets[nftIndex].url, noa.rendering.getScene()) : null;

          entityId = noa.entities.add(
            [ distance - ((distance * 2) * i), 0, distance - ((distance * 2) * j) ], 
            1, 
            1, 
            slotMesh, 
            null, 
            false, 
            false
          );

          nftSlots.push({ position, slotId: nftIndex });
          slots[nftIndex++] = slotMesh;
        }
      
        if (index == 0) {
          const slotId = nftIndex + 1;

          if (!mappedAssets[nftIndex]) {
            noa.entities.addComponent(entityId, "triggerVolume", {
              callback: DimensionAppSetup(props, { smartAsset: { attributes: `slot-id="${slotId}"`, bundleURL: "/dimension/NFTSlot.bundle.js" } }, "slot-app", (onClose, event) => {
                if (event.detail.appType == "selectNFTAndSign") {
                  const opened = window.open(`${window.location.origin}/asset/list?select=1`, "_blank");
  
                  opened.addEventListener("nftSelection", async selectedNFT => {
                    // Read event for params
                    // TODO: Use actual pallet
                    const result = await TransactionUtil.Transaction({
                      accountPair: props.substrate.keyring.getPairs()[8],
                      setStatus: value => Logging.Log(value),
                      type: "SIGNED-TX",
                      setLoading: value => Logging.Log(`Loading: ${value}`),
                      attrs: {
                        palletRpc: "balances",
                        callable: "transfer",
                        inputParams: [ props.substrate.keyring.getPairs()[0].address, 100 ],
                        paramFields: [ true, true ]
                      },
                      api: props.substrate.api
                    });

                    if (result == false) {
                      Notification.displayErrorMessage("Failed to transfer");

                      return;
                    }

                    const response = await fetchAPI(
                      `${endpoints.PLACE_ASSET_IN_SLOT}?countryId=${props.country.uniqueId}&blockId=${props.blockDetail.uniqueId}`, 
                      "POST", 
                      { 
                        blockId: props.blockDetail.uniqueId, 
                        slotId: event.detail.appParams.args.slotId - 1, 
                        AssetId: selectedNFT.detail.nft.id, 
                        TransactionId: result, // TODO: Remember to update so we only run on finalised block,
                        Start: 0, // TODO: Get block number
                        End: event.detail.appParams.args.blockNumber
                      });

                    if (!response?.isSuccess) {
                      throw Error("Error while placing NFT");
                    }

                    Notification.displaySuccessMessage("Asset has been placed");

                    slots[event.detail.appParams.args.slotId - 1].material.diffuseTexture = new Texture(response.placedAsset.url, noa.rendering.getScene());

                    onClose(); 

                    noa.entities.removeComponent(entityId, "triggerVolume", true);
                  });
                }
              }), 
              trigger: {
                width,
                length,
                height,
                text: "Rent this spot?",
                y: height / 2
            } });
          } else {
            noa.entities.addComponent(entityId, "triggerVolume", {
              callback: async () => {
                const response = await fetchAPI(`${endpoints.MARKETPLACE_GET_LISTING_BY_ASSET}?assetId=${mappedAssets[slotId - 1].assetId}`);

                if (!response?.isSuccess) {
                  throw Error("Error while retrieving listing for asset");
                }

                if (response.listing && !response.listing.isExpired) {
                  document.exitPointerLock();

                  Modal.confirm({ 
                    content: `Check out listing for ${response.listing.title}?`, 
                    onOk: () => {
                      window.setTimeout(() => window.open(`${window.location.origin}/marketplace/item/${response.listing.id}`, "_blank"), 100);
                    }
                  });
                } else {
                  HUD.showTimedMessage({ text: "No listing found or expired", duration: 1000, fontColour: "orange", fontWeight: 500 });
                }                
              }, 
              trigger: {
                width,
                length,
                height,
                text: "Find listing on marketplace?",
                y: height / 2
            } });
          }
        }
      }
    }
  }

  return nftSlots;
}