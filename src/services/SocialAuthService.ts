import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { User } from '../types/auth';

export interface SocialAuthResult {
  user: User;
  token: string;
  provider: 'google' | 'apple' | 'microsoft';
}

export interface SocialAuthError {
  code: string;
  message: string;
  provider: 'google' | 'apple' | 'microsoft';
}

// OAuth Configuration
const OAUTH_CONFIG = {
  google: {
    clientId: {
      ios: 'your-ios-client-id.apps.googleusercontent.com',
      android: 'your-android-client-id.apps.googleusercontent.com',
      web: 'your-web-client-id.apps.googleusercontent.com'
    },
    scopes: ['openid', 'profile', 'email']
  },
  microsoft: {
    clientId: 'your-microsoft-client-id',
    tenantId: 'common', // or your specific tenant ID
    scopes: ['openid', 'profile', 'email', 'User.Read']
  }
};

class SocialAuthServiceClass {
  private getGoogleClientId(): string {
    if (Platform.OS === 'ios') {
      return OAUTH_CONFIG.google.clientId.ios;
    } else if (Platform.OS === 'android') {
      return OAUTH_CONFIG.google.clientId.android;
    } else {
      return OAUTH_CONFIG.google.clientId.web;
    }
  }

  async signInWithGoogle(): Promise<SocialAuthResult> {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
        preferLocalhost: true
      });

      const request = new AuthSession.AuthRequest({
        clientId: this.getGoogleClientId(),
        scopes: OAUTH_CONFIG.google.scopes,
        redirectUri: redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {},
        additionalParameters: {}
      });

      const discovery = await AuthSession.fetchDiscoveryAsync(
        'https://accounts.google.com/.well-known/openid_configuration'
      );

      const result = await request.promptAsync(discovery);

      if (result.type === 'success') {
        const { code } = result.params;

        // Exchange code for tokens
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: this.getGoogleClientId(),
            code: code,
            extraParams: {
              code_verifier: request.codeVerifier || '',
            },
            redirectUri: redirectUri,
          },
          discovery
        );

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        });

        const userInfo = await userInfoResponse.json();

        // Create user object
        const user: User = {
          id: `google_${userInfo.id}`,
          email: userInfo.email,
          firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || 'User',
          lastName: userInfo.family_name || userInfo.name?.split(' ').slice(1).join(' ') || '',
          phoneNumber: '', // Google doesn't always provide phone number
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        return {
          user,
          token: tokenResponse.accessToken || 'mock_google_token',
          provider: 'google'
        };
      } else {
        throw new SocialAuthServiceError(
          'GOOGLE_AUTH_CANCELLED',
          'Google authentication was cancelled',
          'google'
        );
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw new SocialAuthServiceError(
        'GOOGLE_AUTH_ERROR',
        'Failed to sign in with Google. Please try again.',
        'google'
      );
    }
  }

  async signInWithApple(): Promise<SocialAuthResult> {
    try {
      // Check if Apple Authentication is available
      if (Platform.OS !== 'ios') {
        throw new SocialAuthServiceError(
          'APPLE_AUTH_UNAVAILABLE',
          'Apple Sign-In is only available on iOS devices',
          'apple'
        );
      }

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new SocialAuthServiceError(
          'APPLE_AUTH_UNAVAILABLE',
          'Apple Sign-In is not available on this device',
          'apple'
        );
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        // Create user object
        const user: User = {
          id: `apple_${credential.user}`,
          email: credential.email || 'apple.user@privaterelay.appleid.com',
          firstName: credential.fullName?.givenName || 'User',
          lastName: credential.fullName?.familyName || '',
          phoneNumber: '', // Apple doesn't provide phone number
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        return {
          user,
          token: credential.identityToken,
          provider: 'apple'
        };
      } else {
        throw new SocialAuthServiceError(
          'APPLE_AUTH_FAILED',
          'Failed to get identity token from Apple',
          'apple'
        );
      }
    } catch (error) {
      if (error instanceof SocialAuthServiceError) {
        throw error;
      }

      console.error('Apple Sign-In Error:', error);
      throw new SocialAuthServiceError(
        'APPLE_AUTH_ERROR',
        'Failed to sign in with Apple. Please try again.',
        'apple'
      );
    }
  }

  async signInWithMicrosoft(): Promise<SocialAuthResult> {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
        preferLocalhost: true
      });

      const discovery = await AuthSession.fetchDiscoveryAsync(
        `https://login.microsoftonline.com/${OAUTH_CONFIG.microsoft.tenantId}/v2.0/.well-known/openid_configuration`
      );

      const request = new AuthSession.AuthRequest({
        clientId: OAUTH_CONFIG.microsoft.clientId,
        scopes: OAUTH_CONFIG.microsoft.scopes,
        redirectUri: redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {},
        additionalParameters: {}
      });

      const result = await request.promptAsync(discovery);

      if (result.type === 'success') {
        const { code } = result.params;

        // Exchange code for tokens
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: OAUTH_CONFIG.microsoft.clientId,
            code: code,
            extraParams: {
              code_verifier: request.codeVerifier || '',
            },
            redirectUri: redirectUri,
          },
          discovery
        );

        // Get user info from Microsoft Graph API
        const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        });

        const userInfo = await userInfoResponse.json();

        // Create user object
        const user: User = {
          id: `microsoft_${userInfo.id}`,
          email: userInfo.mail || userInfo.userPrincipalName,
          firstName: userInfo.givenName || userInfo.displayName?.split(' ')[0] || 'User',
          lastName: userInfo.surname || userInfo.displayName?.split(' ').slice(1).join(' ') || '',
          phoneNumber: '', // Microsoft Graph might have phone, but not always accessible
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        return {
          user,
          token: tokenResponse.accessToken || 'mock_microsoft_token',
          provider: 'microsoft'
        };
      } else {
        throw new SocialAuthServiceError(
          'MICROSOFT_AUTH_CANCELLED',
          'Microsoft authentication was cancelled',
          'microsoft'
        );
      }
    } catch (error) {
      if (error instanceof SocialAuthServiceError) {
        throw error;
      }

      console.error('Microsoft Sign-In Error:', error);
      throw new SocialAuthServiceError(
        'MICROSOFT_AUTH_ERROR',
        'Failed to sign in with Microsoft. Please try again.',
        'microsoft'
      );
    }
  }

  // Mock social authentication for development
  async mockSocialAuth(provider: 'google' | 'apple' | 'microsoft'): Promise<SocialAuthResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockUsers = {
      google: {
        id: `google_mock_${Date.now()}`,
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        phoneNumber: '',
        role: 'customer' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      apple: {
        id: `apple_mock_${Date.now()}`,
        email: 'user@privaterelay.appleid.com',
        firstName: 'Apple',
        lastName: 'User',
        phoneNumber: '',
        role: 'customer' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      microsoft: {
        id: `microsoft_mock_${Date.now()}`,
        email: 'user@outlook.com',
        firstName: 'Microsoft',
        lastName: 'User',
        phoneNumber: '',
        role: 'customer' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    return {
      user: mockUsers[provider],
      token: `mock_${provider}_token_${Date.now()}`,
      provider
    };
  }
}

// Custom error class
class SocialAuthServiceError extends Error {
  code: string;
  provider: 'google' | 'apple' | 'microsoft';

  constructor(code: string, message: string, provider: 'google' | 'apple' | 'microsoft') {
    super(message);
    this.code = code;
    this.provider = provider;
    this.name = 'SocialAuthServiceError';
  }
}

export const SocialAuthService = new SocialAuthServiceClass();
export { SocialAuthServiceError };