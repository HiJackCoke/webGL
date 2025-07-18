import Card from "./Card";
import { Card as CardType } from "@/types/constants";

type EventParams = {
  id: number;
  data?: DataProps;
};

interface DataProps {
  title: string;
  description: string;
}

interface Props {
  // fit?
  cards: CardType<DataProps>[];
  radius?: number;

  onCardPointerOver?: (params: EventParams) => void;
  onCardPointerOut?: (params: EventParams) => void;
  onCardClick?: (params: EventParams) => void;
}

const Carousel = ({
  cards,
  radius,
  onCardPointerOver,
  onCardPointerOut,
  onCardClick,
}: Props) => {
  const count = cards.length;
  const baseRadius = radius ?? count / 5;

  return cards.map(({ id, imageUrl, data }, index) => (
    <Card
      key={id}
      url={imageUrl}
      position={[
        Math.sin((index / count) * Math.PI * 2) * baseRadius,
        0,
        Math.cos((index / count) * Math.PI * 2) * baseRadius,
      ]}
      rotation={[0, (index / count) * Math.PI * 2, 0]}
      onPointerOver={() => onCardPointerOver?.({ id, data })}
      onPointerOut={() => onCardPointerOut?.({ id, data })}
      onClick={() => onCardClick?.({ id, data })}
    />
  ));
};

export default Carousel;
