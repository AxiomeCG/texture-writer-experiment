import { Canvas } from "@react-three/fiber";
import "./App.scss";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { TextureWriter } from "./TextureWriter";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { useSnapshot } from "valtio";
import state from "./state";

interface IProject {
  name: string,
  client: string,
  year: string,
  thumbnail: number
}

const Scene = () => {
  return <>
    <TextureWriter/>
  </>
}



function App() {


  const sceneRef = useRef();
  const snapshot = useSnapshot(state);
  return (
    <>
      <nav className={"navigation"}>
        <div className={"navigation__wrapper"}>
          <div className={"navigation__branding"}>
            <img src={"/logo.svg"}/>
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
      <span className={"text"}>{snapshot.projectList[snapshot.currentProjectIndex].name}</span>

      <div className={"text-container"}>

        <button>Discover</button>


      </div>
      <Canvas camera={{position: [0, 0, 1]}}>
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
