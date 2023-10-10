const vertexShader = `

precision highp float;
precision highp sampler2D;
uniform sampler2D uPositions;
uniform float uTime;
varying vec2 vUv;



vec3 random3(vec3 c) {
\tfloat j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
\tvec3 r;
\tr.z = fract(512.0*j);
\tj *= .125;
\tr.x = fract(512.0*j);
\tj *= .125;
\tr.y = fract(512.0*j);
\treturn r-0.5;
}

const float F3 =  0.3333333;
const float G3 =  0.1666667;
float snoise(vec3 p) {

\tvec3 s = floor(p + dot(p, vec3(F3)));
\tvec3 x = p - s + dot(s, vec3(G3));
\t 
\tvec3 e = step(vec3(0.0), x - x.yzx);
\tvec3 i1 = e*(1.0 - e.zxy);
\tvec3 i2 = 1.0 - e.zxy*(1.0 - e);
\t \t
\tvec3 x1 = x - i1 + G3;
\tvec3 x2 = x - i2 + 2.0*G3;
\tvec3 x3 = x - 1.0 + 3.0*G3;
\t 
\tvec4 w, d;
\t 
\tw.x = dot(x, x);
\tw.y = dot(x1, x1);
\tw.z = dot(x2, x2);
\tw.w = dot(x3, x3);
\t 
\tw = max(0.6 - w, 0.0);
\t 
\td.x = dot(random3(s), x);
\td.y = dot(random3(s + i1), x1);
\td.z = dot(random3(s + i2), x2);
\td.w = dot(random3(s + 1.0), x3);
\t 
\tw *= w;
\tw *= w;
\td *= w;
\t 
\treturn dot(d, vec4(52.0));
}

float snoiseFractal(vec3 m) {
\treturn   0.5333333* snoise(m)
\t\t\t\t+0.2666667* snoise(2.0*m)
\t\t\t\t+0.1333333* snoise(4.0*m)
\t\t\t\t+0.0666667* snoise(8.0*m);
}

varying float vNoise;
void main() {

  vec3 finalPosition = position;
  
  finalPosition.z += sin(uTime + position.x) * 0.1;
  vec4 modelPosition = modelMatrix * vec4(finalPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;


  vUv = uv;
  
  vNoise = snoiseFractal(finalPosition);
  gl_Position = projectedPosition;
}

`

export default vertexShader
