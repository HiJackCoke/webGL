import { ScrollControls } from "@react-three/drei";

import Rig from "../../3D/components/Rig";
import Carousel from "../../3D/components/Carousel";
import Banner from "../../3D/components/Banner";

import cards from "../../constants/cards";

import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const portal = useRef(
    document.getElementById("html")
  ) as MutableRefObject<HTMLDivElement>;

  const location = useLocation();
  const selectedId = new URLSearchParams(location.search).get("id");

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (!portal.current) return;

    const handleWheelCapture: EventListener = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleTouchMoveCapture: EventListener = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    portal.current.addEventListener("wheel", handleWheelCapture);
    portal.current.addEventListener("touch", handleTouchMoveCapture);

    return () => {
      portal.current.removeEventListener("wheel", handleWheelCapture);
      portal.current.removeEventListener("touch", handleTouchMoveCapture);
    };
  }, [portal]);

  useLayoutEffect(() => {
    if (selectedId) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedId]);

  return (
    <>
      <ScrollControls pages={5} infinite>
        <Rig
          animation={!selectedId}
          scrollHintVisible
          rotation={[0, 0, isSelected ? 0 : 0.15]}
        >
          <Carousel
            cards={cards}
            selectedId={selectedId ? Number(selectedId) : undefined}
            onCardClick={() => setIsSelected(true)}
            onCardClose={() => setIsSelected(false)}
          />
        </Rig>

        <Banner
          position={[0, -0.15, 0]}
          radius={isSelected ? 0 : cards.length / 5 + 0.2}
        />
      </ScrollControls>
    </>
  );
};

export default Index;
