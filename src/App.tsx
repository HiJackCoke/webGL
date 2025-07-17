import { Canvas } from "@react-three/fiber";
import { Environment, ScrollControls } from "@react-three/drei";

import Rig from "./components/Rig";
import Carousel from "./components/Carousel";

import cards from "./constants/cards";

import "./3D";

const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
      <ScrollControls pages={5} infinite>
        <Rig rotation={[0, 0, 0.15]}>
          <Carousel cards={cards} />
        </Rig>
      </ScrollControls>
      <Environment preset="dawn" background blur={0.5} />
    </Canvas>
  );
};

export default App;
