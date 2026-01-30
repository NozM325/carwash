import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { User } from '../types/auth';

const AUTH_TOKEN_KEY = 'shybay_auth_token';
const USER_DATA_KEY = 'shybay_user_data';

// Use SecureStore for native platforms, AsyncStorage for web
const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.setItem(key, value);
    }
    return SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.removeItem(key);
    }
    return SecureStore.deleteItemAsync(key);
  }
};

export class AuthStorage {
  static async saveToken(token: string): Promise<void> {
    try {
      await secureStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to save auth token:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await secureStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  }

  static async saveUser(user: User): Promise<void> {
    try {
      await secureStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user data:', error);
      throw new Error('Failed to save user data');
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const userData = await secureStorage.getItem(USER_DATA_KEY);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        // Convert date strings back to Date objects
        return {
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt),
          updatedAt: new Date(parsedUser.updatedAt)
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  static async removeUser(): Promise<void> {
    try {
      await secureStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Failed to remove user data:', error);
    }
  }

  static async clearAll(): Promise<void> {
    await Promise.all([
      this.removeToken(),
      this.removeUser()
    ]);
  }
}