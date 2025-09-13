import * as THREE from "three";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Euler, ThreeEvent, useFrame } from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { easing } from "maath";
import Button from "./Button";

type EventHandler<Event> = (
  e: ThreeEvent<Event>,
  mesh: THREE.Mesh | null
) => void;

interface Props {
  url: string;

  isSelected?: boolean;
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
  onClose?: EventHandler<MouseEvent>;
  onDetail?: EventHandler<MouseEvent>;
}

const Card = forwardRef<THREE.Mesh, Props>(
  (
    {
      url,

      isSelected = false,
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
      onClose,
      onDetail,
    },
    ref
  ) => {
    const imageRef = useRef<THREE.Mesh>(null);
    const isHover = useRef(false);

    const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onPointerOver?.(e, imageRef.current);
      isHover.current = true;
    };

    const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
      onPointerOut?.(e, imageRef.current);
      isHover.current = false;
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();

      onClick?.(e, imageRef.current);
    };

    const handleClose = (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();

      onClose?.(e, imageRef.current);
    };

    const handleDetail = (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();

      onDetail?.(e, imageRef.current);
    };

    useFrame((_, delta) => {
      if (!animation) return;
      if (!imageRef.current) return;

      // easing.damp3(
      //   imageRef.current.scale,
      //   isHover.current ? 1.15 : scale,
      //   0.1,
      //   delta
      // );

      easing.damp(
        imageRef.current.material,
        "radius",
        isHover.current && bent !== 0 ? 0.25 : radius,
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
      <>
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
          {!isSelected && bent !== 0 && (
            <bentPlaneGeometry args={[bent, 1, 1, 20, 20]} />
          )}

          <Button
            visible={isSelected}
            label="🔍"
            width={0.15}
            height={0.15}
            depth={0.15}
            radius={0.075}
            position={[-0.4, 0.4, 0]}
            onClick={handleDetail}
          />

          <Button
            variant="danger"
            visible={isSelected}
            label="✖"
            width={0.15}
            height={0.15}
            depth={0.15}
            radius={0.075}
            position={[0.4, 0.4, 0]}
            onClick={handleClose}
          />
        </Image>
      </>
    );
  }
);

export default Card;
