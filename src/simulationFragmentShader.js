import glslCurlNoise from './glslCurlNoise';

const fragmentShader = `
precision highp float;
precision highp sampler2D;

uniform sampler2D positions;
uniform float uTime;
uniform float uFrequency;
uniform vec2 uMouse;
uniform bool uIsStaticMouse;
uniform float uAngle;


varying vec2 vUv;

${glslCurlNoise}

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, s, -s, c);
  return m * v;
}

float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(float p){
float fl = floor(p);
  float fc = fract(p);
return mix(rand(fl), rand(fl + 1.0), fc);
}

float displacementBrush(vec2 st, vec3 pos, vec2 currentMouse, float brushSize){

  vec2 rotatedUv = rotate(st, uAngle);

  if( st.x < currentMouse.x + brushSize && st.x > currentMouse.x - brushSize && st.y < currentMouse.y + brushSize && st.y > currentMouse.y - brushSize) {
      vec2 boundaryMin = vec2(currentMouse.x - brushSize, currentMouse.y - brushSize);
      vec2 boundaryMax = vec2(currentMouse.x + brushSize, currentMouse.y + brushSize);
      vec2 center = (boundaryMin + boundaryMax) * 0.5;
      float distance = distance(st, center);
      float strength = pow(1.0-distance, 0.5);
    
      float strengthX = pow(1.0-(rotatedUv.x -center.x), 0.5);
      
      return 0.05 * strength * clamp(sin((1.0 - strengthX) * 300.0),-1.0,1.0);
  } 
  
  return 0.0;
}

void main() {

  float brushSize = 0.1;

  vec3 pos = clamp(texture2D(positions, vUv).xyz, 0.0, 1.0);
  
  vec2 currentMouse = (uMouse + 1.0) * 0.5;
  
  if(!uIsStaticMouse) pos -= displacementBrush(vUv, pos, currentMouse, brushSize);
  
  gl_FragColor = vec4(clamp(pos,0.0,1.0), 1.0);



 
}
`

export default fragmentShader
