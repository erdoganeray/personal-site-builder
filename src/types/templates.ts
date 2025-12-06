/**
 * Site component template'leri için tip tanımları
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
}

export interface ComponentTemplate {
  id: string;
  name: string;
  category: 'navigation' | 'hero' | 'about' | 'experience' | 'education' | 'skills' | 'contact' | 'footer';
  htmlTemplate: string;
  cssTemplate: string;
  jsTemplate?: string;
  placeholders?: string[];
  dataSchema?: {
    [key: string]: {
      type: string;
      required: boolean;
      description: string;
    };
  };
  designNotes?: string;
}

export interface SelectedComponent {
  category: string;
  templateId: string;
}

export interface SiteGenerationPlan {
  themeColors: ThemeColors;
  selectedComponents: SelectedComponent[];
  layout: 'single-page' | 'multi-page';
  style: 'modern' | 'minimal' | 'creative' | 'professional';
}
