precision highp float;

uniform sampler2D texture;
uniform vec2 resolution;
uniform float dt;

// 重力加速度[m/s^2]
const float g = 9.80665;

// 空気抵抗係数
// k = 0.24[kg/m]
// F = kv^2
const float k = 0.24;

// 質量[kg]
const float m = 10.011;

void main(void) {
  float uvX = gl_FragCoord.x / resolution.x;

  // position , param
  vec4 data1 = texture2D(texture, vec2(uvX, 0.0));
  vec3 position = data1.xyz;
  float count = 1.0;

  // velocity
  vec4 data2 = texture2D(texture, vec2(uvX, 1.0));
  vec3 velocity = data2.xyz;

  // F = kv^2
  // ma = mg - kv^2
  // a = g - kv^2/m
  vec3 a = vec3(0.0, -g, 0.0) - k * length(velocity) * length(velocity) * normalize(velocity) / m;
  velocity += a * dt * count;
  position += 0.5 * velocity * dt * count;

  // 現在の加速度
  // ma = mg - kv^2
  // v = at;
  // a = v / t

  gl_FragColor = mix(vec4(position, data1.w + 1.0), vec4(velocity, data2.w), step(1.5, gl_FragCoord.y));
}