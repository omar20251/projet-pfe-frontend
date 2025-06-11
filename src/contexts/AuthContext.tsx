import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import authService, { RegisterRequest } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isAuthenticated: false,
  hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session and token
    const initializeAuth = async () => {
      const storedUser = authService.getStoredUser();
      const token = authService.getAuthToken();

      if (storedUser && token) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          // Token is invalid, clear auth data
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });

      // Store token and user data
      authService.setAuthToken(response.token);

      // Transform backend user data to frontend User type
      const transformedUser: User = {
        id: response.user.id.toString(),
        nom: response.user.last_name,
        prenom: response.user.first_name,
        email: response.user.email,
        role: response.user.role === 1 ? 'admin' : response.user.role === 2 ? 'recruiter' : 'candidate',
        statut: response.user.statut,
      };

      authService.setUser(transformedUser);
      setUser(transformedUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      const response = await authService.register(userData);

      // Store token if provided
      if (response.token) {
        authService.setAuthToken(response.token);
      }

      // Transform backend user data to frontend User type
      const transformedUser: User = {
        id: response.user.id.toString(),
        nom: response.user.last_name,
        prenom: response.user.first_name,
        email: response.user.email,
        role: response.user.role === 1 ? 'admin' : response.user.role === 2 ? 'recruiter' : 'candidate',
        statut: response.user.statut,
      };

      authService.setUser(transformedUser);
      setUser(transformedUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};