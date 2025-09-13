import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import { Outlet } from "react-router-dom";

import "../../3D";

const Index = () => {
  return (
    <>
      <div id="html" />
      <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
        <Outlet />
        <Environment preset="dawn" background blur={0.5} />
      </Canvas>
    </>
  );
};

export default Index;
