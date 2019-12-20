precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec4 randomValues;
attribute float vertexId;

uniform float time;
uniform float lifeTime;
uniform float pointSize;
uniform sampler2D dataTexture;
uniform float dataTextureSize;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying float vAlpha;
varying vec3 vColor;

#pragma glslify: easeInCubic = require(glsl-easings/cubic-in);

#pragma glslify: easeOutQuart = require(glsl-easings/quartic-out);
#pragma glslify: easeInQuart = require(glsl-easings/quartic-in);

#pragma glslify: map = require('../../_utils/glsl/map');
#pragma glslify: PI = require('../../_utils/glsl/PI.glsl)
#pragma glslify: rotateVec3 = require('../../_utils/glsl/rotateVec3.glsl)

const float PI2 = PI * 2.0;
const vec3 AXIS_X = vec3(1.0, 0.0, 0.0);
const vec3 AXIS_Y = vec3(0.0, 1.0, 0.0);
const vec3 AXIS_Z = vec3(0.0, 0.0, 1.0);

void main(void){
  float uvX = (vertexId + 0.5) / dataTextureSize;
  vec4 data1 = texture2D(dataTexture, vec2(uvX, 0.0));
  vec4 data2 = texture2D(dataTexture, vec2(uvX, 1.0));

  vec3 pos = data1.xyz;
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

  gl_PointSize = pointSize * (100.0 / -mvPos.z);

  // vAlpha = (1.0 - time / (lifeTime + randomValues.x * lifeTime)) * data2.w * data2.w * data2.w;
  vAlpha = 1.0;
  vColor = vec3(1.0, 0.0, 0.0);

  gl_Position = projectionMatrix * mvPos;
}
