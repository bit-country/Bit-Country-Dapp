/* eslint-disable */

import {
  MeshBuilder,
  Color4,
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import * as Colyseus from "colyseus.js";
import * as HUD from "./HUD/HUDPlayerList";

const red = new Color4(1, 0, 0);
const blue = new Color4(0, 0, 1);
const faceColors = [red, blue, blue, blue, blue, blue];

// multiplayer
export const JoinOrCreateRoom = (noa, worldName, username) => {
  // connect to game server
  var client = new Colyseus.Client("ws://uatserver.bit.country");
  
  SceneLoader.ImportMesh("", `${window.location.origin}/dimension/Character.obj`, null, noa.rendering.getScene(), meshes => {
    meshes[0].scaling = new Vector3(0.5, 0.5, 0.5);

    client
      .joinOrCreate(worldName, { username })
      .then((room) => {
        window.currentGameRoom = room;
        room.state.players.onAdd = (player, currentSession) => {
          const { sessionId } = room;
          if (currentSession === sessionId) {
            HUD.updateSessionDetails(player, room.id);
            HUD.addPlayerToList(player);

            noa.entities.addComponent(noa.playerEntity, "playerMesh", {
              mesh: meshes[0],
              startHidden: true
            });

            noa.ents.setPosition(noa.playerEntity, [
              player.x,
              player.y,
              player.z,
            ]);
          } else {
            // sync all players/ data
            HUD.addPlayerToList(player);

            noa.entities.addComponent(currentSession, "position");
            noa.entities.addComponent(currentSession, "playerMesh", {
              mesh: meshes[0].createInstance("")
            });
            noa.ents.setPosition(currentSession, [player.x, player.y, player.z]);
            noa.entities.addComponent(currentSession, "movement");
            noa.entities.addComponent(currentSession, "physics");
            noa.entities.addComponent(currentSession, "smooth-camera");
          }
        };
        room.state.players.onChange = (player, key) => {
          //room.sessionId => self player id
          if (key !== room.sessionId) {
            // Update the postion for other player
            noa.entities.setPosition(player.sessionId, [
              player.x,
              player.y,
              player.z,
            ]);

            noa.entities.getMovement(player.sessionId).heading = player.heading;
          }
        };
        room.onMessage("removePlayer", ({ sessionId, players }) => {
          // remove (other)player entity and update player list
          noa.ents.deleteEntity(sessionId, true);
          HUD.updatePlayerList(players);
        });

        // //  this causes the mesh to move around in sync with the player entity
        // document.addEventListener("mousemove", (e) => {
        //   //   const dir =  noa.camera.getDirection()
        //   //  const mesh = noa.entities.getState(noa.playerEntity, noa.entities.names.mesh)
        //   //  var orientation = new Vector3(dir[0], dir[1], dir[2]);
        //   //  mesh.mesh.rotation = orientation;
        // });
      })
      .catch((e) => {
        console.error("join error", e);
      });
  });
};
