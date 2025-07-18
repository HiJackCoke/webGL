import Card from "./Card";
import { Card as CardType } from "@/types/constants";
interface Props {
  // fit?
  cards: CardType[];
  radius?: number;
}

const Carousel = ({ cards, radius }: Props) => {
  const count = cards.length;
  const baseRadius = radius ?? count / 5;

  return cards.map(({ id, imageUrl }, i) => (
    <Card
      key={id}
      url={imageUrl}
      position={[
        Math.sin((i / count) * Math.PI * 2) * baseRadius,
        0,
        Math.cos((i / count) * Math.PI * 2) * baseRadius,
      ]}
      rotation={[0, (i / count) * Math.PI * 2, 0]}
    />
  ));
};

export default Carousel;
