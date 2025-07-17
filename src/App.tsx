import { Canvas } from "@react-three/fiber";
import { Environment, ScrollControls } from "@react-three/drei";

import Rig from "./components/Rig";
import Card from "./components/Card";

const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
      <ScrollControls pages={5} infinite>
        <Rig rotation={[0, 0, 0.15]}>
          <Card
            url={"/img1_.jpg"}
            position={[0, 0, 1]}
            rotation={[0, Math.PI, 0]}
          />
        </Rig>
      </ScrollControls>
      <Environment preset="dawn" background blur={0.5} />
    </Canvas>
  );
};

export default App;
