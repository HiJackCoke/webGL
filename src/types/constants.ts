type Card<T = any> = {
  id: number;
  imageUrl: string;
  data?: T;
};

export type { Card };
