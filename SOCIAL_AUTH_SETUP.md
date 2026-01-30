# Social Authentication Setup Guide

This guide will help you set up Google, Apple, and Microsoft OAuth authentication for your Shybay app.

## Overview

The app now includes Uber-style login with support for:
- 📧 **Email + Password login**
- 🔍 **Google OAuth**
- 🍎 **Apple Sign In**
- Ⓜ️ **Microsoft OAuth**

## Current Status

- ✅ **Mock Authentication**: Currently working in development mode with mock social logins
- ⚙️ **Production Setup**: Requires configuration with actual OAuth credentials

## Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - **iOS**: Create iOS OAuth client ID
   - **Android**: Create Android OAuth client ID
   - **Web**: Create Web OAuth client ID

5. Update `src/services/SocialAuthService.ts`:
```typescript
const OAUTH_CONFIG = {
  google: {
    clientId: {
      ios: 'your-ios-client-id.apps.googleusercontent.com',
      android: 'your-android-client-id.apps.googleusercontent.com',
      web: 'your-web-client-id.apps.googleusercontent.com'
    },
    scopes: ['openid', 'profile', 'email']
  },
  // ...
};
```

### 2. Apple Sign In Setup

1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Register your app identifier
3. Enable "Sign In with Apple" capability
4. Configure your app in Xcode:
   - Add "Sign In with Apple" capability
   - Ensure your bundle identifier matches Apple Developer settings

**Note**: Apple Sign In only works on iOS devices and requires proper App Store provisioning.

### 3. Microsoft OAuth Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application in Azure Active Directory
3. Configure redirect URIs for mobile app
4. Copy the Application (client) ID

5. Update `src/services/SocialAuthService.ts`:
```typescript
microsoft: {
  clientId: 'your-microsoft-client-id',
  tenantId: 'common', // or your specific tenant ID
  scopes: ['openid', 'profile', 'email', 'User.Read']
}
```

## Development Mode

In development (`__DEV__ = true`), the app uses mock social authentication:
- **Google Mock**: `user@gmail.com`
- **Apple Mock**: `user@privaterelay.appleid.com`
- **Microsoft Mock**: `user@outlook.com`

All mock accounts will successfully "authenticate" and create temporary user sessions.

## Features

### Uber-Style Login Flow
1. **Email First**: Users enter email address
2. **Continue**: App checks if account exists
3. **Authentication Options**:
   - Password input for existing accounts
   - Social login buttons (Google, Apple, Microsoft)
4. **Secure Storage**: User sessions are automatically saved and persisted

### User Persistence
- ✅ **Secure Storage**: Uses `expo-secure-store` for token/user data
- ✅ **Auto-Login**: Users stay logged in between app sessions
- ✅ **Cross-Platform**: Works on iOS, Android, and Web

### UI/UX Features
- 🎨 **Glassmorphism Design**: Modern glass-effect styling
- 🌙 **Dark Mode Support**: Automatically adapts to system theme
- 📱 **Responsive**: Works on all screen sizes
- ✨ **Animations**: Smooth transitions and loading states

## Testing

### Development Testing
1. Run the app: `npm start`
2. Use the demo buttons to quickly test different user types:
   - 👤 **Customer**: `customer@test.com` / `password`
   - 👷 **Staff**: `staff@test.com` / `password`
   - 👑 **Admin**: `admin@shybay.com` / `admin123`

### Social Auth Testing
- In development, social buttons will use mock authentication
- Users will be automatically signed in with mock accounts
- Test the complete flow without needing real OAuth setup

## Production Deployment

Before deploying to production:

1. **Update OAuth Configuration**: Replace mock credentials with real ones
2. **Test on Devices**: Ensure social login works on physical devices
3. **Configure App Store/Play Store**: Ensure OAuth redirect URIs are properly configured
4. **Security**: Review and secure all OAuth credentials

## Troubleshooting

### Common Issues
- **Apple Sign In not working**: Only available on iOS with proper provisioning
- **Google OAuth errors**: Check client IDs and redirect URIs
- **Microsoft OAuth issues**: Verify tenant settings and scopes

### Debug Mode
Set breakpoints in:
- `src/services/SocialAuthService.ts` - OAuth flow
- `src/context/AuthContext.tsx` - Authentication state
- `src/screens/auth/UberStyleLoginScreen.tsx` - UI interactions

## Next Steps

1. **Configure OAuth Credentials**: Set up real Google, Apple, and Microsoft OAuth
2. **Test on Devices**: Test social authentication on physical devices
3. **Backend Integration**: Connect to your authentication backend
4. **Analytics**: Track social login success/failure rates
5. **UI Customization**: Customize the login flow for your brand

## Support

For issues or questions:
1. Check the React Native and Expo documentation
2. Review OAuth provider documentation (Google, Apple, Microsoft)
3. Test in development mode first before configuring production OAuth