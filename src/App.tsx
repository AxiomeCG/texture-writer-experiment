import { Canvas, useFrame } from "@react-three/fiber";
import "./App.scss";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { FBOParticles } from "./TextureWriter";
import { EffectComposer, N8AO } from "@react-three/postprocessing";

const Scene = () => {
  const sphereRef = useRef<any>(null!);
  const uniforms = useMemo(() => ({
    uTime: {
      value: 0.0
    },
    // Add any other attributes here
  }), [])

  useFrame((state) => {
  });

  return <>
    <FBOParticles/>
  </>
}


function App() {
  return (
    <>
      <div className={"text-container"}>
        <span className={"text"}>Anything World</span>

      </div>
      <Canvas camera={{position: [0,0,1]}}>
        <Scene/>
        <OrbitControls enabled={false}/>
        <pointLight position={[0, 5, 0]} intensity={1} color="white"/>
        <EffectComposer>
          <N8AO intensity={10} halfRes={false}/>
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
