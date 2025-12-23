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
 * Converts hex color to RGB string for rgba() usage
 * @param hex - Hex color (e.g., "#ffffff" or "#fff")
 * @returns RGB string (e.g., "255, 255, 255") or fallback
 */
export function hexToRgb(hex: string | null | undefined): string {
  if (!hex) return '0, 0, 0';

  // Remove # if present
  hex = hex.replace('#', '');

  // Handle shorthand hex (e.g., #fff)
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const num = parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return `${r}, ${g}, ${b}`;
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

  // Generate social links HTML
  const socialLinksHtml: string[] = [];

  if (cvData.personalInfo.linkedin) {
    socialLinksHtml.push(`<a href="${escapeHtml(cvData.personalInfo.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>`);
  }
  if (cvData.personalInfo.github) {
    socialLinksHtml.push(`<a href="${escapeHtml(cvData.personalInfo.github)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>`);
  }
  if (cvData.personalInfo.x) {
    socialLinksHtml.push(`<a href="${escapeHtml(cvData.personalInfo.x)}" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" title="X (Twitter)"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg></a>`);
  }
  if (cvData.personalInfo.facebook) {
    socialLinksHtml.push(`<a href="${escapeHtml(cvData.personalInfo.facebook)}" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>`);
  }
  if (cvData.personalInfo.instagram) {
    socialLinksHtml.push(`<a href="${escapeHtml(cvData.personalInfo.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>`);
  }
  if (cvData.personalInfo.website) {
    socialLinksHtml.push(`<a href="${escapeHtml(cvData.personalInfo.website)}" target="_blank" rel="noopener noreferrer" aria-label="Website" title="Website"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></a>`);
  }

  return {
    '{{NAME}}': escapeHtml(cvData.personalInfo.name),
    '{{INITIALS}}': escapeHtml(initials),
    '{{TITLE}}': escapeHtml(cvData.personalInfo.title || 'Professional'),
    '{{SUMMARY}}': escapeHtml(cvData.summary || cvData.personalInfo.name + ' - Professional Profile'),
    '{{PROFILE_IMAGE}}': profileImageContent,
    '{{CTA_PRIMARY_TEXT}}': 'İletişime Geç',
    '{{CTA_SECONDARY_TEXT}}': 'Hakkımda',
    '{{SOCIAL_LINKS}}': socialLinksHtml.join(''),
    '{{LOCATION}}': escapeHtml(cvData.personalInfo.location || ''),
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_NEUTRAL}}': themeColors.neutral,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_SURFACE}}': themeColors.surface,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
    '{{COLOR_BORDER}}': themeColors.border,
    '{{COLOR_HOVER}}': themeColors.hover,
    '{{COLOR_ICON_PRIMARY}}': themeColors.iconPrimary,
    '{{COLOR_ICON_SECONDARY}}': themeColors.iconSecondary,
    '{{FONT_HEADING}}': themeColors.fontHeading || 'Inter',
    '{{FONT_BODY}}': themeColors.fontBody || 'Inter',
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
    '{{COLOR_NEUTRAL}}': themeColors.neutral,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_SURFACE}}': themeColors.surface,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
    '{{COLOR_BORDER}}': themeColors.border,
    '{{COLOR_HOVER}}': themeColors.hover,
    '{{FONT_HEADING}}': themeColors.fontHeading || 'Inter',
    '{{FONT_BODY}}': themeColors.fontBody || 'Inter',
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
        ${edu.gpa && edu.gpa.trim()
        ? `<p class="education-gpa">GPA: ${escapeHtml(edu.gpa)}</p>`
        : ''}
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
        ${edu.gpa && edu.gpa.trim()
        ? `<p class="education-gpa">GPA: ${escapeHtml(edu.gpa)}</p>`
        : ''}
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
            ${edu.gpa && edu.gpa.trim()
        ? `<p class="education-gpa">GPA: ${escapeHtml(edu.gpa)}</p>`
        : ''}
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
            ${edu.gpa && edu.gpa.trim()
        ? `<div class="accordion-gpa-edu">GPA: ${escapeHtml(edu.gpa)}</div>`
        : ''}
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
          ${edu.gpa && edu.gpa.trim()
        ? `<p class="horizontal-timeline-gpa-edu">GPA: ${escapeHtml(edu.gpa)}</p>`
        : ''}
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
            ${edu.gpa && edu.gpa.trim()
        ? `<div class="tab-gpa-edu">GPA: ${escapeHtml(edu.gpa)}</div>`
        : ''}
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
    '{{COLOR_NEUTRAL}}': themeColors.neutral,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_SURFACE}}': themeColors.surface,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
    '{{COLOR_BORDER}}': themeColors.border,
    '{{COLOR_HOVER}}': themeColors.hover,
    '{{FONT_HEADING}}': themeColors.fontHeading || 'Inter',
    '{{FONT_BODY}}': themeColors.fontBody || 'Inter',
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
    '{{COLOR_NEUTRAL}}': themeColors.neutral,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_SURFACE}}': themeColors.surface,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
    '{{COLOR_BORDER}}': themeColors.border,
    '{{COLOR_HOVER}}': themeColors.hover,
    '{{FONT_HEADING}}': themeColors.fontHeading || 'Inter',
    '{{FONT_BODY}}': themeColors.fontBody || 'Inter',
  };
}

