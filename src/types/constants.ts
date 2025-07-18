type Card<T = any> = {
  id: number;
  imageUrl: string;
  data?: T;
};

interface CardDataProps {
  title: string;
  description: string;
}

export type { Card, CardDataProps };
