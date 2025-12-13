import api from '@/lib/api';
import { User, LoginRequest, SignupRequest, AuthResponse, ApiResponse } from '@/types';

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface MeResponse {
  user_id: number;
  email: string;
  role_id: number;
}

class AuthService {
  // Register new user
  async register(data: RegisterRequest): Promise<ApiResponse<{ user: User; message: string }>> {
    return api.post('/api/auth/register', data);
  }

  // Login user
  async login(email_or_username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return api.post('/api/auth/login', {
      email_or_username,
      password,
    });
  }

  // Refresh access token
  async refreshToken(refresh_token: string): Promise<ApiResponse<RefreshTokenResponse>> {
    return api.post('/api/auth/refresh', {
      refresh_token,
    });
  }

  // Logout user
  async logout(): Promise<ApiResponse<{ message: string }>> {
    return api.post('/api/auth/logout');
  }

  // Get current user info
  async getMe(): Promise<ApiResponse<MeResponse>> {
    return api.get('/api/auth/me');
  }

  // Request password reset
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string; token: string }>> {
    return api.post('/api/auth/forgot-password', {
      email,
    });
  }

  // Reset password with token
  async resetPassword(token: string, new_password: string): Promise<ApiResponse<{ message: string }>> {
    return api.post('/api/auth/reset-password', {
      token,
      new_password,
    });
  }

  // Helper methods for token management
  setAuthData(loginResponse: LoginResponse) {
    api.setAuthToken(loginResponse.access_token);
    localStorage.setItem('refresh_token', loginResponse.refresh_token);
    localStorage.setItem('user', JSON.stringify(loginResponse.user));
  }

  clearAuthData() {
    api.clearAuthToken();
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();
export default authService;
