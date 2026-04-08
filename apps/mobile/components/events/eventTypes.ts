export interface EventItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  category: string;
  recurring: boolean;
  tags: string[] | null;
  image_url?: string | null;
  featured?: boolean | null;
}
