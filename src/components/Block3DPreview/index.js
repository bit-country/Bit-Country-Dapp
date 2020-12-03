import * as BABYLON from "@babylonjs/core";
import * as React from "react";
import { Spin } from "antd";

export default function Block3DPreview({ blockTheme, blockTemplate, width, height, loading }) {
  const [ canvas, setCanvas ] = React.useState(null);
  const handleCanvasRef = React.useCallback(element => { setCanvas(element); }, []);

  React.useEffect(() => {
    if (!canvas || loading) {
      return;
    }

    let engine = new BABYLON.Engine(canvas);

    let scene = new BABYLON.Scene(engine);

    let camera = new BABYLON.ArcRotateCamera("camera", -(4 / Math.PI), 2 / Math.PI, 15, BABYLON.Vector3.Zero(), scene);

    camera.attachControl(canvas, true);
    
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 30;
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.9;

    new BABYLON.HemisphericLight("hemilight", new BABYLON.Vector3(0, 1, 0), scene);

    const groundUVs = [
      new BABYLON.Vector4(0, 0, 1, 1), // front
      new BABYLON.Vector4(0, 0, 1, 1), // back
      new BABYLON.Vector4(0, 0, 1, 1), // right
      new BABYLON.Vector4(0, 0, 1, 1), // left
      new BABYLON.Vector4(0, 0, 10, 10), // top
      new BABYLON.Vector4(0, 0, 10, 10), // bottom
    ];

    let ground = BABYLON.MeshBuilder.CreateBox("ground", { width: 10, depth: 10, height: 1, faceUV: groundUVs }, scene);
    
    ground.material = new BABYLON.StandardMaterial("groundmat", scene);
    ground.material.diffuseTexture = new BABYLON.Texture(blockTheme.ground1.textureURL, scene);
    ground.material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    let podium = BABYLON.MeshBuilder.CreateBox("podium", { width: 2, depth: 2, height: 0.5 }, scene);
    
    podium.material = new BABYLON.StandardMaterial("groundmat", scene);
    podium.material.diffuseTexture = ground.material.diffuseTexture;
    podium.material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    podium.position = new BABYLON.Vector3(0, 0.75, 0);

    const wallUVs = [
      new BABYLON.Vector4(0, 0, 2, 1), // front
      new BABYLON.Vector4(0, 0, 2, 1), // back
      new BABYLON.Vector4(0, 0, 2, 10), // right
      new BABYLON.Vector4(0, 0, 2, 10), // left
      new BABYLON.Vector4(0, 0, 10, 1), // top
      new BABYLON.Vector4(0, 0, 10, 1), // bottom
    ];

    let wallWest = BABYLON.MeshBuilder.CreateBox("wallWest", { width: 1, depth: 10, height: 2, faceUV: wallUVs }, scene);
    
    wallWest.position = new BABYLON.Vector3(-5.5, 0.5, 0);
    wallWest.material = new BABYLON.StandardMaterial("groundmat", scene);
    wallWest.material.diffuseTexture = new BABYLON.Texture(blockTheme.restricted1.textureURL, scene);
    wallWest.material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    let wallEast = wallWest.createInstance("wallEast");

    wallEast.position = new BABYLON.Vector3(5.5, 0.5, 0);

    let wallNorth = BABYLON.MeshBuilder.CreateBox("wallWest", { width: 1, depth: 12, height: 2, faceUV: wallUVs }, scene);
    
    wallNorth.position = new BABYLON.Vector3(0, 0.5, 5.5);
    wallNorth.rotation = new BABYLON.Vector3(0, 1.571, 0);
    wallNorth.material = wallWest.material;

    let wallSouth = wallNorth.createInstance("wallSouth");
    
    wallSouth.position = new BABYLON.Vector3(0, 0.5, -5.5);
    wallSouth.rotation = new BABYLON.Vector3(0, 1.571, 0);

    let slots = [];

    for (let slot of blockTemplate.slots) {
      let newSlot = new BABYLON.MeshBuilder.CreateBox("slot", { width: 1, depth: 1, height: 0.5, }, scene);

      newSlot.position = new BABYLON.Vector3(slot.position.x / 10, (slot.position.y / 10) + 0.75, slot.position.z / 10);
      newSlot.material = new BABYLON.StandardMaterial("slotMat", scene);
      newSlot.material.diffuseColor = new BABYLON.Color4(0, 1, 1, 0.4);
      newSlot.material.alpha = 0.4;

      slots.push(newSlot);
    }

    engine.runRenderLoop(() => scene.render());

    return () => {
      engine.stopRenderLoop();

      engine = scene = camera = ground = podium = wallNorth = wallSouth = wallEast = wallWest = slots = null;
    };
  }, [ loading, canvas, blockTheme, blockTemplate ]);
  
  if (!blockTheme || !blockTemplate) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height }}>
        <Spin size="large" tip="Choose your settings above to load preview" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height }}>
      <canvas width={width} height={height} ref={handleCanvasRef}></canvas>
    </div>
  );
}
