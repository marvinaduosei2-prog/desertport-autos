import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const { pageName, sections, siteConfig, isDraft } = await request.json();

    console.log('💾 Saving site config...');

    // Save to Firestore
    const docRef = adminDb.collection('site_config').doc('main');
    
    await docRef.set({
      ...siteConfig,
      updatedAt: new Date(),
      updatedBy: 'site-builder'
    }, { merge: true });

    console.log('✅ Saved successfully');

    return NextResponse.json({
      success: true,
      message: 'Site configuration saved successfully',
    });
  } catch (error: any) {
    console.error('❌ Error saving site builder config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save configuration' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📥 Fetching site config from Firestore...');
    
    // Fetch from Firestore using Admin SDK
    const doc = await adminDb.collection('site_config').doc('main').get();

    if (!doc.exists) {
      console.log('❌ Config not found');
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    const data = doc.data();
    console.log('✅ Config fetched successfully:', {
      hasHero: !!data?.hero,
      heroHeadlines: data?.hero?.headlines?.length || 0,
      hasNavigation: !!data?.navigation,
      navItems: data?.navigation?.menuItems?.length || 0,
    });

    return NextResponse.json({
      success: true,
      config: {
        id: doc.id,
        ...data,
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching site builder config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}
