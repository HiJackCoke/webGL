import * as THREE from "three";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Euler, ThreeEvent, useFrame } from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { easing } from "maath";

type EventHandler<Event> = (
  e: ThreeEvent<Event>
  // mesh: THREE.Mesh | null
) => void;

interface Props {
  url: string;

  animation?: boolean;
  position: THREE.Vector3Tuple;
  rotation: Euler;
  bent?: number;
  zoom?: number;
  radius?: number;
  scale?: number;

  onPointerOver?: EventHandler<PointerEvent>;
  onPointerOut?: EventHandler<PointerEvent>;
  onClick?: EventHandler<MouseEvent>;
}

const Card = forwardRef<THREE.Mesh, Props>(
  (
    {
      url,
      position,
      rotation,
      animation = true,
      bent = 0,
      zoom = 1,
      radius = 0.1,
      scale = 1,

      onPointerOver,
      onPointerOut,
      onClick,
    },
    ref
  ) => {
    const imageRef = useRef<THREE.Mesh>(null);
    const isHover = useRef(false);

    const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onPointerOver?.(e);
      isHover.current = true;
    };

    const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
      onPointerOut?.(e);
      isHover.current = false;
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();

      onClick?.(e);
    };

    useFrame((_, delta) => {
      if (!animation) return;
      if (!imageRef.current) return;

      easing.damp3(
        imageRef.current.scale,
        isHover.current ? 1.15 : scale,
        0.1,
        delta
      );
      easing.damp(
        imageRef.current.material,
        "radius",
        isHover ? 0.25 : radius,
        0.2,
        delta
      );
      easing.damp(
        imageRef.current.material,
        "zoom",
        isHover.current ? 1 : zoom,
        0.2,
        delta
      );
    });

    useImperativeHandle(ref, () => imageRef.current as THREE.Mesh);

    return (
      <Image
        ref={imageRef}
        url={url}
        transparent
        side={THREE.DoubleSide}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        radius={radius}
        zoom={zoom}
        scale={scale}
        position={position}
        rotation={rotation}
      >
        {bent !== 0 && <bentPlaneGeometry args={[bent, 1, 1, 20, 20]} />}
      </Image>
    );
  }
);

export default Card;
