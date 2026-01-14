# QUICK FIX: Firebase Storage Rules

## The Problem:
- "Failed to upload logo" error
- Firebase Storage doesn't have proper rules set

## Quick Fix (2 minutes):

### Option 1: Via Firebase Console (Easiest)

1. Go to: https://console.firebase.google.com/
2. Select your project
3. Click **"Storage"** in left sidebar
4. Click **"Rules"** tab
5. **Replace** all content with this:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Branding assets (logo, favicon)
    match /branding/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Vehicle images
    match /vehicles/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Spare parts images
    match /spare-parts/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Category images
    match /categories/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Testimonial images
    match /testimonials/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

6. Click **"Publish"**
7. Done! ✅

### Option 2: Via Firebase CLI (If you prefer)

```bash
cd "/Users/marvin/Desktop/DesertPort Autos"
firebase deploy --only storage
```

## What These Rules Do:

✅ **Anyone** can READ images (public access)
✅ **Only authenticated users** can WRITE/DELETE
✅ Organized by folder (branding, vehicles, spare-parts, etc.)
✅ Secure and production-ready

## After Deploying:

1. Go back to Admin Dashboard
2. Try uploading logo again
3. Should work perfectly! 🎉

## Troubleshooting:

**Still not working?**
- Make sure you're logged in as admin
- Check browser console for errors
- Verify Firebase Storage is enabled in Firebase Console
- Check that your storage bucket is set up

**Need to enable Storage?**
1. Go to Firebase Console → Storage
2. Click "Get Started"
3. Use default rules (we'll override them)
4. Click "Done"
5. Then deploy the rules above


