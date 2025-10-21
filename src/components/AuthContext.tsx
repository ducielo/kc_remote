import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, role?: 'admin' | 'user') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string, role: 'admin' | 'user' = 'user'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulation d'appel API avec délai
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Credentials de démonstration
    if (role === 'admin') {
      if (email === 'admin@karis-continental.ga' && password === 'admin123') {
        setUser({
          id: '1',
          email,
          name: 'Administrateur Karis',
          role: 'admin'
        });
        setIsLoading(false);
        return true;
      }
    } else {
      // Connexion utilisateur standard
      if (email && password) {
        setUser({
          id: '2',
          email,
          name: 'Utilisateur',
          role: 'user'
        });
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};