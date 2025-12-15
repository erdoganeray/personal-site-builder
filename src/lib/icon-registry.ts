import {
  Mail,
  Phone,
  MapPin,
  Loader,
  CheckCircle,
  XCircle,
  Info,
  ArrowUp,
  ChevronDown,
  Linkedin,
  Github,
  Twitter,
  Globe,
  Home,
  Briefcase,
  GraduationCap,
  Image,
  Zap,
  // Skills icons
  Code,
  Palette,
  Music,
  Camera,
  // Education icons
  BookOpen,
  Award,
  FileCheck,
  // Work icons
  Laptop,
  Coffee,
  Presentation,
  Rocket,
  // Creative icons
  Paintbrush,
  Film,
  Headphones,
  type LucideIcon
} from 'lucide-react';

/**
 * Icon style types
 */
export type IconStyle = 'outline' | 'solid';

/**
 * Icon category types
 */
export type IconCategory = 'contact' | 'ui' | 'social' | 'navigation' | 'skills' | 'education' | 'work' | 'creative';

/**
 * Icon registry structure
 */
interface IconRegistry {
  [category: string]: {
    [name: string]: {
      outline: LucideIcon;
      solid: LucideIcon;
    };
  };
}

/**
 * Central icon registry
 * Maps icon names to Lucide icon components
 * Supports both outline and solid styles (Lucide icons are outline by default)
 */
export const iconRegistry: IconRegistry = {
  contact: {
    mail: { outline: Mail, solid: Mail },
    phone: { outline: Phone, solid: Phone },
    mapPin: { outline: MapPin, solid: MapPin },
  },
  ui: {
    loader: { outline: Loader, solid: Loader },
    check: { outline: CheckCircle, solid: CheckCircle },
    x: { outline: XCircle, solid: XCircle },
    info: { outline: Info, solid: Info },
    arrowUp: { outline: ArrowUp, solid: ArrowUp },
    chevronDown: { outline: ChevronDown, solid: ChevronDown },
  },
  social: {
    linkedin: { outline: Linkedin, solid: Linkedin },
    github: { outline: Github, solid: Github },
    twitter: { outline: Twitter, solid: Twitter },
    globe: { outline: Globe, solid: Globe },
  },
  navigation: {
    home: { outline: Home, solid: Home },
    briefcase: { outline: Briefcase, solid: Briefcase },
    graduationCap: { outline: GraduationCap, solid: GraduationCap },
    image: { outline: Image, solid: Image },
    zap: { outline: Zap, solid: Zap },
    globe: { outline: Globe, solid: Globe },
    mail: { outline: Mail, solid: Mail },
  },
  skills: {
    code: { outline: Code, solid: Code },
    palette: { outline: Palette, solid: Palette },
    music: { outline: Music, solid: Music },
    camera: { outline: Camera, solid: Camera },
  },
  education: {
    book: { outline: BookOpen, solid: BookOpen },
    award: { outline: Award, solid: Award },
    certificate: { outline: FileCheck, solid: FileCheck },
  },
  work: {
    laptop: { outline: Laptop, solid: Laptop },
    coffee: { outline: Coffee, solid: Coffee },
    presentation: { outline: Presentation, solid: Presentation },
    rocket: { outline: Rocket, solid: Rocket },
  },
  creative: {
    paintbrush: { outline: Paintbrush, solid: Paintbrush },
    film: { outline: Film, solid: Film },
    headphones: { outline: Headphones, solid: Headphones },
  },
};

/**
 * Default fallback icon (Info icon)
 */
const fallbackIcon = Info;

/**
 * Get icon SVG string
 * @param category - Icon category (contact, ui, social)
 * @param name - Icon name (mail, phone, etc.)
 * @param style - Icon style (outline or solid)
 * @param size - Icon size in pixels (default: 24)
 * @param className - Additional CSS classes
 * @returns SVG string or null if icon not found
 */
export function getIconSvg(
  category: IconCategory,
  name: string,
  style: IconStyle = 'outline',
  size: number = 24,
  className: string = ''
): string {
  try {
    // Get icon from registry
    const categoryIcons = iconRegistry[category];
    if (!categoryIcons) {
      console.warn(`Icon category not found: ${category}`);
      return renderIconToSvg(fallbackIcon, size, className, style);
    }

    const iconVariants = categoryIcons[name];
    if (!iconVariants) {
      console.warn(`Icon not found: ${category}/${name}`);
      return renderIconToSvg(fallbackIcon, size, className, style);
    }

    const IconComponent = iconVariants[style];
    return renderIconToSvg(IconComponent, size, className, style);
  } catch (error) {
    console.error(`Error rendering icon ${category}/${name}:`, error);
    return renderIconToSvg(fallbackIcon, size, className, style);
  }
}

/**
 * Render Lucide icon component to SVG string
 * @param IconComponent - Lucide icon component  
 * @param size - Icon size
 * @param className - CSS classes
 * @param style - Icon style (affects stroke-width for solid effect)
 * @returns SVG string
 */
function renderIconToSvg(
  IconComponent: LucideIcon,
  size: number,
  className: string,
  style: IconStyle
): string {
  // For solid style, increase stroke-width to create filled effect
  const strokeWidth = style === 'solid' ? 3 : 2;

  // Map icon components to their SVG path data
  // This is a manual mapping since we can't use React rendering
  const iconPaths: Record<string, string> = {
    'Mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'Phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'MapPin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    'Loader': '<line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/>',
    'CheckCircle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    'XCircle': '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    'Info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    'ArrowUp': '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    'ChevronDown': '<path d="m6 9 6 6 6-6"/>',
    'Linkedin': '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    'Github': '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    'Twitter': '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
    'Globe': '<circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    'Home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    'Briefcase': '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    'GraduationCap': '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    'Image': '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    'Zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    // Skills icons
    'Code': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    'Palette': '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    'Music': '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    'Camera': '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    // Education icons
    'BookOpen': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'Award': '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    'FileCheck': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>',
    // Work icons
    'Laptop': '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
    'Coffee': '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>',
    'Presentation': '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
    'Rocket': '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    // Creative icons
    'Paintbrush': '<path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/><path d="M14.5 17.5 4.5 15"/>',
    'Film': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
    'Headphones': '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  };

  // Get icon name from component
  const iconName = IconComponent.displayName || IconComponent.name || 'Info';
  const pathData = iconPaths[iconName] || iconPaths['Info'];

  // Manually construct the SVG string
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconName.toLowerCase()} icon icon-${style} ${className}">${pathData}</svg>`;
}

/**
 * Get all available icons in a category
 * @param category - Icon category
 * @returns Array of icon names
 */
export function getAvailableIcons(category: IconCategory): string[] {
  const categoryIcons = iconRegistry[category];
  if (!categoryIcons) {
    return [];
  }
  return Object.keys(categoryIcons);
}

/**
 * Check if an icon exists in the registry
 * @param category - Icon category
 * @param name - Icon name
 * @returns True if icon exists
 */
export function iconExists(category: IconCategory, name: string): boolean {
  return !!(iconRegistry[category]?.[name]);
}
