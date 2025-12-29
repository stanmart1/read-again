import { BaseModel } from './base';
import { User } from './user';
import { Book } from './book';

export interface Cart extends BaseModel {
  user_id: number;
  user?: User;
  book_id: number;
  book?: Book;
  quantity: number;
}
