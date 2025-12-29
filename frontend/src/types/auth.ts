import { User } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_student?: string;
  school_name?: string;
  school_category?: string;
  class_level?: string;
  department?: string;
  password: string;
  confirm_password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}
