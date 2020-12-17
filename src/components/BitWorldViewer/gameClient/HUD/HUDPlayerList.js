/* eslint-disable */
import * as GUI from "@babylonjs/gui";
import Player from "../../gameCommon/Player";

export const addPlayerToList = (player) => {
  window.ActivePlayerList.playerList.text += `\n${
    // player.sessionId
    player.name
  }: x: ${player.x.toFixed(2)}, z: ${player.z.toFixed(2)}`;
};

/**
 * [update the list of active on HUD]
 * @param  {Player} players [Object pair of players, no need to convert to an array of players]
 */
export const updatePlayerList = (players) => {
  let newPlayerList;
  Object.keys(players).map((key) => {
    newPlayerList += `\n${players[key].sessionId}: x: ${players[key].x.toFixed(
      2
    )}, z: ${players[key].z.toFixed(2)}`;
  });
  window.ActivePlayerList.playerList.text = newPlayerList;
};

/**
 * [update location of current player]
 * @param  location [Object of location contain x && z]
 */
export const updatePlayerLocation = (location) => {
  window.GamePlayerLocation.text = `x: ${location.x.toFixed(
    2
  )}, z: ${location.z.toFixed(2)}`;
};

export const updateSessionDetails = (player, rId) => {
  window.GameSession.text = `Player Id: ${player.sessionId}, Room: ${rId}, Session: ${player.sessionId}`;
};
const setupSessionUI = (advancedTexture) => {
  const sessionHUD = new GUI.TextBlock("session", `player Id: , session: `);
  var container = new GUI.Rectangle();
  container.width = 0.5;
  container.height = "30px";
  container.color = "white";
  sessionHUD.fontSizeInPixels = '18';
  container.background = "#00000096";
  container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  container.top = "-40%";
  container.left = "50px";
  container.thickness = 0;
  container.cornerRadius = 10;
  container.addControl(sessionHUD);
  //advancedTexture.addControl(container);

  window.GameSession = sessionHUD;
};

const setupPlayerListUI = (advancedTexture) => {
  const playerList = new GUI.TextBlock("players");
  const playerLabel = new GUI.TextBlock("playerLabel", "Active Players");
  const container = new GUI.Rectangle();

  playerLabel.top = "-43%";
  playerLabel.fontWeight = 800;
  playerLabel.fontSize = "38px";
  container.addControl(playerLabel);

  container.color = "white";
  container.width = 0.9;
  container.cornerRadius = 10;
  container.height = 0.8;
  container.background = "#000000cf";
  container.thickness = 0;
  container.zIndex = "9999";
  playerList.zIndex = "9999";
  container.addControl(playerList);

  window.ActivePlayerList = {
    container: container,
    playerList: playerList,
    isDisplayed: false,
    closePanel: () => {
      advancedTexture.removeControl(container);
    },
    displayPanel: () => {
      advancedTexture.addControl(container);
    },
  };
};

const setupPlayerLocationUI = (advancedTexture) => {
  let locationLabel = new GUI.TextBlock("location", `x: --, z: --`);
  const container = new GUI.Rectangle();
  container.width = 0.2;
  container.height = "30px";
  container.cornerRadius = 10;
  container.thickness = 0;
  container.color = "white";
  container.background = "#000000bd";
  container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  container.top = "-45%";
  container.left = "50px";
  container.addControl(locationLabel);

  advancedTexture.addControl(container);
  window.GamePlayerLocation = locationLabel;
};
export default () => {
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UIPlayerList");

  // For debug only
  setupSessionUI(advancedTexture);

  setupPlayerListUI(advancedTexture);
  setupPlayerLocationUI(advancedTexture);
};
