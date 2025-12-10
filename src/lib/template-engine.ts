import { ComponentTemplate, ThemeColors, SelectedComponent } from "@/types/templates";
import { CVData } from "./gemini-pdf-parser";

/**
 * Template placeholder'larını gerçek içerik ile doldurur
 */

interface PlaceholderReplacements {
  [key: string]: string;
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
    ? `<img src="${convertedPhotoUrl}" alt="${cvData.personalInfo.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;" />`
    : initials;

  return {
    '{{NAME}}': cvData.personalInfo.name,
    '{{INITIALS}}': initials,
    '{{TITLE}}': cvData.personalInfo.title || 'Professional',
    '{{SUMMARY}}': cvData.summary || cvData.personalInfo.name + ' - Professional Profile',
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
 * CV verilerinden education section için HTML items oluşturur
 */
export function generateEducationItems(
  cvData: CVData,
  templateId: string
): string {
  if (templateId === 'education-timeline') {
    return cvData.education.map(edu => `
      <div class="education-item">
        <div class="education-duration">${edu.year}</div>
        <h3 class="education-degree">${edu.degree}</h3>
        <div class="education-school">${edu.school}</div>
        <p class="education-description">${edu.field}</p>
      </div>
    `).join('\n');
  } else if (templateId === 'education-cards') {
    return cvData.education.map(edu => `
      <div class="education-card">
        <div class="education-duration">${edu.year}</div>
        <h3 class="education-degree">${edu.degree}</h3>
        <div class="education-school">${edu.school}</div>
        <p class="education-description">${edu.field}</p>
      </div>
    `).join('\n');
  } else if (templateId === 'education-modern') {
    return cvData.education.map(edu => `
      <div class="education-modern-item">
        <div class="education-header">
          <div class="education-title-group">
            <h3 class="education-degree">${edu.degree}</h3>
            <div class="education-school">${edu.school}</div>
          </div>
          <div class="education-duration">${edu.year}</div>
        </div>
        <p class="education-description">${edu.field}</p>
      </div>
    `).join('\n');
  }

  return '';
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
        <img src="${convertR2UrlToRelativePath(item.imageUrl)}" alt="Portfolio ${index + 1}" loading="lazy" />
      </div>
    `).join('\n');
  } else if (templateId === 'portfolio-masonry') {
    return cvData.portfolio.map((item, index) => `
      <div class="portfolio-item-masonry" data-index="${index}">
        <img src="${convertR2UrlToRelativePath(item.imageUrl)}" alt="Portfolio ${index + 1}" loading="lazy" />
      </div>
    `).join('\n');
  } else if (templateId === 'portfolio-carousel') {
    return cvData.portfolio.map((item, index) => `
      <div class="portfolio-item-carousel" data-index="${index}">
        <img src="${convertR2UrlToRelativePath(item.imageUrl)}" alt="Portfolio ${index + 1}" loading="lazy" />
      </div>
    `).join('\n');
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
 */
export function generateLanguageItems(
  cvData: CVData,
  templateId: string
): string {
  if (!cvData.languages || cvData.languages.length === 0) {
    return '';
  }

  // Dil seviyelerini belirle (Native, Fluent, Advanced, Intermediate, Basic)
  const levels = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];
  const levelPercentages = { Native: 100, Fluent: 90, Advanced: 75, Intermediate: 60, Basic: 40 };

  const languagesWithLevels = cvData.languages.map((lang, index) => {
    // Döngüsel olarak seviye ata veya ilk dil Native, sonrakiler Fluent/Advanced
    const level = index === 0 ? 'Native' : levels[Math.min(index, levels.length - 1)];
    return { name: lang, level, percentage: levelPercentages[level as keyof typeof levelPercentages] };
  });

  if (templateId === 'languages-progress-bars') {
    return languagesWithLevels.map(lang => `
      <div class="language-item">
        <div class="language-name">
          <span>${lang.name}</span>
          <span class="language-level">${lang.level}</span>
        </div>
        <div class="language-bar">
          <div class="language-progress" style="width: ${lang.percentage}%"></div>
        </div>
      </div>
    `).join('\n');
  } else if (templateId === 'languages-card-grid') {
    return languagesWithLevels.map(lang => `
      <div class="language-card">
        <div class="language-icon">🌍</div>
        <div class="language-name">${lang.name}</div>
        <div class="language-level">${lang.level}</div>
      </div>
    `).join('\n');
  } else if (templateId === 'languages-minimalist') {
    return languagesWithLevels.map(lang => `
      <div class="language-item-minimal">
        <div class="language-name-minimal">${lang.name}</div>
        <div class="language-level-minimal">${lang.level}</div>
      </div>
    `).join('\n');
  }

  return '';
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
    '{{COLOR_PRIMARY}}': themeColors.primary,
    '{{COLOR_SECONDARY}}': themeColors.secondary,
    '{{COLOR_ACCENT}}': themeColors.accent,
    '{{COLOR_BACKGROUND}}': themeColors.background,
    '{{COLOR_TEXT}}': themeColors.text,
    '{{COLOR_TEXT_SECONDARY}}': themeColors.textSecondary,
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
    '{{EMAIL}}': cvData.personalInfo.email || 'Email bulunamadı',
    '{{PHONE}}': cvData.personalInfo.phone || 'Telefon bulunamadı',
    '{{LOCATION}}': cvData.personalInfo.location || 'Konum belirtilmemiş',
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
    '{{NAME}}': cvData.personalInfo.name,
    '{{TITLE}}': cvData.personalInfo.title || 'Professional',
    '{{EMAIL}}': cvData.personalInfo.email || 'Email bulunamadı',
    '{{PHONE}}': cvData.personalInfo.phone || 'Telefon bulunamadı',
    '{{LOCATION}}': cvData.personalInfo.location || 'Konum belirtilmemiş',
    '{{SUMMARY}}': cvData.summary || cvData.personalInfo.name + ' - Professional Profile',
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