/**
 * CV verilerinden portfolio section için HTML items oluşturur
 * @param useAbsoluteUrls - true ise proxy URL kullanılır (preview için), false ise relative path'e dönüştürülür (publish için)
 */
export function generatePortfolioItems(
  cvData: CVData,
  templateId: string,
  useAbsoluteUrls: boolean = false
): string {
  if (!cvData.portfolio || cvData.portfolio.length === 0) {
    return '';
  }

  // URL dönüşümü: 
  // Preview için: R2 URL -> /api/anonymous/assets/userId/folder/fileName (proxy)
  // Publish için: R2 URL -> /_assets/folder/fileName (relative)
  const getImageUrl = (url: string): string => {
    if (!url) return url;

    if (useAbsoluteUrls) {
      // R2 URL'i proxy URL'e çevir
      // R2 format: https://pub-xxx.r2.dev/users/{userId}/portfolio/{fileName}
      const r2Match = url.match(/https?:\/\/pub-[a-f0-9]+\.r2\.dev\/users\/([^/]+)\/(portfolio|profile)\/(.+)/);
      if (r2Match) {
        const [, userId, folder, fileName] = r2Match;
        return `/api/anonymous/assets/${userId}/${folder}/${fileName}`;
      }
      return url; // R2 formatı değilse olduğu gibi döndür
    } else {
      return convertR2UrlToRelativePath(url);
    }
  };

  if (templateId === 'portfolio-grid') {
    return cvData.portfolio.map((item, index) => `
      <div class="portfolio-item" data-index="${index}">
        <img src="${getImageUrl(item.imageUrl)}" alt="${escapeHtml(item.title || `Portfolio ${index + 1}`)}" loading="lazy" />
      </div>
    `).join('\n');
  } else if (templateId === 'portfolio-masonry') {
    return cvData.portfolio.map((item, index) => `
      <div class="portfolio-item-masonry" data-index="${index}">
        <img src="${getImageUrl(item.imageUrl)}" alt="${escapeHtml(item.title || `Portfolio ${index + 1}`)}" loading="lazy" />
      </div>
    `).join('\n');
  } else if (templateId === 'portfolio-carousel') {
    return cvData.portfolio.map((item, index) => `
      <div class="portfolio-item-carousel" data-index="${index}">
        <img src="${getImageUrl(item.imageUrl)}" alt="${escapeHtml(item.title || `Portfolio ${index + 1}`)}" loading="lazy" />
      </div>
    `).join('\n');
  } else if (templateId === 'portfolio-bento-grid') {
    return cvData.portfolio.map((item, index) => {
      const hasMetadata = item.title || item.description || item.category || (item.tags && item.tags.length > 0);

      return `
      <div class="portfolio-item-bento" data-index="${index}">
        <img src="${getImageUrl(item.imageUrl)}" alt="${escapeHtml(item.title || `Portfolio ${index + 1}`)}" loading="lazy" />
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
 * @param useAbsoluteUrls - true ise R2 URL'leri olduğu gibi kullanılır (preview için)
 */
export function getPortfolioReplacements(
  cvData: CVData,
  themeColors: ThemeColors,
  templateId: string,
  useAbsoluteUrls: boolean = false
): PlaceholderReplacements {
  const portfolioItems = generatePortfolioItems(cvData, templateId, useAbsoluteUrls);

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
    '{{COLOR_NEUTRAL}}': themeColors.neutral,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_SURFACE}}': themeColors.surface,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
    '{{COLOR_BORDER}}': themeColors.border,
    '{{COLOR_HOVER}}': themeColors.hover,
    '{{FONT_HEADING}}': themeColors.fontHeading || 'Inter',
    '{{FONT_BODY}}': themeColors.fontBody || 'Inter',
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
    '{{SECTION_TITLE}}': 'Languages',
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_NEUTRAL}}': themeColors.neutral,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_SURFACE}}': themeColors.surface,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
    '{{COLOR_BORDER}}': themeColors.border,
    '{{COLOR_HOVER}}': themeColors.hover,
    '{{COLOR_CARD_BG}}': themeColors.surface,
    '{{COLOR_CARD_BG_HOVER}}': themeColors.hover,
    '{{COLOR_BADGE_BG}}': themeColors.surface,
    '{{COLOR_SHADOW}}': themeColors.border,
    '{{FONT_HEADING}}': themeColors.fontHeading || 'Inter',
    '{{FONT_BODY}}': themeColors.fontBody || 'Inter',
  };
}

/**
 * CV verilerinden contact section için placeholder değerleri oluşturur
 */
export function getContactReplacements(
  cvData: CVData,
  themeColors: ThemeColors
): PlaceholderReplacements {
  // Sosyal medya linklerini oluştur - sadece dolu olanlar görünsün
  const { getIconSvg } = require('./icon-registry');

  const socialLinks = [
    cvData.personalInfo.linkedin ? `<a href="${cvData.personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">${getIconSvg('social', 'linkedin', 'outline', 20)}</a>` : '',
    cvData.personalInfo.github ? `<a href="${cvData.personalInfo.github}" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">${getIconSvg('social', 'github', 'outline', 20)}</a>` : '',
    cvData.personalInfo.facebook ? `<a href="${cvData.personalInfo.facebook}" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">${getIconSvg('social', 'facebook', 'outline', 20)}</a>` : '',
    cvData.personalInfo.instagram ? `<a href="${cvData.personalInfo.instagram}" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">${getIconSvg('social', 'instagram', 'outline', 20)}</a>` : '',
    cvData.personalInfo.x ? `<a href="${cvData.personalInfo.x}" target="_blank" rel="noopener noreferrer" title="X (Twitter)" aria-label="X">${getIconSvg('social', 'twitter', 'outline', 20)}</a>` : '',
    cvData.personalInfo.website ? `<a href="${cvData.personalInfo.website}" target="_blank" rel="noopener noreferrer" title="Website" aria-label="Website">${getIconSvg('social', 'globe', 'outline', 20)}</a>` : '',
  ].filter(link => link !== '').join('\n    ');

  return {
    '{{EMAIL}}': escapeHtml(cvData.personalInfo.email || 'Email bulunamadı'),
    '{{PHONE}}': escapeHtml(cvData.personalInfo.phone || 'Telefon bulunamadı'),
    '{{LOCATION}}': escapeHtml(cvData.personalInfo.location || 'Konum belirtilmemiş'),
    '{{SITE_OWNER_EMAIL}}': escapeHtml(cvData.personalInfo.email || ''),
    '{{SOCIAL_LINKS}}': socialLinks,
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_NEUTRAL}}': themeColors.neutral,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_SURFACE}}': themeColors.surface,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
    '{{COLOR_BORDER}}': themeColors.border,
    '{{COLOR_HOVER}}': themeColors.hover,
    '{{FONT_HEADING}}': themeColors.fontHeading || 'Inter',
    '{{FONT_BODY}}': themeColors.fontBody || 'Inter',
  };
}

