import * as THREE from "three";

import { ReactNode, useRef } from "react";
import { Euler, useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { easing } from "maath";

interface Props {
  rotation?: Euler;
  children: ReactNode;
}

const Rig = ({ rotation, children }: Props) => {
  const ref = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (!ref.current) return;
    if (!state.events.update) return;

    ref.current.rotation.y = -scroll.offset * (Math.PI * 2);
    state.events.update();
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
      0.3,
      delta
    );

    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={ref} rotation={rotation}>
      {children}
    </group>
  );
};

export default Rig;
