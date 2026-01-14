import { Timestamp } from 'firebase/firestore';

// ==================== USER & AUTH ====================

export type UserRole = 'user' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== SITE CONFIG (CMS) ====================

export interface GlobalAlert {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  enabled: boolean;
  link?: string;
  linkText?: string;
}

// Design System Types
export interface DesignColors {
  background: string;
  text: string;
  accent: string;
  border: string;
}

export interface DesignTypography {
  fontFamily: string;
  fontSize: {
    heading: string;
    subheading: string;
    body: string;
    small: string;
  };
  fontWeight: {
    heading: string;
    subheading: string;
    body: string;
  };
  lineHeight: {
    heading: string;
    body: string;
  };
  letterSpacing: {
    heading: string;
    body: string;
  };
}

export interface DesignSpacing {
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  marginTop: string;
  marginBottom: string;
  gap: string;
}

export interface DesignLayout {
  maxWidth: string;
  textAlign: string;
}

export interface DesignAnimations {
  entrance: {
    type: string;
    duration: number;
    delay: number;
    easing: string;
  };
  hover: {
    scale: number;
    rotate: number;
    translateY: number;
    brightness: number;
  };
  scroll: {
    parallax: boolean;
    parallaxSpeed: number;
    fadeOnScroll: boolean;
  };
}

export interface DesignAssets {
  backgroundImage: string;
  backgroundVideo: string;
  featuredImage: string;
}

export interface SectionDesign {
  colors: DesignColors;
  typography: DesignTypography;
  spacing: DesignSpacing;
  layout: DesignLayout;
  animations: DesignAnimations;
  assets: DesignAssets;
}

// Hero Section Types
export interface HeroHeadline {
  id: string;
  text: string;
}

export interface HeroStat {
  id: string;
  label: string;
  value: string;
  icon?: string;
  enabled: boolean;
}

export interface HeroConfig {
  videoUrl: string;
  fallbackImageUrl?: string;
  headlines: HeroHeadline[]; // Multiple rotating headlines
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  overlayOpacity: number; // 0-100
  rotationSpeed: number; // seconds between headline changes
  stats: HeroStat[];
  design?: SectionDesign;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  section: 'company' | 'legal' | 'social';
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

// Navigation Types
export interface NavMenuItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
}

export interface NavigationConfig {
  logoText: string;
  menuItems: NavMenuItem[];
  design?: SectionDesign;
}

// About Section Types
export interface AboutCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutConfig {
  title: string;
  subtitle: string;
  heading: string;
  subheading: string;
  cards: AboutCard[];
  design?: SectionDesign;
}

// Categories Section Types
export interface CategoryCard {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  link: string;
}

export interface CategoriesConfig {
  title: string;
  subtitle: string;
  cards: CategoryCard[];
  design?: SectionDesign;
}

// Experience Section Types
export interface ExperienceFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ExperienceConfig {
  title: string;
  subtitle: string;
  features: ExperienceFeature[];
  benefits?: string[];
  imageUrl?: string;
  design?: SectionDesign;
}

// Testimonials Section Types
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
  rating: number;
}

export interface TestimonialsConfig {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
  design?: SectionDesign;
}

// Footer Types
export interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
}

export interface FooterConfig {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  quickLinks: FooterLinkItem[];
  resourcesLinks: FooterLinkItem[];
  legalLinks: FooterLinkItem[];
  design?: SectionDesign;
}

export interface SiteConfig {
  id: 'main'; // Single document
  
  // Section Configurations
  navigation: NavigationConfig;
  hero: HeroConfig;
  about: AboutConfig;
  categories: CategoriesConfig;
  experience: ExperienceConfig;
  testimonials: TestimonialsConfig;
  footer: FooterConfig;
  
  // Optional Features
  globalAlerts?: GlobalAlert[];
  floatingVideo?: {
    enabled: boolean;
    videoUrl: string;
    title: string;
  };
  
  // Deprecated (kept for backwards compatibility)
  heroStats?: HeroStat[];
  footerLinks?: FooterLink[];
  contactInfo?: ContactInfo;
  brandName?: string;
  brandLogo?: string;
  
  // Metadata
  updatedAt: Timestamp;
  updatedBy: string; // Admin UID
}

