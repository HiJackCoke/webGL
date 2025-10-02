import * as THREE from "three";

import { ReactNode, useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, ScrollControlsState, useScroll } from "@react-three/drei";
import { easing } from "maath";
import ScrollHint from "./ScrollHint";

interface Props {
  zoom?: number;
  rotation?: [number, number, number];
  children: ReactNode;
  scrollHintVisible?: boolean;
  onScrollChange?: (state: ScrollControlsState) => void;
}

const Rig = ({
  zoom = 1,
  rotation = [0, 0, 0],
  scrollHintVisible = false,
  children,
  onScrollChange,
}: Props) => {
  const scrollRef = useRef(0);
  const ref = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const { viewport } = useThree();
  const [isVisible, setIsVisible] = useState(true);

  const aspectRatio = useMemo(() => {
    return viewport.aspect < 1 ? 15 / zoom / viewport.aspect : 10;
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
    if (scroll.offset > 0 && isVisible) setIsVisible(false);

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

  console.log(scrollHintVisible, isVisible);

  return (
    <>
      <Html wrapperClass="z-[9]" fullscreen>
        <ScrollHint visible={scrollHintVisible && isVisible} />
      </Html>
      <fog attach="fog" args={["#95a99c", ...fogPosition]} />
      <group ref={ref}>{children}</group>;
    </>
  );
};

export default Rig;
