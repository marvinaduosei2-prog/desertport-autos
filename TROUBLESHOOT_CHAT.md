# 🔍 Chat Troubleshooting Checklist

You've created the index but messages still aren't showing. Let's diagnose!

---

## Step 1: Verify Index Status

1. Go to Firebase Console → Firestore Database → **Indexes** tab
2. Look for an index for **`chatMessages`**
3. **Check the status:**
   - ✅ **Green "Enabled"** = Good!
   - 🟡 **"Building..."** = Wait a few more minutes
   - 🔴 **"Error"** = Delete and recreate it

**What do you see?** _________________

---

## Step 2: Check Browser Console (CRITICAL!)

### Open Console:
1. Press **F12** in your browser
2. Click the **Console** tab
3. Make sure "All levels" is selected (not just errors)

### Test Admin Side:
1. Go to `/admin/support`
2. Select a chat session
3. Type "test" and send
4. **Look for these logs - COPY THEM HERE:**

```
Expected logs:
📤 Admin: Sending message: test
📋 Session ID: [some-id]
👤 Agent: [your-name]
📥 Agent API received: ...
📋 Session found: ...
✅ Agent message added: [firestore-id]
✅ Session updated
✅ Response: { success: true }
💬 Message sent successfully!
```

**What logs do you see?** (Copy paste them here)

---

## Step 3: Check Firebase Console - Messages Collection

1. Go to Firebase Console → Firestore Database → **Data** tab
2. Look for a collection called **`chatMessages`**
3. **Do you see any documents in it?**
   - If YES: How many? What's the most recent timestamp?
   - If NO: Messages aren't being saved!

**What do you see?** _________________

---

## Step 4: Check Firebase Console - Sessions Collection

1. In Firestore Database → **Data** tab
2. Click on **`chatSessions`** collection
3. Find your active session
4. **Check these fields:**
   - `status`: Should be `"pending_agent"` or `"with_agent"`
   - `agentId`: Should have your user ID
   - `agentName`: Should have your name
   - `sessionId`: Copy this ID

**Session ID:** _________________
**Status:** _________________
**Agent ID:** _________________

---

## Step 5: Verify Session ID Match

### In Browser Console:
After sending a message from admin, look for:
```
📋 Session ID: abc123xyz
```

### In Firebase Console:
1. Go to `chatMessages` collection
2. Click on any message document
3. Look at the `sessionId` field

**Do they match?** YES / NO

---

## Common Issues & Fixes

### Issue 1: Index Still Building
**Symptoms:** Console shows `failed-precondition` error
**Fix:** Wait 3-5 more minutes, then refresh the page

### Issue 2: Wrong Index Fields
**Symptoms:** Index shows "Enabled" but queries still fail
**Fix:** Delete the index and recreate with EXACTLY:
- Field 1: `sessionId` (Ascending)
- Field 2: `timestamp` (Ascending)

### Issue 3: Messages Not Saving
**Symptoms:** No documents in `chatMessages` collection
**Fix:** Check Firestore rules are deployed (see `DEPLOY_RULES_SIMPLE.md`)

### Issue 4: Session ID Mismatch
**Symptoms:** Messages exist but don't show for this session
**Fix:** Clear browser cache and start a new chat session

### Issue 5: Client Not Listening
**Symptoms:** Messages show in admin but not client
**Fix:** Check client console for errors, ensure chat widget is open

---

## Emergency Debug Commands

### Check if Firestore is Connected:
Open browser console and run:
```javascript
console.log('Firestore:', window.firebase || 'Not available');
```

### Force Refresh Messages:
In admin page, after sending message, run:
```javascript
location.reload();
```

### Check Local Storage:
```javascript
console.log('Session:', localStorage.getItem('chatSessionId'));
```

---

## What to Tell Me

Please copy and paste:

1. **Index Status:** (Enabled / Building / Error)
2. **Admin Console Logs:** (All the 📤 📋 ✅ logs when you send a message)
3. **Client Console Logs:** (Any 💬 or 🚨 logs)
4. **chatMessages Count:** (How many documents in Firebase)
5. **Session ID from logs:** (The ID shown in console)
6. **Session ID from Firebase:** (The ID in the database)
7. **Any Red Errors:** (Screenshot or copy paste)

With this info, I can tell you exactly what's wrong!


