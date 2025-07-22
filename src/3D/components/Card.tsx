import * as THREE from "three";
import { useRef } from "react";
import { Euler, ThreeEvent, useFrame, Vector3 } from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { easing } from "maath";

type EventHandler<Event> = (
  e: ThreeEvent<Event>,
  mesh: THREE.Mesh | null
) => void;

interface Props {
  url: string;
  position: Vector3;
  rotation: Euler;
  bent?: number;

  onPointerOver?: EventHandler<PointerEvent>;
  onPointerOut?: EventHandler<PointerEvent>;
  onClick?: EventHandler<MouseEvent>;
}

const Card = ({
  url,
  position,
  rotation,
  bent = 0,

  onPointerOver,
  onPointerOut,
  onClick,
}: Props) => {
  const ref = useRef<THREE.Mesh>(null);
  const isHover = useRef(false);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onPointerOver?.(e, ref.current);
    isHover.current = true;
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    onPointerOut?.(e, ref.current);
    isHover.current = false;
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    onClick?.(e, ref.current);
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
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      position={position}
      rotation={rotation}
    >
      {bent !== 0 && <bentPlaneGeometry args={[bent, 1, 1, 20, 20]} />}
    </Image>
  );
};

export default Card;
