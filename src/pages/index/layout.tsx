import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import { Outlet } from "react-router-dom";

import "../../3D";
import { isMobileDevice } from "@/utils";

const Index = () => {
  return (
    <>
      <div id="html" className="w-screen h-screen overflow-scroll absolute" />

      <Canvas
        camera={{ position: [0, 0, 100], fov: 15 }}
        // shadows={{
        //   type: isMobileDevice ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap,
        // }}
        dpr={isMobileDevice ? [1, 1.5] : [1, 2]}
        performance={
          isMobileDevice ? { min: 0.5, max: 0.8 } : { min: 1, max: 1 }
        }
      >
        <Outlet />
        <Environment preset="park" background blur={0.5} />
      </Canvas>
    </>
  );
};

export default Index;
