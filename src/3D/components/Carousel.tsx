import * as THREE from "three";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
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
  originPosition: THREE.Vector3Tuple;
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
  const selectedUUIDRef = useRef<
    THREE.Object3D<THREE.Object3DEventMap>["uuid"] | null
  >(null);

  const handleAnimation = (mesh: THREE.Mesh, position: THREE.Vector3Tuple) => {
    if (!mesh) return;

    if (selectedUUIDRef.current === mesh.uuid) {
      selectedUUIDRef.current = null;
    } else {
      selectedUUIDRef.current = mesh.uuid;
    }

    selectedMeshRef.current = {
      mesh,
      originPosition: position,
    };
  };

  const handleClick =
    (card: T, position: THREE.Vector3Tuple) =>
    (_: unknown, mesh: THREE.Mesh | null) => {
      onCardClick?.(card);

      if (!mesh) return;
      handleAnimation(mesh, position);
    };

  useFrame((_, delta) => {
    if (!selectedMeshRef.current?.mesh.parent) return;

    const isOff = selectedUUIDRef.current === null;

    const originPosition = new THREE.Vector3(
      ...selectedMeshRef.current.originPosition
    );
    const originScale = new THREE.Vector3(1, 1, 1);

    if (isOff) {
      const isPositionEquals =
        selectedMeshRef.current.mesh.position.equals(originPosition);
      const isScaleEquals =
        selectedMeshRef.current.mesh.scale.equals(originScale);

      if (isPositionEquals && isScaleEquals) {
        selectedMeshRef.current = null;
        return;
      }
    }

    easing.damp3(
      selectedMeshRef.current.mesh.position,
      isOff ? originPosition : [0, 0.1, 0],
      0.1,
      delta
    );

    meshesRef.current.forEach((mesh) => {
      if (!mesh) return;

      if (mesh.uuid === selectedMeshRef.current?.mesh.uuid) {
        easing.damp3(mesh.scale, isOff ? 1 : SCALE + 1, 0.1, delta);
      } else {
        easing.damp3(mesh.scale, isOff ? 1 : 0, 0.1, delta);
      }
    });
  });

  return cards.map((card, index) => {
    const { id, imageUrl } = card;

    const position: THREE.Vector3Tuple = [
      Math.sin((index / count) * Math.PI * 2) * baseRadius,
      0,
      Math.cos((index / count) * Math.PI * 2) * baseRadius,
    ];

    const isSelected =
      selectedUUIDRef.current === meshesRef.current[index]?.uuid;
    return (
      <Card
        key={id}
        ref={(el) => (meshesRef.current[index] = el)}
        url={imageUrl}
        bent={-0.1}
        zoom={isSelected ? 1 : 1.5}
        position={position}
        rotation={[0, (index / count) * Math.PI * 2, 0]}
        onPointerOver={() => onCardPointerOver?.(card)}
        onPointerOut={() => onCardPointerOut?.(card)}
        onClick={handleClick(card, position)}
      />
    );
  });
};

export default Carousel;
