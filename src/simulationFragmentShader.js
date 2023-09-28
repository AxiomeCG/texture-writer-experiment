import glslCurlNoise from './glslCurlNoise';

const fragmentShader = `

uniform sampler2D positions;
uniform float uTime;
uniform float uFrequency;
uniform vec2 uMouse;


varying vec2 vUv;

${glslCurlNoise}
void main() {

  vec3 pos = clamp(texture2D(positions, vUv).xyz, 0.0, 1.0);
  
  vec2 currentMouse = (uMouse + 1.0) * 0.5;

  if(vUv.x < currentMouse.x + 0.1 && vUv.x > currentMouse.x - 0.1 && vUv.y < currentMouse.y + 0.1 && vUv.y > currentMouse.y - 0.1) {
     pos += vec3(1.0, 1.0, 1.0);
  }
  
  gl_FragColor = vec4(pos, 1.0);



 
}
`

export default fragmentShader
