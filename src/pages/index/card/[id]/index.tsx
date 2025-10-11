import { ScrollControls } from "@react-three/drei";

import * as THREE from "three";
import { easing } from "maath";

import { useEffect, useMemo, useRef } from "react";
import Rig from "@/3D/components/Rig";

import cards from "@/constants/cards";
import Card from "@/3D/components/Card";
import { useFrame, useThree } from "@react-three/fiber";
import { useNavigate, useParams } from "react-router-dom";
import CardDetailContent from "@/components/CardDetailContent";

import { createRoot } from "react-dom/client";

const GAP = 0.05;

const Index = () => {
  const ref = useRef<THREE.Mesh | null>(null);

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { viewport } = useThree();

  const isVertical = useMemo(() => {
    if (viewport.aspect < 1) {
      return true;
    }
    return false;
  }, [viewport.aspect]);

  useFrame((state, delta) => {
    const { aspect, width, height, distance } = state.viewport;

    if (!ref.current) return;

    // const { width: w, height: h } = getMeshPixelSize(ref.current, camera, size);

    if (aspect < 1) {
      const fixeHeight = (((height / distance) * 10) / aspect) * 1.5;
      const scale = fixeHeight * 0.4;

      const y = scale * (0.5 + GAP);

      easing.damp3(ref.current.scale, scale, 0.2, delta);
      easing.damp3(ref.current.position, [0, y, 0], 0.2, delta);

      // easing.damp3(ref.current.scale, 2 / aspect, delta);
      // easing.damp3(ref.current.position, [0, 1.5 - aspect, 0], 0.2, delta);
    } else {
      const fixedWidth = (width / distance) * 10;
      const scale = fixedWidth * 0.4;

      const x = -scale * (0.5 + GAP);

      easing.damp3(ref.current.scale, scale, 0.2, delta);
      easing.damp3(ref.current.position, [x, 0, 0], 0.2, delta);
    }
  });

  const card = cards.find((card) => card.id === Number(params.id));
  useEffect(() => {
    if (!card) {
      navigate("/", {
        flushSync: true,
        viewTransition: true,
      });
    }
  }, []);

  useEffect(() => {
    const html = document.getElementById("html");
    if (!html) return;

    const root = createRoot(html);
    root.render(
      <CardDetailContent data={card?.data} isVertical={isVertical} />
    );

    return () => {
      root.unmount();
    };
  }, [isVertical]);

  if (!card) return null;

  return (
    <>
      <ScrollControls enabled={false} prepend={true}>
        <Rig rotation={[0, 0, 0]}>
          <Card
            ref={ref}
            url={card.imageUrl}
            bent={0}
            scale={1.8}
            radius={0.1}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            onClose={() => {
              navigate(-1);
            }}
          />
        </Rig>
      </ScrollControls>
    </>
  );
};

export default Index;