/**
 * CV verilerinden footer section için placeholder değerleri oluşturur
 */
export function getFooterReplacements(
  cvData: CVData,
  themeColors: ThemeColors,
  selectedComponents?: SelectedComponent[]
): PlaceholderReplacements {
  // Sosyal medya linklerini oluştur - sadece dolu olanlar görünsün
  // Icon'ları direkt SVG olarak inject ediyoruz
  const { getIconSvg } = require('./icon-registry');

  const socialLinks = [
    cvData.personalInfo.linkedin ? `<a href="${cvData.personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">${getIconSvg('social', 'linkedin', 'outline', 20)}</a>` : '',
    cvData.personalInfo.github ? `<a href="${cvData.personalInfo.github}" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">${getIconSvg('social', 'github', 'outline', 20)}</a>` : '',
    cvData.personalInfo.facebook ? `<a href="${cvData.personalInfo.facebook}" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">${getIconSvg('social', 'facebook', 'outline', 20)}</a>` : '',
    cvData.personalInfo.instagram ? `<a href="${cvData.personalInfo.instagram}" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">${getIconSvg('social', 'instagram', 'outline', 20)}</a>` : '',
    cvData.personalInfo.x ? `<a href="${cvData.personalInfo.x}" target="_blank" rel="noopener noreferrer" title="X (Twitter)" aria-label="X">${getIconSvg('social', 'twitter', 'outline', 20)}</a>` : '',
    cvData.personalInfo.website ? `<a href="${cvData.personalInfo.website}" target="_blank" rel="noopener noreferrer" title="Website" aria-label="Website">${getIconSvg('social', 'globe', 'outline', 20)}</a>` : '',
    cvData.personalInfo.email ? `<a href="mailto:${cvData.personalInfo.email}" title="Email" aria-label="Email">${getIconSvg('contact', 'mail', 'outline', 20)}</a>` : '',
    cvData.personalInfo.phone ? `<a href="tel:${cvData.personalInfo.phone}" title="Telefon" aria-label="Telefon">${getIconSvg('contact', 'phone', 'outline', 20)}</a>` : '',
  ].filter(link => link !== '').join('\n    ');

  // Footer navigation linklerini oluştur (navigation ve footer hariç tüm section'lar)
  let footerLinks = '';
  if (selectedComponents && selectedComponents.length > 0) {
    const { SECTION_NAME_MAP } = require('./navigation-utils');
    const menuableComponents = selectedComponents.filter(
      comp => comp.category !== 'navigation' && comp.category !== 'footer'
    );

    footerLinks = menuableComponents.map(comp => {
      const name = SECTION_NAME_MAP[comp.category] || comp.category;
      const ariaLabel = `${name} bölümüne git`;
      return `<li><a href="#${comp.category}" aria-label="${ariaLabel}">${name}</a></li>`;
    }).join('\n              ');
  }

  return {
    '{{NAME}}': escapeHtml(cvData.personalInfo.name),
    '{{TITLE}}': escapeHtml(cvData.personalInfo.title || 'Professional'),
    '{{EMAIL}}': escapeHtml(cvData.personalInfo.email || 'Email bulunamadı'),
    '{{PHONE}}': escapeHtml(cvData.personalInfo.phone || 'Telefon bulunamadı'),
    '{{LOCATION}}': escapeHtml(cvData.personalInfo.location || 'Konum belirtilmemiş'),
    '{{SUMMARY}}': escapeHtml(cvData.summary || cvData.personalInfo.name + ' - Professional Profile'),
    '{{SOCIAL_LINKS}}': socialLinks,
    '{{FOOTER_LINKS}}': footerLinks,
    '{{CURRENT_YEAR}}': new Date().getFullYear().toString(),
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_NEUTRAL}}': themeColors.neutral,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_SURFACE}}': themeColors.surface,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
    '{{COLOR_BORDER}}': themeColors.border,
    '{{COLOR_HOVER}}': themeColors.hover,
    '{{FONT_HEADING}}': themeColors.fontHeading || 'Inter',
    '{{FONT_BODY}}': themeColors.fontBody || 'Inter',
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
  templateId?: string,
  iconStyle?: 'outline' | 'solid',
  iconSizes?: { navigation: string; social: string }
): PlaceholderReplacements {
  const initials = cvData.personalInfo.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Navigation template tipini belirle
  let templateType: 'classic' | 'minimal' | 'sidebar' | 'floating' | 'tabbar' | 'glass' | 'pill' = 'classic';
  if (templateId) {
    if (templateId.includes('minimal')) templateType = 'minimal';
    else if (templateId.includes('sidebar')) templateType = 'sidebar';
    else if (templateId.includes('floating')) templateType = 'floating';
    else if (templateId.includes('tabbar')) templateType = 'tabbar';
    else if (templateId.includes('glass')) templateType = 'glass';
    else if (templateId.includes('pill')) templateType = 'pill';
  }

  // Menu item'larını server-side oluştur
  const { generateNavigationMenuItems } = require('./navigation-utils');
  const navMenuItems = generateNavigationMenuItems(
    selectedComponents,
    templateType,
    iconStyle || 'outline'
  );

  // Sosyal medya linklerini oluştur - sadece dolu olanlar görünsün
  // Icon'ları direkt SVG olarak inject ediyoruz çünkü {{SOCIAL_LINKS}} zaten HTML olarak yerleştiriliyor
  const { getIconSvg } = require('./icon-registry');

  console.log('🔍 DEBUG: Generating social links with icons...');

  const socialIconSize = iconSizes?.social ? parseInt(iconSizes.social) : 20;
  const socialIconStyle = iconStyle || 'outline';

  const socialLinks = [
    cvData.personalInfo.linkedin ? `<a href="${cvData.personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">${getIconSvg('social', 'linkedin', socialIconStyle, socialIconSize)}</a>` : '',
    cvData.personalInfo.github ? `<a href="${cvData.personalInfo.github}" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">${getIconSvg('social', 'github', socialIconStyle, socialIconSize)}</a>` : '',
    cvData.personalInfo.facebook ? `<a href="${cvData.personalInfo.facebook}" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">${getIconSvg('social', 'facebook', socialIconStyle, socialIconSize)}</a>` : '',
    cvData.personalInfo.instagram ? `<a href="${cvData.personalInfo.instagram}" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">${getIconSvg('social', 'instagram', socialIconStyle, socialIconSize)}</a>` : '',
    cvData.personalInfo.x ? `<a href="${cvData.personalInfo.x}" target="_blank" rel="noopener noreferrer" title="X (Twitter)" aria-label="X">${getIconSvg('social', 'twitter', socialIconStyle, socialIconSize)}</a>` : '',
    cvData.personalInfo.website ? `<a href="${cvData.personalInfo.website}" target="_blank" rel="noopener noreferrer" title="Website" aria-label="Website">${getIconSvg('social', 'globe', socialIconStyle, socialIconSize)}</a>` : '',
    cvData.personalInfo.email ? `<a href="mailto:${cvData.personalInfo.email}" title="Email" aria-label="Email">${getIconSvg('contact', 'mail', socialIconStyle, socialIconSize)}</a>` : '',
    cvData.personalInfo.phone ? `<a href="tel:${cvData.personalInfo.phone}" title="Phone" aria-label="Phone">${getIconSvg('contact', 'phone', socialIconStyle, socialIconSize)}</a>` : '',
  ].filter(link => link !== '').join('\n    ');

  console.log('✅ DEBUG: Social links generated:', socialLinks.substring(0, 200) + '...');

  return {
    '{{NAME}}': cvData.personalInfo.name,
    '{{INITIALS}}': initials,
    '{{NAV_MENU_ITEMS}}': navMenuItems,
    '{{SOCIAL_LINKS}}': socialLinks,
    '{{ICON_SIZE_NAVIGATION}}': iconSizes?.navigation || '20px',
    '{{ICON_SIZE_SOCIAL}}': iconSizes?.social || '18px',
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_PRIMARY_RGB}}': hexToRgb(themeColors.primary),
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_NEUTRAL}}': themeColors.neutral,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_BACKGROUND_RGB}}': hexToRgb(themeColors.background),
    '{{COLOR_SURFACE}}': themeColors.surface,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_RGB}}': hexToRgb(themeColors.text),
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
    '{{COLOR_BORDER}}': themeColors.border,
    '{{COLOR_HOVER}}': themeColors.hover,
    '{{COLOR_ICON_PRIMARY}}': themeColors.iconPrimary,
    '{{COLOR_ICON_SECONDARY}}': themeColors.iconSecondary,
    '{{FONT_HEADING}}': themeColors.fontHeading || 'Inter',
    '{{FONT_BODY}}': themeColors.fontBody || 'Inter',
  };
}

