# Google Maps Setup Guide

## Overview
To use the Google Maps functionality in the Shybay app, you'll need to set up Google Maps API keys for both Android and iOS platforms.

## Step 1: Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (for address autocomplete)
   - Geocoding API (for address-to-coordinates conversion)

4. Create credentials:
   - Go to **APIs & Services > Credentials**
   - Click **Create Credentials > API Key**
   - Copy the generated API key

## Step 2: Configure API Key Restrictions (Recommended)

### For Android:
1. In Google Cloud Console, click on your API key
2. Under "Application restrictions", select "Android apps"
3. Add your app's package name and SHA-1 certificate fingerprint

### For iOS:
1. In Google Cloud Console, click on your API key
2. Under "Application restrictions", select "iOS apps"
3. Add your app's iOS bundle identifier

## Step 3: Update app.json

Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` in your `app.json` with your actual API key:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "AIzaSyC4YjA12345678901234567890123456789"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyC4YjA12345678901234567890123456789"
        }
      }
    }
  }
}
```

## Step 4: Test the Integration

1. Run the app: `npx expo start`
2. Navigate to the booking screen
3. Toggle to "🗺️ Google Maps" mode
4. You should see:
   - Interactive Google Maps
   - Search functionality
   - Pin dropping
   - Distance calculation from base location

## Important Notes

- **Free Tier**: Google Maps provides a generous free tier
- **Billing**: Set up billing limits to avoid unexpected charges
- **Security**: Use API key restrictions for production apps
- **Testing**: Test on both iOS and Android devices

## Troubleshooting

### Map not loading:
- Check API key is correct
- Ensure Maps SDK is enabled in Google Cloud Console
- Verify app.json syntax is correct

### Search not working:
- Enable Places API in Google Cloud Console
- Check network connectivity

### Distance calculation issues:
- Enable Geocoding API
- Verify location permissions are granted

## Alternative for Development

For development/testing without Google Maps API, users can:
1. Toggle to "📝 Form Input" mode
2. Use the basic GPS location picker
3. Manually enter addresses

This provides full functionality without requiring Google Maps API setup.