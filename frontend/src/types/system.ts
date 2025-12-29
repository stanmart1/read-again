import { BaseModel } from './base';
import { User } from './user';
import { Book } from './book';

export interface SystemSettings extends BaseModel {
  key: string;
  value: string;
  data_type: string;
  category: string;
  description: string;
  is_public: boolean;
}

export interface AuditLog extends BaseModel {
  user_id: number;
  user?: User;
  action: string;
  entity_type: string;
  entity_id: number;
  old_value: string;
  new_value: string;
  ip_address: string;
  user_agent: string;
}

export interface Notification extends BaseModel {
  user_id: number;
  user?: User;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url: string;
}

export interface Achievement extends BaseModel {
  name: string;
  description: string;
  icon: string;
  type: string;
  target: number;
  points: number;
}

export interface UserAchievement extends BaseModel {
  user_id: number;
  user?: User;
  achievement_id: number;
  achievement?: Achievement;
  progress: number;
  is_unlocked: boolean;
}

export interface AboutPage extends BaseModel {
  title: string;
  content: string;
  mission: string;
  vision: string;
  team_section: string;
  values: string;
}

export interface Activity extends BaseModel {
  user_id: number;
  user?: User;
  type: string;
  title: string;
  description: string;
  entity_type: string;
  entity_id: number;
  metadata: string;
}

export interface Wishlist extends BaseModel {
  user_id: number;
  user?: User;
  book_id: number;
  book?: Book;
}
