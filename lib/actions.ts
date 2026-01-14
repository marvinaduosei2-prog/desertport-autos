'use server';

import { adminDb, adminAuth, setUserRole as setRole } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// ==================== HELPER: Get Current User from Session ====================

async function getCurrentUserFromSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  
  if (!session) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(session);
    return decodedToken;
  } catch (error) {
    return null;
  }
}

// ==================== SITE CONFIG ACTIONS ====================

export async function updateSiteConfig(data: any) {
  try {
    const user = await getCurrentUserFromSession();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await adminDb.collection(COLLECTIONS.SITE_CONFIG).doc('main').set(
      {
        ...data,
        updatedAt: new Date(),
        updatedBy: user.uid,
      },
      { merge: true }
    );

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Update site config error:', error);
    return { success: false, error: error.message };
  }
}

export async function initializeSiteConfig() {
  try {
    const configDoc = await adminDb.collection(COLLECTIONS.SITE_CONFIG).doc('main').get();
    
    if (!configDoc.exists) {
      // Create default config
      const defaultConfig = {
        id: 'main',
        globalAlerts: [],
        hero: {
          videoUrl: '',
          fallbackImageUrl: '',
          headline: 'Welcome to DesertPort Autos',
          subheadline: 'Luxury vehicles for discerning drivers',
          ctaText: 'Browse Inventory',
          ctaLink: '/inventory',
          overlayOpacity: 50,
        },
        footerLinks: [
          { id: '1', label: 'About Us', url: '/about', section: 'company' },
          { id: '2', label: 'Contact', url: '/contact', section: 'company' },
          { id: '3', label: 'Privacy Policy', url: '/privacy', section: 'legal' },
          { id: '4', label: 'Terms of Service', url: '/terms', section: 'legal' },
        ],
        contactInfo: {
          phone: '(555) 123-4567',
          email: 'info@desertportautos.com',
          address: '123 Desert Road, Phoenix, AZ 85001',
          hours: 'Mon-Sat: 9AM-7PM, Sun: 10AM-5PM',
        },
        brandName: 'DesertPort Autos',
        brandLogo: '/logo.svg',
        updatedAt: new Date(),
        updatedBy: 'system',
      };

      await adminDb.collection(COLLECTIONS.SITE_CONFIG).doc('main').set(defaultConfig);
      return { success: true, data: defaultConfig };
    }

    return { success: true, data: configDoc.data() };
  } catch (error: any) {
    console.error('Initialize site config error:', error);
    return { success: false, error: error.message };
  }
}

// ==================== USER MANAGEMENT ACTIONS ====================

