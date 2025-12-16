/**
 * Color Utility Library
 * 
 * Provides color manipulation, validation, and palette generation utilities
 * for the 4-color base palette system.
 */

/**
 * Base palette with 4 core colors
 */
export interface BasePalette {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
}

/**
 * Full palette with derived colors
 */
export interface FullPalette extends BasePalette {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
    iconPrimary: string;
    iconSecondary: string;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    // Null/undefined check
    if (!hex || typeof hex !== 'string') {
        console.warn(`Invalid hex color: ${hex}`);
        return null;
    }

    // Remove # if present
    const cleanHex = hex.replace('#', '');

    // Parse hex values
    const bigint = parseInt(cleanHex, 16);

    if (isNaN(bigint)) {
        return null;
    }

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => {
        const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calculate relative luminance for WCAG contrast ratio
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb;

    // Convert to 0-1 range
    const [rs, gs, bs] = [r, g, b].map(val => {
        const v = val / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    // Calculate luminance
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function getContrastRatio(color1: string, color2: string): number {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) {
        return 1; // Return minimum contrast if invalid colors
    }

    const l1 = getRelativeLuminance(rgb1);
    const l2 = getRelativeLuminance(rgb2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG requirements
 * AA: 4.5:1 for normal text, 3:1 for large text
 * AAA: 7:1 for normal text, 4.5:1 for large text
 */
export function meetsContrastRequirement(
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AA',
    largeText: boolean = false
): boolean {
    const ratio = getContrastRatio(foreground, background);

    if (level === 'AAA') {
        return largeText ? ratio >= 4.5 : ratio >= 7;
    }

    return largeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Lighten a color by a percentage (0-100)
 */
export function lighten(color: string, amount: number): string {
    const rgb = hexToRgb(color);
    if (!rgb) return color;

    const factor = amount / 100;

    const r = rgb.r + (255 - rgb.r) * factor;
    const g = rgb.g + (255 - rgb.g) * factor;
    const b = rgb.b + (255 - rgb.b) * factor;

    return rgbToHex(r, g, b);
}

/**
 * Darken a color by a percentage (0-100)
 */
export function darken(color: string, amount: number): string {
    const rgb = hexToRgb(color);
    if (!rgb) return color;

    const factor = 1 - (amount / 100);

    const r = rgb.r * factor;
    const g = rgb.g * factor;
    const b = rgb.b * factor;

    return rgbToHex(r, g, b);
}

/**
 * Set opacity of a color (returns rgba string)
 */
export function setOpacity(color: string, opacity: number): string {
    const rgb = hexToRgb(color);
    if (!rgb) return color;

    const clampedOpacity = Math.max(0, Math.min(1, opacity));
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampedOpacity})`;
}

/**
 * Get contrasting text color (black or white) for a background
 */
export function getContrastingTextColor(backgroundColor: string): string {
    const whiteContrast = getContrastRatio('#ffffff', backgroundColor);
    const blackContrast = getContrastRatio('#000000', backgroundColor);

    return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

/**
 * Generate a full palette from 4 base colors
 */
export function generateFullPalette(
    base: BasePalette,
    theme: 'light' | 'dark' = 'light'
): FullPalette {
    const isLight = theme === 'light';

    // Background colors
    const background = isLight ? '#ffffff' : '#0a0a0a';
    const surface = isLight ? lighten(base.neutral, 95) : darken(base.neutral, 85);

    // Text colors with guaranteed contrast
    const text = isLight ? '#1a1a1a' : '#f5f5f5';
    const textSecondary = isLight ? '#666666' : '#a3a3a3';

    // Validate text contrast, adjust if needed
    let finalText = text;
    let finalTextSecondary = textSecondary;

    if (!meetsContrastRequirement(text, background, 'AA')) {
        finalText = isLight ? '#000000' : '#ffffff';
    }

    if (!meetsContrastRequirement(textSecondary, background, 'AA')) {
        finalTextSecondary = isLight ? '#4a4a4a' : '#b8b8b8';
    }

    // Border and hover colors
    const border = isLight
        ? setOpacity(base.neutral, 0.2)
        : setOpacity(lighten(base.neutral, 30), 0.2);

    const hover = isLight
        ? lighten(base.primary, 90)
        : darken(base.primary, 70);

    // Icon colors
    const iconPrimary = base.primary;
    const iconSecondary = base.accent;

    return {
        // Base colors
        primary: base.primary,
        secondary: base.secondary,
        accent: base.accent,
        neutral: base.neutral,

        // Derived colors
        background,
        surface,
        text: finalText,
        textSecondary: finalTextSecondary,
        border,
        hover,
        iconPrimary,
        iconSecondary,
    };
}

/**
 * Update base palette with partial updates
 */
export function updateBasePalette(
    currentPalette: BasePalette,
    updates: Partial<BasePalette>
): BasePalette {
    return {
        ...currentPalette,
        ...updates,
    };
}

/**
 * Extract base palette from full theme colors
 * (for reverse compatibility with existing sites)
 */
export function extractBasePaletteFromThemeColors(themeColors: any): BasePalette {
    return {
        primary: themeColors.primary || '#2563eb',
        secondary: themeColors.secondary || '#7c3aed',
        accent: themeColors.accent || '#06b6d4',
        neutral: themeColors.neutral || themeColors.textSecondary || '#64748b',
    };
}

/**
 * Validate if a color is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
}

/**
 * Calculate accessibility score for a palette
 */
export interface AccessibilityScore {
    wcagAA: boolean;
    wcagAAA: boolean;
    score: number; // 0-100
    issues: string[];
}

export function calculateAccessibilityScore(palette: FullPalette): AccessibilityScore {
    const issues: string[] = [];
    let score = 100;

    // Check text on background
    const textBgContrast = getContrastRatio(palette.text, palette.background);
    const textBgAA = textBgContrast >= 4.5;
    const textBgAAA = textBgContrast >= 7;

    if (!textBgAA) {
        issues.push('Text on background does not meet WCAG AA (4.5:1)');
        score -= 30;
    } else if (!textBgAAA) {
        issues.push('Text on background does not meet WCAG AAA (7:1)');
        score -= 10;
    }

    // Check secondary text on background
    const textSecBgContrast = getContrastRatio(palette.textSecondary, palette.background);
    const textSecBgAA = textSecBgContrast >= 4.5;

    if (!textSecBgAA) {
        issues.push('Secondary text on background does not meet WCAG AA (4.5:1)');
        score -= 20;
    }

    // Check accent on background (for buttons)
    const accentBgContrast = getContrastRatio(palette.accent, palette.background);
    if (accentBgContrast < 3) {
        issues.push('Accent color has low contrast with background (< 3:1)');
        score -= 15;
    }

    // Check text on accent (for buttons)
    const textOnAccent = getContrastingTextColor(palette.accent);
    const textAccentContrast = getContrastRatio(textOnAccent, palette.accent);
    if (textAccentContrast < 4.5) {
        issues.push('Text on accent color does not meet WCAG AA (4.5:1)');
        score -= 25;
    }

    const wcagAA = textBgAA && textSecBgAA && textAccentContrast >= 4.5;
    const wcagAAA = textBgAAA && textSecBgAA && textAccentContrast >= 7;

    return {
        wcagAA,
        wcagAAA,
        score: Math.max(0, score),
        issues,
    };
}
