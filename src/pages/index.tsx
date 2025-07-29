import { Canvas } from "@react-three/fiber";
import { Environment, ScrollControls } from "@react-three/drei";

import Rig from "../3D/components/Rig";
import Carousel from "../3D/components/Carousel";
import Banner from "../3D/components/Banner";

import cards from "../constants/cards";

import "../3D";
import { useState } from "react";

const Index = () => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
      <fog attach="fog" args={["#a79", 8.5, 12]} />
      <ScrollControls pages={5} infinite>
        <Rig rotation={[0, 0, isSelected ? 0 : 0.15]}>
          <Carousel
            cards={cards}
            onCardClick={() => setIsSelected(!isSelected)}
          />
        </Rig>
        <Banner
          position={[0, -0.15, 0]}
          radius={isSelected ? 0 : cards.length / 5 + 0.2}
        />
      </ScrollControls>
      <Environment preset="dawn" background blur={0.5} />
    </Canvas>
  );
};

export default Index;
