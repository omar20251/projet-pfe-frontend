import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
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
    // Check for existing user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to authenticate
    try {
      // Mock authentication for demonstration
      if (email && password) {
        // This is just for demonstration; in a real app, this would come from backend
        let mockUser: User;
        
        if (email.includes('recruiter')) {
          mockUser = {
            id: '1',
            nom: 'Dupont',
            prenom: 'Jean',
            email: email,
            role: 'recruiter',
            entreprise_name: 'TechRecruit',
            website: 'techrecruit.com',
          };
        } else if (email.includes('admin')) {
          mockUser = {
            id: '2',
            nom: 'Admin',
            prenom: 'Super',
            email: email,
            role: 'admin',
          };
        } else {
          mockUser = {
            id: '3',
            nom: 'Martin',
            prenom: 'Sophie',
            email: email,
            role: 'candidate',
            governorat: 'Paris',
            dateNaissance: new Date('1990-01-15'),
          };
        }

        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to register
    try {
      if (userData.email && password) {
        // Create a mock user with provided data
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          nom: userData.nom || '',
          prenom: userData.prenom || '',
          email: userData.email,
          role: userData.role || 'candidate',
          ...userData
        };

        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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