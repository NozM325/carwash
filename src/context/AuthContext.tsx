import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  AuthContextType,
  LoginCredentials,
  SignupData,
  AuthError as AuthErrorType
} from '../types/auth';
import { AuthService } from '../services/AuthService';
import { AuthStorage } from '../utils/AuthStorage';
import { SocialAuthService, SocialAuthServiceError } from '../services/SocialAuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthErrorType | null>(null);

  const isAuthenticated = !!user;

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // Add test users for demo
      AuthService.addTestUsers();

      const token = await AuthStorage.getToken();

      if (token) {
        const savedUser = await AuthStorage.getUser();

        if (savedUser) {
          // Validate token with backend (in production)
          const validatedUser = await AuthService.validateToken(token);

          if (validatedUser) {
            setUser(validatedUser);
          } else {
            // Token invalid, clear storage
            await AuthStorage.clearAll();
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      await AuthStorage.clearAll();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { user: loggedInUser, token } = await AuthService.login(credentials);

      // Save to secure storage
      await AuthStorage.saveToken(token);
      await AuthStorage.saveUser(loggedInUser);

      setUser(loggedInUser);
      return true;
    } catch (err) {
      const authError = err as AuthErrorType;
      setError({
        code: authError.code || 'LOGIN_ERROR',
        message: authError.message || 'Login failed. Please try again.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (signupData: SignupData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { user: newUser, token } = await AuthService.signup(signupData);

      // Save to secure storage
      await AuthStorage.saveToken(token);
      await AuthStorage.saveUser(newUser);

      setUser(newUser);
      return true;
    } catch (err) {
      const authError = err as AuthErrorType;
      setError({
        code: authError.code || 'SIGNUP_ERROR',
        message: authError.message || 'Signup failed. Please try again.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Clear storage
      await AuthStorage.clearAll();

      // Clear state
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      setError(null);

      const updatedUser = await AuthService.updateProfile(user.id, updates);

      // Save updated user
      await AuthStorage.saveUser(updatedUser);
      setUser(updatedUser);

      return true;
    } catch (err) {
      const authError = err as AuthErrorType;
      setError({
        code: authError.code || 'UPDATE_ERROR',
        message: authError.message || 'Failed to update profile. Please try again.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'apple' | 'microsoft'): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Use mock social auth for development, real auth for production
      const socialAuthResult = __DEV__
        ? await SocialAuthService.mockSocialAuth(provider)
        : await (provider === 'google' ? SocialAuthService.signInWithGoogle() :
                provider === 'apple' ? SocialAuthService.signInWithApple() :
                SocialAuthService.signInWithMicrosoft());

      // Save to secure storage
      await AuthStorage.saveToken(socialAuthResult.token);
      await AuthStorage.saveUser(socialAuthResult.user);

      setUser(socialAuthResult.user);
      return true;
    } catch (err) {
      const socialAuthError = err as SocialAuthServiceError;
      setError({
        code: socialAuthError.code || 'SOCIAL_AUTH_ERROR',
        message: socialAuthError.message || `Failed to sign in with ${provider}. Please try again.`
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    // State
    user,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    signup,
    logout,
    updateProfile,

    // Social Authentication
    socialLogin,

    // Error handling
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}