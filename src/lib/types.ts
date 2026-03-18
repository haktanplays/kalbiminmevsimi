export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category_id: string;
  category?: Category;
  author_name: string;
  is_published: boolean;
  is_featured: boolean;
  reading_time_minutes: number | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookInfo {
  id: string;
  title: string;
  author: string;
  description: string | null;
  isbn: string | null;
  publisher: string | null;
  publish_year: number | null;
  page_count: number | null;
  cover_image_url: string | null;
  purchase_url: string | null;
  updated_at: string;
}

export interface BookPage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  updated_at: string;
}

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}
