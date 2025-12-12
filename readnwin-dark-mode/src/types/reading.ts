import { BaseModel } from './base';
import { User } from './user';
import { Book } from './book';

export interface UserLibrary extends BaseModel {
  user_id: number;
  user?: User;
  book_id: number;
  book?: Book;
  progress: number;
  current_page: number;
  last_read_at?: string;
  completed_at?: string;
  is_favorite: boolean;
  rating: number;
}

export interface ReadingSession extends BaseModel {
  user_id: number;
  user?: User;
  book_id: number;
  book?: Book;
  start_time: string;
  end_time?: string;
  duration: number;
  pages_read: number;
  start_page: number;
  end_page: number;
}

export interface ReadingGoal extends BaseModel {
  user_id: number;
  user?: User;
  type: string;
  target: number;
  current: number;
  start_date: string;
  end_date: string;
  is_completed: boolean;
}

export interface Bookmark extends BaseModel {
  user_id: number;
  user?: User;
  book_id: number;
  book?: Book;
  page: number;
  location: string;
  note: string;
}

export interface Note extends BaseModel {
  user_id: number;
  user?: User;
  book_id: number;
  book?: Book;
  page: number;
  content: string;
  highlight: string;
}
