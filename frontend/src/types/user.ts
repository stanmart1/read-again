import { BaseModel } from './base';

export interface User extends BaseModel {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  school_name: string;
  school_category: string;
  class_level: string;
  department: string;
  role_id: number;
  role?: Role;
  is_active: boolean;
  is_email_verified: boolean;
  last_login?: string;
}

export interface Role extends BaseModel {
  name: string;
  description: string;
  permissions?: Permission[];
}

export interface Permission extends BaseModel {
  name: string;
  description: string;
  category: string;
}

export interface AuthLog extends BaseModel {
  user_id: number;
  user?: User;
  action: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
}

export interface TokenBlacklist extends BaseModel {
  token: string;
  expires_at: string;
}
