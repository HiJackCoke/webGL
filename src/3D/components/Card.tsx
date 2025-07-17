import * as THREE from "three";
import { useRef } from "react";
import { Euler, ThreeEvent, useFrame, Vector3 } from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { easing } from "maath";

interface Props {
  url: string;
  position: Vector3;
  rotation: Euler;
}

const Card = ({ url, position, rotation }: Props) => {
  const ref = useRef<THREE.Mesh>(null);
  const isHover = useRef(false);

  const pointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isHover.current = true;
  };
  const pointerOut = () => {
    isHover.current = false;
  };

  useFrame((_, delta) => {
    if (!ref.current) return;

    easing.damp3(ref.current.scale, isHover.current ? 1.15 : 1, 0.1, delta);
    easing.damp(
      ref.current.material,
      "radius",
      isHover ? 0.25 : 0.1,
      0.2,
      delta
    );
    easing.damp(
      ref.current.material,
      "zoom",
      isHover.current ? 1 : 1.5,
      0.2,
      delta
    );
  });

  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      position={position}
      rotation={rotation}
    >
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  );
};

export default Card;
