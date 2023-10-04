const fragmentShader = `
varying vec3 vPosition;

void main() {
  //vec3 color = mix(vec3(0.25),vec3(0.867,0.847,0.812) , pow( clamp(vPosition.y *2.0,0.0,1.0),2.0));
  vec3 color = vec3(0.867,0.847,0.812);
  gl_FragColor = vec4(color, 1.0);
}
`

export default fragmentShader
