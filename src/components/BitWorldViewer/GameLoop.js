/* eslint-disable no-unused-vars */
export function SetupGameloop(noa, gameStateStruct) {
  noa.inputs.down.on("fire", function () {
    if (!gameStateStruct.blockData) {
      return;
    }

    if (
      noa.targetedBlock &&
      noa.targetedBlock.blockID != gameStateStruct.blockData.BlockRegistry.restrictedId
    ) {
      const position = noa.targetedBlock.position;

      for (let section of gameStateStruct.blockData.sections) {
        if (
          position[0] < section.end.x &&
          position[0] > section.start.x &&
          position[2] > section.start.y &&
          position[2] < section.end.y
        ) {
          noa.setBlock(0, noa.targetedBlock.position);
        }
      }
    }
  });

  // place some grass on right click
  noa.inputs.down.on("alt-fire", function () {
    if (!gameStateStruct.blockData) {
      return;
    }

    if (noa.targetedBlock) {
      const position = noa.targetedBlock.adjacent;

      for (let section of gameStateStruct.blockData.sections) {
        if (
          position[0] < section.end.x &&
          position[0] > section.start.x &&
          position[2] > section.start.y &&
          position[2] < section.end.y &&
          position[1] > -24 &&
          position[1] < 48
        ) {
          noa.setBlock(gameStateStruct.blockData.BlockRegistry.buildableId, noa.targetedBlock.adjacent);
        }
      }
    }
  });

  // add a key binding for "E" to do the same as alt-fire
  noa.inputs.bind("alt-fire", "E");

  noa.inputs.bind("use", "F");

  noa.inputs.down.on("use", () => {
    if (gameStateStruct.currentAction) {
      gameStateStruct.currentAction();
    }
  });

  // each tick, consume any scroll events and use them to zoom camera
  noa.on("tick", function (dt) {
    var scroll = noa.inputs.state.scrolly;

    if (scroll !== 0) {
      noa.camera.zoomDistance += (scroll > 0) ? 1 : -1;
      
      if (noa.camera.zoomDistance < 1) {
        const accessor = noa.entities.getStateAccessor("playerMesh");

        const entity = accessor(noa.playerEntity);

        noa.rendering.removeMeshFromScene(entity.mesh);
      } else {
        const accessor = noa.entities.getStateAccessor("playerMesh");

        const entity = accessor(noa.playerEntity);

        noa.rendering.addMeshToScene(entity.mesh);
      }

      if (noa.camera.zoomDistance < 0) noa.camera.zoomDistance = 0;

      if (noa.camera.zoomDistance > 10) noa.camera.zoomDistance = 10;
    }
  });
}