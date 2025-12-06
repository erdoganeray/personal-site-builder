import { ComponentTemplate, ThemeColors, SelectedComponent } from "@/types/templates";
import { CVData } from "./gemini-pdf-parser";

/**
 * Template placeholder'larını gerçek içerik ile doldurur
 */

interface PlaceholderReplacements {
  [key: string]: string;
}

/**
 * Template'deki tüm placeholder'ları değiştirir
 */
export function replacePlaceholders(
  template: string,
  replacements: PlaceholderReplacements
): string {
  let result = template;
  
  for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, value);
  }
  
  return result;
}

/**
 * CV verilerinden hero section için placeholder değerleri oluşturur
 */
export function getHeroReplacements(
  cvData: CVData,
  themeColors: ThemeColors
): PlaceholderReplacements {
  const initials = cvData.personalInfo.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    '{{NAME}}': cvData.personalInfo.name,
    '{{INITIALS}}': initials,
    '{{TITLE}}': cvData.personalInfo.title || 'Professional',
    '{{SUMMARY}}': cvData.summary || cvData.personalInfo.name + ' - Professional Profile',
    '{{PROFILE_IMAGE}}': initials, // İlk harfler profil resmi yerine
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
  };
}

/**
 * CV verilerinden experience section için HTML items oluşturur
 */
export function generateExperienceItems(
  cvData: CVData,
  templateId: string
): string {
  if (templateId === 'experience-timeline') {
    return cvData.experience.map(exp => `
      <div class="timeline-item">
        <div class="timeline-duration">${exp.duration}</div>
        <h3 class="timeline-position">${exp.position}</h3>
        <div class="timeline-company">${exp.company}</div>
        <p class="timeline-description">${exp.description}</p>
      </div>
    `).join('\n');
  } else if (templateId === 'experience-cards') {
    return cvData.experience.map(exp => `
      <div class="experience-card">
        <div class="experience-duration">${exp.duration}</div>
        <h3 class="experience-position">${exp.position}</h3>
        <div class="experience-company">${exp.company}</div>
        <p class="experience-description">${exp.description}</p>
      </div>
    `).join('\n');
  }
  
  return '';
}

/**
 * CV verilerinden experience section için placeholder değerleri oluşturur
 */
export function getExperienceReplacements(
  cvData: CVData,
  themeColors: ThemeColors,
  templateId: string
): PlaceholderReplacements {
  return {
    '{{EXPERIENCE_ITEMS}}': generateExperienceItems(cvData, templateId),
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
  };
}

/**
 * CV verilerinden skills section için HTML items oluşturur
 */
export function generateSkillItems(
  cvData: CVData,
  templateId: string
): string {
  if (templateId === 'skills-progress-bars') {
    // Tüm yeteneklere %80-95 arası rastgele bir yüzde atayalım
    return cvData.skills.map(skill => {
      const percentage = Math.floor(Math.random() * 15) + 80; // 80-95 arası
      return `
        <div class="skill-item">
          <div class="skill-name">${skill}</div>
          <div class="skill-bar">
            <div class="skill-progress" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    }).join('\n');
  } else if (templateId === 'skills-card-grid') {
    return cvData.skills.map(skill => `
      <div class="skill-card">
        <div class="skill-icon">💡</div>
        <div class="skill-name">${skill}</div>
      </div>
    `).join('\n');
  }
  
  return '';
}

/**
 * CV verilerinden skills section için placeholder değerleri oluşturur
 */
export function getSkillsReplacements(
  cvData: CVData,
  themeColors: ThemeColors,
  templateId: string
): PlaceholderReplacements {
  return {
    '{{SKILL_ITEMS}}': generateSkillItems(cvData, templateId),
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
  };
}

/**
 * Navigation menu için placeholder değerleri oluşturur
 * Sayfadaki componentlere göre dinamik menu linkleri oluşturur
 */
export function getNavigationReplacements(
  cvData: CVData,
  themeColors: ThemeColors,
  selectedComponents: SelectedComponent[]
): PlaceholderReplacements {
  const initials = cvData.personalInfo.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Sosyal medya linklerini oluştur (eğer varsa)
  const socialLinks = `
    <a href="mailto:${cvData.personalInfo.email || '#'}" title="Email">📧</a>
    ${cvData.personalInfo.phone ? `<a href="tel:${cvData.personalInfo.phone}" title="Phone">📱</a>` : ''}
  `.trim();

  return {
    '{{NAME}}': cvData.personalInfo.name,
    '{{INITIALS}}': initials,
    '{{SOCIAL_LINKS}}': socialLinks,
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
  };
}

/**
 * Component kategorisine göre doğru replacement fonksiyonunu çağırır
 */
export function getReplacementsForComponent(
  component: ComponentTemplate,
  cvData: CVData,
  themeColors: ThemeColors,
  selectedComponents?: SelectedComponent[]
): PlaceholderReplacements {
  switch (component.category) {
    case 'navigation':
      return getNavigationReplacements(cvData, themeColors, selectedComponents || []);
    case 'hero':
      return getHeroReplacements(cvData, themeColors);
    case 'experience':
      return getExperienceReplacements(cvData, themeColors, component.id);
    case 'skills':
      return getSkillsReplacements(cvData, themeColors, component.id);
    default:
      return {};
  }
}

/**
 * Component template'ini CV verileri ile doldurur
 */
export function populateTemplate(
  component: ComponentTemplate,
  cvData: CVData,
  themeColors: ThemeColors,
  selectedComponents?: SelectedComponent[]
): { html: string; css: string; js?: string } {
  const replacements = getReplacementsForComponent(component, cvData, themeColors, selectedComponents);
  
  return {
    html: replacePlaceholders(component.htmlTemplate, replacements),
    css: replacePlaceholders(component.cssTemplate, replacements),
    js: component.jsTemplate 
      ? replacePlaceholders(component.jsTemplate, replacements)
      : undefined
  };
}
