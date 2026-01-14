import { SectionDesign } from '@/types/database';

/**
 * Converts design configuration to Tailwind CSS classes
 * This allows dynamic styling from the Site Builder
 */
export function applyDesignConfig(design?: Partial<SectionDesign>): {
  className: string;
  style: React.CSSProperties;
} {
  if (!design) {
    return { className: '', style: {} };
  }

  const classes: string[] = [];
  const style: React.CSSProperties = {};

  // ==================== COLORS ====================
  if (design.colors) {
    if (design.colors.background) {
      style.backgroundColor = design.colors.background;
    }
    if (design.colors.text) {
      style.color = design.colors.text;
    }
    if (design.colors.border) {
      style.borderColor = design.colors.border;
    }
  }

  // ==================== TYPOGRAPHY ====================
  if (design.typography) {
    if (design.typography.fontFamily) {
      style.fontFamily = design.typography.fontFamily;
    }
  }

  // ==================== SPACING ====================
  if (design.spacing) {
    const spacingMap: Record<string, string> = {
      none: '0',
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      '2xl': '4rem',
      '3xl': '6rem',
    };

    if (design.spacing.paddingTop) {
      style.paddingTop = spacingMap[design.spacing.paddingTop] || design.spacing.paddingTop;
    }
    if (design.spacing.paddingBottom) {
      style.paddingBottom = spacingMap[design.spacing.paddingBottom] || design.spacing.paddingBottom;
    }
    if (design.spacing.paddingLeft) {
      style.paddingLeft = spacingMap[design.spacing.paddingLeft] || design.spacing.paddingLeft;
    }
    if (design.spacing.paddingRight) {
      style.paddingRight = spacingMap[design.spacing.paddingRight] || design.spacing.paddingRight;
    }
    if (design.spacing.marginTop) {
      style.marginTop = spacingMap[design.spacing.marginTop] || design.spacing.marginTop;
    }
    if (design.spacing.marginBottom) {
      style.marginBottom = spacingMap[design.spacing.marginBottom] || design.spacing.marginBottom;
    }
    if (design.spacing.gap) {
      style.gap = spacingMap[design.spacing.gap] || design.spacing.gap;
    }
  }

  // ==================== LAYOUT ====================
  if (design.layout) {
    const maxWidthMap: Record<string, string> = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    };

    if (design.layout.maxWidth) {
      classes.push(maxWidthMap[design.layout.maxWidth] || 'max-w-full');
    }

    if (design.layout.textAlign) {
      const alignMap: Record<string, string> = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      };
      classes.push(alignMap[design.layout.textAlign] || 'text-left');
    }
  }

  // ==================== ASSETS ====================
  if (design.assets) {
    if (design.assets.backgroundImage) {
      style.backgroundImage = `url(${design.assets.backgroundImage})`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
    }
  }

  return {
    className: classes.join(' '),
    style,
  };
}

/**
 * Get Framer Motion animation variants from design config
 */
export function getAnimationVariants(design?: Partial<SectionDesign>) {
  if (!design?.animations) {
    return {
      hidden: {},
      visible: {},
    };
  }

  const { entrance } = design.animations;
  const variants: any = {
    hidden: {},
    visible: {
      transition: {
        duration: entrance.duration || 0.6,
        delay: entrance.delay || 0,
        ease: entrance.easing || 'easeOut',
      },
    },
  };

  switch (entrance.type) {
    case 'fadeIn':
      variants.hidden = { opacity: 0 };
      variants.visible = { ...variants.visible, opacity: 1 };
      break;
    case 'slideUp':
      variants.hidden = { opacity: 0, y: 50 };
      variants.visible = { ...variants.visible, opacity: 1, y: 0 };
      break;
    case 'slideDown':
      variants.hidden = { opacity: 0, y: -50 };
      variants.visible = { ...variants.visible, opacity: 1, y: 0 };
      break;
    case 'slideLeft':
      variants.hidden = { opacity: 0, x: 50 };
      variants.visible = { ...variants.visible, opacity: 1, x: 0 };
      break;
    case 'slideRight':
      variants.hidden = { opacity: 0, x: -50 };
      variants.visible = { ...variants.visible, opacity: 1, x: 0 };
      break;
    case 'scaleUp':
      variants.hidden = { opacity: 0, scale: 0.8 };
      variants.visible = { ...variants.visible, opacity: 1, scale: 1 };
      break;
    case 'scaleDown':
      variants.hidden = { opacity: 0, scale: 1.2 };
      variants.visible = { ...variants.visible, opacity: 1, scale: 1 };
      break;
    case 'zoomIn':
      variants.hidden = { opacity: 0, scale: 0.5 };
      variants.visible = { ...variants.visible, opacity: 1, scale: 1 };
      break;
    default:
      break;
  }

  return variants;
}

/**
 * Get hover animation props from design config
 */
export function getHoverAnimation(design?: Partial<SectionDesign>) {
  if (!design?.animations?.hover) {
    return {};
  }

  const { hover } = design.animations;

  return {
    scale: hover.scale || 1,
    rotate: hover.rotate || 0,
    y: hover.translateY || 0,
    filter: `brightness(${hover.brightness || 1})`,
    transition: { duration: 0.3 },
  };
}

/**
 * Get typography classes for headings, subheadings, and body text
 */
export function getTypographyClasses(
  design?: Partial<SectionDesign>,
  type: 'heading' | 'subheading' | 'body' | 'small' = 'body'
): string {
  if (!design?.typography) {
    return '';
  }

  const { typography } = design;
  const classes: string[] = [];

  // Font size
  if (typography.fontSize && typography.fontSize[type]) {
    classes.push(`text-${typography.fontSize[type]}`);
  }

  // Font weight (not available for 'small')
  if (typography.fontWeight && type !== 'small' && typography.fontWeight[type as 'heading' | 'subheading' | 'body']) {
    classes.push(`font-${typography.fontWeight[type as 'heading' | 'subheading' | 'body']}`);
  }

  // Line height (for heading and body)
  if (type === 'heading' || type === 'body') {
    if (typography.lineHeight && typography.lineHeight[type]) {
      const lineHeight = typography.lineHeight[type];
      classes.push(`leading-[${lineHeight}]`);
    }
  }

  // Letter spacing (for heading and body)
  if (type === 'heading' || type === 'body') {
    if (typography.letterSpacing && typography.letterSpacing[type]) {
      const spacing = typography.letterSpacing[type];
      classes.push(`tracking-[${spacing}]`);
    }
  }

  return classes.join(' ');
}

