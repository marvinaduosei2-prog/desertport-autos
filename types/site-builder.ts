import { Timestamp } from 'firebase/firestore';

// ==================== SITE BUILDER TYPES ====================

export type SectionType = 
  | 'hero' 
  | 'about' 
  | 'categories' 
  | 'featured' 
  | 'experience' 
  | 'testimonials' 
  | 'cta' 
  | 'custom';

export type LayoutType = 'full-width' | 'contained' | 'narrow';
export type AlignmentType = 'left' | 'center' | 'right';
export type SpacingSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ColorScheme {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
}

export interface Typography {
  fontFamily: string;
  fontSize: {
    heading: string; // e.g., "5xl"
    subheading: string;
    body: string;
    small: string;
  };
  fontWeight: {
    heading: string; // e.g., "black"
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

export interface Spacing {
  paddingTop: SpacingSize;
  paddingBottom: SpacingSize;
  paddingLeft: SpacingSize;
  paddingRight: SpacingSize;
  marginTop: SpacingSize;
  marginBottom: SpacingSize;
  gap: SpacingSize;
}

export interface LayoutSettings {
  type: LayoutType;
  maxWidth: string; // e.g., "7xl"
  alignment: AlignmentType;
  columns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface AnimationSettings {
  enabled: boolean;
  type: 'fade' | 'slide' | 'scale' | 'none';
  duration: number;
  delay: number;
  easing: string;
}

export interface SectionStyles {
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing;
  layout: LayoutSettings;
  animation: AnimationSettings;
  customCSS?: string;
}

export interface SectionContent {
  [key: string]: any; // Flexible content structure
}

export interface PageSection {
  id: string;
  type: SectionType;
  name: string;
  enabled: boolean;
  order: number;
  styles: SectionStyles;
  content: SectionContent;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SiteBuilderConfig {
  id: string;
  pageName: string; // e.g., "home", "about", etc.
  sections: PageSection[];
  globalStyles: {
    colors: ColorScheme;
    typography: Typography;
    spacing: Spacing;
  };
  publishedAt?: Timestamp;
  isDraft: boolean;
  version: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== PRESET THEMES ====================

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  colors: ColorScheme;
  typography: Typography;
}

export const DEFAULT_THEMES: ThemePreset[] = [
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    description: 'Sophisticated dark theme with lime accents',
    thumbnail: '/themes/dark-premium.jpg',
    colors: {
      background: '#0a0a0a',
      foreground: '#ffffff',
      primary: '#84cc16',
      secondary: '#22c55e',
      accent: '#fbbf24',
      muted: '#6b7280',
      border: 'rgba(255,255,255,0.1)',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        heading: '7xl',
        subheading: 'xl',
        body: 'base',
        small: 'sm',
      },
      fontWeight: {
        heading: 'black',
        subheading: 'semibold',
        body: 'normal',
      },
      lineHeight: {
        heading: '1.1',
        body: '1.6',
      },
      letterSpacing: {
        heading: '-0.02em',
        body: '0',
      },
    },
  },
  {
    id: 'light-modern',
    name: 'Light Modern',
    description: 'Clean white theme with vibrant accents',
    thumbnail: '/themes/light-modern.jpg',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      primary: '#84cc16',
      secondary: '#3b82f6',
      accent: '#f59e0b',
      muted: '#9ca3af',
      border: 'rgba(0,0,0,0.1)',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        heading: '6xl',
        subheading: 'lg',
        body: 'base',
        small: 'sm',
      },
      fontWeight: {
        heading: 'black',
        subheading: 'semibold',
        body: 'normal',
      },
      lineHeight: {
        heading: '1.2',
        body: '1.7',
      },
      letterSpacing: {
        heading: '-0.01em',
        body: '0',
      },
    },
  },
  {
    id: 'gradient-bold',
    name: 'Gradient Bold',
    description: 'Bold gradients with strong typography',
    thumbnail: '/themes/gradient-bold.jpg',
    colors: {
      background: '#1e1b4b',
      foreground: '#ffffff',
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#f59e0b',
      muted: '#9ca3af',
      border: 'rgba(255,255,255,0.2)',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        heading: '8xl',
        subheading: '2xl',
        body: 'lg',
        small: 'base',
      },
      fontWeight: {
        heading: 'black',
        subheading: 'bold',
        body: 'medium',
      },
      lineHeight: {
        heading: '1',
        body: '1.8',
      },
      letterSpacing: {
        heading: '-0.03em',
        body: '0.01em',
      },
    },
  },
];

// ==================== COMPONENT LIBRARY ====================

export interface ComponentTemplate {
  id: string;
  name: string;
  category: 'button' | 'card' | 'hero' | 'form' | 'text' | 'image';
  thumbnail: string;
  defaultStyles: Partial<SectionStyles>;
  defaultContent: SectionContent;
}

export const COMPONENT_LIBRARY: ComponentTemplate[] = [
  {
    id: 'hero-video',
    name: 'Video Hero',
    category: 'hero',
    thumbnail: '/components/hero-video.jpg',
    defaultStyles: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        primary: '#84cc16',
        secondary: '#22c55e',
        accent: '#fbbf24',
        muted: '#6b7280',
        border: 'rgba(255,255,255,0.1)',
      },
    },
    defaultContent: {
      videoUrl: 'https://example.com/video.mp4',
      headline: 'Your Headline Here',
      subheadline: 'Your subheadline goes here',
      ctaText: 'Get Started',
      ctaLink: '/contact',
    },
  },
  // More components...
];

