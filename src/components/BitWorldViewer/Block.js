/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import {
  Color3,
  MeshBuilder,
  SceneLoader,
  ShaderMaterial,
  StandardMaterial,
  Texture,
  Vector3,
  VideoTexture,
} from "@babylonjs/core";
import * as LOADERS from "@babylonjs/loaders";
import { Modal } from "antd";
import assetTypes from "../../config/assetTypes";
import endpoints from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import BlockNFTSlot from "./BlockNFTSlot";
import { SetupBlockTheme } from "./Theme";
import { SetupSmartAsset } from "./Util";

export const blockX = 50,
  blockY = 50;

function heightGen(x, y, z) {
  if (y <= 0) return true;

  if (x > -10 && x < 10 && z > -10 && z < 10) {
    const diff = Math.min(10 - Math.abs(x), 10 - Math.abs(z), 3);

    if (y <= diff) return true;
  }

  return false;
}

export async function BlockLoader(noa, props, HUD) {
  // Setup Theme
  const blockIds = await SetupBlockTheme(noa, props);

  // Prepare sections
  const response = await fetchAPI(
    `${endpoints.GET_SECTIONS_BY_BLOCK}?countryId=${props.country.uniqueId}&blockId=${props.blockDetail.uniqueId}`
  );

  if (!response?.isSuccess) {
    throw Error("Error while retrieving the sections");
  }

  const sections = response.sections;

  // Chunk handling
  const { buildableId, defaultId, restrictedId } = blockIds;

  // Setup Chunk and Voxel related handlers.
  const ChunkVoxelLoader = (x, y, z) => {
    // Show buildable section
    for (let section of sections) {
      if (
        x <= section.end.x &&
        x >= section.start.x &&
        z >= section.start.y &&
        z <= section.end.y &&
        y <= 0
      ) {
        return buildableId;
      }
    }

    if (heightGen(x, y, z)) return defaultId;

    return 0; // signifying empty space
  };

  const ChunkVoxelBarrier = (x, y, z, next) => {
    if (y < -24) return restrictedId;
    else if (y > 14) return 0;

    if (Math.abs(x) >= blockX || Math.abs(z) >= blockY) return restrictedId;

    return next(x, y, z);
  };

  // register for world events
  noa.world.on("worldDataNeeded", function (id, data, x, y, z) {
    if (y <= -50 || y >= 50) {
      noa.world.setChunkData(id, data);

      return;
    }

    (async () => {
      for (var i = 0; i < data.shape[0]; i++) {
        for (var j = 0; j < data.shape[1]; j++) {
          for (var k = 0; k < data.shape[2]; k++) {
            var voxelID = ChunkVoxelBarrier(
              x + i,
              y + j,
              z + k,
              ChunkVoxelLoader
            );

            data.set(i, j, k, voxelID);
          }
        }
      }

      noa.world.setChunkData(id, data);
    })();
  });

  // Load in assets and related handlers
  await AssetLoader(noa, props);

  // Compile shader for trigger volumes
  var shaderMaterial = new ShaderMaterial(
    "shader",
    noa.rendering.getScene(),
    {
      vertex: "custom",
      fragment: "custom",
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: [
        "world",
        "worldView",
        "worldViewProjection",
        "view",
        "projection",
      ],
    }
  );

  shaderMaterial.setFloat("time", 0);
  shaderMaterial.setVector3("cameraPosition", Vector3.Zero());
  shaderMaterial.backFaceCulling = false;
  shaderMaterial.alpha = 0.8;
  
  // Prepare welcome media
  let advertisement = MeshBuilder.CreatePlane(
    "plane",
    { width: 20, height: 10 },
    noa.rendering.getScene()
  );
  
  const advertisementClone = advertisement.clone("mesh2");

  advertisement.material = new StandardMaterial("planeMat", noa.rendering.getScene());
  advertisement.material.diffuseTexture = new VideoTexture("video", `${window.location.origin}/dimension/Kiosk.mp4`, noa.rendering.getScene());
  advertisement.material.alpha = 0.8;

  advertisementClone.material = new StandardMaterial("planeMat2", noa.rendering.getScene());
  advertisementClone.material.diffuseTexture = new VideoTexture("video", `${window.location.origin}/dimension/com.mp4`, noa.rendering.getScene());
  advertisementClone.material.alpha = 0.4;
  advertisementClone.material.emissiveColor = new Color3(0.8, 0.8, 0.8);
  advertisementClone.material.emissiveTexture = new VideoTexture("video", `${window.location.origin}/dimension/com.mp4`, noa.rendering.getScene());

  noa.entities.add(
    [0, 8, 49.9],
    0,
    0,
    advertisement,
    [0, 0, 0],
    false,
    false
  );

  noa.entities.add(
    [0, 8, 49.85],
    0,
    0,
    advertisementClone,
    [0, 0, 0],
    false,
    false
  );

  // Neighbouring block navigation
  const getTopicByBlockCoordinate = (x, y) => {
    const { surroundingBlocks } = props;

    if (surroundingBlocks) {
      let topic = surroundingBlocks.filter(topic => {
        return topic.blockAxis == x && topic.blockYxis == y;
      })[0];

      return topic || null;
    }

    return null;
  };

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i == 0 && j == 0) {
        continue;
      }

      const topic = getTopicByBlockCoordinate(
        props.blockDetail.blockAxis + i,
        props.blockDetail.blockYxis + j
      );

      if (topic) {
        const entryMesh = MeshBuilder.CreateBox("entry", {
          size: 10,
        });

        entryMesh.material = shaderMaterial;

        const entityId = noa.entities.add(
          [(blockX - 4.9) * i, 5, (blockY - 4.9) * j],
          10,
          10,
          null,
          null,
          false,
          false
        );

        noa.entities.addComponent(entityId, "triggerVolume", { 
          topic, 
          callback: () => window.location.href = window.location.pathname.replace(/\/b\/.+\/viewer/, `/b/${topic.uniqueId}/viewer`), 
          trigger: {
            width: 10,
            length: 10,
            height: 10,
            text: `Enter ${topic.name}`,
          },
        });
      }
    }
  }

  // Prepare NFT rental slots
  const nftSlots = await BlockNFTSlot(noa, props, HUD);

  return {
    BlockRegistry: blockIds,
    sections,
    nftSlots,
  };
}

