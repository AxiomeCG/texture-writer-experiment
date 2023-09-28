import { Canvas, useFrame } from "@react-three/fiber";
import "./App.scss";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { FBOParticles } from "./TextureWriter";

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
      <Canvas camera={{position: [0,0,1]}}>
        <color attach={"background"} args={["#1d2262"]}/>
        <Scene/>
        <pointLight position={[0, 5, 0]} intensity={1} color="white"/>
      </Canvas>
    </>
  );
}

export default App;
