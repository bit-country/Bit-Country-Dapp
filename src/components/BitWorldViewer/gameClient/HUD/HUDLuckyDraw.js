/* eslint-disable */
import * as GUI from "@babylonjs/gui";
import {
  Color3,
  MeshBuilder,
  SceneLoader,
  Quaternion,
  Mesh,
  Ray,
  Texture,
  ParticleSystem,
  Vector3,
  Color4,
} from "@babylonjs/core";
var index = 0;
var pushButtonCore;
var panel;

function makePushButton(mesh, hoverColor) {
  var cylinder = mesh.getChildMeshes(false, (node) => {
    return node.name.indexOf("Cylinder") !== -1;
  })[0];
  var cylinderMat = cylinder.material.clone();
  cylinderMat.albedoColor = new Color3(0.5, 0.19, 0);
  cylinder.material = cylinderMat;
  var pushButton = new GUI.MeshButton3D(mesh, "pushButton" + index);
  pushButton.pointerEnterAnimation = () => {
    cylinder.material.albedoColor = hoverColor;
  };
  pushButton.pointerOutAnimation = () => {
    cylinder.material.albedoColor = new Color3(0.5, 0.19, 0);
  };
  pushButton.pointerDownAnimation = () => {
    cylinder.position.y = 0;
  };
  pushButton.pointerUpAnimation = () => {
    cylinder.position.y = 0.21;
  };
  pushButton.onPointerDownObservable.add(() => {
    console.log(pushButton.name + " pushed.");
  });
  panel.addControl(pushButton);
  index++;
}

export const ShowLuckyDraw = () => {
  var faceColors = [];
  faceColors[0] = Color3.Blue();
  faceColors[1] = Color3.Red();
  faceColors[2] = Color3.Green();
  faceColors[3] = Color3.White();
  faceColors[4] = Color3.Yellow();
  faceColors[5] = Color3.Black();

  const scene = window.noa.rendering.getScene();
  const playerPosition = window.noa.ents.getPositionData(1);
  const playerMesh = MeshBuilder.CreateBox("sa", {
    size: 1,
    faceColors,
  });

  playerMesh.checkCollisions = true;

  window.noa.entities.add(
    [0, playerPosition.position[1], 10],
    2,
    2,
    playerMesh,
    [0, playerPosition.position[1], 0],
    true,
    true
  );
  var theta = Math.PI / 8;
  var axis = new Vector3(1, 1, 1);

  var quaternion = new Quaternion.RotationAxis(axis, theta);
  playerMesh.rotationQuaternion = quaternion;
  scene.registerBeforeRender(function () {
    // playerMesh.rotation.y += 0.03;

    theta += 0.02;
    quaternion = new Quaternion.RotationAxis(axis, theta);
    playerMesh.rotationQuaternion = quaternion;
  });

  //   // var donut = MeshBuilder.CreateTorusKnot("donut", 2, 0.5, 48, 32, 3, 2);
  //   // Create the 3D UI manager
  //   var manager = new GUI.GUI3DManager(scene);

  //   var panel = new GUI.SpherePanel();
  //   panel.margin = 0.2;

  //   manager.addControl(panel);
  //   panel.position.x = playerPosition.position[0] * 0.8;
  //   panel.position.y = playerPosition.position[1] * 1.5;
  //   panel.position.z = playerPosition.position[2];
  //   panel.orientation = -2;
  //   debugger;

  //   // Let's add some buttons!
  //   var addButton = function () {
  //     var button = new GUI.HolographicButton("orientation");
  //     panel.addControl(button);

  //     button.text = "?";
  //   };

  //   panel.blockLayout = true;
  //   addButton();

  //   panel.blockLayout = false;

  // Create & launch a particule system
  var particleSystem = new ParticleSystem("spawnParticles", 3600, scene); // 3600 particles to have a continue effect when computing circle positions
  particleSystem.particleTexture = new Texture("./flare.png", scene);
  //   particleSystem.color1 = new Color4(0.9, 0.9, 0.95, 1.0);
  //   particleSystem.color2 = new Color4(0.2, 0.2, 0.3, 0.5);
  particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);
  particleSystem.emitter = new Vector3(0, 20, 0);
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.4;
  particleSystem.emitRate = 600;
  particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE; // to manage alpha
  particleSystem.gravity = new Vector3(0, -9.81, 0);
  particleSystem.direction1 = new Vector3(-1, 1, -1);
  particleSystem.direction2 = new Vector3(1, 1, 1);
  particleSystem.minEmitPower = -10;
  particleSystem.maxEmitPower = -100;
  particleSystem.maxLifeTime = 10;
  //particleSystem.updateSpeed = 0.1;

  var radius = 15;

  // Custom function to get the circle effect
  particleSystem.startPositionFunction = function (
    worldMatrix,
    positionToUpdate
  ) {
    var rndAngle = 2 * Math.random() * Math.PI;
    var randX = Math.random() * radius * Math.sin(rndAngle);
    var randY = this.minEmitBox.y;
    var randZ = Math.random() * radius * Math.cos(rndAngle);

    Vector3.TransformCoordinatesFromFloatsToRef(
      randX,
      randY,
      randZ,
      worldMatrix,
      positionToUpdate
    );
  };

  particleSystem.updateFunction = function (particles) {
    for (var index = 0; index < particles.length; index++) {
      var particle = particles[index];
      particle.color = new Color4(
        particle.position.x * 0.8,
        particle.position.y * 0.8,
        particle.position.z * 0.8,
        1.0
      );
      particle.age += this._scaledUpdateSpeed;
      if (particle.age >= particle.lifeTime) {
        particleSystem.stop();

        // this.recycleParticle(particle);
        // index--;
        continue;
      } else {
        particle.colorStep.scaleToRef(
          this._scaledUpdateSpeed,
          this._scaledColorStep
        );
        particle.color.addInPlace(this._scaledColorStep);
        if (particle.color.a < 0) particle.color.a = 0;
        particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;
        particle.direction.scaleToRef(
          this._scaledUpdateSpeed,
          this._scaledDirection
        );
        particle.position.addInPlace(this._scaledDirection);
        this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
        particle.direction.addInPlace(this._scaledGravity);
      }
    }
  };

  // Start
  particleSystem.start();
};
