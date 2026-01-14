/**
 * Script to set admin role for a user
 * Usage: node scripts/set-admin-role.js YOUR_EMAIL@example.com
 */

const dotenv = require('dotenv');
const admin = require('firebase-admin');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  const serviceAccount = {
    type: process.env.FIREBASE_ADMIN_TYPE,
    project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
    private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
    auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
    token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_CERT_URL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function setAdminRole(email) {
  try {
    console.log(`\n🔍 Looking for user with email: ${email}`);

    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found user: ${userRecord.displayName || 'No name'} (UID: ${userRecord.uid})`);

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'admin',
    });
    console.log(`✅ Admin role set in Firebase Auth`);

    // Update user document in Firestore
    await db.collection('users').doc(userRecord.uid).set(
      {
        role: 'admin',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`✅ Admin role updated in Firestore`);

    console.log(`\n🎉 SUCCESS! ${email} is now an admin!`);
    console.log(`\n⚠️  IMPORTANT: User must log out and log back in for changes to take effect.\n`);

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Error:`, error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('\n❌ Error: Email address required');
  console.log('\n📖 Usage: node scripts/set-admin-role.js YOUR_EMAIL@example.com\n');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('\n❌ Error: Invalid email format');
  process.exit(1);
}

setAdminRole(email);

