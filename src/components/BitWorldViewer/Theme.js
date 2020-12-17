/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import { Color3, CubeTexture, MeshBuilder, StandardMaterial, Texture } from "@babylonjs/core";
import endpoints from "../../config/endpoints";
import { fetchAPI } from "../../utils/FetchUtil";
import { MaterialBuilder } from "./Util";

export async function SetupBlockTheme(noa, props) {
  const response = await fetchAPI(`${endpoints.GET_BLOCK_THEME}?blockId=${props.blockDetail.id}`);

  if(!response?.isSuccess) {
    throw Error("Error while retrieving block theme");
  }
  
  const theme = response.theme;
  
  // Setup materials for block theme
  const buildableMat = MaterialBuilder("Buildable", theme.buildable1.textureURL, null, noa.rendering.getScene());
  const defaultMat = MaterialBuilder("Non-buildable", theme.ground1.textureURL, null, noa.rendering.getScene());
  const restrictedMat = MaterialBuilder("Restricted", theme.restricted1.textureURL, null, noa.rendering.getScene());

  noa.registry.registerMaterial("Buildable", null, null, false, buildableMat);
  noa.registry.registerMaterial("Non-buildable", null, null, false, defaultMat);
  noa.registry.registerMaterial("Restricted", null, null, false, restrictedMat);

  // Block types and their material names
  var buildableId = noa.registry.registerBlock(1, { material: "Buildable" });
  var defaultId = noa.registry.registerBlock(2, { material: "Non-buildable" });
  var restrictedId = noa.registry.registerBlock(3, { material: "Restricted" });

  // Sky theme
  noa.rendering.getScene().clearColor = new Color3(0.05, 0.05, 0.15);
  noa.rendering.getScene().ambientColor = new Color3(0.2, 0.2, 0.2);

  // const skyBox = MeshBuilder.CreateBox("skybox", { size: 1000 }, noa.rendering.getScene());

  // skyBox.material = new StandardMaterial("skybox", noa.rendering.getScene());
  // skyBox.material.backFaceCulling = false;
  // skyBox.material.reflectionTexture = new CubeTexture("", noa.rendering.getScene(), null, null, [ "/dimension/sky_ny.png", "/dimension/sky_ny.png", "/dimension/sky_ny.png", "/dimension/sky_ny.png", "/dimension/sky_ny.png", "/dimension/sky_ny.png" ]);
  // skyBox.material.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  // skyBox.material.alpha = 0.8;
  // skyBox.material.diffuseColor = Color3.Black();
  // skyBox.material.specularColor = Color3.Black();

  // noa.entities.add(null, 0, 0, skyBox);

  return { buildableId, defaultId, restrictedId };
}