/**
 * Component kategorisine göre doğru replacement fonksiyonunu çağırır
 * @param useAbsoluteUrls - true ise R2 URL'leri absolute olarak kullanılır (preview için)
 */
export function getReplacementsForComponent(
  component: ComponentTemplate,
  cvData: CVData,
  themeColors: ThemeColors,
  selectedComponents?: SelectedComponent[],
  iconStyle?: 'outline' | 'solid',
  iconSizes?: { navigation: string; social: string },
  useAbsoluteUrls?: boolean
): PlaceholderReplacements {
  switch (component.category) {
    case 'navigation':
      return getNavigationReplacements(
        cvData,
        themeColors,
        selectedComponents || [],
        component.id,
        iconStyle,
        iconSizes
      );
    case 'hero':
      return getHeroReplacements(cvData, themeColors);
    case 'experience':
      return getExperienceReplacements(cvData, themeColors, component.id);
    case 'education':
      return getEducationReplacements(cvData, themeColors, component.id);
    case 'portfolio':
      return getPortfolioReplacements(cvData, themeColors, component.id, useAbsoluteUrls);
    case 'skills':
      return getSkillsReplacements(cvData, themeColors, component.id);
    case 'languages':
      return getLanguagesReplacements(cvData, themeColors, component.id);
    case 'contact':
      return getContactReplacements(cvData, themeColors);
    case 'footer':
      return getFooterReplacements(cvData, themeColors, selectedComponents);
    default:
      return {};
  }
}

