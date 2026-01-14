# Google Maps API Setup Guide

## Required for Interactive Map Picker in Admin Dashboard

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Maps Embed API**
   - **Places API**
   - **Geocoding API**

4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key
6. (Optional) Restrict the API key:
   - Application restrictions: HTTP referrers
   - Add your domain (e.g., `yourdomain.com/*`)
   - API restrictions: Select the 4 APIs mentioned above

### Step 2: Add to Environment Variables

Add this to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Step 3: Restart Development Server

```bash
npm run dev
```

## Features Enabled

✅ **Interactive Map Picker** in Admin Dashboard → Site Settings
- Search for locations by name
- Click on map to place pin
- Drag marker to adjust position
- Get current location button
- Auto-generates address from coordinates

✅ **Dynamic Map** on Contact Page
- Displays location set in admin
- Embedded Google Map
- Responsive and mobile-friendly

## Pricing (Google Maps Platform)

- **Free Tier**: $200/month credit (covers ~28,000 map loads)
- **After Free Tier**: $7 per 1,000 map loads
- Most small businesses stay within free tier

## Security Best Practices

1. **Restrict your API key** to your domain
2. **Enable only required APIs**
3. **Monitor usage** in Google Cloud Console
4. **Set usage limits** to prevent unexpected charges

## Troubleshooting

**Map not loading?**
- Check API key is in `.env.local`
- Verify APIs are enabled in Google Cloud
- Check browser console for errors
- Restart development server after adding key

**"RefererNotAllowedMapError"?**
- Your domain is not in allowed referrers
- Update API key restrictions in Google Cloud Console


