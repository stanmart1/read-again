import { BaseModel } from './base';
import { User } from './user';
import { Book } from './book';

export interface Blog extends BaseModel {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author_id: number;
  author?: User;
  category_id?: number;
  status: string;
  is_featured: boolean;
  views: number;
  read_time: number;
  tags: string;
  published_at?: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

export interface FAQ extends BaseModel {
  question: string;
  answer: string;
  category: string;
  order: number;
  is_active: boolean;
}

export interface Review extends BaseModel {
  user_id: number;
  user?: User;
  book_id: number;
  book?: Book;
  rating: number;
  comment: string;
  status: string;
  is_featured: boolean;
}

export interface Testimonial extends BaseModel {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  is_active: boolean;
  order: number;
}

export interface ContactMessage extends BaseModel {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  reply: string;
}
