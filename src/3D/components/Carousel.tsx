import * as THREE from "three";

import { useRef } from "react";
import { Vector3, Euler, useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { easing } from "maath";

import Card from "./Card";

import { Card as CardType } from "@/types/constants";

type EventParams<T> = T;

type Props<T extends CardType> = {
  cards: T[];
  radius?: number;

  onCardPointerOver?: (params: EventParams<T>) => void;
  onCardPointerOut?: (params: EventParams<T>) => void;
  onCardClick?: (params: EventParams<T>) => void;
};

interface RefProps {
  mesh: THREE.Mesh;
  originPosition: Vector3;
  originRotation: Euler;
}

const SCALE = 1;

const Carousel = <T extends CardType>({
  cards,
  radius,
  onCardPointerOver,
  onCardPointerOut,
  onCardClick,
}: Props<T>) => {
  const count = cards.length;
  const baseRadius = radius ?? count / 5;

  const selectedMeshRef = useRef<RefProps | null>(null);
  const scroll = useScroll();

  const handleCardClick = (card: T) => {
    onCardClick?.(card);
  };

  const handleAnimation = (
    mesh: THREE.Mesh | null,
    position: Vector3,
    rotation: Euler
  ) => {
    if (!mesh) return;

    if (selectedMeshRef.current) {
      const hackedVector3 = JSON.parse(
        JSON.stringify(selectedMeshRef.current.originPosition)
      ) as [number, number, number];
      const hackedEuler = JSON.parse(
        JSON.stringify(selectedMeshRef.current.originRotation)
      ) as [number, number, number];

      selectedMeshRef.current.mesh.position.set(...hackedVector3);
      selectedMeshRef.current.mesh.rotation.set(...hackedEuler);

      if (mesh.uuid === selectedMeshRef.current.mesh.uuid) {
        selectedMeshRef.current = null;
        return;
      }
    }

    selectedMeshRef.current = {
      mesh,
      originPosition: position,
      originRotation: rotation,
    };
  };

  useFrame((_, delta) => {
    if (!selectedMeshRef.current) return;

    easing.damp3(
      selectedMeshRef.current.mesh.position,
      [0, 0.3, 0],
      0.1,
      delta
    );
    easing.damp3(selectedMeshRef.current.mesh.scale, SCALE + 1.5, 0.1, delta);
    selectedMeshRef.current.mesh.rotation.y = scroll.offset * (Math.PI * 2);
  });

  return cards.map((card, index) => {
    const { id, imageUrl } = card;

    const position: Vector3 = [
      Math.sin((index / count) * Math.PI * 2) * baseRadius,
      0,
      Math.cos((index / count) * Math.PI * 2) * baseRadius,
    ];
    const rotation: Euler = [0, (index / count) * Math.PI * 2, 0];

    return (
      <Card
        key={id}
        url={imageUrl}
        bent={-0.1}
        position={position}
        rotation={rotation}
        onPointerOver={() => onCardPointerOver?.(card)}
        onPointerOut={() => onCardPointerOut?.(card)}
        onClick={(_, mesh) => {
          handleCardClick(card);
          handleAnimation(mesh, position, rotation);
        }}
      />
    );
  });
};

export default Carousel;
