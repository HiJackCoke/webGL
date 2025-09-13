import { ScrollControls } from "@react-three/drei";

import * as THREE from "three";
import { easing } from "maath";

import { useEffect, useRef } from "react";
import Rig from "@/3D/components/Rig";

import cards from "@/constants/cards";
import Card from "@/3D/components/Card";
import { useFrame } from "@react-three/fiber";
import { useNavigate, useParams } from "react-router-dom";

const Index = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const ref = useRef<THREE.Mesh | null>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    easing.damp3(ref.current.scale, 2, 0.1, delta);
  });

  const card = cards.find((card) => card.id === Number(params.id));

  useEffect(() => {
    if (!card) {
      navigate("/", {
        flushSync: true,
        viewTransition: true,
      });
    }
  }, []);

  if (!card) return null;

  return (
    <ScrollControls prepend={true}>
      <Rig rotation={[0, 0, 0]}>
        <Card
          animation={false}
          ref={ref}
          url={card.imageUrl}
          bent={0}
          scale={1.8}
          radius={0.1}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
        />
      </Rig>
    </ScrollControls>
  );
};

export default Index;
