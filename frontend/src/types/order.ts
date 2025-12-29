import { BaseModel } from './base';
import { User } from './user';
import { Author, Book } from './book';

export interface Order extends BaseModel {
  user_id: number;
  user?: User;
  author_id: number;
  author?: Author;
  order_number: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  payment_method: string;
  notes: string;
  items?: OrderItem[];
}

export interface OrderItem extends BaseModel {
  order_id: number;
  book_id: number;
  book?: Book;
  quantity: number;
  price: number;
  book_title: string;
}