async function AssetLoader(noa, props) {
  const response = await fetchAPI(
    `${endpoints.GET_ASSETS_BY_BLOCK}?countryId=${props.country.uniqueId}&blockId=${props.blockDetail.uniqueId}`
  );

  if (!response?.isSuccess) {
    throw Error("Error while retrieving assets for blocks");
  }

  const assets = response.assets;

  for (let asset of assets) {
    switch (asset.type) {
      case assetTypes.BUILDING:
        SceneLoader.ImportMesh(
          null,
          `${window.location.origin}/`,
          asset.url,
          noa.rendering.getScene(),
          newMeshes => {
            let smartAssetDone = false;

            for (let mesh of newMeshes) {
              if (!mesh.material) {
                mesh.material = new StandardMaterial(
                  "mesh-material",
                  noa.rendering.getScene()
                );
                mesh.material.ambientColor = new Color3(0, 0, 0);
                mesh.material.diffuseColor = new Color3(0.5, 0.5, 0.5);
                mesh.material.specularColor = new Color3(0, 0, 0);
              }

              mesh.scaling = new Vector3(
                asset.scale.x,
                asset.scale.y,
                asset.scale.z
              );

              mesh.addRotation(
                asset.rotation.pitch,
                asset.rotation.yaw,
                asset.rotation.roll
              );

              const entityId = noa.entities.add(
                [asset.position.x, asset.position.y, asset.position.z],
                asset.width,
                asset.height,
                mesh,
                [asset.offset.x, asset.offset.y, asset.offset.z],
                false,
                true
              );

              if (!smartAssetDone) {
                SetupSmartAsset(noa, props, asset, entityId);

                smartAssetDone = true;
              }
            }
          }
        );

        break;

      case assetTypes.ART:
        {
          let advertisement = MeshBuilder.CreatePlane(
            "plane",
            { width: asset.width, height: asset.height },
            noa.rendering.getScene()
          );

          advertisement.material = new StandardMaterial(
            "planeMat",
            noa.rendering.getScene()
          );
          advertisement.material.diffuseTexture = new Texture(
            asset.url,
            noa.rendering.getScene()
          );

          advertisement.addRotation(
            asset.rotation.pitch,
            asset.rotation.yaw,
            asset.rotation.roll
          );

          const entityId = noa.entities.add(
            [asset.position.x, asset.position.y, asset.position.z],
            0,
            0,
            advertisement,
            [0, 0, 0],
            false,
            false
          );

          SetupSmartAsset(noa, props, asset, entityId);
        }

        break;

      case assetTypes.VIDEO:
        {
          let advertisement = MeshBuilder.CreatePlane(
            "plane",
            { width: asset.width, height: asset.height },
            noa.rendering.getScene()
          );

          advertisement.material = new StandardMaterial("planeMat", noa.rendering.getScene());
          advertisement.material.diffuseTexture = new VideoTexture("video", asset.url, noa.rendering.getScene());
          advertisement.material.alpha = 1;

          const entityId = noa.entities.add(
            [asset.position.x, asset.position.y, asset.position.z],
            0,
            0,
            advertisement,
            [0, 0, 0],
            false,
            false
          );

          SetupSmartAsset(noa, props, asset, entityId);
        }

        break;

      default:
        throw Error("Unknown asset type");
    }
  }
}
