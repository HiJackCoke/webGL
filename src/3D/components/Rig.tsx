import * as THREE from "three";

import { ReactNode, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ScrollControlsState, useScroll } from "@react-three/drei";
import { easing } from "maath";

interface Props {
  rotation?: [number, number, number];
  children: ReactNode;
  onScrollChange?: (state: ScrollControlsState) => void;
}

const Rig = ({ rotation = [0, 0, 0], children, onScrollChange }: Props) => {
  const scrollRef = useRef(0);
  const ref = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const { viewport } = useThree();

  const aspectRatio = useMemo(() => {
    return viewport.aspect < 1 ? 15 / viewport.aspect : 10;
  }, [viewport.width, viewport.height]);

  const cameraPosition = useMemo(() => {
    return new THREE.Vector3(0, 0, aspectRatio);
  }, [viewport.width, viewport.height]);

  const fogPosition = useMemo(
    () => [aspectRatio, aspectRatio + 3] as [number, number],
    [viewport.width, viewport.height]
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    if (!state.events.update) return;

    const rotationY = -scroll.offset * (Math.PI * 2);
    state.events.update();

    // easing.damp3(
    //   state.camera.position,
    //   [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
    //   0.3,
    //   delta
    // );
    if (state.scene.fog) {
      easing.damp(state.scene.fog, "near", fogPosition[0], 0.3, delta);
      easing.damp(state.scene.fog, "far", fogPosition[1], 0.3, delta);
    }
    easing.damp3(state.camera.position, cameraPosition, 0.3, delta);

    easing.dampE(
      ref.current.rotation,
      [rotation[0], rotationY, rotation[2]],
      0.1,
      delta
    );

    state.camera.lookAt(0, 0, 0);

    if (scrollRef.current !== scroll.offset && onScrollChange) {
      scrollRef.current = scroll.offset;
      onScrollChange(scroll);
    }
  });

  return (
    <>
      <fog attach="fog" args={["#95a99c", ...fogPosition]} />
      <group ref={ref}>{children}</group>;
    </>
  );
};

export default Rig;
