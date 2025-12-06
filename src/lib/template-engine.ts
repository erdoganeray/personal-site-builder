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

  // Generate profile image content - either <img> tag or initials
  const profilePhotoUrl = cvData.personalInfo.profilePhotoUrl;
  const profileImageContent = profilePhotoUrl
    ? `<img src="${profilePhotoUrl}" alt="${cvData.personalInfo.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;" />`
    : initials;

  return {
    '{{NAME}}': cvData.personalInfo.name,
    '{{INITIALS}}': initials,
    '{{TITLE}}': cvData.personalInfo.title || 'Professional',
    '{{SUMMARY}}': cvData.summary || cvData.personalInfo.name + ' - Professional Profile',
    '{{PROFILE_IMAGE}}': profileImageContent,
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
        <img src="${item.imageUrl}" alt="Portfolio ${index + 1}" loading="lazy" />
      </div>
    `).join('\n');
  } else if (templateId === 'portfolio-masonry') {
    return cvData.portfolio.map((item, index) => `
      <div class="portfolio-item-masonry" data-index="${index}">
        <img src="${item.imageUrl}" alt="Portfolio ${index + 1}" loading="lazy" />
      </div>
    `).join('\n');
  } else if (templateId === 'portfolio-carousel') {
    return cvData.portfolio.map((item, index) => `
      <div class="portfolio-item-carousel" data-index="${index}">
        <img src="${item.imageUrl}" alt="Portfolio ${index + 1}" loading="lazy" />
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
  selectedComponents: SelectedComponent[]
): PlaceholderReplacements {
  const initials = cvData.personalInfo.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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
    case 'education':
      return getEducationReplacements(cvData, themeColors, component.id);
    case 'portfolio':
      return getPortfolioReplacements(cvData, themeColors, component.id);
    case 'skills':
      return getSkillsReplacements(cvData, themeColors, component.id);
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
