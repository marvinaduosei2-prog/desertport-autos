# 🚀 QUICK SETUP GUIDE - COMPLETE THESE STEPS

## ✅ STATUS: Steps 1-6 DONE! 

You've already completed:
- ✅ Created Firebase project
- ✅ Enabled Authentication
- ✅ Created Firestore Database
- ✅ Applied Security Rules
- ✅ Enabled Storage
- ✅ Got Client SDK credentials
- ✅ Downloaded Admin SDK JSON file
- ✅ Installed npm packages

---

## 📝 REMAINING STEPS (Do these now):

### **STEP 8: Configure .env.local** ⚠️ CRITICAL

1. **Open your downloaded JSON file** (from Step 7) in a text editor
2. **Find these 3 values:**
   - `project_id` (should be: `desertport-autos`)
   - `client_email` (looks like: `firebase-adminsdk-xxxxx@desertport-autos.iam.gserviceaccount.com`)
   - `private_key` (starts with: `-----BEGIN PRIVATE KEY-----`)

3. **In your project folder**, create/edit the file `.env.local`

4. **Copy this template and fill in your values:**

```env
# Firebase Client SDK (Public - Safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCIPRp_uENoBwflHFvPC-PjUI_UQUKbvdM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=desertport-autos.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=desertport-autos
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=desertport-autos.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=148174990408
NEXT_PUBLIC_FIREBASE_APP_ID=1:148174990408:web:c6286e08101c53faed3c7d

# Firebase Admin SDK (Private - Server-side only)
# Replace the values below with YOUR values from the JSON file:
FIREBASE_ADMIN_PROJECT_ID=desertport-autos
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@desertport-autos.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**IMPORTANT:** 
- Keep the quotes around the private_key
- The `\n` characters should stay in the key
- Don't add any extra spaces or line breaks

5. **Save the file**

**✅ When done, tell me: "Step 8 done"**

---

### **STEP 9: Initialize Database** 

Once your `.env.local` is ready, run this command:

```bash
node scripts/init-database.js
```

This will:
- ✅ Create the site configuration
- ✅ Add a sample vehicle (Porsche 911)
- ✅ Set up default alerts and footer links

**✅ When done, tell me: "Step 9 done"**

---

### **STEP 10: Start the Development Server**

Run:

```bash
npm run dev
```

Open your browser to: http://localhost:3000

You should see:
- ✅ The homepage with hero section
- ✅ Navigation bar
- ✅ AI Chat widget in bottom right

**✅ When done, tell me: "Step 10 done - app is running"**

---

### **STEP 11: Create Your Admin Account**

1. **Go to:** http://localhost:3000/signup
2. **Fill in the form:**
   - Name: Your name
   - Email: Your email
   - Phone: Your phone
   - Password: Choose a password
3. **Click "Sign Up"**
4. **Check your email** for verification (you can skip verification for now)

**✅ When done, tell me: "Step 11 done - I created an account"**

---

### **STEP 12: Make Yourself Admin**

1. **Go to Firebase Console:** https://console.firebase.google.com/
2. **Navigate to:** Authentication → Users
3. **Find your email** in the list
4. **Copy your User UID** (long string like: `abc123xyz456`)
5. **Go to:** Firestore Database → `users` collection
6. **Click on your user document** (using the UID you copied)
7. **Find the field:** `role`
8. **Change it from** `user` **to** `admin`
9. **Save**

10. **Refresh your browser** (on localhost:3000)
11. **You should now see** "Admin" button in the navigation

**✅ When done, tell me: "Step 12 done - I'm now an admin"**

---

## 🎉 WHAT TO DO AFTER SETUP

Once all steps are complete, test these features:

1. **Homepage:**
   - Hero section loads
   - Alert bar appears
   - Footer shows

2. **Authentication:**
   - Sign out and sign in again
   - Email verification banner appears

3. **Admin Panel:**
   - Click "Admin" in navigation
   - Dashboard shows
   - Check Inquiries page
   - Check Users page

4. **Create a test inquiry:**
   - Click on the sample Porsche (if you can navigate to it)
   - Or we'll add inventory page next

---

## ⚠️ TROUBLESHOOTING

**If you see errors:**

### "Firebase: Error (auth/invalid-api-key)"
→ Check `.env.local` - API key might be wrong

### "Permission denied" in Firestore
→ Check security rules are applied

### "Cannot read properties of undefined"
→ Restart dev server: Stop with Ctrl+C, run `npm run dev` again

### App won't start
→ Check `.env.local` exists and has all values filled in

---

## 📋 YOUR CURRENT PROGRESS

```
[✅] Step 1-6: Firebase setup
[✅] Step 7: Admin SDK downloaded
[⏳] Step 8: Configure .env.local ← DO THIS FIRST
[⏳] Step 9: Initialize database
[⏳] Step 10: Start dev server
[⏳] Step 11: Create admin account
[⏳] Step 12: Set admin role
```

---

## 🎯 START HERE:

**Right now, complete Step 8:**
1. Open your JSON file
2. Find the 3 values (project_id, client_email, private_key)
3. Create/edit `.env.local`
4. Paste the template above
5. Replace the placeholder values
6. Save the file
7. Tell me "Step 8 done"

I'm here to help if you get stuck! 🚀

