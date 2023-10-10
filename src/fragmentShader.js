const fragmentShader = `
varying vec2 vUv;
uniform sampler2D uPositions;
uniform sampler2D uTexture;
uniform float uAspectRatio;

varying float vNoise;


void main() {

  vec2 st = vUv;
  st.x /= uAspectRatio;
  
  vec2 correctedUv = vUv;
  
  correctedUv.x *= uAspectRatio *2.0;
  
  vec3 rgb = texture2D(uPositions, vUv).rgb;
  vec3 image = texture2D(uTexture, vUv).rgb;
  
  float d = clamp(1.8 * distance(vUv, vec2(0.5)),0.0, 1.0);
  
  float strength = clamp(pow(1.0 - d, 2.0),0.0, 1.0) ;
  float noise = ((vNoise *0.1)  + strength) * 5.0;

  gl_FragColor = vec4(image, noise * step(0.5,(1.0 - rgb.r)));
}
`

export default fragmentShader
