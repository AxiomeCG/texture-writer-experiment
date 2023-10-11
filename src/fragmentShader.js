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
  correctedUv.x *= uAspectRatio * 2.0;
  
  vec3 rgb = texture2D(uPositions, vUv).rgb;
  vec3 image = texture2D(uTexture, vUv).rgb;
  
  float d = clamp(1.8 * distance(vUv, vec2(0.5)), 0.0, 1.0);
  float strength = clamp(pow(1.0 - d, 2.0), 0.0, 1.0);
  float noise = ((vNoise * 0.1)  + strength) * 5.0;

  // Calculate gradient for the rgb.r value
  
  
  vec2 randomOffset1 = vec2(vNoise, vNoise) * 0.01;  // Adjust 0.01 for stronger/weaker randomness
  vec2 randomOffset2 = vec2(1.0 - vNoise, vNoise) * 0.01;

  float borderSize = 0.075;
  float gradientX = texture2D(uPositions, vUv + vec2(borderSize, 0.0) + randomOffset1).r - texture2D(uPositions, vUv - vec2(borderSize, 0.0) + randomOffset2).r;
  float gradientY = texture2D(uPositions, vUv + vec2(0.0, borderSize) + randomOffset1).r - texture2D(uPositions, vUv - vec2(0.0, borderSize) + randomOffset2).r;

  float gradientMagnitude = length(vec2(gradientX, gradientY));
  gradientMagnitude *= (1.0 + 0.5 * vNoise);  // Adjust 0.5 for stronger/weaker effect

  vec3 inkColor = vec3(0.0, 0.0, 0.0);
  vec3 blendedImage = mix(image, inkColor, step(0.35, gradientMagnitude));
  
  gl_FragColor = vec4(blendedImage, step(0.35, (1.0 - rgb.r)));
}
`

export default fragmentShader
