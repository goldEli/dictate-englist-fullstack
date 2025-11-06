import { apiClient } from '../../lib/api-client';

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
}

export interface MeResponse {
  success: boolean;
  user: Pick<User, 'id' | 'email'>;
}

class AuthClient {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('auth_token', response.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    }
  }

  async getCurrentUser(): Promise<MeResponse> {
    return apiClient.get<MeResponse>('/auth/me');
  }
}

export const authClient = new AuthClient();
