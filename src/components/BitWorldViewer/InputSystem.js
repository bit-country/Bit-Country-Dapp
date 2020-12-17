/* eslint-disable */
import * as HUD from "./gameClient/HUD/HUDPlayerList";

const movementSystem = (noa) => {
  // Keyboard event
  let forwardLoop;
  let leftLoop;
  let rightLoop;
  let backwardLoop;
  let jumpLoop;
  const move = () => {
    let keyboard = { x: 0, y: 0, z: 0 };

    for (var i = 0; i < 2; i++) {
      const dat = noa.entities.getPositionData(noa.playerEntity);
      const heading = noa.entities.getMovement(noa.playerEntity).heading;

      keyboard.z = dat.position[2];
      keyboard.y = dat.position[1];
      keyboard.x = dat.position[0];
      keyboard.heading = heading;
      HUD.updatePlayerLocation(keyboard);
      window.currentGameRoom.send("key", keyboard);
    }
  };
  noa.inputs.down.on("forward", function () {
    forwardLoop = setInterval(move, 100);
  });
  noa.inputs.up.on("forward", function () {
    clearInterval(forwardLoop);
  });
  noa.inputs.down.on("backward", function () {
    backwardLoop = setInterval(move, 100);
  });
  noa.inputs.up.on("backward", function () {
    clearInterval(backwardLoop);
  });
  noa.inputs.down.on("left", function () {
    leftLoop = setInterval(move, 100);
  });
  noa.inputs.up.on("left", function () {
    clearInterval(leftLoop);
  });
  noa.inputs.down.on("right", function () {
    rightLoop = setInterval(move, 100);
  });
  noa.inputs.up.on("right", function () {
    clearInterval(rightLoop);
  });
  noa.inputs.down.on("jump", function () {
    jumpLoop = setInterval(move, 100);
  });
  noa.inputs.up.on("jump", function () {
    clearInterval(rightLoop);
  });
};

const playerList = (noa) => {
  noa.inputs.bind("playerList", "P");
  noa.inputs.down.on("playerList", () => {
    if (!window.ActivePlayerList.isDisplayed) {
      window.ActivePlayerList.displayPanel();
      window.ActivePlayerList.isDisplayed = !window.ActivePlayerList
        .isDisplayed;
    }
  });
  noa.inputs.up.on("playerList", () => {
    if (window.ActivePlayerList.isDisplayed) {
      window.ActivePlayerList.closePanel();
      window.ActivePlayerList.isDisplayed = !window.ActivePlayerList
        .isDisplayed;
    }
  });
};

export default (noa) => {
  movementSystem(noa);
  playerList(noa);
};
