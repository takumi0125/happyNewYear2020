precision highp float;

uniform sampler2D texture;
uniform vec2 resolution;

const vec3 GRAVITY_FORCE = vec3(0.0, -0.1, 0.0);

void main(void) {
  float uvX = gl_FragCoord.x / resolution.x;

  // position , param
  vec4 data1 = texture2D(texture, vec2(uvX, 0.0));
  vec3 position = data1.xyz;
  float count = clamp(data1.w + 2.0, 0.0, 1.0);

  // velocity
  vec4 data2 = texture2D(texture, vec2(uvX, 1.0));
  vec3 velocity = data2.xyz;

  velocity *= (1.0 - 0.01 * count);
  position += ((velocity + GRAVITY_FORCE * data2.w * data2.w * data2.w) * count * data2.w);

  gl_FragColor = mix(vec4(position, data1.w + 2.0), vec4(velocity, data2.w), step(1.5, gl_FragCoord.y));
}