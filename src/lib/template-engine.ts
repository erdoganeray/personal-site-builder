import { ComponentTemplate, ThemeColors, SelectedComponent } from "@/types/templates";
import { CVData } from "./gemini-pdf-parser";

/**
 * Template placeholder'larını gerçek içerik ile doldurur
 */

interface PlaceholderReplacements {
  [key: string]: string;
}

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param text - The text to escape
 * @returns Escaped text safe for HTML insertion
 */
export function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';

  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Normalizes education year/date format
 * @param year - The year/date string to format
 * @returns Normalized year string or fallback message
 */
export function formatEducationYear(year: string | null | undefined): string {
  if (!year) return 'Tarih belirtilmemiş';

  const trimmed = year.trim();
  if (!trimmed) return 'Tarih belirtilmemiş';

  return trimmed;
}

/**
 * R2 public URL'lerini subdomain relative path'lere dönüştürür
 * Eski format: https://pub-xxx.r2.dev/users/{userId}/profile/photo.jpg
 * Yeni format: /assets/profile/photo.jpg (localhost preview için)
 * Yeni format: /_assets/profile/photo.jpg (published site için - Worker proxy)
 */
export function convertR2UrlToRelativePath(url: string, forPublish: boolean = true): string {
  if (!url) return url;

  // Zaten relative path ise dokunma
  if (url.startsWith('/_assets/') || url.startsWith('/assets/')) {
    return url;
  }

  // R2 public URL'i mi kontrol et
  const r2PublicUrlPattern = /https?:\/\/pub-[a-f0-9]+\.r2\.dev\/users\/[^/]+\/(profile|portfolio)\/(.+)/;
  const match = url.match(r2PublicUrlPattern);

  if (match) {
    const [, folder, fileName] = match;
    // Published site için /_assets (Worker proxy)
    // Preview için /assets (Next.js API route)
    const prefix = forPublish ? '/_assets' : '/assets';
    return `${prefix}/${folder}/${fileName}`;
  }

  // Başka bir URL formatı ise olduğu gibi döndür
  return url;
}

/**
 * HTML içeriğindeki tüm R2 URL'lerini relative path'e çevirir (published siteler için)
 */
