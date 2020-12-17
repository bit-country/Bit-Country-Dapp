/* eslint-disable no-debugger */
export default function (noa) {
  return {
    name: "playerMesh",
    order: 101,
    state: {
      mesh: null,
      offset: null,
      startHidden: false
    },

    onAdd: function (eid, state) {
      // set mesh to correct position
      var posDat = noa.ents.getPositionData(eid)._renderPosition;

      if (!state.startHidden) {
        noa.rendering.addMeshToScene(state.mesh, false, posDat);
      }

      state.mesh.position.copyFromFloats(
        posDat[0],
        posDat[1],
        posDat[2]);
    },

    onRemove: (eid, state) => {
      state.mesh.dispose();
    },

    renderSystem: function updater(dt, state) {
      for (let instance of state) {
        const pos = noa.entities.getPositionData(instance.__id)._renderPosition;
        const heading = noa.entities.getMovement(instance.__id).heading;

        instance.mesh.position.copyFromFloats(
          pos[0],
          pos[1],
          pos[2]);

        instance.mesh.rotation.y = heading;
      }
    }
  };
}