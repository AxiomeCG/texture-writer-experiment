import {Html, Plane, useFBO, useTexture} from '@react-three/drei';
import {createPortal, extend, useFrame, useThree} from '@react-three/fiber';
import {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {Vector2} from 'three';
import SimulationMaterial from './SimulationMaterial.js';
import fragmentShader from './fragmentShader.js';
import vertexShader from './vertexShader.js';
import {damp2, dampAngle} from 'maath/easing';
import state from './state.js';
import {useSnapshot} from 'valtio';
import gsap from 'gsap';

extend({SimulationMaterial: SimulationMaterial});

export const TextureWriter = () => {
  const size = 2048;

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)

  const snapshot = useSnapshot(state);
  // This reference gives us direct access to our points
  // const points = useRef();
  const simulationMaterialRef = useRef();
  const debugMeshBasicMaterialRef = useRef();

  // Create a camera and a scene for our FBO
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

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
  const renderTarget1 = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const renderTarget2 = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const isRenderTarget1 = useRef(true);

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
      uTexture: {
        value: null,
      },
      uAspectRatio: {
        value: window.innerWidth / window.innerHeight,
      },
      uTime: {
        value: null,
      },


    }),
    []
  );
  let savedTexture = null;

  const points = useRef();

  const isFirstTimeRef = useRef(true);
  const currentRenderTargetRef = useRef(renderTarget1);
  const previousRenderTargetRef = useRef(renderTarget2)

  const targetAngleRef = useRef(0);

  function pingPong() {
    const temp = currentRenderTargetRef.current;
    currentRenderTargetRef.current = previousRenderTargetRef.current;
    previousRenderTargetRef.current = temp
  }

  const previousMouseRef = useRef(new Vector2(0, 0));
  const oldAngleRef = useRef(0);
  const isMouseStaticRef = useRef(true);
  const isMouseClicked = useRef(false);

  const textures = useTexture(['/project1.png', '/project2.png']);

  useEffect(() => {
    const onPointerDown = () => {
      isMouseClicked.current = true
    }

    const onPointerUp = () => {
      isMouseClicked.current = false
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('pointerup', onPointerUp)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerup', onPointerDown)
    }
  }, []);

  const brushSizeRef = useRef(0.3);

  useFrame((state, delta) => {
    const {gl, clock} = state;
    gl.autoClear = false;

    damp2(simulationMaterialRef.current.uniforms.uMouse.value, new Vector2(state.mouse.x, state.mouse.y), 0.01, delta);


    isMouseStaticRef.current = (state.mouse.x === previousMouseRef.current.x && state.mouse.y === previousMouseRef.current.y) || simulationMaterialRef.current.uniforms.uClearFactor.value > 1 ;
    //const newAngle = Math.atan2(state.mouse.x - previousMouseRef.current.x, state.mouse.y - previousMouseRef.current.y);

    targetAngleRef.current = Math.atan2(state.mouse.x - previousMouseRef.current.x, state.mouse.y - previousMouseRef.current.y);


    if (!isMouseStaticRef.current) {
      dampAngle(oldAngleRef, 'current', targetAngleRef.current, 0.05, delta);
    } else {
    }
    simulationMaterialRef.current.uniforms.uAngle.value = oldAngleRef.current;
    simulationMaterialRef.current.uniforms.uIsStaticMouse.value = isMouseStaticRef.current;
    simulationMaterialRef.current.uniforms.uBrushSize.value = brushSizeRef.current;

    previousMouseRef.current.set(state.mouse.x, state.mouse.y);


    if (!isFirstTimeRef.current) {
      simulationMaterialRef.current.uniforms.positions.value = previousRenderTargetRef.current.texture;
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
    points.current.material.uniforms.uPositions.value = previousRenderTargetRef.current.texture;
    points.current.material.uniforms.uTexture.value = textures[snapshot.projectList[snapshot.currentProjectIndex].thumbnail];
    points.current.material.uniforms.uAspectRatio.value = window.innerWidth / window.innerHeight;
    points.current.material.uniforms.uTime.value = clock.getElapsedTime();

    debugMeshBasicMaterialRef.current.map = previousRenderTargetRef.current.texture;


    // Set the current render target to our FBO
    gl.setRenderTarget(currentRenderTargetRef.current);
    gl.render(scene, camera);

    gl.setRenderTarget(null);
    pingPong();

    isFirstTimeRef.current = false;
  });

  const {viewport} = useThree();

  const clearAnimation = () => {
    simulationMaterialRef.current.uniforms.uClearFactor.value = 5;
  }

  return (
    <>
      {/* Render off-screen our simulation material and square geometry */}
      {createPortal(
        <Plane args={[2, 2, 64, 64]} position={[0, 0, -0.01]}>
          <simulationMaterial ref={simulationMaterialRef} args={[size]}/>

        </Plane>,
        scene
      )}
      {/*<mesh>*/}
      {/*  <meshBasicMaterial ref={meshBasicMaterialRef} />*/}
      {/*  <bufferGeometry>*/}
      {/*    <bufferAttribute*/}
      {/*      attach="attributes-position"*/}
      {/*      count={positions.length / 3}*/}
      {/*      array={positions}*/}
      {/*      itemSize={3}*/}
      {/*    />*/}
      {/*    <bufferAttribute*/}
      {/*      attach="attributes-uv"*/}
      {/*      count={uvs.length / 2}*/}
      {/*      array={uvs}*/}
      {/*      itemSize={2}*/}
      {/*    />*/}
      {/*  </bufferGeometry>*/}
      {/*</mesh>*/}

      <Plane visible={false}>
        <meshBasicMaterial ref={debugMeshBasicMaterialRef}/>
      </Plane>

      <Plane ref={points} args={[viewport.width, viewport.height, 128, 128]} position={[0, 0, -0.2]}>
        <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader}/>
      </Plane>
      <Html>
        <button onClick={() => {
          gsap.timeline().to('.text', {
            opacity: 0,
            duration: 2,
            onStart: () => clearAnimation(),
            onComplete: () => {
              state.currentProjectIndex = snapshot.currentProjectIndex === 0 ? snapshot.projectList.length - 1 : snapshot.currentProjectIndex - 1;
            }
          }).to('.text', {
            opacity: 1,
            duration: 1,
            delay: 1,

          }).set(simulationMaterialRef.current.uniforms.uClearFactor, {
            value: 1,
          })
        }}>{'<-'}</button>
        <button onClick={() => {
          clearAnimation()
          state.currentProjectIndex = (snapshot.currentProjectIndex + 1) % snapshot.projectList.length
        }}>{'->'}</button>
      </Html>

    </>
  );
};