export function convertHtmlAssetsToRelativePaths(html: string): string {
  // Tüm R2 public URL'lerini bul ve değiştir
  const r2UrlPattern = /https?:\/\/pub-[a-f0-9]+\.r2\.dev\/users\/[^/]+\/(profile|portfolio)\/([^"'\s>]+)/g;

  return html.replace(r2UrlPattern, (match, folder, fileName) => {
    return `/_assets/${folder}/${fileName}`;
  });
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

  // Generate profile image content - either <img> tag or initials
  const profilePhotoUrl = cvData.personalInfo.profilePhotoUrl;
  // Convert old R2 URLs to new relative paths
  const convertedPhotoUrl = convertR2UrlToRelativePath(profilePhotoUrl || '');
  const profileImageContent = convertedPhotoUrl
    ? `<img src="${escapeHtml(convertedPhotoUrl)}" alt="${escapeHtml(cvData.personalInfo.name)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;" />`
    : escapeHtml(initials);

  return {
    '{{NAME}}': escapeHtml(cvData.personalInfo.name),
    '{{INITIALS}}': escapeHtml(initials),
    '{{TITLE}}': escapeHtml(cvData.personalInfo.title || 'Professional'),
    '{{SUMMARY}}': escapeHtml(cvData.summary || cvData.personalInfo.name + ' - Professional Profile'),
    '{{PROFILE_IMAGE}}': profileImageContent,
    '{{CTA_PRIMARY_TEXT}}': 'İletişime Geç',
    '{{CTA_SECONDARY_TEXT}}': 'Hakkımda',
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
 * @param cvData - CV data containing experience information
 * @param templateId - Template identifier (experience-timeline or experience-cards)
 * @returns HTML string with experience items or empty state message
 */
export function generateExperienceItems(
  cvData: CVData,
  templateId: string
): string {
  // Empty data validation
  if (!cvData.experience || cvData.experience.length === 0) {
    return '<p class="no-experience">Henüz deneyim bilgisi eklenmemiş.</p>';
  }

  // Template generators with XSS protection
  const templateGenerators: Record<string, (exp: typeof cvData.experience[0]) => string> = {
    'experience-timeline': (exp) => `<article class="timeline-item" role="listitem"><time class="timeline-duration" datetime="${escapeHtml(exp.duration)}">${escapeHtml(exp.duration)}</time><h3 class="timeline-position">${escapeHtml(exp.position)}</h3><div class="timeline-company" aria-label="Company name">${escapeHtml(exp.company)}</div><p class="timeline-description">${escapeHtml(exp.description)}</p></article>`,
    'experience-cards': (exp) => `<article class="experience-card"><time class="experience-duration" datetime="${escapeHtml(exp.duration)}">${escapeHtml(exp.duration)}</time><h3 class="experience-position">${escapeHtml(exp.position)}</h3><div class="experience-company" aria-label="Company name">${escapeHtml(exp.company)}</div><p class="experience-description">${escapeHtml(exp.description)}</p></article>`,
    'experience-accordion': (exp) => `<article class="accordion-item"><button class="accordion-header" aria-expanded="false" aria-controls="accordion-content-${escapeHtml(exp.position).replace(/\s+/g, '-').toLowerCase()}"><div class="accordion-header-content"><div class="accordion-position">${escapeHtml(exp.position)}</div><div class="accordion-company" aria-label="Company name">${escapeHtml(exp.company)}</div><time class="accordion-duration" datetime="${escapeHtml(exp.duration)}">${escapeHtml(exp.duration)}</time></div><span class="accordion-icon" aria-hidden="true">▼</span></button><div class="accordion-content" id="accordion-content-${escapeHtml(exp.position).replace(/\s+/g, '-').toLowerCase()}" role="region"><div class="accordion-description">${escapeHtml(exp.description)}</div></div></article>`,
    'experience-minimal': (exp) => `<article class="experience-item-minimal"><div class="experience-header-minimal"><div class="experience-position-minimal">${escapeHtml(exp.position)}</div><time class="experience-duration-minimal" datetime="${escapeHtml(exp.duration)}">${escapeHtml(exp.duration)}</time></div><div class="experience-company-minimal">${escapeHtml(exp.company)}</div><p class="experience-description-minimal">${escapeHtml(exp.description)}</p></article>`,
    'experience-horizontal-timeline': (exp) => `<article class="horizontal-timeline-item"><div class="horizontal-timeline-card"><time class="horizontal-timeline-duration" datetime="${escapeHtml(exp.duration)}">${escapeHtml(exp.duration)}</time><h3 class="horizontal-timeline-position">${escapeHtml(exp.position)}</h3><div class="horizontal-timeline-company">${escapeHtml(exp.company)}</div><p class="horizontal-timeline-description">${escapeHtml(exp.description)}</p></div></article>`,
    'experience-tabs': (exp) => `<div class="tab-item" role="presentation"><button class="tab-button" role="tab" aria-expanded="false"><div class="tab-button-content"><div class="tab-company">${escapeHtml(exp.company)}</div><div class="tab-position">${escapeHtml(exp.position)}</div></div><time class="tab-duration" datetime="${escapeHtml(exp.duration)}">${escapeHtml(exp.duration)}</time><span class="tab-icon" aria-hidden="true">▶</span></button><div class="tab-content" role="tabpanel"><div class="tab-description">${escapeHtml(exp.description)}</div></div></div>`
  };

  // Template ID validation
  const generator = templateGenerators[templateId];

  if (!generator) {
    console.error(`[generateExperienceItems] Unknown template ID: ${templateId}`);
    throw new Error(`Experience template "${templateId}" not found. Available templates: ${Object.keys(templateGenerators).join(', ')}`);
  }

  return cvData.experience.map(generator).join('\n');
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
 * CV verilerinden education section için HTML items oluşturur
 * @param cvData - CV data containing education information
 * @param templateId - Template identifier
 * @returns HTML string with education items or empty state message
 */
export function generateEducationItems(
  cvData: CVData,
  templateId: string
): string {
  // Import EDUCATION_TEMPLATE_IDS from education-templates
  const EDUCATION_TEMPLATE_IDS = {
    TIMELINE: 'education-timeline',
    CARDS: 'education-cards',
    MODERN: 'education-modern',
    ACCORDION: 'education-accordion',
    HORIZONTAL_TIMELINE: 'education-horizontal-timeline',
    TABS: 'education-tabs'
  } as const;

  // Empty data validation - Template-specific empty states
  if (!cvData.education || cvData.education.length === 0) {
    const emptyStates: Record<string, string> = {
      [EDUCATION_TEMPLATE_IDS.TIMELINE]: `
        <div class="education-empty-state">
          <div class="empty-icon">🎓</div>
          <p class="empty-message">Henüz eğitim bilgisi eklenmemiş. Eğitim geçmişinizi ekleyerek profilinizi tamamlayın.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Eğitim Ekle</a>
        </div>
      `,
      [EDUCATION_TEMPLATE_IDS.CARDS]: `
        <div class="education-empty-state">
          <div class="empty-icon">🎓</div>
          <p class="empty-message">Henüz eğitim bilgisi eklenmemiş. Eğitim geçmişinizi ekleyerek profilinizi tamamlayın.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Eğitim Ekle</a>
        </div>
      `,
      [EDUCATION_TEMPLATE_IDS.MODERN]: `
        <div class="education-empty-state">
          <div class="empty-icon">🎓</div>
          <p class="empty-message">Henüz eğitim bilgisi eklenmemiş. Eğitim geçmişinizi ekleyerek profilinizi tamamlayın.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Eğitim Ekle</a>
        </div>
      `,
      [EDUCATION_TEMPLATE_IDS.ACCORDION]: `
        <div class="education-empty-state">
          <div class="empty-icon">🎓</div>
          <p class="empty-message">Henüz eğitim bilgisi eklenmemiş. Eğitim geçmişinizi ekleyerek profilinizi tamamlayın.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Eğitim Ekle</a>
        </div>
      `,
      [EDUCATION_TEMPLATE_IDS.HORIZONTAL_TIMELINE]: `
        <div class="education-empty-state">
          <div class="empty-icon">🎓</div>
          <p class="empty-message">Henüz eğitim bilgisi eklenmemiş. Eğitim geçmişinizi ekleyerek profilinizi tamamlayın.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Eğitim Ekle</a>
        </div>
      `,
      [EDUCATION_TEMPLATE_IDS.TABS]: `
        <div class="education-empty-state">
          <div class="empty-icon">🎓</div>
          <p class="empty-message">Henüz eğitim bilgisi eklenmemiş. Eğitim geçmişinizi ekleyerek profilinizi tamamlayın.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Eğitim Ekle</a>
        </div>
      `
    };

    return emptyStates[templateId] || emptyStates[EDUCATION_TEMPLATE_IDS.TIMELINE];
  }

  // Template generators with XSS protection and field validation
  const templateGenerators: Record<string, (edu: typeof cvData.education[0]) => string> = {
    [EDUCATION_TEMPLATE_IDS.TIMELINE]: (edu) => `
      <article class="education-item" role="listitem">
        <time class="education-duration" datetime="${escapeHtml(edu.year)}">${escapeHtml(formatEducationYear(edu.year))}</time>
        <h3 class="education-degree">${escapeHtml(edu.degree)}</h3>
        <div class="education-school">${escapeHtml(edu.school)}</div>
        ${edu.field && edu.field.trim() && edu.field !== edu.degree
        ? `<p class="education-description">${escapeHtml(edu.field)}</p>`
        : ''}
      </article>
    `,
    [EDUCATION_TEMPLATE_IDS.CARDS]: (edu) => `
      <article class="education-card" role="listitem">
        <time class="education-duration" datetime="${escapeHtml(edu.year)}">${escapeHtml(formatEducationYear(edu.year))}</time>
        <h3 class="education-degree">${escapeHtml(edu.degree)}</h3>
        <div class="education-school">${escapeHtml(edu.school)}</div>
        ${edu.field && edu.field.trim() && edu.field !== edu.degree
        ? `<p class="education-description">${escapeHtml(edu.field)}</p>`
        : ''}
      </article>
    `,
    [EDUCATION_TEMPLATE_IDS.MODERN]: (edu) => `
      <article class="education-modern-item" role="listitem">
        <div class="education-header">
          <div class="education-title-group">
            <h3 class="education-degree">${escapeHtml(edu.degree)}</h3>
            <div class="education-school">${escapeHtml(edu.school)}</div>
          </div>
          <time class="education-duration" datetime="${escapeHtml(edu.year)}">${escapeHtml(formatEducationYear(edu.year))}</time>
        </div>
        ${edu.field && edu.field.trim() && edu.field !== edu.degree
        ? `<p class="education-description">${escapeHtml(edu.field)}</p>`
        : ''}
      </article>
    `,
    [EDUCATION_TEMPLATE_IDS.ACCORDION]: (edu) => `
      <article class="accordion-item-edu" role="listitem">
        <button class="accordion-header-edu" aria-expanded="false">
          <div class="accordion-header-content-edu">
            <div class="accordion-degree-edu">${escapeHtml(edu.degree)}</div>
            <div class="accordion-school-edu">${escapeHtml(edu.school)}</div>
            <time class="accordion-year-edu" datetime="${escapeHtml(edu.year)}">${escapeHtml(formatEducationYear(edu.year))}</time>
          </div>
          <span class="accordion-icon-edu">▼</span>
        </button>
        ${edu.field && edu.field.trim() && edu.field !== edu.degree
        ? `<div class="accordion-content-edu">
             <p class="accordion-description-edu">${escapeHtml(edu.field)}</p>
           </div>`
        : '<div class="accordion-content-edu"></div>'}
      </article>
    `,
    [EDUCATION_TEMPLATE_IDS.HORIZONTAL_TIMELINE]: (edu) => `
      <article class="horizontal-timeline-item-edu" role="listitem">
        <div class="horizontal-timeline-card-edu">
          <time class="horizontal-timeline-year-edu" datetime="${escapeHtml(edu.year)}">${escapeHtml(formatEducationYear(edu.year))}</time>
          <h3 class="horizontal-timeline-degree-edu">${escapeHtml(edu.degree)}</h3>
          <div class="horizontal-timeline-school-edu">${escapeHtml(edu.school)}</div>
          ${edu.field && edu.field.trim() && edu.field !== edu.degree
        ? `<p class="horizontal-timeline-description-edu">${escapeHtml(edu.field)}</p>`
        : ''}
        </div>
      </article>
    `,
    [EDUCATION_TEMPLATE_IDS.TABS]: (edu) => `
      <div class="tab-item-edu">
        <button class="tab-button-edu" aria-expanded="false" role="tab">
          <div class="tab-button-content-edu">
            <div class="tab-degree-edu">${escapeHtml(edu.degree)}</div>
            <div class="tab-school-edu">${escapeHtml(edu.school)}</div>
          </div>
          <time class="tab-year-edu" datetime="${escapeHtml(edu.year)}">${escapeHtml(formatEducationYear(edu.year))}</time>
          <span class="tab-icon-edu">▶</span>
        </button>
        ${edu.field && edu.field.trim() && edu.field !== edu.degree
        ? `<div class="tab-content-edu" role="tabpanel">
             <p class="tab-description-edu">${escapeHtml(edu.field)}</p>
           </div>`
        : '<div class="tab-content-edu" role="tabpanel"></div>'}
      </div>
    `
  };

  // Template ID validation
  const generator = templateGenerators[templateId];

  if (!generator) {
    console.error(`[generateEducationItems] Unknown template ID: ${templateId}`);
    throw new Error(`Education template "${templateId}" not found. Available templates: ${Object.keys(templateGenerators).join(', ')}`);
  }

  return cvData.education.map(generator).join('\n');
}

/**
 * CV verilerinden education section için placeholder değerleri oluşturur
 */
export function getEducationReplacements(
  cvData: CVData,
  themeColors: ThemeColors,
  templateId: string
): PlaceholderReplacements {
  return {
    '{{EDUCATION_ITEMS}}': generateEducationItems(cvData, templateId),
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
  };
}

/**
 * Helper function to normalize skill to CVSkill format
 * Supports both legacy string format and new CVSkill object format
 */
function normalizeSkill(skill: string | import('./gemini-pdf-parser').CVSkill): import('./gemini-pdf-parser').CVSkill {
  // Level to percentage mapping
  const levelPercentages = {
    'beginner': 40,
    'intermediate': 70,
    'advanced': 85,
    'expert': 95
  };

  if (typeof skill === 'string') {
    // Legacy format: convert string to CVSkill object with defaults
    return {
      name: skill,
      level: 'intermediate',
      percentage: 70,
      category: undefined,
      yearsOfExperience: undefined
    };
  }

  // New format: ensure all optional fields have defaults
  const level = skill.level || 'intermediate';
  const percentage = skill.percentage !== undefined
    ? skill.percentage
    : levelPercentages[level as keyof typeof levelPercentages];

  return {
    name: skill.name,
    level: level,
    percentage: percentage,
    category: skill.category,
    yearsOfExperience: skill.yearsOfExperience
  };
}

/**
 * Helper function to normalize language to CVLanguage format
 * Supports both legacy string format and new CVLanguage object format
 */
function normalizeLanguage(language: string | import('./gemini-pdf-parser').CVLanguage): import('./gemini-pdf-parser').CVLanguage {
  // Level to percentage mapping
  const levelPercentages = {
    'native': 100,
    'fluent': 90,
    'advanced': 75,
    'intermediate': 60,
    'basic': 40
  };

  if (typeof language === 'string') {
    // Legacy format: convert string to CVLanguage object with defaults
    return {
      name: language,
      level: 'intermediate',
      percentage: 60,
      certifications: undefined,
      cefr: undefined
    };
  }

  // New format: ensure all optional fields have defaults
  const level = language.level || 'intermediate';
  const percentage = language.percentage !== undefined
    ? language.percentage
    : levelPercentages[level as keyof typeof levelPercentages];

  return {
    name: language.name,
    level: level,
    percentage: percentage,
    certifications: language.certifications,
    cefr: language.cefr
  };
}

/**
 * CV verilerinden skills section için HTML items oluşturur
 * @param cvData - CV data containing skills information
 * @param templateId - Template identifier
 * @returns HTML string with skill items or empty state message
 */
export function generateSkillItems(
  cvData: CVData,
  templateId: string
): string {
  // Empty data validation
  if (!cvData.skills || cvData.skills.length === 0) {
    return '<p class="no-skills">Henüz yetenek bilgisi eklenmemiş.</p>';
  }

  // Template generators with XSS protection
  const templateGenerators: Record<string, (skill: string | import('./gemini-pdf-parser').CVSkill) => string> = {
    'skills-progress-bars': (skill) => {
      const normalized = normalizeSkill(skill);
      const percentage = normalized.percentage || 70; // Default to 70% if not specified

      return `
        <div class="skill-item">
          <div class="skill-name">${escapeHtml(normalized.name)}</div>
          <div class="skill-bar">
            <div class="skill-progress" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    },
    'skills-card-grid': (skill) => {
      const normalized = normalizeSkill(skill);

      return `
        <div class="skill-card">
          <div class="skill-icon">💡</div>
          <div class="skill-name">${escapeHtml(normalized.name)}</div>
          ${normalized.category ? `<div class="skill-category">${escapeHtml(normalized.category)}</div>` : ''}
        </div>
      `;
    },
    'skills-categorized': (skill) => {
      // This template handles grouping differently, so we return empty here
      // The actual grouping logic is below
      return '';
    },
    'skills-minimal-list': (skill) => {
      const normalized = normalizeSkill(skill);

      return `
        <div class="skill-item-minimal">
          <span class="skill-name-minimal">${escapeHtml(normalized.name)}</span>
          <span class="skill-level-minimal">${normalized.level || 'intermediate'}</span>
        </div>
      `;
    },
    'skills-tag-cloud': (skill) => {
      const normalized = normalizeSkill(skill);
      const level = normalized.level || 'intermediate';

      return `
        <span class="skill-tag" data-level="${level}">
          ${escapeHtml(normalized.name)}
        </span>
      `;
    }
  };

  // Special handling for categorized template
  if (templateId === 'skills-categorized') {
    // Normalize all skills first
    const normalizedSkills = cvData.skills.map(normalizeSkill);

    // Group skills by category
    const skillsByCategory: Record<string, typeof normalizedSkills> = {};

    normalizedSkills.forEach(skill => {
      const category = skill.category && skill.category.trim() !== ''
        ? skill.category
        : 'Genel';

      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill);
    });

    // Generate HTML for each category
    const categoryHtml = Object.entries(skillsByCategory).map(([category, skills]) => {
      const skillBadges = skills.map(skill => `
        <div class="skill-badge">
          <span>${escapeHtml(skill.name)}</span>
          <span class="skill-level">${skill.level || 'intermediate'}</span>
        </div>
      `).join('');

      return `
        <div class="skill-category-group">
          <div class="skill-category-header">${escapeHtml(category)}</div>
          <div class="skill-category-items">
            ${skillBadges}
          </div>
        </div>
      `;
    }).join('');

    return categoryHtml;
  }

  // Template ID validation
  const generator = templateGenerators[templateId];

  if (!generator) {
    console.error(`[generateSkillItems] Unknown template ID: ${templateId}`);
    throw new Error(`Skills template "${templateId}" not found. Available templates: ${Object.keys(templateGenerators).join(', ')}`);
  }

  return cvData.skills.map(generator).join('\n');
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
 * CV verilerinden portfolio section için HTML items oluşturur
 */
export function generatePortfolioItems(
  cvData: CVData,
  templateId: string
): string {
  if (!cvData.portfolio || cvData.portfolio.length === 0) {
    return '';
  }

  if (templateId === 'portfolio-grid') {
    return cvData.portfolio.map((item, index) => `
      <div class="portfolio-item" data-index="${index}">
        <img src="${convertR2UrlToRelativePath(item.imageUrl)}" alt="${escapeHtml(item.title || `Portfolio ${index + 1}`)}" loading="lazy" />
      </div>
    `).join('\n');
  } else if (templateId === 'portfolio-masonry') {
    return cvData.portfolio.map((item, index) => `
      <div class="portfolio-item-masonry" data-index="${index}">
        <img src="${convertR2UrlToRelativePath(item.imageUrl)}" alt="${escapeHtml(item.title || `Portfolio ${index + 1}`)}" loading="lazy" />
      </div>
    `).join('\n');
  } else if (templateId === 'portfolio-carousel') {
    return cvData.portfolio.map((item, index) => `
      <div class="portfolio-item-carousel" data-index="${index}">
        <img src="${convertR2UrlToRelativePath(item.imageUrl)}" alt="${escapeHtml(item.title || `Portfolio ${index + 1}`)}" loading="lazy" />
      </div>
    `).join('\n');
  } else if (templateId === 'portfolio-bento-grid') {
    return cvData.portfolio.map((item, index) => {
      const hasMetadata = item.title || item.description || item.category || (item.tags && item.tags.length > 0);

      return `
      <div class="portfolio-item-bento" data-index="${index}">
        <img src="${convertR2UrlToRelativePath(item.imageUrl)}" alt="${escapeHtml(item.title || `Portfolio ${index + 1}`)}" loading="lazy" />
        ${item.projectUrl ? `<a href="${escapeHtml(item.projectUrl)}" target="_blank" rel="noopener noreferrer" class="portfolio-item-link" title="View Project">🔗</a>` : ''}
        ${hasMetadata ? `
        <div class="portfolio-item-metadata">
          ${item.category ? `<div class="portfolio-item-category">${escapeHtml(item.category)}</div>` : ''}
          ${item.title ? `<h3 class="portfolio-item-title">${escapeHtml(item.title)}</h3>` : ''}
          ${item.description ? `<p class="portfolio-item-description">${escapeHtml(item.description)}</p>` : ''}
          ${item.tags && item.tags.length > 0 ? `
          <div class="portfolio-item-tags">
            ${item.tags.map(tag => `<span class="portfolio-item-tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
          ` : ''}
        </div>
        ` : ''}
      </div>
    `;
    }).join('\n');
  }

  return '';
}

/**
 * CV verilerinden portfolio section için placeholder değerleri oluşturur
 */
export function getPortfolioReplacements(
  cvData: CVData,
  themeColors: ThemeColors,
  templateId: string
): PlaceholderReplacements {
  const portfolioItems = generatePortfolioItems(cvData, templateId);

  // Add lightbox HTML structure
  const lightboxHtml = `
    <div class="lightbox" id="portfolio-lightbox">
      <div class="lightbox-content">
        <button class="lightbox-close" id="lightbox-close">×</button>
        <img id="lightbox-img" src="" alt="Portfolio" />
      </div>
    </div>
  `;

  return {
    '{{PORTFOLIO_ITEMS}}': portfolioItems + lightboxHtml,
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
  };
}

/**
 * CV verilerinden languages section için HTML items oluşturur
 * @param cvData - CV data containing languages information
 * @param templateId - Template identifier
 * @returns HTML string with language items or empty state message
 */
export function generateLanguageItems(
  cvData: CVData,
  templateId: string
): string {
  // Empty data validation - Template-specific empty states
  if (!cvData.languages || cvData.languages.length === 0) {
    const emptyStates: Record<string, string> = {
      'languages-progress-bars': `
        <div class="languages-empty-state">
          <div class="empty-icon">🌍</div>
          <p class="empty-message">No language information added yet. Add your language skills to complete your profile.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Add Language</a>
        </div>
      `,
      'languages-card-grid': `
        <div class="languages-empty-state">
          <div class="empty-icon">🌍</div>
          <p class="empty-message">No language information added yet. Add your language skills to complete your profile.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Add Language</a>
        </div>
      `,
      'languages-minimalist': `
        <div class="languages-empty-state">
          <div class="empty-icon">🌍</div>
          <p class="empty-message">No language information added yet. Add your language skills to complete your profile.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Add Language</a>
        </div>
      `,
      'languages-certification': `
        <div class="languages-empty-state">
          <div class="empty-icon">🌍</div>
          <p class="empty-message">No language information added yet. Add your language skills and certifications to complete your profile.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Add Language</a>
        </div>
      `,
      'languages-accordion': `
        <div class="languages-empty-state">
          <div class="empty-icon">🌍</div>
          <p class="empty-message">No language information added yet. Add your language skills to complete your profile.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Add Language</a>
        </div>
      `,
      'languages-badge-cloud': `
        <div class="languages-empty-state">
          <div class="empty-icon">🌍</div>
          <p class="empty-message">No language information added yet. Add your language skills to complete your profile.</p>
          <a href="/dashboard?tab=my-info" class="empty-action">Add Language</a>
        </div>
      `
    };

    return emptyStates[templateId] || emptyStates['languages-progress-bars'];
  }

  // Normalize all languages to CVLanguage format
  const normalizedLanguages = cvData.languages.map(normalizeLanguage);

  // Template generators with XSS protection and accessibility
  const templateGenerators: Record<string, (lang: import('./gemini-pdf-parser').CVLanguage, index: number) => string> = {
    'languages-progress-bars': (lang, index) => {
      const percentage = lang.percentage || 60;
      const level = lang.level || 'intermediate';

      return `
      <article class="language-item" role="listitem">
        <div class="language-name">
          <span id="lang-${index}">${escapeHtml(lang.name)}</span>
          <span class="language-level" aria-label="Proficiency level">${escapeHtml(level)}</span>
        </div>
        <div class="language-bar" 
             role="progressbar" 
             aria-labelledby="lang-${index}"
             aria-valuenow="${percentage}" 
             aria-valuemin="0" 
             aria-valuemax="100">
          <div class="language-progress" style="width: ${percentage}%"></div>
        </div>
      </article>
    `;
    },
    'languages-card-grid': (lang, index) => {
      const level = lang.level || 'intermediate';

      return `
      <article class="language-card" role="listitem" aria-labelledby="lang-card-${index}">
        <div class="language-icon" aria-hidden="true">🌍</div>
        <div class="language-name" id="lang-card-${index}">${escapeHtml(lang.name)}</div>
        <div class="language-level" aria-label="Proficiency level">${escapeHtml(level)}</div>
      </article>
    `;
    },
    'languages-minimalist': (lang, index) => {
      const level = lang.level || 'intermediate';

      return `
      <article class="language-item-minimal" role="listitem" aria-labelledby="lang-min-${index}">
        <div class="language-name-minimal" id="lang-min-${index}">${escapeHtml(lang.name)}</div>
        <div class="language-level-minimal" aria-label="Proficiency level">${escapeHtml(level)}</div>
      </article>
    `;
    },
    'languages-certification': (lang, index) => {
      const level = lang.level || 'intermediate';
      const hasCertifications = lang.certifications && lang.certifications.length > 0;
      const hasCefr = lang.cefr && lang.cefr.trim() !== '';

      // Generate certification badges HTML
      const certificationsHtml = hasCertifications
        ? lang.certifications!.map(cert => `
            <div class="language-cert-badge">
              <span class="language-cert-badge-icon">🏆</span>
              <span>${escapeHtml(cert)}</span>
            </div>
          `).join('')
        : '<div class="language-cert-no-badges">No certifications yet</div>';

      return `
      <article class="language-cert-card" role="listitem" aria-labelledby="lang-cert-${index}">
        <div class="language-cert-header">
          <div>
            <div class="language-cert-name" id="lang-cert-${index}">${escapeHtml(lang.name)}</div>
            ${hasCefr ? `
              <div class="language-cert-cefr">
                CEFR Level:
                <span class="language-cert-cefr-badge">${escapeHtml(lang.cefr!)}</span>
              </div>
            ` : ''}
          </div>
          <div class="language-cert-level" aria-label="Proficiency level">${escapeHtml(level)}</div>
        </div>
        <div class="language-cert-badges">
          <div class="language-cert-badges-title">Certifications</div>
          <div class="language-cert-badge-list">
            ${certificationsHtml}
          </div>
        </div>
      </article>
    `;
    },
    'languages-accordion': (lang, index) => {
      const level = lang.level || 'intermediate';
      const hasCertifications = lang.certifications && lang.certifications.length > 0;
      const hasCefr = lang.cefr && lang.cefr.trim() !== '';
      const percentage = lang.percentage || 60;

      // Generate certifications HTML
      const certificationsHtml = hasCertifications
        ? lang.certifications!.map(cert => `
            <div class="language-accordion-cert-badge">
              <span>🏆</span>
              <span>${escapeHtml(cert)}</span>
            </div>
          `).join('')
        : '<div class="language-accordion-no-certs">No certifications</div>';

      return `
      <article class="language-accordion-item" role="listitem">
        <button class="language-accordion-header" 
                aria-expanded="false" 
                aria-controls="accordion-content-${index}"
                id="accordion-header-${index}">
          <div class="language-accordion-header-content">
            <div class="language-accordion-name">${escapeHtml(lang.name)}</div>
            <div class="language-accordion-level" aria-label="Proficiency level">${escapeHtml(level)}</div>
          </div>
          <span class="language-accordion-icon" aria-hidden="true">▼</span>
        </button>
        <div class="language-accordion-content" 
             id="accordion-content-${index}" 
             role="region" 
             aria-labelledby="accordion-header-${index}">
          <div class="language-accordion-details">
            <div class="language-accordion-detail-row">
              <span class="language-accordion-detail-label">Proficiency</span>
              <span class="language-accordion-detail-value">${percentage}%</span>
            </div>
            ${hasCefr ? `
              <div class="language-accordion-detail-row">
                <span class="language-accordion-detail-label">CEFR Level</span>
                <span class="language-accordion-cefr-badge">${escapeHtml(lang.cefr!)}</span>
              </div>
            ` : ''}
            <div class="language-accordion-detail-row">
              <span class="language-accordion-detail-label">Certifications</span>
              <div class="language-accordion-certifications">
                ${certificationsHtml}
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
    },
    'languages-badge-cloud': (lang, index) => {
      const level = lang.level || 'intermediate';
      const percentage = lang.percentage || 60;
      const hasCefr = lang.cefr && lang.cefr.trim() !== '';

      return `
      <div class="language-badge-item" 
           role="listitem" 
           data-level="${escapeHtml(level)}"
           ${hasCefr ? `data-cefr="${escapeHtml(lang.cefr!)}"` : ''}
           aria-label="${escapeHtml(lang.name)} - ${escapeHtml(level)} level">
        <span class="language-badge-name">${escapeHtml(lang.name)}</span>
        <span class="language-badge-level">${escapeHtml(level)}</span>
        <span class="language-badge-percentage">${percentage}%</span>
      </div>
    `;
    }
  };

  // Template ID validation
  const generator = templateGenerators[templateId];

  if (!generator) {
    console.error(`[generateLanguageItems] Unknown template ID: ${templateId}`);
    throw new Error(`Languages template "${templateId}" not found. Available templates: ${Object.keys(templateGenerators).join(', ')}`);
  }

  return normalizedLanguages.map((lang, index) => generator(lang, index)).join('\n');
}

/**
 * CV verilerinden languages section için placeholder değerleri oluşturur
 */
export function getLanguagesReplacements(
  cvData: CVData,
  themeColors: ThemeColors,
  templateId: string
): PlaceholderReplacements {
  return {
    '{{LANGUAGE_ITEMS}}': generateLanguageItems(cvData, templateId),
    '{{SECTION_TITLE}}': 'Languages', // Can be made dynamic/translatable later
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
    '{{COLOR_BORDER}}': 'rgba(0, 0, 0, 0.1)', // Light border for progress bars
    '{{COLOR_CARD_BG}}': 'rgba(255, 255, 255, 0.1)', // Semi-transparent card background
    '{{COLOR_CARD_BG_HOVER}}': 'rgba(255, 255, 255, 0.15)', // Hover state for cards
    '{{COLOR_BADGE_BG}}': 'rgba(0, 0, 0, 0.05)', // Badge background
    '{{COLOR_SHADOW}}': 'rgba(0, 0, 0, 0.1)', // Shadow color
  };
}

/**
 * CV verilerinden contact section için placeholder değerleri oluşturur
 */
export function getContactReplacements(
  cvData: CVData,
  themeColors: ThemeColors
): PlaceholderReplacements {
  return {
    '{{EMAIL}}': escapeHtml(cvData.personalInfo.email || 'Email bulunamadı'),
    '{{PHONE}}': escapeHtml(cvData.personalInfo.phone || 'Telefon bulunamadı'),
    '{{LOCATION}}': escapeHtml(cvData.personalInfo.location || 'Konum belirtilmemiş'),
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
  };
}

/**
 * CV verilerinden footer section için placeholder değerleri oluşturur
 */
export function getFooterReplacements(
  cvData: CVData,
  themeColors: ThemeColors
): PlaceholderReplacements {
  // Sosyal medya linklerini oluştur - sadece dolu olanlar görünsün
  const socialLinks = [
    cvData.personalInfo.linkedin ? `<a href="${cvData.personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">💼</a>` : '',
    cvData.personalInfo.github ? `<a href="${cvData.personalInfo.github}" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">⚙️</a>` : '',
    cvData.personalInfo.facebook ? `<a href="${cvData.personalInfo.facebook}" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">📘</a>` : '',
    cvData.personalInfo.instagram ? `<a href="${cvData.personalInfo.instagram}" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">📷</a>` : '',
    cvData.personalInfo.x ? `<a href="${cvData.personalInfo.x}" target="_blank" rel="noopener noreferrer" title="X (Twitter)" aria-label="X">🐦</a>` : '',
    cvData.personalInfo.website ? `<a href="${cvData.personalInfo.website}" target="_blank" rel="noopener noreferrer" title="Website" aria-label="Website">🌐</a>` : '',
    cvData.personalInfo.email ? `<a href="mailto:${cvData.personalInfo.email}" title="Email" aria-label="Email">📧</a>` : '',
    cvData.personalInfo.phone ? `<a href="tel:${cvData.personalInfo.phone}" title="Telefon" aria-label="Telefon">📱</a>` : '',
  ].filter(link => link !== '').join('\n    ');

  return {
    '{{NAME}}': escapeHtml(cvData.personalInfo.name),
    '{{TITLE}}': escapeHtml(cvData.personalInfo.title || 'Professional'),
    '{{EMAIL}}': escapeHtml(cvData.personalInfo.email || 'Email bulunamadı'),
    '{{PHONE}}': escapeHtml(cvData.personalInfo.phone || 'Telefon bulunamadı'),
    '{{LOCATION}}': escapeHtml(cvData.personalInfo.location || 'Konum belirtilmemiş'),
    '{{SUMMARY}}': escapeHtml(cvData.summary || cvData.personalInfo.name + ' - Professional Profile'),
    '{{SOCIAL_LINKS}}': socialLinks,
    '{{CURRENT_YEAR}}': new Date().getFullYear().toString(),
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
  selectedComponents: SelectedComponent[],
  templateId?: string
): PlaceholderReplacements {
  const initials = cvData.personalInfo.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Navigation template tipini belirle
  let templateType: 'classic' | 'minimal' | 'sidebar' | 'floating' = 'classic';
  if (templateId) {
    if (templateId.includes('minimal')) templateType = 'minimal';
    else if (templateId.includes('sidebar')) templateType = 'sidebar';
    else if (templateId.includes('floating')) templateType = 'floating';
  }

  // Menu item'larını server-side oluştur
  const { generateNavigationMenuItems } = require('./navigation-utils');
  const navMenuItems = generateNavigationMenuItems(selectedComponents, templateType);

  // Sosyal medya linklerini oluştur - sadece dolu olanlar görünsün
  const socialLinks = [
    cvData.personalInfo.linkedin ? `<a href="${cvData.personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">💼</a>` : '',
    cvData.personalInfo.github ? `<a href="${cvData.personalInfo.github}" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">⚙️</a>` : '',
    cvData.personalInfo.facebook ? `<a href="${cvData.personalInfo.facebook}" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">📘</a>` : '',
    cvData.personalInfo.instagram ? `<a href="${cvData.personalInfo.instagram}" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">📷</a>` : '',
    cvData.personalInfo.x ? `<a href="${cvData.personalInfo.x}" target="_blank" rel="noopener noreferrer" title="X (Twitter)" aria-label="X">🐦</a>` : '',
    cvData.personalInfo.website ? `<a href="${cvData.personalInfo.website}" target="_blank" rel="noopener noreferrer" title="Website" aria-label="Website">🌐</a>` : '',
    cvData.personalInfo.email ? `<a href="mailto:${cvData.personalInfo.email}" title="Email" aria-label="Email">📧</a>` : '',
    cvData.personalInfo.phone ? `<a href="tel:${cvData.personalInfo.phone}" title="Phone" aria-label="Phone">📱</a>` : '',
  ].filter(link => link !== '').join('\n    ');

  return {
    '{{NAME}}': cvData.personalInfo.name,
    '{{INITIALS}}': initials,
    '{{NAV_MENU_ITEMS}}': navMenuItems,
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
      return getNavigationReplacements(cvData, themeColors, selectedComponents || [], component.id);
    case 'hero':
      return getHeroReplacements(cvData, themeColors);
    case 'experience':
      return getExperienceReplacements(cvData, themeColors, component.id);
    case 'education':
      return getEducationReplacements(cvData, themeColors, component.id);
    case 'portfolio':
      return getPortfolioReplacements(cvData, themeColors, component.id);
    case 'skills':
      return getSkillsReplacements(cvData, themeColors, component.id);
    case 'languages':
      return getLanguagesReplacements(cvData, themeColors, component.id);
    case 'contact':
      return getContactReplacements(cvData, themeColors);
    case 'footer':
      return getFooterReplacements(cvData, themeColors);
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