/**
 * Component template'ini CV verileri ile doldurur
 * @param useAbsoluteUrls - true ise R2 URL'leri absolute olarak kullanılır (preview için)
 */
export function populateTemplate(
  component: ComponentTemplate,
  cvData: CVData,
  themeColors: ThemeColors,
  selectedComponents?: SelectedComponent[],
  iconStyle?: 'outline' | 'solid',
  iconSizes?: { navigation: string; social: string },
  stockImages?: { [category: string]: { url: string; alt: string; photographer?: string; pexelsId?: number; avgColor?: string; } },
  useAbsoluteUrls?: boolean
): { html: string; css: string; js?: string } {
  const replacements = getReplacementsForComponent(
    component,
    cvData,
    themeColors,
    selectedComponents,
    iconStyle,
    iconSizes,
    useAbsoluteUrls
  );

  // Get icon style from template (default to 'outline')
  const templateIconStyle = component.iconStyle || iconStyle || 'outline';

  // Replace standard placeholders
  let html = replacePlaceholders(component.htmlTemplate, replacements);
  let css = replacePlaceholders(component.cssTemplate, replacements);
  let js = component.jsTemplate
    ? replacePlaceholders(component.jsTemplate, replacements)
    : undefined;

  // Replace icon placeholders: {{ICON:iconName}}
  const { getIconSvg, iconExists } = require('./icon-registry');

  html = html.replace(/\{\{ICON:(\w+)\}\}/g, (match, iconName) => {
    // Intelligently determine icon category to avoid false warnings
    let category: 'contact' | 'ui' | 'social' = 'contact';

    // UI icons
    if (['loader', 'check', 'x', 'info', 'arrowUp', 'chevronDown'].includes(iconName)) {
      category = 'ui';
    }
    // Social icons
    else if (['linkedin', 'github', 'twitter', 'globe'].includes(iconName)) {
      category = 'social';
    }
    // Contact icons (mail, phone, mapPin)
    else {
      category = 'contact';
    }

    // Get icon with determined category
    let iconSvg = getIconSvg(category, iconName, templateIconStyle, 24, 'inline-icon');

    // Fallback: try other categories if not found
    if (!iconSvg || iconSvg.includes('Info')) {
      const categories: Array<'contact' | 'ui' | 'social'> = ['contact', 'ui', 'social'];
      for (const cat of categories) {
        if (cat !== category && iconExists(cat, iconName)) {
          iconSvg = getIconSvg(cat, iconName, templateIconStyle, 24, 'inline-icon');
          break;
        }
      }
    }

    return iconSvg || match; // Return original if icon not found
  });

  // Replace stock image placeholders: {{STOCK_IMAGE:category}} and {{STOCK_IMAGE_ALT:category}}
  if (stockImages) {
    // Replace {{STOCK_IMAGE:category}} with URL
    html = html.replace(/\{\{STOCK_IMAGE:([a-zA-Z0-9-_]+)\}\}/g, (match, imgCategory) => {
      const stockImage = stockImages[imgCategory];
      if (stockImage && stockImage.url) {
        return stockImage.url;
      }
      // Fallback to default SVG
      return `/defaults/${imgCategory}-fallback.svg`;
    });

    // Replace {{STOCK_IMAGE_ALT:category}} with alt text
    html = html.replace(/\{\{STOCK_IMAGE_ALT:([a-zA-Z0-9-_]+)\}\}/g, (match, imgCategory) => {
      const stockImage = stockImages[imgCategory];
      if (stockImage && stockImage.alt) {
        return escapeHtml(stockImage.alt);
      }
      return `Professional ${imgCategory} background`;
    });

    // Replace {{STOCK_IMAGE_PHOTOGRAPHER:category}} with photographer name (optional)
    html = html.replace(/\{\{STOCK_IMAGE_PHOTOGRAPHER:([a-zA-Z0-9-_]+)\}\}/g, (match, imgCategory) => {
      const stockImage = stockImages[imgCategory];
      if (stockImage && stockImage.photographer) {
        return escapeHtml(stockImage.photographer);
      }
      return '';
    });

    // Replace in CSS as well (for background-image)
    css = css.replace(/\{\{STOCK_IMAGE:([a-zA-Z0-9-_]+)\}\}/g, (match, imgCategory) => {
      const stockImage = stockImages[imgCategory];
      if (stockImage && stockImage.url) {
        return stockImage.url;
      }
      return `/defaults/${imgCategory}-fallback.svg`;
    });
  } else {
    // If no stockImages provided, use fallback URLs
    html = html.replace(/\{\{STOCK_IMAGE:([a-zA-Z0-9-_]+)\}\}/g, (match, imgCategory) => {
      return `/defaults/${imgCategory}-fallback.svg`;
    });
    html = html.replace(/\{\{STOCK_IMAGE_ALT:([a-zA-Z0-9-_]+)\}\}/g, (match, imgCategory) => {
      return `Professional ${imgCategory} background`;
    });
    html = html.replace(/\{\{STOCK_IMAGE_PHOTOGRAPHER:([a-zA-Z0-9-_]+)\}\}/g, () => '');

    css = css.replace(/\{\{STOCK_IMAGE:([a-zA-Z0-9-_]+)\}\}/g, (match, imgCategory) => {
      return `/defaults/${imgCategory}-fallback.svg`;
    });
  }

  return {
    html,
    css,
    js
  };
}
