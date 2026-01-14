// Client-side types (stripped of Firestore Timestamp)

import { UserRole, VehicleStatus, VehicleCondition, InquiryStatus, InquirySource, PurchaseStatus, TicketStatus, TicketPriority } from './database';

export type {
  UserRole,
  VehicleStatus,
  VehicleCondition,
  InquiryStatus,
  InquirySource,
  PurchaseStatus,
  TicketStatus,
  TicketPriority,
};

// Serializable versions (Date instead of Timestamp)
export interface UserData {
  uid: string;
  email: string;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string; // ISO string
  updatedAt: string;
}

export interface VehicleData {
  id: string;
  specs: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    vin: string;
    mileage: number;
    condition: VehicleCondition;
    exteriorColor: string;
    interiorColor: string;
    transmission: 'automatic' | 'manual' | 'cvt' | 'dual-clutch';
    drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd';
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plug-in-hybrid';
    engine: string;
    horsepower: number;
    torque: number;
  };
  price: number;
  status: VehicleStatus;
  images: string[];
  thumbnailUrl: string;
  description: string;
  features: string[];
  isFeatured: boolean;
  views: number;
  inquiries: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface InquiryData {
  id: string;
  vehicleId: string;
  vehicleSnapshot: {
    make: string;
    model: string;
    year: number;
    price: number;
    thumbnailUrl: string;
  };
  name: string;
  email: string;
  phone: string;
  userId?: string;
  source: InquirySource;
  message?: string;
  status: InquiryStatus;
  assignedTo?: string;
  notes: Array<{
    id: string;
    content: string;
    createdBy: string;
    createdByName: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

export interface SiteConfigData {
  id: 'main';
  globalAlerts: Array<{
    id: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    enabled: boolean;
    link?: string;
    linkText?: string;
  }>;
  hero: {
    videoUrl: string;
    fallbackImageUrl?: string;
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
    overlayOpacity: number;
  };
  footerLinks: Array<{
    id: string;
    label: string;
    url: string;
    section: 'company' | 'legal' | 'social';
  }>;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  brandName: string;
  brandLogo: string;
  updatedAt: string;
  updatedBy: string;
}

export interface GarageItemData {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleSnapshot: {
    make: string;
    model: string;
    year: number;
    price: number;
    thumbnailUrl: string;
    status: VehicleStatus;
  };
  addedAt: string;
  notes?: string;
}

export interface PurchaseData {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleSnapshot: {
    make: string;
    model: string;
    year: number;
    price: number;
    vin: string;
    thumbnailUrl: string;
  };
  finalPrice: number;
  status: PurchaseStatus;
  purchaseDate: string;
  deliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketData {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: 'general' | 'technical' | 'billing' | 'vehicle_inquiry';
  status: TicketStatus;
  priority: TicketPriority;
  messages: Array<{
    id: string;
    content: string;
    sentBy: string;
    sentByRole: UserRole;
    sentByName: string;
    createdAt: string;
    attachments?: string[];
  }>;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

