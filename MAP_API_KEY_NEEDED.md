# QUICK FIX: Add Google Maps API Key

## The Error You're Seeing:
- **Admin Dashboard**: White screen in Map Location section
- **Contact Page**: "Google Maps Platform rejected your request. The provided API key is invalid."

## Quick Fix (5 minutes):

### Step 1: Create/Edit `.env.local` File

In your project root (`/Users/marvin/Desktop/DesertPort Autos/`), create or edit `.env.local`:

```bash
# Add this line to your .env.local file:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBk9H4xU7Tq5R3_example_key_get_your_own
```

**⚠️ Important:** Replace `AIzaSyBk9H4xU7Tq5R3_example_key_get_your_own` with your actual API key!

### Step 2: Get Your Free API Key

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable these APIs:
   - Maps JavaScript API
   - Maps Embed API
   - Places API
   - Geocoding API
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key
6. Paste it in `.env.local`

### Step 3: Restart Your Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Alternative: Skip Map for Now

If you don't want to set up Google Maps right now, the app will still work:
- ✅ Admin settings page will show helpful instructions instead of white screen
- ✅ Contact page will show a placeholder instead of error
- ✅ All other features work normally

You can add the API key later when you're ready!

## Cost Info:
- **FREE**: First $200/month (covers ~28,000 map loads)
- Most small businesses never exceed free tier

## Need Help?
See `GOOGLE_MAPS_SETUP.md` for detailed instructions with screenshots.


