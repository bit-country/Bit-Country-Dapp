/* eslint-disable */
import { Room, Client } from "colyseus";

import StateHandler from "../../../src/components/BitWorldViewer/gameCommon/StateHandler";
import Player from "../../../src/components/BitWorldViewer/gameCommon/Player";

function randomPosition(min, max) {
  return Math.random() * (max - min) + min;
}
export class GameRoom extends Room {
  maxClients = 50;

  onCreate(options) {
    this.setSimulationInterval(() => this.onUpdate());
    this.setState(new StateHandler());

    this.onMessage("key", (client, message) => {
      const player = this.state.players[client.sessionId];
      player.pressedKeys = { x: message.x, y: message.y, z: message.z};
      player.heading = message.heading
      console.log(message);
    });

    this.onMessage("newPlayerJoined", ({ player }) => {
      this.broadcast("spawnPlayer", { player });
    });

    this.setSeatReservationTime(30);
  }

  onJoin(client, { username }) {
    // console.log("************** on join **************");
    //CreatePlayer();
    if (typeof this.state.players[client.sessionId] === "undefined") {
      Logging.Log("undefined");
      let player = new Player();
      player.name = username;
      player.sessionId = client.sessionId;
      player.x = randomPosition(-1, 1);
      player.z = randomPosition(-1, 1);
      player.y = 4;

      this.state.players[client.sessionId] = player;
      //console.log( this.state.players)
      // console.log( `------------------------------------------------------------`)
      //  console.log( `${this.state.players[client.sessionId].name} just joined the room \nSession Id: ${client.sessionId} \nRoom Id: ${this.roomId} `)
      // console.log('Clients:')
      this.clients.forEach((x) => console.log(`${x.id}`));

      // this.state.players.forEach((x) => console.log(`${x.sessionId}, ${x.x}`));

      //console.log( `------------------------------------------------------------`)
      // this.broadcast("spawnPlayer", { player });
    }
  }

  onUpdate(e) {
    // this.onMessage("playerMove", ({ player }) => {
    //   this.broadcast("updatePlayerPosition", { player });
    // });
    for (const sessionId in this.state.players) {
      const player = this.state.players[sessionId];
      if (player.pressedKeys) {
        player.x = player.pressedKeys.x;
        player.z = player.pressedKeys.z;
        player.y = player.pressedKeys.y;
        //   this.broadcast("updatePlayerPosition", { player });

        // smoothMovement()
        // console.log(player.x )
        // console.log(player.z )
      }
    }
  }

  onLeave(client) {
    delete this.state.players[client.sessionId];
    this.broadcast("removePlayer", {
      sessionId: client.sessionId,
      players: this.state.players,
    });
  }

  onDispose() {
    // return new Promise((resolve, reject) => {
    //   doDatabaseOperation((err, data) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(data);
    //     }
    //   });
    // });
  }
}
