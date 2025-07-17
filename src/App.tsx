import { Canvas } from "@react-three/fiber";
import { Environment, Image, ScrollControls } from "@react-three/drei";

import Rig from "./components/Rig";

const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
      <ScrollControls pages={5} infinite>
        <Rig rotation={[0, 0, 0.15]}>
          <Image url={`/img1_.jpg`} />
        </Rig>
      </ScrollControls>
      <Environment preset="dawn" background blur={0.5} />
    </Canvas>
  );
};

export default App;
