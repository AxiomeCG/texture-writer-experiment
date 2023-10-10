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
uniform float uBrushSize;


varying vec2 vUv;

${glslCurlNoise}

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

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

  //if( st.x < currentMouse.x + brushSize && st.x > currentMouse.x - brushSize && st.y < currentMouse.y + brushSize && st.y > currentMouse.y - brushSize) {
  if(distance(currentMouse, st) < brushSize *2.0 * rand(brushSize)) {
      vec2 boundaryMin = vec2(currentMouse.x - brushSize, currentMouse.y - brushSize);
      vec2 boundaryMax = vec2(currentMouse.x + brushSize, currentMouse.y + brushSize);
      vec2 center = (boundaryMin + boundaryMax) * 0.5;
      float distance = distance(st, center) + noise(center.x + rand(center.y));
      float strength = pow(1.0-distance, 3.);
    
      
      //return 0.05 * strength * clamp(sin(0.1*(1.0/brushSize) * (1.0 - strengthX) * 300.0),-1.0,1.0);
      return (1.0 - clamp(distance,0.0,1.0)) * snoise(st * 100.0);
  } 
  
  
  return 0.0;
}

void main() {

  float brushSize = uBrushSize;

  vec3 pos = clamp(texture2D(positions, vUv).xyz, 0.0, 1.0);
  
  vec2 currentMouse = (uMouse + 1.0) * 0.5;
  
  if( pos.b < 1.0) pos += 0.0005;
  
  if(!uIsStaticMouse) pos -= displacementBrush(vUv, pos, currentMouse, brushSize);
  
  gl_FragColor = vec4(clamp(pos,0.0,1.0), 1.0);



 
}
`

export default fragmentShader
