import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  QueryConstraint,
  DocumentData,
  WithFieldValue
} from 'firebase/firestore';
import { db } from './config';
import type { 
  Vehicle, 
  User, 
  SiteConfig, 
  Inquiry,
  GarageItem,
  Purchase,
  SupportTicket
} from '@/types/database';

// ==================== COLLECTION NAMES ====================
export const COLLECTIONS = {
  USERS: 'users',
  VEHICLES: 'vehicles',
  INQUIRIES: 'inquiries',
  CONTACTS: 'contact_submissions',
  GARAGE: 'garage',
  PURCHASES: 'purchases',
  TICKETS: 'support_tickets',
  SITE_CONFIG: 'site_config',
  PAGE_VIEWS: 'page_views',
  VEHICLE_VIEWS: 'vehicle_views',
} as const;

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert Firestore Timestamp to ISO string for client
 */
export function serializeTimestamp(timestamp: Timestamp | undefined): string {
  if (!timestamp) return new Date().toISOString();
  return timestamp.toDate().toISOString();
}

/**
 * Convert ISO string to Firestore Timestamp
 */
export function deserializeTimestamp(isoString: string): Timestamp {
  return Timestamp.fromDate(new Date(isoString));
}

/**
 * Generic fetch document
 */
export async function fetchDocument<T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching document from ${collectionName}:`, error);
    return null;
  }
}

/**
 * Generic fetch collection with query
 */
export async function fetchCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
    const querySnapshot = await getDocs(q as any);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any)
    })) as T[];
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return [];
  }
}

// ==================== SITE CONFIG ====================

export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  return fetchDocument<SiteConfig>(COLLECTIONS.SITE_CONFIG, 'main');
}

// ==================== VEHICLES ====================

export async function fetchVehicle(id: string): Promise<Vehicle | null> {
  return fetchDocument<Vehicle>(COLLECTIONS.VEHICLES, id);
}

export async function fetchVehicles(filters?: {
  status?: string;
  isFeatured?: boolean;
  limitCount?: number;
}): Promise<Vehicle[]> {
  const constraints: QueryConstraint[] = [];
  
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }
  
  if (filters?.isFeatured !== undefined) {
    constraints.push(where('isFeatured', '==', filters.isFeatured));
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  
  if (filters?.limitCount) {
    constraints.push(limit(filters.limitCount));
  }
  
  return fetchCollection<Vehicle>(COLLECTIONS.VEHICLES, constraints);
}

export async function searchVehicles(searchTerm: string): Promise<Vehicle[]> {
  // Note: For production, consider using Algolia or Typesense for full-text search
  // This is a basic implementation
  const vehicles = await fetchCollection<Vehicle>(COLLECTIONS.VEHICLES);
  
  const lowerSearch = searchTerm.toLowerCase();
  return vehicles.filter(vehicle => 
    vehicle.specs.make.toLowerCase().includes(lowerSearch) ||
    vehicle.specs.model.toLowerCase().includes(lowerSearch) ||
    vehicle.description.toLowerCase().includes(lowerSearch)
  );
}

// ==================== USER ====================

export async function fetchUser(uid: string): Promise<User | null> {
  return fetchDocument<User>(COLLECTIONS.USERS, uid);
}

// ==================== INQUIRIES ====================

export async function fetchInquiry(id: string): Promise<Inquiry | null> {
  return fetchDocument<Inquiry>(COLLECTIONS.INQUIRIES, id);
}

export async function fetchUserInquiries(userId: string): Promise<Inquiry[]> {
  return fetchCollection<Inquiry>(COLLECTIONS.INQUIRIES, [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ]);
}

export async function fetchVehicleInquiries(vehicleId: string): Promise<Inquiry[]> {
  return fetchCollection<Inquiry>(COLLECTIONS.INQUIRIES, [
    where('vehicleId', '==', vehicleId),
    orderBy('createdAt', 'desc')
  ]);
}

// ==================== GARAGE (WISHLIST) ====================

export async function fetchUserGarage(userId: string): Promise<GarageItem[]> {
  return fetchCollection<GarageItem>(COLLECTIONS.GARAGE, [
    where('userId', '==', userId),
    orderBy('addedAt', 'desc')
  ]);
}

// ==================== PURCHASES ====================

export async function fetchUserPurchases(userId: string): Promise<Purchase[]> {
  return fetchCollection<Purchase>(COLLECTIONS.PURCHASES, [
    where('userId', '==', userId),
    orderBy('purchaseDate', 'desc')
  ]);
}

// ==================== SUPPORT TICKETS ====================

export async function fetchUserTickets(userId: string): Promise<SupportTicket[]> {
  return fetchCollection<SupportTicket>(COLLECTIONS.TICKETS, [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ]);
}

export async function fetchTicket(id: string): Promise<SupportTicket | null> {
  return fetchDocument<SupportTicket>(COLLECTIONS.TICKETS, id);
}

