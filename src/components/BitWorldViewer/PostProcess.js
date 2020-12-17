import { GlowLayer, Effect } from "@babylonjs/core";

Effect.ShadersStore["customVertexShader"] =
  "precision highp float;\r\n" +
  "// Attributes\r\n" +
  "attribute vec3 position;\r\n" +
  "attribute vec2 uv;\r\n" +
  "// Uniforms\r\n" +
  "uniform mat4 worldViewProjection;\r\n" +
  "// Varying\r\n" +
  "varying vec2 vUV;\r\n" +
  "varying vec3 vPosition;\r\n" +
  "void main(void) {\r\n" +
  "    gl_Position = worldViewProjection * vec4(position, 1.0);\r\n" +
  "    \r\n" +
  "    vPosition = (normalize(position) + vec3(1)) / vec3(2);\r\n" +
  "    vUV = uv;\r\n" +
  "}\r\n";

Effect.ShadersStore["customFragmentShader"] =
  "precision highp float;\r\n" +
  "varying vec2 vUV;\r\n" +
  "varying vec3 vPosition;\r\n" +
  "uniform sampler2D textureSampler;\r\n" +
  "void main(void) {\r\n" +
  "    gl_FragColor = (vec4(1) - (vec4(vPosition.yyyy) * vec4(2))) * vec4(0, 1, 1, 1);\r\n" +
  "}\r\n";

export default function PostProcess(noa) {
  new GlowLayer("glow", noa.rendering.getScene(), { blurKernelSize: 64 });
}
