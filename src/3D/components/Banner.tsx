import * as THREE from "three";
import { useRef } from "react";
import { useFrame, Vector3 } from "@react-three/fiber";
import { useScroll, useTexture } from "@react-three/drei";

import { MeshSineMaterial } from "../materials/MeshSineMaterial";

interface Props {
  position: Vector3;
  radius?: number;
}

const Banner = ({ position, radius = 1.6 }: Props) => {
  const ref = useRef<THREE.Mesh<THREE.BufferGeometry, MeshSineMaterial>>(null);
  const scroll = useScroll();
  const texture = useTexture("/tech_stack_row.png");

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame((_, delta) => {
    if (!ref.current) return;

    ref.current.material.time.value += Math.abs(scroll.delta) * 4;

    if (ref.current.material.map && ref.current.material.map.offset) {
      ref.current.material.map.offset.x += delta / 2;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[radius, radius, 0.14, 128, 16, true]} />
      <meshSineMaterial
        map={texture}
        map-anisotropy={16}
        map-repeat={[20, 1]}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
};

export default Banner;
