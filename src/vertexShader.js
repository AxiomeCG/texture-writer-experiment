const vertexShader = `
uniform sampler2D uPositions;
uniform float uTime;
varying vec3 vPosition;
void main() {
  vec3 pos = texture2D(uPositions, position.xy).xyz;
  
  
  vec3 finalPos = vec3(position.xy, pos.z * 0.1);

  vec4 modelPosition = modelMatrix * vec4(finalPos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;


  vPosition = modelPosition.xyz;
  gl_Position = projectedPosition;

  gl_PointSize = 10.0;
  // Size attenuation;
  gl_PointSize *= step(1.0 - (1.0/64.0), position.x) + 0.5;
}

`

export default vertexShader
