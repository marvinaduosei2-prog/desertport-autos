import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const { email, secretKey } = await request.json();

    // Simple secret key check (you can change this)
    if (secretKey !== 'DESERTPORT_ADMIN_SETUP_2024') {
      return NextResponse.json(
        { error: 'Invalid secret key' },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get user by email
    const userRecord = await adminAuth.getUserByEmail(email);

    // Set custom claims
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      role: 'admin',
    });

    // Update user document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set(
      {
        role: 'admin',
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: `Admin role granted to ${email}`,
      uid: userRecord.uid,
    });
  } catch (error: any) {
    console.error('Error setting admin role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set admin role' },
      { status: 500 }
    );
  }
}

