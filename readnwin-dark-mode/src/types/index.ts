// Base interface matching Go BaseModel
export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string;
}

// User related interfaces
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

// Book related interfaces
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

// Order related interfaces
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

// Cart interface
export interface Cart extends BaseModel {
  user_id: number;
  user?: User;
  book_id: number;
  book?: Book;
  quantity: number;
}

// Content related interfaces
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

// Reading related interfaces
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

// System related interfaces
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

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth types
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
