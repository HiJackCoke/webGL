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
  vertical?: boolean;

  onCardPointerOver?: (params: EventParams<T>) => void;
  onCardPointerOut?: (params: EventParams<T>) => void;
  onCardClick?: (params: EventParams<T>) => void;
  onCardClose?: (params: EventParams<T>) => void;
};

interface CardMeshRef {
  mesh: THREE.Mesh;
  originPosition: THREE.Vector3Tuple;
}

interface AnimationRef {
  navigation: number;
  scroll: number;
}

const SCALE = 1;
const EPSILON = 0.001;

const Carousel = <T extends CardType>({
  cards,
  radius,
  vertical = false,

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
  const selectedMeshRef = useRef<CardMeshRef | null>(null);
  const selectedUUIDRef = useRef<
    THREE.Object3D<THREE.Object3DEventMap>["uuid"] | null
  >(null);

  const navigateRef = useRef("");
  const animationRef = useRef<AnimationRef>({
    navigation: 0,
    scroll: 0,
  });

  const handleClose = (card: T) => () => {
    selectedUUIDRef.current = null;
    onCardClose?.(card);
  };

  const handleClick =
    (card: T, position: THREE.Vector3Tuple) =>
    (_: unknown, mesh: THREE.Mesh | null) => {
      if (!mesh) return;

      if (selectedUUIDRef.current === mesh.uuid) return;

      const animate = () => {
        const index = meshesRef.current.findIndex(
          (mesh) => mesh?.uuid === selectedUUIDRef.current
        );

        const targetOffset = (index / cards.length) % 1;
        const realScrollPages = scroll.pages + 1;

        const top =
          (scroll.el.scrollHeight / realScrollPages) *
          scroll.pages *
          targetOffset;

        scroll.el.scrollTo({
          top,
          behavior: "smooth",
        });

        animationRef.current.scroll = targetOffset;
        selectedMeshRef.current = {
          mesh,
          originPosition: position,
        };
        scroll.el.style.pointerEvents = "none";
      };

      selectedUUIDRef.current = mesh.uuid;
      onCardClick?.(card);
      animate();
    };

  const handleDetail = (card: T) => () => {
    navigateRef.current = `/card/${card.id}`;
  };

  const animateNavigation = (card: CardMeshRef, delta: number) => {
    if (!navigateRef.current) return;
    if (!card) return;

    const rig = card.mesh.parent;
    if (!rig) return;

    const originRotation = new THREE.Euler(0, 0, 0);

    easing.dampE(card.mesh.rotation, originRotation, 0.1, delta);
    // 스크롤 위치 강제 전환x
    scroll.offset = 0;

    const isCenter =
      Math.abs(
        (animationRef.current.navigation % 1) - (card.mesh.rotation.y % 1)
      ) < EPSILON;

    if (isCenter) {
      navigate(navigateRef.current);
    }

    animationRef.current.navigation = card.mesh.rotation.y;
  };

  const animateRotation = (
    card: CardMeshRef,
    isOff: boolean,
    delta: number
  ) => {
    const selectedMeshScale = SCALE + 0.8;

    const isCompleted = selectedMeshRef.current?.mesh.scale.equals(
      new THREE.Vector3(selectedMeshScale, selectedMeshScale, selectedMeshScale)
    );

    if (isCompleted) {
      scroll.el.style.pointerEvents = "";
    }

    meshesRef.current.forEach((mesh) => {
      if (!mesh) return;

      if (mesh.uuid === card.mesh.uuid) {
        easing.damp3(mesh.scale, isOff ? 1 : selectedMeshScale, 0.1, delta);
      } else {
        easing.damp3(mesh.scale, isOff ? 1 : 0, 0.1, delta);
      }
    });
  };

  const animate = (card: CardMeshRef, delta: number) => {
    if (!card?.mesh.parent) return;

    const isOff = selectedUUIDRef.current === null;

    const originPosition = new THREE.Vector3(...card.originPosition);
    const originScale = new THREE.Vector3(1, 1, 1);

    if (isOff) {
      const isPositionEquals = card.mesh.position.equals(originPosition);
      const isScaleEquals = card.mesh.scale.equals(originScale);

      if (isPositionEquals && isScaleEquals) {
        selectedMeshRef.current = null;
        return;
      }

      easing.damp3(card.mesh.position, originPosition, 0.1, delta);
      animateRotation(card, isOff, delta);
    } else {
      const isCenter =
        Math.abs((scroll.offset % 1) - (animationRef.current.scroll % 1)) <
        EPSILON;

      if (isCenter) {
        easing.damp3(card.mesh.position, [0, 0, 0], 0.1, delta);
        animateRotation(card, isOff, delta);
      }
    }
  };

  useFrame((_, delta) => {
    const card = selectedMeshRef.current;

    if (!card) return;

    animateNavigation(card, delta);
    animate(card, delta);
  });

  return cards.map((card, index) => {
    const { id, imageUrl } = card;

    const circlePosition = Math.sin((index / count) * Math.PI * 2) * baseRadius;
    const circleRotation = (index / count) * Math.PI * 2;

    const position: THREE.Vector3Tuple = [
      vertical ? 0 : circlePosition,
      vertical ? -circlePosition : 0,
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
        rotation={[
          vertical ? circleRotation : 0,
          vertical ? 0 : circleRotation,
          0,
        ]}
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
