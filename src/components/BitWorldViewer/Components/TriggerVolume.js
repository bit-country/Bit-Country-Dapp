import { MeshBuilder, ShaderMaterial, Vector3 } from "@babylonjs/core";

/* eslint-disable no-debugger */
export default function (noa, HUD, gameStateStruct) {
  return {
    name: "triggerVolume",
    order: 300,
    state: {
      callback: null,
      trigger: {
        x: 0,
        y: 0,
        z: 0,
        width: 1,
        length: 1,
        height: 5,
        text: null
      }
    },
    onAdd: function (eid, state) {
      var posDat = noa.ents.getPositionData(eid);

      const mesh = MeshBuilder.CreateBox("trigger-volume", { size: 1 });
      
      mesh.scaling.x = state.trigger.width ?? 1;
      mesh.scaling.y = state.trigger.height ?? 5;
      mesh.scaling.z = state.trigger.length ?? 1;

      var shaderMaterial = new ShaderMaterial("shader", noa.rendering.getScene(), {
          vertex: "custom",
          fragment: "custom",
        },
        {
          attributes: [ "position", "normal", "uv" ],
          uniforms: [ "world", "worldView", "worldViewProjection", "view", "projection" ]
        }
      );
    
      shaderMaterial.setFloat("time", 0);
      shaderMaterial.setVector3("cameraPosition", Vector3.Zero());
      shaderMaterial.backFaceCulling = false;
      shaderMaterial.alpha = 0.8;

      mesh.material = shaderMaterial;

      noa.rendering.addMeshToScene(mesh, false, posDat.position);

      // set mesh to correct position
      var rpos = posDat._renderPosition;

      mesh.position.copyFromFloats(
        rpos[0] + (state.trigger.x ?? 0),
        rpos[1] + (state.trigger.y ?? 0),
        rpos[2] + (state.trigger.z ?? 0));

        state.triggerVolumeMesh = mesh;
    },

    onRemove: (eid, state) => {
      state.triggerVolumeMesh.dispose();
    },

    system: function collider(dt, state) {
      for (let instance of state) {
        const playerPos = noa.entities.getPosition(noa.playerEntity);

        const pos = noa.entities.getPosition(instance.__id);
        const triggerX = pos[0] + (instance.trigger.x ?? 0);
        const triggerY = pos[1] + (instance.trigger.y ?? 0);
        const triggerZ = pos[2] + (instance.trigger.z ?? 0);

        const triggerWidth = instance.trigger.width ?? 1, triggerHeight = instance.trigger.height ?? 1, triggerLength = instance.trigger.length ?? 1;

        const minX = triggerX - (triggerWidth / 2), maxX = triggerX + (triggerWidth / 2);
        const minY = triggerY - (triggerHeight / 2), maxY = triggerY + (triggerHeight / 2);
        const minZ = triggerZ - (triggerLength / 2), maxZ = triggerZ + (triggerLength / 2);
        
        if (minX <= playerPos[0] && maxX >= playerPos[0]
          && minY <= playerPos[1] && maxY >= playerPos[1]
          && minZ <= playerPos[2] && maxZ >= playerPos[2]) {
          HUD.showAction({ text: instance.trigger.text, fontSize: 40 });
          
          gameStateStruct.currentAction = () => { 
            if (instance.callback) {
              instance.callback();
            }
          };

          break;
        } else {
          gameStateStruct.currentAction = null;
          HUD.hideAction();
        }    
      }
    }
  };
}