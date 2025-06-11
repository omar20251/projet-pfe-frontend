import api from './api';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: number; // 1: admin, 2: recruiter, 3: candidate
  // Recruiter specific fields
  entreprise_name?: string;
  website?: string;
  phone?: string;
  address?: string;
  logo?: string;
  entreprise_description?: string;
  unique_identifier?: string;
  domaine?: string;
  // Candidate specific fields
  civility?: 'M' | 'Mme' | 'Mlle';
  birth_date?: string;
  Governorate?: string;
}

export interface LoginResponse {
  message: string;
  user: any;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: any;
  token?: string;
  domaine?: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post('/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/user');
    const userData = response.data;

    // Transform backend user data to frontend User type
    return {
      id: userData.id.toString(),
      nom: userData.last_name,
      prenom: userData.first_name,
      email: userData.email,
      role: userData.role === 1 ? 'admin' : userData.role === 2 ? 'recruiter' : 'candidate',
      statut: userData.statut,
    };
  }

  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();
