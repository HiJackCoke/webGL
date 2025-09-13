import { Html, ScrollControls } from "@react-three/drei";

import * as THREE from "three";
import { easing } from "maath";

import { useRef } from "react";
import Rig from "@/3D/components/Rig";

import cards from "@/constants/cards";
import Card from "@/3D/components/Card";
import { useFrame } from "@react-three/fiber";

const Index = () => {
  const ref = useRef<THREE.Mesh | null>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    easing.damp3(ref.current.scale, 2, 0.1, delta);
  });

  const card = cards.find((card) => card.id === 1);

  return (
    <ScrollControls prepend={true}>
      <Rig rotation={[0, 0, 0]}>
        <Card
          // animation={false}
          ref={ref}
          url={cards[0].imageUrl}
          bent={-0.1}
          zoom={1}
          scale={2}
          radius={0.5}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          //   onPointerOver={() => onCardPointerOver?.(card)}
          //   onPointerOut={() => onCardPointerOut?.(card)}
          //   onClick={handleClick(card, position)}
        />
        {/* <Carousel
          cards={cards}
          onCardClick={() => setIsSelected(!isSelected)}
        /> */}
      </Rig>
    </ScrollControls>
  );
};

export default Index;
