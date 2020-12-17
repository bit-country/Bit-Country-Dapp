/* eslint-disable padding-line-between-statements */
/* eslint-disable no-unused-vars */

// Engine options object, and engine instantiation:
import NoaEngine from "noa-engine";
import { Color3, GlowLayer, SceneLoader, Sound, Vector3 } from "@babylonjs/core";
import SetupHUD from "./HUD";

import { BlockLoader } from "./Block";
import { SetupGameloop } from "./GameLoop";

import BlockNavigator from "./Components/TriggerVolume";
import { JoinOrCreateRoom } from "./gameClient/room";
import Axios from "axios";
import SetupPlayerHUD from "./gameClient/HUD/HUDPlayerList";
import SetupInputSystem from "./InputSystem";
import SetupAirdrop from "./Function/Airdrop";
import PostProcess from "./PostProcess";
import PlayerMesh from "./Components/PlayerMesh";
import React, { useEffect, useState } from "react";

// Setup
var opts = {
  chunkSize: 25,
  chunkAddDistance: 7.0,
  chunkRemoveDistance: 7.5,
};

export default function Engine(props) {
  const [ engine, setEngine ] = useState(null);
  const [ HUD, setHUD ] = useState(null);
  const [ loadingBlock, setLoadingBlock ] = useState(false);
  const [ loadingEngine, setLoadingEngine ] = useState(false);
  const [ gameStateStruct, setGameStateStruct ] = useState({
    canvas: null,
    blockLoaded: false,
    engineLoaded: false
  });

  useEffect(() => {
    if (!gameStateStruct.canvas || loadingEngine || gameStateStruct.engineLoaded) {
      return;
    }

    setLoadingEngine(true);

    (async () => {
      const noa = new NoaEngine({
        ...opts,
        domElement: gameStateStruct.canvas
      });

      setEngine(noa);

      window.noa = noa;
    
      // Wait for completion of intialisation
      noa.setPaused(true);

      // View
      PostProcess(noa);
      const hud = SetupHUD(noa.rendering.getScene());
      setHUD(hud);

      // Infrastructure
      const compDef = BlockNavigator(noa, hud, gameStateStruct);
      noa.entities.createComponent(compDef);

      const playerMeshDef = PlayerMesh(noa);
      noa.entities.createComponent(playerMeshDef);

      // Gameplay
      const startAirdrop = await SetupAirdrop(noa, hud);
      setGameStateStruct(state => ({
        ...state,
        startAirdrop
      }));

      // Input
      SetupGameloop(noa, gameStateStruct);

      setGameStateStruct(state => ({
        ...state,
        engineLoaded: true
      }));
      setLoadingEngine(false);
    })();
  }, [ gameStateStruct.canvas ]);
  
  useEffect(() => {
    if (!HUD || !engine) {
      return;
    }

    engine.worldName = props.blockDetail.name;

    HUD.updateLocation(props.blockDetail.name);
  }, [ HUD, engine, props.blockDetail.name ]);

  useEffect(() => {
    if (!gameStateStruct.engineLoaded || loadingBlock) {
      return;
    }

    setLoadingBlock(true);

    (async () => {
      // World
      const blockData = await BlockLoader(engine, props, HUD);

      setGameStateStruct(state => ({
        ...state,
        blockData
      }));

      // Multiplayer
      SetupInputSystem(engine);
      Axios.post("http://uatserver.bit.country/dim-world/new", {
        name: props.blockDetail.uniqueId,
      })
        .then(() => {
          SetupPlayerHUD();
          JoinOrCreateRoom(engine, props.blockDetail.uniqueId, props.user.nickName);

          setGameStateStruct(state => ({
            ...state,
            blockLoaded: true
          }));

          setLoadingBlock(false);
        });
    })();
  }, [ gameStateStruct.engineLoaded, props.blockDetail.id ]);

  useEffect(() => {
    if (gameStateStruct.blockLoaded && gameStateStruct.engineLoaded) {
      engine.setPaused(false);
    }
  }, [ gameStateStruct.blockLoaded, gameStateStruct.engineLoaded ]);

  return (
    <div
      ref={node => {
        if (node && !gameStateStruct.canvas) {
          setGameStateStruct(state => ({
            ...state,
            canvas: node
          }));
        }
      }}
    >
      <canvas
        ref={props.refProp}
        id="bitDimensionCanvas"
        touch-action="none"
        style={{
          width: "100%",
          height: "100%",
        }}
      ></canvas>
    </div>
  );
}