export async function setUserRole(uid: string, role: 'user' | 'admin') {
  try {
    const user = await getCurrentUserFromSession();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    // Set custom claim
    await setRole(uid, role);

    // Update Firestore document
    await adminDb.collection(COLLECTIONS.USERS).doc(uid).update({
      role,
      updatedAt: new Date(),
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Set user role error:', error);
    return { success: false, error: error.message };
  }
}

export async function getAllUsers() {
  try {
    const user = await getCurrentUserFromSession();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized', data: [] };
    }

    const usersSnapshot = await adminDb.collection(COLLECTIONS.USERS).get();
    const users = usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    } as any));

    return { success: true, data: users };
  } catch (error: any) {
    console.error('Get all users error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

// ==================== VEHICLE ACTIONS ====================

export async function createVehicle(data: any) {
  try {
    const user = await getCurrentUserFromSession();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const vehicleData = {
      ...data,
      views: 0,
      inquiries: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.uid,
    };

    const docRef = await adminDb.collection(COLLECTIONS.VEHICLES).add(vehicleData);

    revalidatePath('/inventory');
    revalidatePath('/admin/inventory');
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Create vehicle error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateVehicle(id: string, data: any) {
  try {
    const user = await getCurrentUserFromSession();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await adminDb.collection(COLLECTIONS.VEHICLES).doc(id).update({
      ...data,
      updatedAt: new Date(),
    });

    revalidatePath('/inventory');
    revalidatePath(`/inventory/${id}`);
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error: any) {
    console.error('Update vehicle error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteVehicle(id: string) {
  try {
    const user = await getCurrentUserFromSession();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await adminDb.collection(COLLECTIONS.VEHICLES).doc(id).delete();

    revalidatePath('/inventory');
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error: any) {
    console.error('Delete vehicle error:', error);
    return { success: false, error: error.message };
  }
}

// ==================== INQUIRY ACTIONS ====================

export async function createInquiry(data: any) {
  try {
    const inquiryData = {
      ...data,
      status: 'new',
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection(COLLECTIONS.INQUIRIES).add(inquiryData);

    // Increment vehicle inquiry count
    await adminDb.collection(COLLECTIONS.VEHICLES).doc(data.vehicleId).update({
      inquiries: (adminDb as any).FieldValue.increment(1),
    });

    revalidatePath('/admin/inquiries');
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Create inquiry error:', error);
    return { success: false, error: error.message };
  }
}

// ==================== CONTACT SUBMISSIONS ====================

export async function createContactSubmission(data: any) {
  try {
    const submissionData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      preferredContact: data.preferredContact || 'email',
      status: 'new',
      source: 'contact_form',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection('contact_submissions').add(submissionData);

    revalidatePath('/admin/contacts');
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Create contact submission error:', error);
    return { success: false, error: error.message };
  }
}

export async function getContactSubmissions() {
  try {
    const user = await getCurrentUserFromSession();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized', data: [] };
    }

    const snapshot = await adminDb
      .collection('contact_submissions')
      .orderBy('createdAt', 'desc')
      .get();

    const submissions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: submissions };
  } catch (error: any) {
    console.error('Get contact submissions error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function updateContactStatus(id: string, status: string) {
  try {
    const user = await getCurrentUserFromSession();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await adminDb.collection('contact_submissions').doc(id).update({
      status,
      updatedAt: new Date(),
    });

    revalidatePath('/admin/contacts');
    return { success: true };
  } catch (error: any) {
    console.error('Update contact status error:', error);
    return { success: false, error: error.message };
  }
}

export async function getInquiries() {
  try {
    const user = await getCurrentUserFromSession();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized', data: [] };
    }

    // Get all inquiries
    const inquiriesSnapshot = await adminDb.collection(COLLECTIONS.INQUIRIES).orderBy('createdAt', 'desc').get();
    const inquiries = await Promise.all(
      inquiriesSnapshot.docs.map(async (doc) => {
        const inquiry = doc.data();
        
        // Get associated vehicle data
        let vehicleData: any = null;
        if (inquiry.vehicleId) {
          try {
            const vehicleDoc = await adminDb.collection(COLLECTIONS.VEHICLES).doc(inquiry.vehicleId).get();
            if (vehicleDoc.exists) {
              vehicleData = {
                id: vehicleDoc.id,
                ...vehicleDoc.data(),
              };
            }
          } catch (e) {
            console.error('Error fetching vehicle:', e);
          }
        }

        return {
          id: doc.id,
          ...inquiry,
          vehicle: vehicleData,
        };
      })
    );

    return { success: true, data: inquiries };
  } catch (error: any) {
    console.error('Get inquiries error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function updateInquiryStatus(id: string, status: string) {
  try {
    const user = await getCurrentUserFromSession();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await adminDb.collection(COLLECTIONS.INQUIRIES).doc(id).update({
      status,
      updatedAt: new Date(),
      lastContactedAt: new Date(),
    });

    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (error: any) {
    console.error('Update inquiry status error:', error);
    return { success: false, error: error.message };
  }
}

export async function addInquiryNote(id: string, content: string) {
  try {
    const user = await getCurrentUserFromSession();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const userData = await adminDb.collection(COLLECTIONS.USERS).doc(user.uid).get();
    const userName = userData.data()?.displayName || 'Admin';

    const note = {
      id: Date.now().toString(),
      content,
      createdBy: user.uid,
      createdByName: userName,
      createdAt: new Date(),
    };

    await adminDb.collection(COLLECTIONS.INQUIRIES).doc(id).update({
      notes: (adminDb as any).FieldValue.arrayUnion(note),
      updatedAt: new Date(),
    });

    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (error: any) {
    console.error('Add inquiry note error:', error);
    return { success: false, error: error.message };
  }
}

// ==================== GARAGE ACTIONS ====================

export async function addToGarage(vehicleId: string, vehicleSnapshot: any) {
  try {
    const user = await getCurrentUserFromSession();
    if (!user) {
      return { success: false, error: 'Please sign in to add vehicles to your garage' };
    }

    const garageData = {
      userId: user.uid,
      vehicleId,
      vehicleSnapshot,
      addedAt: new Date(),
    };

    await adminDb.collection(COLLECTIONS.GARAGE).add(garageData);

    revalidatePath('/account');
    return { success: true };
  } catch (error: any) {
    console.error('Add to garage error:', error);
    return { success: false, error: error.message };
  }
}

export async function removeFromGarage(garageItemId: string) {
  try {
    const user = await getCurrentUserFromSession();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify ownership
    const garageItem = await adminDb.collection(COLLECTIONS.GARAGE).doc(garageItemId).get();
    if (garageItem.data()?.userId !== user.uid) {
      return { success: false, error: 'Unauthorized' };
    }

    await adminDb.collection(COLLECTIONS.GARAGE).doc(garageItemId).delete();

    revalidatePath('/account');
    return { success: true };
  } catch (error: any) {
    console.error('Remove from garage error:', error);
    return { success: false, error: error.message };
  }
}

// ==================== TICKET ACTIONS ====================

export async function createTicket(data: any) {
  try {
    const user = await getCurrentUserFromSession();
    if (!user) {
      return { success: false, error: 'Please sign in to create a support ticket' };
    }

    const userData = await adminDb.collection(COLLECTIONS.USERS).doc(user.uid).get();
    const userName = userData.data()?.displayName || 'User';

    const ticketData = {
      ...data,
      userId: user.uid,
      userName,
      status: 'open',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection(COLLECTIONS.TICKETS).add(ticketData);

    revalidatePath('/account');
    revalidatePath('/admin/tickets');
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Create ticket error:', error);
    return { success: false, error: error.message };
  }
}

export async function addTicketMessage(ticketId: string, content: string) {
  try {
    const user = await getCurrentUserFromSession();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const userData = await adminDb.collection(COLLECTIONS.USERS).doc(user.uid).get();
    const userName = userData.data()?.displayName || 'User';
    const userRole = userData.data()?.role || 'user';

    const message = {
      id: Date.now().toString(),
      content,
      sentBy: user.uid,
      sentByRole: userRole,
      sentByName: userName,
      createdAt: new Date(),
    };

    await adminDb.collection(COLLECTIONS.TICKETS).doc(ticketId).update({
      messages: (adminDb as any).FieldValue.arrayUnion(message),
      updatedAt: new Date(),
    });

    revalidatePath('/account');
    revalidatePath('/admin/tickets');
    return { success: true };
  } catch (error: any) {
    console.error('Add ticket message error:', error);
    return { success: false, error: error.message };
  }
}

