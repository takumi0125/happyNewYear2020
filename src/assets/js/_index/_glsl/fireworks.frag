precision highp float;

uniform sampler2D pointTexture;
varying float vAlpha;
varying vec3 vColor;

void main(void) {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  vec4 color = texture2D(pointTexture, uv) * vec4(vColor, 1.0);
  color.a *= vAlpha;
  gl_FragColor = color;
}