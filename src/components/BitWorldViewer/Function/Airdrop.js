/* eslint-disable no-unused-vars */
import { SceneLoader, Sound, Vector3 } from "@babylonjs/core";
import { blockX, blockY } from "../Block";
import Notification from "../../../utils/Notification";
import moment from "moment";

const COIN_SIZES = {
  BIG: {
    scaling: new Vector3(1.25, 1.25, 1.25),
    value: 20,
  },
  MEDIUM: {
    scaling: new Vector3(0.5, 0.5, 0.5),
    value: 5,
  },
  SMALL: {
    scaling: new Vector3(0.25, 0.25, 0.25),
    value: 1,
  },
  REMAINDER: {
    scaling: new Vector3(0.20, 0.20, 0.20)
  }
};

export default async function SetupAirdrop(noa, HUD) {
  // Assets
  let coinModel = null;

  const coinResult = await SceneLoader.ImportMeshAsync(
    null,
    `${window.location.origin}/`,
    "dimension/Coin.obj",
    noa.rendering.getScene()
  );

  coinModel = coinResult.meshes[0];
  
  const willStartSound = new Sound(
    "willstart",
    "/dimension/airdrop_willstart.mp3",
    noa.rendering.getScene(),
    null,
    {
      volume: 0.4,
    }
  );
  const startSound = new Sound(
    "start",
    "/dimension/airdrop_started.mp3",
    noa.rendering.getScene(),
    null,
    {
      loop: true,
      volume: 0.8,
    }
  );
  const collectSound = new Sound(
    "collect",
    "/dimension/collect.mp3",
    noa.rendering.getScene(),
    null,
    { volume: 1 }
  );

  let airdropState = {
    inProgress: false,
    value: 0,
    collectors: [],
    coins: [],
    start: null,
  };
  
  // Functionality
  const startAirdrop = value => {
    if (airdropState.inProgress) {
      Notification.displayErrorMessage("Can't start another event with existing event in progress");

      return;
    }

    // TODO: Add dispatch to server for syncing
    // Setup
    airdropState.inProgress = true;
    airdropState.value = value;
    airdropState.collectors = [];
    airdropState.coins = [];
    airdropState.start = new Date();

    let timer = 3;
    let intervalHandler = null;

    willStartSound.play();

    let currentValue = value;

    intervalHandler = window.setInterval(() => {
      if (timer-- > 0) {
        HUD.showTimedMessage({ text: `Airdrop in ${timer}!`, duration: 800, fontSize: 50, fontWeight: 500 });
      } else {
        startSound.play();

        window.setTimeout(() => {
          startSound.stop();
        }, 9000);

        window.clearInterval(intervalHandler);

        // Loop until value is dispensed
        while (currentValue > 0) {
          const mesh = coinModel.createInstance("mesh");

          let ran = Math.random();
          let type, value, scaling;

          if (ran > 0.9 && currentValue >= COIN_SIZES.BIG.value) {
            // BIG
            type = "BIG";
            value = COIN_SIZES.BIG.value;
            scaling = COIN_SIZES.BIG.scaling;
          } else if (ran > 0.7 && currentValue >= COIN_SIZES.MEDIUM.value) {
            // MEDIUM
            type = "MEDIUM";
            value = COIN_SIZES.MEDIUM.value;
            scaling = COIN_SIZES.MEDIUM.scaling;
          } else if (currentValue >= COIN_SIZES.SMALL.value) {
            // SMALL
            type = "SMALL";
            value = COIN_SIZES.SMALL.value;
            scaling = COIN_SIZES.SMALL.scaling;
          } else {
            // REMAINDER
            type = "REMAINDER";
            value = currentValue;
            scaling = COIN_SIZES.REMAINDER.scaling;
          }

          currentValue -= value;
          
          mesh.scaling = scaling;

          // Spawn coins
          window.setTimeout(() => {
            let positionX = (blockX - 10) * 2 * Math.random() - (blockX - 10), 
                positionY = (blockY - 10) * 2 * Math.random() - (blockY - 10);

            if (positionX < 0) {
              positionX = (Math.random() * (-32 - positionX)) + positionX;
            } else {
              positionX = (Math.random() * (32 - positionX)) + positionX;
            }

            if (positionY < 0) {
              positionY = (Math.random() * (-32 - positionY)) + positionY;
            } else {
              positionY = (Math.random() * (32 - positionY)) + positionY;
            }

            const dropEntityId = noa.entities.add(
              [
                positionX,
                20,
                positionY,
              ],
              1,
              1,
              mesh,
              [ 0, 1.5 * scaling.y, 0 ],
              true,
              true
            );

            const state = { id: Math.random() * 100, value, type, eid: dropEntityId };
            
            noa.entities.addComponent(
              dropEntityId,
              noa.entities.names.collideEntities,
              {
                callback: entityId => {
                  if (entityId == noa.playerEntity) {
                    // TODO Send message to server to sync
                    HUD.showTimedMessage({ text: `Picked up ${value}`, duration: 600 });
                    
                    collectSound.play();
                    
                    if (!airdropState.collectors[0]) {
                      airdropState.collectors.push({ coins: [] });
                    } else {
                      airdropState.collectors[0].coins.push(state);
                    }

                    noa.entities.deleteEntity(dropEntityId, true);
                  }
                },
              }
            );
            
            airdropState.coins.push(state);
          }, Math.random() * 10000);
        }
      }
    }, 1000);

    // Clean up event/finalise
    window.setTimeout(async () => {
      if (moment(airdropState.start).add(61, "seconds").isBefore(moment())) {
        // Too long after even should've ended
        Notification.displayErrorMessage("Event timed out with server");

        airdropState.inProgress = false;
        airdropState.coins = [];
        airdropState.collectors = [];
        airdropState.start = null;
        
        return;
      }

      // TODO Send API request to finalise event
      let total = 0;

      for (let collectedCoin of airdropState.collectors[0]?.coins) {
        total += collectedCoin.value;
      }

      HUD.showTimedMessage({ text: "YOU COLLECTED: " + total, duration: 2000 });

      for (let coin of airdropState.coins) {
        noa.entities.deleteEntity(coin.eid, true);
      }

      airdropState.inProgress = false;
      airdropState.coins = [];
      airdropState.collectors = [];
      airdropState.start = null;
    }, 60000);
  };
  
  return startAirdrop;
}