// ==================== VEHICLES ====================

export type VehicleStatus = 'available' | 'reserved' | 'sold' | 'coming_soon';
export type VehicleCondition = 'new' | 'used' | 'certified';

export interface VehicleSpecs {
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
  engine: string; // e.g., "3.0L V6"
  horsepower: number;
  torque: number; // lb-ft
}

export interface Vehicle {
  id: string;
  specs: VehicleSpecs;
  price: number;
  status: VehicleStatus;
  images: string[]; // Firebase Storage URLs
  thumbnailUrl: string;
  description: string;
  features: string[];
  isFeatured: boolean;
  views: number;
  inquiries: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // Admin UID
}

// ==================== SPARE PARTS ====================

export type SparePartCondition = 'new' | 'used' | 'refurbished' | 'oem' | 'aftermarket';
export type SparePartStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
export type SparePartCategory = 
  | 'engine_parts'
  | 'transmission'
  | 'brakes'
  | 'suspension'
  | 'electrical'
  | 'body_parts'
  | 'interior'
  | 'wheels_tires'
  | 'accessories'
  | 'fluids_filters'
  | 'lighting'
  | 'exhaust'
  | 'cooling'
  | 'other';

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  manufacturer: string;
  category: SparePartCategory;
  subcategory?: string;
  condition: SparePartCondition;
  status: SparePartStatus;
  price: number;
  compareAtPrice?: number; // Original price for sale items
  stockQuantity: number;
  minStockLevel?: number; // Alert when stock falls below this
  images: string[]; // Firebase Storage URLs
  thumbnailUrl: string;
  description: string;
  specifications: Record<string, string>; // e.g., { "Weight": "2.5kg", "Dimensions": "10x5x3cm" }
  compatibleVehicles: string[]; // e.g., ["BMW 3 Series 2015-2020", "BMW X5 2018+"]
  warranty?: string; // e.g., "6 months", "1 year"
  isFeatured: boolean;
  views: number;
  orders: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // Admin UID
}

// ==================== INQUIRIES ====================

export type InquiryStatus = 'new' | 'contacted' | 'qualified' | 'negotiating' | 'closed_won' | 'closed_lost';
export type InquirySource = 'guest' | 'registered';

export interface Inquiry {
  id: string;
  vehicleId: string;
  vehicleSnapshot: {
    make: string;
    model: string;
    year: number;
    price: number;
    thumbnailUrl: string;
  };
  
  // Contact Info
  name: string;
  email: string;
  phone: string;
  
  // User Info
  userId?: string; // Present if user is registered
  source: InquirySource;
  
  // Inquiry Details
  message?: string;
  status: InquiryStatus;
  
  // CRM Fields
  assignedTo?: string; // Admin UID
  notes: InquiryNote[];
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastContactedAt?: Timestamp;
}

export interface InquiryNote {
  id: string;
  content: string;
  createdBy: string; // Admin UID
  createdByName: string;
  createdAt: Timestamp;
}

// ==================== USER GARAGE (WISHLIST) ====================

export interface GarageItem {
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
  addedAt: Timestamp;
  notes?: string;
}

// ==================== PURCHASE HISTORY ====================

export type PurchaseStatus = 'pending' | 'completed' | 'cancelled';

export interface Purchase {
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
  purchaseDate: Timestamp;
  deliveryDate?: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== SUPPORT TICKETS ====================

export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketMessage {
  id: string;
  content: string;
  sentBy: string; // UID
  sentByRole: UserRole;
  sentByName: string;
  createdAt: Timestamp;
  attachments?: string[]; // URLs
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: 'general' | 'technical' | 'billing' | 'vehicle_inquiry';
  status: TicketStatus;
  priority: TicketPriority;
  messages: TicketMessage[];
  assignedTo?: string; // Admin UID
  createdAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt?: Timestamp;
}

// ==================== ANALYTICS ====================

export interface PageView {
  id: string;
  path: string;
  userId?: string;
  sessionId: string;
  referrer?: string;
  userAgent: string;
  timestamp: Timestamp;
}

export interface VehicleView {
  id: string;
  vehicleId: string;
  userId?: string;
  sessionId: string;
  duration?: number; // seconds
  timestamp: Timestamp;
}

