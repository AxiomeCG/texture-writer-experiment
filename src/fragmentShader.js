const fragmentShader = `
varying vec3 vPosition;

void main() {
  vec3 color = mix(vec3(0.5,0.5,0.5),vec3(0.867,0.847,0.812) , clamp(vPosition.z * (10.0),0.0,1.0));
  gl_FragColor = vec4(color, 1.0);
}
`

export default fragmentShader
