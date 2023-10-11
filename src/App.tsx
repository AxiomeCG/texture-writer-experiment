import { Canvas, useFrame } from "@react-three/fiber";
import "./App.scss";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { TextureWriter } from "./TextureWriter";
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
    <TextureWriter/>
  </>
}


function App() {
  return (
    <>
      <nav className={"navigation"}>
        <div className={"navigation__wrapper"}>
          <div className={"navigation__branding"}>
            <img src={'/logo.svg'}/>
            <span className={"navigation__branding__title"}>Adam NAILI</span>
          </div>
          <div className={"navigation__links"}>
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
      </nav>
      <span className={"text"}>Anything World</span>

      <div className={"text-container"}>
        <button>Discover</button>

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
