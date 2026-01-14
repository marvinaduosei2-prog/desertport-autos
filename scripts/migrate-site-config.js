/**
 * Migrate site config to new structure for Site Builder
 */

const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config({ path: '.env.local' });

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

if (admin.apps.length === 0) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

async function migrateSiteConfig() {
  try {
    console.log('🔄 Starting site config migration...\n');

    const docRef = db.collection('site_config').doc('main');
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log('❌ No site config found');
      process.exit(1);
    }

    const current = doc.data();
    console.log('📄 Current config loaded');

    // Build new structure while preserving existing data
    const updated = {
      ...current,
      
      // NAVIGATION - Convert from hardcoded to editable
      navigation: {
        logoText: current.brandName || 'DesertPort Autos',
        menuItems: [
          { id: '1', label: 'INVENTORY', href: '/inventory', enabled: true },
          { id: '2', label: 'ABOUT', href: '/about', enabled: true },
          { id: '3', label: 'EXPERIENCE', href: '#experience', enabled: true },
          { id: '4', label: 'CONTACT', href: '/contact', enabled: true },
        ]
      },

      // HERO - Convert single headline to array
      hero: {
        ...current.hero,
        videoUrl: current.hero?.videoUrl || '',
        headlines: current.hero?.headlines || [
          { id: '1', text: current.hero?.headline || 'DRIVE THE FUTURE' },
          { id: '2', text: 'LUXURY REDEFINED' },
          { id: '3', text: 'POWER MEETS ELEGANCE' },
          { id: '4', text: 'YOUR DREAM AWAITS' }
        ],
        rotationSpeed: current.hero?.rotationSpeed || 4,
        stats: current.hero?.stats || [
          { id: '1', label: 'Premium Vehicles', value: '100+', icon: 'car', enabled: true },
          { id: '2', label: 'Years Excellence', value: '15+', icon: 'award', enabled: true },
          { id: '3', label: 'Happy Clients', value: '1000+', icon: 'users', enabled: true }
        ]
      },

      // ABOUT SECTION
      about: {
        title: 'Why Choose Us',
        subtitle: 'Excellence in Every Detail',
        cards: [
          { id: '1', icon: 'shield', title: 'Trusted Quality', description: 'Every vehicle undergoes rigorous inspection' },
          { id: '2', icon: 'star', title: 'Premium Selection', description: 'Curated collection of luxury vehicles' },
          { id: '3', icon: 'check', title: 'Certified Service', description: 'Professional service and maintenance' }
        ]
      },

      // CATEGORIES SECTION
      categories: {
        title: 'Browse by Category',
        subtitle: 'Find Your Perfect Ride',
        items: [
          { 
            id: '1', 
            name: 'Luxury Sedans', 
            description: 'Premium comfort and performance',
            imageUrl: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800',
            link: '/inventory?category=sedan'
          },
          { 
            id: '2', 
            name: 'Sports Cars', 
            description: 'Unleash the power',
            imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f1b0f?w=800',
            link: '/inventory?category=sports'
          },
          { 
            id: '3', 
            name: 'SUVs', 
            description: 'Adventure ready vehicles',
            imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
            link: '/inventory?category=suv'
          },
          { 
            id: '4', 
            name: 'Electric', 
            description: 'The future of driving',
            imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
            link: '/inventory?category=electric'
          }
        ]
      },

      // EXPERIENCE SECTION
      experience: {
        title: 'The DesertPort Experience',
        subtitle: 'More Than Just A Car Dealership',
        features: [
          { id: '1', icon: 'star', title: 'Premium Quality', description: 'Hand-selected vehicles that exceed expectations' },
          { id: '2', icon: 'shield', title: 'Warranty Coverage', description: 'Comprehensive protection for peace of mind' },
          { id: '3', icon: 'award', title: 'Award Winning', description: 'Recognized for excellence in customer service' },
          { id: '4', icon: 'thumbs-up', title: 'Customer First', description: 'Your satisfaction is our top priority' }
        ]
      },

      // TESTIMONIALS SECTION
      testimonials: {
        title: 'What Our Clients Say',
        subtitle: 'Real Stories from Real Customers',
        items: [
          { 
            id: '1', 
            name: 'John Smith', 
            role: 'Business Owner', 
            quote: 'Exceptional service and quality. Found my dream car here!',
            avatar: '',
            rating: 5
          },
          { 
            id: '2', 
            name: 'Sarah Johnson', 
            role: 'Engineer', 
            quote: 'Professional team and amazing selection. Highly recommended!',
            avatar: '',
            rating: 5
          },
          { 
            id: '3', 
            name: 'Michael Chen', 
            role: 'Entrepreneur', 
            quote: 'Best car buying experience ever. They made it so easy!',
            avatar: '',
            rating: 5
          }
        ]
      },

      // FOOTER - Reorganize existing footerLinks
      footer: {
        companyName: current.brandName || 'DesertPort Autos',
        tagline: 'Premium vehicles crafted for excellence',
        email: current.contactInfo?.email || 'info@desertportautos.com',
        phone: current.contactInfo?.phone || '(555) 123-4567',
        quickLinks: (current.footerLinks || [])
          .filter(link => link.section === 'company')
          .map(link => ({ id: link.id, label: link.label, href: link.url })),
        resources: [
          { id: 'r1', label: 'Financing', href: '/financing' },
          { id: 'r2', label: 'Trade-In', href: '/trade-in' },
          { id: 'r3', label: 'FAQ', href: '/faq' }
        ],
        legal: (current.footerLinks || [])
          .filter(link => link.section === 'legal')
          .map(link => ({ id: link.id, label: link.label, href: link.url })),
      },

      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: 'migration-script'
    };

    await docRef.set(updated, { merge: false });

    console.log('\n✅ Migration complete!');
    console.log('\n📊 Summary:');
    console.log(`   • Navigation: ${updated.navigation.menuItems.length} menu items`);
    console.log(`   • Hero: ${updated.hero.headlines.length} headlines, ${updated.hero.stats.length} stats`);
    console.log(`   • About: ${updated.about.cards.length} cards`);
    console.log(`   • Categories: ${updated.categories.items.length} categories`);
    console.log(`   • Experience: ${updated.experience.features.length} features`);
    console.log(`   • Testimonials: ${updated.testimonials.items.length} testimonials`);
    console.log(`   • Footer: ${updated.footer.quickLinks.length} quick links, ${updated.footer.legal.length} legal links`);
    console.log('\n🎉 Your site config is now ready for the Site Builder!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateSiteConfig();


