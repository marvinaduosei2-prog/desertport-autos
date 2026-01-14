import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
  updatePassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { COLLECTIONS } from './db';
import type { User } from '@/types/database';

// ==================== AUTH FUNCTIONS ====================

/**
 * Sign up new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string,
  phoneNumber: string
): Promise<{ user: FirebaseUser; error?: string }> {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const userData: User = {
      uid: user.uid,
      email: user.email!,
      displayName,
      phoneNumber,
      photoURL: null,
      role: 'user', // Default role
      emailVerified: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userData);

    // Send email verification
    await sendEmailVerification(user);

    return { user };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { 
      user: null as any, 
      error: error.message || 'Failed to create account' 
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ user: FirebaseUser; error?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { 
      user: null as any, 
      error: error.message || 'Failed to sign in' 
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error?: string }> {
  try {
    await firebaseSignOut(auth);
    return {};
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { error: error.message || 'Failed to sign out' };
  }
}

/**
 * Send email verification
 */
export async function sendVerificationEmail(): Promise<{ error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: 'No user logged in' };
    }
    await sendEmailVerification(user);
    return {};
  } catch (error: any) {
    console.error('Email verification error:', error);
    return { error: error.message || 'Failed to send verification email' };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<{ error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return {};
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { error: error.message || 'Failed to send password reset email' };
  }
}

/**
 * Update user password
 */
export async function changePassword(newPassword: string): Promise<{ error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: 'No user logged in' };
    }
    await updatePassword(user, newPassword);
    return {};
  } catch (error: any) {
    console.error('Password change error:', error);
    return { error: error.message || 'Failed to change password' };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: {
  displayName?: string;
  phoneNumber?: string;
}): Promise<{ error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: 'No user logged in' };
    }

    // Update auth profile
    if (data.displayName) {
      await updateProfile(user, { displayName: data.displayName });
    }

    // Update Firestore document
    await setDoc(
      doc(db, COLLECTIONS.USERS, user.uid),
      {
        ...data,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    return {};
  } catch (error: any) {
    console.error('Profile update error:', error);
    return { error: error.message || 'Failed to update profile' };
  }
}

/**
 * Get current user from Firestore
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data() as User;

    // Sync emailVerified status from Firebase Auth to Firestore if different
    if (userData.emailVerified !== user.emailVerified) {
      await setDoc(
        doc(db, COLLECTIONS.USERS, user.uid),
        { emailVerified: user.emailVerified, updatedAt: Timestamp.now() },
        { merge: true }
      );
      userData.emailVerified = user.emailVerified;
    }

    return { id: userDoc.id, ...userData } as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthChanged(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get user role from custom claims
 */
export async function getUserRole(): Promise<'user' | 'admin'> {
  try {
    const user = auth.currentUser;
    if (!user) return 'user';

    // Force token refresh to get latest custom claims
    const idTokenResult = await user.getIdTokenResult(true);
    return (idTokenResult.claims.role as 'user' | 'admin') || 'user';
  } catch (error) {
    console.error('Get user role error:', error);
    return 'user';
  }
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'admin';
}

