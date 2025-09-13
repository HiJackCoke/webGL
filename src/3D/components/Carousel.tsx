import * as THREE from "three";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

import Card from "./Card";
import { Card as CardType } from "@/types/constants";
import { useNavigate } from "react-router-dom";
import { useScroll } from "@react-three/drei";

type EventParams<T> = T;

type Props<T extends CardType> = {
  cards: T[];
  radius?: number;

  onCardPointerOver?: (params: EventParams<T>) => void;
  onCardPointerOut?: (params: EventParams<T>) => void;
  onCardClick?: (params: EventParams<T>) => void;
  onCardClose?: (params: EventParams<T>) => void;
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
  onCardClose,
}: Props<T>) => {
  const count = cards.length;
  const baseRadius = radius ?? count / 5;

  const navigate = useNavigate();
  const scroll = useScroll();

  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);
  const selectedMeshRef = useRef<RefProps | null>(null);
  const selectedUUIDRef = useRef<
    THREE.Object3D<THREE.Object3DEventMap>["uuid"] | null
  >(null);
  const navigateRef = useRef("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = (card: T) => () => {
    selectedUUIDRef.current = null;
    onCardClose?.(card);
  };

  const handleClick =
    (card: T, position: THREE.Vector3Tuple) =>
    (_: unknown, mesh: THREE.Mesh | null) => {
      // selectedCardRef.current = card;

      if (!mesh) return;

      if (selectedUUIDRef.current !== mesh.uuid) {
        selectedUUIDRef.current = mesh.uuid;
        onCardClick?.(card);
      }

      selectedMeshRef.current = {
        mesh,
        originPosition: position,
      };
    };

  const handleDetail = (card: T) => () => {
    navigateRef.current = `/card/${card.id}`;
  };

  useFrame((_, delta) => {
    if (navigateRef.current) {
      const card = selectedMeshRef.current?.mesh;

      if (!card) return;

      const rig = card.parent;
      if (!rig) return;

      const originRotation = new THREE.Euler(0, 0, 0);

      easing.dampE(card.rotation, originRotation, 0.1, delta);
      scroll.offset = 0;

      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          navigate(navigateRef.current);
          timeoutRef.current = null;
        }, 300);
      }
    }

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
      isOff ? originPosition : [0, 0, 0],
      0.1,
      delta
    );

    meshesRef.current.forEach((mesh) => {
      if (!mesh) return;

      if (mesh.uuid === selectedMeshRef.current?.mesh.uuid) {
        easing.damp3(mesh.scale, isOff ? 1 : SCALE + 0.8, 0.1, delta);
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
        isSelected={isSelected}
        bent={isSelected ? 0 : -0.1}
        zoom={isSelected ? 1 : 1.5}
        position={position}
        rotation={[0, (index / count) * Math.PI * 2, 0]}
        onPointerOver={() => onCardPointerOver?.(card)}
        onPointerOut={() => onCardPointerOut?.(card)}
        onClick={handleClick(card, position)}
        onClose={handleClose(card)}
        onDetail={handleDetail(card)}
      />
    );
  });
};

export default Carousel;
