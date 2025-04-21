import axios from 'axios';

// TODO: Move to environment variables
const API_BASE_URL = 'http://localhost:3000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static USER_KEY = 'auth_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const data = response.data;
      
      // Store auth data
      this.setToken(data.token);
      this.setUser(data.user);
      
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    localStorage.removeItem(AuthService.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }

  getUser(): any | null {
    const user = localStorage.getItem(AuthService.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private setUser(user: any): void {
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();