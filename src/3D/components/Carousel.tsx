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

const Carousel = <T extends CardType>({
  cards,
  radius,
  onCardPointerOver,
  onCardPointerOut,
  onCardClick,
}: Props<T>) => {
  const count = cards.length;
  const baseRadius = radius ?? count / 5;

  return cards.map((card, index) => (
    <Card
      key={card.id}
      url={card.imageUrl}
      position={[
        Math.sin((index / count) * Math.PI * 2) * baseRadius,
        0,
        Math.cos((index / count) * Math.PI * 2) * baseRadius,
      ]}
      rotation={[0, (index / count) * Math.PI * 2, 0]}
      onPointerOver={() => onCardPointerOver?.(card)}
      onPointerOut={() => onCardPointerOut?.(card)}
      onClick={() => onCardClick?.(card)}
    />
  ));
};

export default Carousel;
