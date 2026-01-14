// Load environment variables from .env.local first
require('dotenv').config({ path: '.env.local' });

const admin = require('firebase-admin');

// Get credentials from environment
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || 'desertport-autos';
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

if (!clientEmail || !privateKey) {
  console.error('❌ Error: Firebase Admin credentials not found in environment variables.');
  console.error('Please make sure .env.local is properly configured with:');
  console.error('- FIREBASE_ADMIN_PROJECT_ID');
  console.error('- FIREBASE_ADMIN_CLIENT_EMAIL');
  console.error('- FIREBASE_ADMIN_PRIVATE_KEY');
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

async function initializeSiteConfig() {
  try {
    console.log('🔄 Initializing site configuration...');

    const siteConfig = {
      id: 'main',
      brandName: 'DesertPort Autos',
      brandLogo: '/logo.svg',
      globalAlerts: [
        {
          id: '1',
          message: 'Welcome to DesertPort Autos! Browse our premium collection.',
          type: 'info',
          enabled: true,
          link: '/inventory',
          linkText: 'View Inventory',
        },
      ],
      hero: {
        videoUrl: 'https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4',
        fallbackImageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920',
        headlines: [
          'DRIVE THE FUTURE',
          'LUXURY REDEFINED',
          'POWER MEETS ELEGANCE',
          'YOUR DREAM AWAITS'
        ],
        subheadline: 'Experience automotive excellence redefined for the modern era',
        ctaText: 'Explore Collection',
        ctaLink: '/inventory',
        overlayOpacity: 50,
        rotationSpeed: 4, // seconds between headline changes
      },
      heroStats: [
        { id: '1', label: 'PREMIUM VEHICLES', value: '100+', enabled: true },
        { id: '2', label: 'YEARS EXCELLENCE', value: '15+', enabled: true },
        { id: '3', label: 'HAPPY CLIENTS', value: '1000+', enabled: true },
      ],
      floatingVideo: {
        enabled: true,
        videoUrl: 'https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4',
        title: 'Featured Showcase',
      },
      footerLinks: [
        { id: '1', label: 'About Us', url: '/about', section: 'company' },
        { id: '2', label: 'Contact', url: '/contact', section: 'company' },
        { id: '3', label: 'Careers', url: '/careers', section: 'company' },
        { id: '4', label: 'Privacy Policy', url: '/privacy', section: 'legal' },
        { id: '5', label: 'Terms of Service', url: '/terms', section: 'legal' },
        { id: '6', label: 'Facebook', url: 'https://facebook.com', section: 'social' },
        { id: '7', label: 'Instagram', url: 'https://instagram.com', section: 'social' },
        { id: '8', label: 'Twitter', url: 'https://twitter.com', section: 'social' },
      ],
      contactInfo: {
        phone: '(555) 123-4567',
        email: 'info@desertportautos.com',
        address: '123 Desert Road, Phoenix, AZ 85001',
        hours: 'Mon-Sat: 9AM-7PM, Sun: 10AM-5PM',
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: 'system',
    };

    await db.collection('site_config').doc('main').set(siteConfig);
    console.log('✅ Site configuration initialized successfully!');

    // Create a sample vehicle for testing
    console.log('🔄 Creating sample vehicle...');
    
    const sampleVehicle = {
      specs: {
        year: 2024,
        make: 'Porsche',
        model: '911 Carrera',
        trim: 'S',
        vin: '1HGBH41JXMN109186',
        mileage: 500,
        condition: 'new',
        exteriorColor: 'Guards Red',
        interiorColor: 'Black Leather',
        transmission: 'dual-clutch',
        drivetrain: 'rwd',
        fuelType: 'gasoline',
        engine: '3.0L Twin-Turbo Flat-6',
        horsepower: 443,
        torque: 390,
      },
      price: 129900,
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
      ],
      thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
      description: 'Experience the legendary 911 in its purest form. This 2024 Carrera S combines timeless design with cutting-edge performance. The twin-turbocharged flat-six engine delivers exhilarating power while maintaining the efficiency expected of a modern sports car.',
      features: [
        'Porsche Communication Management (PCM)',
        'Sport Chrono Package',
        'Adaptive Sport Seats Plus',
        'Premium Sound System',
        'LED Headlights with PDLS+',
        'Porsche Active Suspension Management',
        'Sport Exhaust System',
        'Apple CarPlay & Android Auto',
      ],
      isFeatured: true,
      views: 0,
      inquiries: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'system',
    };

    await db.collection('vehicles').add(sampleVehicle);
    console.log('✅ Sample vehicle created successfully!');

    console.log('\n🎉 All done! Your database is ready.');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Sign up for an account at http://localhost:3000/signup');
    console.log('3. Get your user UID from Firebase Console → Authentication');
    console.log('4. Set your role to "admin" in Firestore → users → [your-uid] → role: "admin"');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeSiteConfig();

