type Card<T = any> = {
  id: number;
  imageUrl: string;
  data?: T;
};

interface ContributionItem {
  title: string;
  content?: string; // 단락형 콘텐츠
  items?: string[]; // 리스트형 콘텐츠
  type: "paragraph" | "list";
}

interface CardDataProps {
  title: string;
  description: string;
  period: string;
  link?: string;
  contributions: ContributionItem[];
}

export type { Card, CardDataProps };
