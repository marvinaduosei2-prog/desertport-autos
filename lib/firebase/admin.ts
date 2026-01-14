import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK (server-side only)
function initAdmin() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!privateKey || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PROJECT_ID) {
    throw new Error('Missing Firebase Admin credentials. Please check your .env.local file.');
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

// Export initialized services
export const adminApp = initAdmin();
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export const FieldValue = admin.firestore.FieldValue;

// Helper to verify ID tokens
export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
}

// Helper to set custom claims (for role management)
export async function setUserRole(uid: string, role: 'user' | 'admin') {
  try {
    await adminAuth.setCustomUserClaims(uid, { role });
    return true;
  } catch (error) {
    console.error('Error setting custom claims:', error);
    return false;
  }
}

// Helper to get user with custom claims
export async function getUserWithClaims(uid: string) {
  try {
    const user = await adminAuth.getUser(uid);
    return {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      role: (user.customClaims?.role as 'user' | 'admin') || 'user',
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

