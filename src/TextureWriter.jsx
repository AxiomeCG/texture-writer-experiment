import {useFBO} from '@react-three/drei';
import {extend, useFrame} from '@react-three/fiber';
import {useMemo, useRef} from 'react';
import * as THREE from 'three';
import {Vector2} from 'three';
import SimulationMaterial from './SimulationMaterial.js';

extend({SimulationMaterial: SimulationMaterial});

export const FBOParticles = () => {
  const size = 128;

  // This reference gives us direct access to our points
  // const points = useRef();
  const simulationMaterialRef = useRef();

  // Create a camera and a scene for our FBO
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    1 / Math.pow(2, 53),
    1
  );

  // Create a simple square geometry with custom uv and positions attributes
  const positions = new Float32Array([
    -1,
    -1,
    0,
    1,
    -1,
    0,
    1,
    1,
    0,
    -1,
    -1,
    0,
    1,
    1,
    0,
    -1,
    1,
    0,
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  // Create our FBO render target
  const renderTarget = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  // Generate a "buffer" of vertex of size "size" with normalized coordinates
  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const uniforms = useMemo(
    () => ({
      uPositions: {
        value: null,
      },
    }),
    []
  );

  useFrame((state) => {
    const {gl, clock} = state;
    // Set the current render target to our FBO
    gl.setRenderTarget(renderTarget);
    gl.clear();
    // Render the simulation material with square geometry in the render target
    gl.render(scene, camera);
    // Revert to the default render target
    gl.setRenderTarget(null);

    // Read the position data from the texture field of the render target
    // and send that data to the final shaderMaterial via the `uPositions` uniform
    //points.current.material.uniforms.uPositions.value = renderTarget.texture;


    simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    simulationMaterialRef.current.uniforms.uMouse.value = new Vector2(state.mouse.x, -state.mouse.y);
  });

  return (
    <>
      {/* Render off-screen our simulation material and square geometry */}
      <mesh>
        <simulationMaterial ref={simulationMaterialRef} args={[size]}/>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-uv"
            count={uvs.length / 2}
            array={uvs}
            itemSize={2}
          />
        </bufferGeometry>
      </mesh>
      {/*<points ref={points}>*/}
      {/*  <bufferGeometry>*/}
      {/*    <bufferAttribute*/}
      {/*      attach="attributes-position"*/}
      {/*      count={particlesPosition.length / 3}*/}
      {/*      array={particlesPosition}*/}
      {/*      itemSize={3}*/}
      {/*    />*/}
      {/*  </bufferGeometry>*/}
      {/*  <shaderMaterial*/}
      {/*    blending={THREE.AdditiveBlending}*/}
      {/*    depthWrite={false}*/}
      {/*    fragmentShader={fragmentShader}*/}
      {/*    vertexShader={vertexShader}*/}
      {/*    uniforms={uniforms}*/}
      {/*  />*/}
      {/*</points>*/}
    </>
  );
};
