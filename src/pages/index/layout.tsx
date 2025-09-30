import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import { Outlet } from "react-router-dom";

import ScrollHint from "@/3D/components/ScrollHint";
import "../../3D";

const Index = () => {
  return (
    <>
      <div id="html" className="w-screen h-screen overflow-scroll absolute" />
      <ScrollHint />

      <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
        <Outlet />
        <Environment preset="park" background blur={0.5} />
      </Canvas>
    </>
  );
};

export default Index;
