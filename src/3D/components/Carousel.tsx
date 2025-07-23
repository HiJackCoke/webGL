import * as THREE from "three";

import { useRef, useState } from "react";
import { Vector3, Euler, useFrame } from "@react-three/fiber";
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

  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);
  const selectedMeshRef = useRef<RefProps | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCardClick = (card: T) => {
    if (selectedId === card.id) {
      setSelectedId(null);
    } else {
      setSelectedId(card.id);
    }

    onCardClick?.(card);
  };

  const handleAnimation = (
    index: number,
    position: Vector3,
    rotation: Euler
  ) => {
    const mesh = meshesRef.current[index];
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
    if (!selectedMeshRef.current.mesh.parent) return;

    easing.damp3(
      selectedMeshRef.current.mesh.position,
      [0, 0.1, 0],
      0.1,
      delta
    );
    easing.damp3(selectedMeshRef.current.mesh.scale, SCALE + 1, 0.1, delta);

    meshesRef.current.forEach((mesh) => {
      if (!mesh || mesh?.uuid === selectedMeshRef.current?.mesh.uuid) return;
      if (Array.from(mesh.scale).some((scale) => scale === 0)) return;

      if (mesh.scale.x < 0.01) {
        mesh.scale.setScalar(0);

        return;
      }
      easing.damp3(mesh.scale, mesh.scale.x - 0.4, 0.1, delta);
    });
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
        ref={(el) => (meshesRef.current[index] = el)}
        url={imageUrl}
        animation={!selectedId}
        bent={-0.1}
        position={position}
        rotation={rotation}
        onPointerOver={() => onCardPointerOver?.(card)}
        onPointerOut={() => onCardPointerOut?.(card)}
        onClick={() => {
          handleCardClick(card);
          handleAnimation(index, position, rotation);
        }}
      />
    );
  });
};

export default Carousel;
