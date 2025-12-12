import { BaseModel } from './base';
import { User } from './user';

export interface Author extends BaseModel {
  user_id: number;
  user?: User;
  business_name: string;
  bio: string;
  photo: string;
  website: string;
  email: string;
  status: string;
}

export interface Book extends BaseModel {
  author_id: number;
  author?: Author;
  title: string;
  subtitle: string;
  description: string;
  short_description: string;
  price: number;
  cover_image: string;
  file_path: string;
  file_size: number;
  category_id?: number;
  category?: Category;
  isbn: string;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_release: boolean;
  status: string;
  is_active: boolean;
  pages: number;
  language: string;
  publisher: string;
  publication_date?: string;
  download_count: number;
  view_count: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

export interface Category extends BaseModel {
  name: string;
  description: string;
  status: string;
}
