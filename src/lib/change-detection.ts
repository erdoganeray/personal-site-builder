/**
 * Change Detection Utilities for Published Sites
 * 
 * This module provides utilities to detect if a published site has unpublished changes
 * and to generate summaries of those changes for user notifications.
 */

interface Site {
  id: string;
  status: string;
  htmlContent: string | null;
  cssContent: string | null;
  jsContent: string | null;
  cvContent: any;
  publishedHtmlContent?: string | null;
  publishedCssContent?: string | null;
  publishedJsContent?: string | null;
  publishedCvContent?: any;
}

interface ChangeInfo {
  hasChanges: boolean;
  changedFields: string[];
  summary: string;
}

/**
 * Detailed change information for displaying specific differences
 */
export interface DetailedChange {
  category: "personal" | "experience" | "education" | "skills" | "languages" | "photos" | "portfolio";
  type: "text" | "nested" | "photo" | "portfolio";
  field: string;
  label: string;
  oldValue?: any;
  newValue?: any;
  changes?: NestedItemChange[]; // For nested arrays
}

/**
 * Change information for nested items (experience, education, etc.)
 */
export interface NestedItemChange {
  itemLabel: string; // e.g., "Software Engineer at Google"
  field: string; // e.g., "duration"
  fieldLabel: string; // e.g., "Süre"
  oldValue: string;
  newValue: string;
}

/**
 * Photo change types
 */
export type PhotoChangeType = "added" | "removed" | "unchanged";


/**
 * Checks if a published site has unpublished changes
 * @param site - The site object with current and published content
 * @returns true if site is published and has changes, false otherwise
 */
export function hasUnpublishedChanges(site: Site): boolean {
  // Only check if site is published
  if (site.status !== "published") {
    return false;
  }

  // If no published snapshots exist, consider it as having changes
  if (!site.publishedHtmlContent && !site.publishedCssContent && !site.publishedJsContent) {
    return false; // No published version to compare against
  }

  // Check if any content differs from published version
  const htmlChanged = site.htmlContent !== site.publishedHtmlContent;
  const cssChanged = site.cssContent !== site.publishedCssContent;
  const jsChanged = site.jsContent !== site.publishedJsContent;

  return htmlChanged || cssChanged || jsChanged;
}

/**
 * Gets detailed information about what has changed
 * @param site - The site object with current and published content
 * @returns ChangeInfo object with details about changes
 */
export function getChangeInfo(site: Site): ChangeInfo {
  const changedFields: string[] = [];

  if (site.status !== "published") {
    return {
      hasChanges: false,
      changedFields: [],
      summary: "Site is not published",
    };
  }

  // Check each content type
  if (site.htmlContent !== site.publishedHtmlContent) {
    changedFields.push("HTML");
  }
  if (site.cssContent !== site.publishedCssContent) {
    changedFields.push("CSS");
  }
  if (site.jsContent !== site.publishedJsContent) {
    changedFields.push("JavaScript");
  }

  const hasChanges = changedFields.length > 0;

  // Generate summary message
  let summary = "";
  if (hasChanges) {
    if (changedFields.length === 1) {
      summary = `${changedFields[0]} içeriği değişti`;
    } else if (changedFields.length === 2) {
      summary = `${changedFields[0]} ve ${changedFields[1]} içerikleri değişti`;
    } else {
      summary = "Site içeriği değişti";
    }
  } else {
    summary = "Yayınlanan site güncel";
  }

  return {
    hasChanges,
    changedFields,
    summary,
  };
}

/**
 * Detailed diff item for displaying changes
 */
export interface DiffItem {
  field: string;
  label: string;
  oldValue: string;
  newValue: string;
}

/**
 * Gets a user-friendly change summary for CV content
 * Compares current cvContent with published snapshot to detect data changes
 * @param site - The site object
 * @returns Array of change descriptions
 */
export function getCvContentChanges(site: Site): string[] {
  const changes: string[] = [];

  if (site.status !== "published" || !site.publishedCvContent) {
    return changes;
  }

  const current = site.cvContent || {};
  const published = site.publishedCvContent || {};

  // Check personal info changes
  const currentInfo = current.personalInfo || {};
  const publishedInfo = published.personalInfo || {};

  if (currentInfo.name !== publishedInfo.name) {
    changes.push("İsim değişti");
  }
  if (currentInfo.jobTitle !== publishedInfo.jobTitle) {
    changes.push("Meslek ünvanı değişti");
  }
  if (currentInfo.email !== publishedInfo.email) {
    changes.push("E-posta değişti");
  }
  if (currentInfo.phone !== publishedInfo.phone) {
    changes.push("Telefon değişti");
  }

  // Check sections
  if (JSON.stringify(current.experience) !== JSON.stringify(published.experience)) {
    changes.push("İş deneyimi güncellendi");
  }
  if (JSON.stringify(current.education) !== JSON.stringify(published.education)) {
    changes.push("Eğitim bilgileri güncellendi");
  }
  if (JSON.stringify(current.skills) !== JSON.stringify(published.skills)) {
    changes.push("Yetenekler güncellendi");
  }
  if (JSON.stringify(current.portfolio) !== JSON.stringify(published.portfolio)) {
    changes.push("Portfolyo güncellendi");
  }
  if (JSON.stringify(current.languages) !== JSON.stringify(published.languages)) {
    changes.push("Dil bilgileri güncellendi");
  }

  return changes;
}

/**
 * Extracts visible text content from HTML for comparison
 * @param html - HTML string
 * @returns Extracted text content
 */
function extractTextFromHtml(html: string): string {
  if (!html) return "";
  // Remove script and style tags completely
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

/**
 * Calculates similarity percentage between two strings
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity percentage (0-100)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  if (len1 === 0 && len2 === 0) return 100;
  if (len1 === 0 || len2 === 0) return 0;

  const maxLen = Math.max(len1, len2);
  const minLen = Math.min(len1, len2);

  // Simple similarity based on length difference
  return Math.round((minLen / maxLen) * 100);
}

/**
 * Gets detailed diff information including HTML content changes
 * Shows old vs new values for changed fields and HTML text content
 * @param site - The site object
 * @returns Array of DiffItem objects
 */
export function getDetailedDiff(site: Site): DiffItem[] {
  const diffs: DiffItem[] = [];

  if (site.status !== "published") {
    return diffs;
  }

  // Check HTML content changes (for design changes)
  if (site.htmlContent !== site.publishedHtmlContent) {
    const currentText = extractTextFromHtml(site.htmlContent || "");
    const publishedText = extractTextFromHtml(site.publishedHtmlContent || "");

    // If text content is similar but HTML is different, it's a design change
    const similarity = calculateSimilarity(currentText, publishedText);

    if (similarity > 90) {
      diffs.push({
        field: "design",
        label: "Tasarım",
        oldValue: "Önceki tasarım",
        newValue: "Yeni tasarım uygulandı",
      });
    } else {
      // Text content also changed
      const oldPreview = publishedText.substring(0, 100) + (publishedText.length > 100 ? "..." : "");
      const newPreview = currentText.substring(0, 100) + (currentText.length > 100 ? "..." : "");

      diffs.push({
        field: "content",
        label: "İçerik",
        oldValue: oldPreview || "-",
        newValue: newPreview || "-",
      });
    }
  }

  // Check CSS changes
  if (site.cssContent !== site.publishedCssContent) {
    diffs.push({
      field: "css",
      label: "Stil (CSS)",
      oldValue: "Önceki stiller",
      newValue: "Yeni stiller uygulandı",
    });
  }

  // Check JS changes
  if (site.jsContent !== site.publishedJsContent) {
    diffs.push({
      field: "js",
      label: "JavaScript",
      oldValue: "Önceki kod",
      newValue: "Yeni kod uygulandı",
    });
  }

  // If no published CV content exists, skip CV comparison
  if (!site.publishedCvContent) {
    return diffs;
  }

  const current = site.cvContent || {};
  const published = site.publishedCvContent || {};

  // Check personal info changes
  const currentInfo = current.personalInfo || {};
  const publishedInfo = published.personalInfo || {};

  if (currentInfo.name !== publishedInfo.name) {
    diffs.push({
      field: "name",
      label: "İsim",
      oldValue: publishedInfo.name || "-",
      newValue: currentInfo.name || "-",
    });
  }
  if (currentInfo.jobTitle !== publishedInfo.jobTitle) {
    diffs.push({
      field: "jobTitle",
      label: "Meslek Ünvanı",
      oldValue: publishedInfo.jobTitle || "-",
      newValue: currentInfo.jobTitle || "-",
    });
  }
  if (currentInfo.email !== publishedInfo.email) {
    diffs.push({
      field: "email",
      label: "E-posta",
      oldValue: publishedInfo.email || "-",
      newValue: currentInfo.email || "-",
    });
  }
  if (currentInfo.phone !== publishedInfo.phone) {
    diffs.push({
      field: "phone",
      label: "Telefon",
      oldValue: publishedInfo.phone || "-",
      newValue: currentInfo.phone || "-",
    });
  }
  if (currentInfo.location !== publishedInfo.location) {
    diffs.push({
      field: "location",
      label: "Konum",
      oldValue: publishedInfo.location || "-",
      newValue: currentInfo.location || "-",
    });
  }

  // Check social links
  if (currentInfo.linkedin !== publishedInfo.linkedin) {
    diffs.push({
      field: "linkedin",
      label: "LinkedIn",
      oldValue: publishedInfo.linkedin || "-",
      newValue: currentInfo.linkedin || "-",
    });
  }
  if (currentInfo.github !== publishedInfo.github) {
    diffs.push({
      field: "github",
      label: "GitHub",
      oldValue: publishedInfo.github || "-",
      newValue: currentInfo.github || "-",
    });
  }

  // Check summary
  if (current.summary !== published.summary) {
    const oldSummary = published.summary || "-";
    const newSummary = current.summary || "-";
    diffs.push({
      field: "summary",
      label: "Özet",
      oldValue: oldSummary.length > 100 ? oldSummary.substring(0, 100) + "..." : oldSummary,
      newValue: newSummary.length > 100 ? newSummary.substring(0, 100) + "..." : newSummary,
    });
  }

  // Check sections (count changes)
  const currentExpCount = (current.experience || []).length;
  const publishedExpCount = (published.experience || []).length;
  if (currentExpCount !== publishedExpCount) {
    diffs.push({
      field: "experience",
      label: "İş Deneyimi Sayısı",
      oldValue: `${publishedExpCount} adet`,
      newValue: `${currentExpCount} adet`,
    });
  }

  const currentEduCount = (current.education || []).length;
  const publishedEduCount = (published.education || []).length;
  if (currentEduCount !== publishedEduCount) {
    diffs.push({
      field: "education",
      label: "Eğitim Sayısı",
      oldValue: `${publishedEduCount} adet`,
      newValue: `${currentEduCount} adet`,
    });
  }

  const currentSkillsCount = (current.skills || []).length;
  const publishedSkillsCount = (published.skills || []).length;
  if (currentSkillsCount !== publishedSkillsCount) {
    diffs.push({
      field: "skills",
      label: "Yetenek Sayısı",
      oldValue: `${publishedSkillsCount} adet`,
      newValue: `${currentSkillsCount} adet`,
    });
  }

  const currentPortCount = (current.portfolio || []).length;
  const publishedPortCount = (published.portfolio || []).length;
  if (currentPortCount !== publishedPortCount) {
    diffs.push({
      field: "portfolio",
      label: "Portfolyo Öğesi Sayısı",
      oldValue: `${publishedPortCount} adet`,
      newValue: `${currentPortCount} adet`,
    });
  }

  return diffs;
}

/**
 * Generates a complete change summary for display
 * @param site - The site object
 * @returns Formatted change summary string
 */
export function getChangeSummary(site: Site): string {
  const changeInfo = getChangeInfo(site);

  if (!changeInfo.hasChanges) {
    return "Yayınlanan site güncel";
  }

  const cvChanges = getCvContentChanges(site);

  if (cvChanges.length > 0) {
    return `${cvChanges.length} değişiklik: ${cvChanges.slice(0, 3).join(", ")}${cvChanges.length > 3 ? "..." : ""}`;
  }

  return changeInfo.summary;
}

/**
 * Checks if site needs republishing
 * Returns true if published and has changes
 * @param site - The site object
 * @returns true if republish is recommended
 */
export function needsRepublish(site: Site): boolean {
  return site.status === "published" && hasUnpublishedChanges(site);
}

/**
 * Gets detailed CV content changes for display
 * @param site - The site object
 * @returns Array of DetailedChange objects
 */
export function getDetailedCvChanges(site: Site): DetailedChange[] {
  const changes: DetailedChange[] = [];

  if (site.status !== "published" || !site.publishedCvContent) {
    return changes;
  }

  const current = site.cvContent || {};
  const published = site.publishedCvContent || {};

  // Compare text fields
  const textChanges = compareTextFields(current, published);
  changes.push(...textChanges);

  // Compare experience
  const experienceChanges = compareExperience(current.experience || [], published.experience || []);
  if (experienceChanges.length > 0) {
    changes.push({
      category: "experience",
      type: "nested",
      field: "experience",
      label: "İş Deneyimi",
      changes: experienceChanges,
    });
  }

  // Compare education
  const educationChanges = compareEducation(current.education || [], published.education || []);
  if (educationChanges.length > 0) {
    changes.push({
      category: "education",
      type: "nested",
      field: "education",
      label: "Eğitim",
      changes: educationChanges,
    });
  }

  // Compare skills
  const skillsChanges = compareSkills(current.skills || [], published.skills || []);
  if (skillsChanges.length > 0) {
    changes.push({
      category: "skills",
      type: "nested",
      field: "skills",
      label: "Yetenekler",
      changes: skillsChanges,
    });
  }

  // Compare languages
  const languagesChanges = compareLanguages(current.languages || [], published.languages || []);
  if (languagesChanges.length > 0) {
    changes.push({
      category: "languages",
      type: "nested",
      field: "languages",
      label: "Diller",
      changes: languagesChanges,
    });
  }

  // Compare profile photo
  const photoChange = compareProfilePhoto(current.personalInfo || {}, published.personalInfo || {});
  if (photoChange) {
    changes.push(photoChange);
  }

  // Compare portfolio
  const portfolioChange = comparePortfolio(current.portfolio || [], published.portfolio || []);
  if (portfolioChange) {
    changes.push(portfolioChange);
  }

  return changes;
}

/**
 * Compares text fields between current and published CV
 */
function compareTextFields(current: any, published: any): DetailedChange[] {
  const changes: DetailedChange[] = [];
  const currentInfo = current.personalInfo || {};
  const publishedInfo = published.personalInfo || {};

  const fieldMap = [
    { field: "name", label: "İsim" },
    { field: "title", label: "Ünvan" },
    { field: "email", label: "E-posta" },
    { field: "phone", label: "Telefon" },
    { field: "location", label: "Konum" },
    { field: "linkedin", label: "LinkedIn" },
    { field: "github", label: "GitHub" },
    { field: "facebook", label: "Facebook" },
    { field: "instagram", label: "Instagram" },
    { field: "x", label: "X (Twitter)" },
    { field: "website", label: "Web Sitesi" },
  ];

  for (const { field, label } of fieldMap) {
    const currentValue = currentInfo[field] || "";
    const publishedValue = publishedInfo[field] || "";

    if (currentValue !== publishedValue) {
      changes.push({
        category: "personal",
        type: "text",
        field,
        label,
        oldValue: publishedValue || "-",
        newValue: currentValue || "-",
      });
    }
  }

  // Check summary
  const currentSummary = current.summary || "";
  const publishedSummary = published.summary || "";
  if (currentSummary !== publishedSummary) {
    changes.push({
      category: "personal",
      type: "text",
      field: "summary",
      label: "Özet",
      oldValue: publishedSummary || "-",
      newValue: currentSummary || "-",
    });
  }

  return changes;
}

/**
 * Compares experience arrays and returns detailed changes
 */
function compareExperience(current: any[], published: any[]): NestedItemChange[] {
  const changes: NestedItemChange[] = [];

  // Create a map of published experiences by a unique key
  const publishedMap = new Map();
  published.forEach((exp, index) => {
    const key = `${exp.company}-${exp.position}`;
    publishedMap.set(key, exp);
  });

  // Check each current experience
  current.forEach((exp) => {
    const key = `${exp.company}-${exp.position}`;
    const publishedExp = publishedMap.get(key);

    if (publishedExp) {
      const itemLabel = `${exp.position} - ${exp.company}`;

      // Compare fields
      if (exp.duration !== publishedExp.duration) {
        changes.push({
          itemLabel,
          field: "duration",
          fieldLabel: "Süre",
          oldValue: publishedExp.duration || "-",
          newValue: exp.duration || "-",
        });
      }

      if (exp.description !== publishedExp.description) {
        changes.push({
          itemLabel,
          field: "description",
          fieldLabel: "Açıklama",
          oldValue: publishedExp.description || "-",
          newValue: exp.description || "-",
        });
      }

      // Remove from map to track deletions
      publishedMap.delete(key);
    } else {
      // New experience added
      changes.push({
        itemLabel: `${exp.position} - ${exp.company}`,
        field: "new",
        fieldLabel: "Yeni Eklendi",
        oldValue: "-",
        newValue: "✓",
      });
    }
  });

  // Check for removed experiences
  publishedMap.forEach((exp) => {
    changes.push({
      itemLabel: `${exp.position} - ${exp.company}`,
      field: "removed",
      fieldLabel: "Kaldırıldı",
      oldValue: "✓",
      newValue: "-",
    });
  });

  return changes;
}

/**
 * Compares education arrays and returns detailed changes
 */
function compareEducation(current: any[], published: any[]): NestedItemChange[] {
  const changes: NestedItemChange[] = [];

  const publishedMap = new Map();
  published.forEach((edu) => {
    const key = `${edu.school}-${edu.degree}`;
    publishedMap.set(key, edu);
  });

  current.forEach((edu) => {
    const key = `${edu.school}-${edu.degree}`;
    const publishedEdu = publishedMap.get(key);

    if (publishedEdu) {
      const itemLabel = `${edu.degree} - ${edu.school}`;

      if (edu.field !== publishedEdu.field) {
        changes.push({
          itemLabel,
          field: "field",
          fieldLabel: "Bölüm",
          oldValue: publishedEdu.field || "-",
          newValue: edu.field || "-",
        });
      }

      if (edu.year !== publishedEdu.year) {
        changes.push({
          itemLabel,
          field: "year",
          fieldLabel: "Yıl",
          oldValue: publishedEdu.year || "-",
          newValue: edu.year || "-",
        });
      }

      if (edu.gpa !== publishedEdu.gpa) {
        changes.push({
          itemLabel,
          field: "gpa",
          fieldLabel: "GPA",
          oldValue: publishedEdu.gpa || "-",
          newValue: edu.gpa || "-",
        });
      }

      publishedMap.delete(key);
    } else {
      changes.push({
        itemLabel: `${edu.degree} - ${edu.school}`,
        field: "new",
        fieldLabel: "Yeni Eklendi",
        oldValue: "-",
        newValue: "✓",
      });
    }
  });

  publishedMap.forEach((edu) => {
    changes.push({
      itemLabel: `${edu.degree} - ${edu.school}`,
      field: "removed",
      fieldLabel: "Kaldırıldı",
      oldValue: "✓",
      newValue: "-",
    });
  });

  return changes;
}

/**
 * Compares skills arrays and returns detailed changes
 */
function compareSkills(current: any[], published: any[]): NestedItemChange[] {
  const changes: NestedItemChange[] = [];

  // Normalize skills to get names
  const getCurrentSkillName = (skill: any) => typeof skill === "string" ? skill : skill.name;
  const getSkillLevel = (skill: any) => typeof skill === "string" ? undefined : skill.level;
  const getSkillCategory = (skill: any) => typeof skill === "string" ? undefined : skill.category;

  const publishedMap = new Map();
  published.forEach((skill) => {
    const name = getCurrentSkillName(skill);
    publishedMap.set(name, skill);
  });

  current.forEach((skill) => {
    const name = getCurrentSkillName(skill);
    const publishedSkill = publishedMap.get(name);

    if (publishedSkill) {
      const currentLevel = getSkillLevel(skill);
      const publishedLevel = getSkillLevel(publishedSkill);
      const currentCategory = getSkillCategory(skill);
      const publishedCategory = getSkillCategory(publishedSkill);

      if (currentLevel !== publishedLevel) {
        changes.push({
          itemLabel: name,
          field: "level",
          fieldLabel: "Seviye",
          oldValue: publishedLevel || "-",
          newValue: currentLevel || "-",
        });
      }

      if (currentCategory !== publishedCategory) {
        changes.push({
          itemLabel: name,
          field: "category",
          fieldLabel: "Kategori",
          oldValue: publishedCategory || "-",
          newValue: currentCategory || "-",
        });
      }

      publishedMap.delete(name);
    } else {
      changes.push({
        itemLabel: name,
        field: "new",
        fieldLabel: "Yeni Eklendi",
        oldValue: "-",
        newValue: "✓",
      });
    }
  });

  publishedMap.forEach((skill) => {
    const name = getCurrentSkillName(skill);
    changes.push({
      itemLabel: name,
      field: "removed",
      fieldLabel: "Kaldırıldı",
      oldValue: "✓",
      newValue: "-",
    });
  });

  return changes;
}

/**
 * Compares languages arrays and returns detailed changes
 */
function compareLanguages(current: any[], published: any[]): NestedItemChange[] {
  const changes: NestedItemChange[] = [];

  const getLanguageName = (lang: any) => typeof lang === "string" ? lang : lang.name;
  const getLanguageLevel = (lang: any) => typeof lang === "string" ? undefined : lang.level;
  const getLanguageCerts = (lang: any) => typeof lang === "string" ? undefined : lang.certifications;

  const publishedMap = new Map();
  published.forEach((lang) => {
    const name = getLanguageName(lang);
    publishedMap.set(name, lang);
  });

  current.forEach((lang) => {
    const name = getLanguageName(lang);
    const publishedLang = publishedMap.get(name);

    if (publishedLang) {
      const currentLevel = getLanguageLevel(lang);
      const publishedLevel = getLanguageLevel(publishedLang);

      if (currentLevel !== publishedLevel) {
        changes.push({
          itemLabel: name,
          field: "level",
          fieldLabel: "Seviye",
          oldValue: publishedLevel || "-",
          newValue: currentLevel || "-",
        });
      }

      const currentCerts = getLanguageCerts(lang);
      const publishedCerts = getLanguageCerts(publishedLang);
      const currentCertsStr = currentCerts?.join(", ") || "";
      const publishedCertsStr = publishedCerts?.join(", ") || "";

      if (currentCertsStr !== publishedCertsStr) {
        changes.push({
          itemLabel: name,
          field: "certifications",
          fieldLabel: "Sertifikalar",
          oldValue: publishedCertsStr || "-",
          newValue: currentCertsStr || "-",
        });
      }

      publishedMap.delete(name);
    } else {
      changes.push({
        itemLabel: name,
        field: "new",
        fieldLabel: "Yeni Eklendi",
        oldValue: "-",
        newValue: "✓",
      });
    }
  });

  publishedMap.forEach((lang) => {
    const name = getLanguageName(lang);
    changes.push({
      itemLabel: name,
      field: "removed",
      fieldLabel: "Kaldırıldı",
      oldValue: "✓",
      newValue: "-",
    });
  });

  return changes;
}

/**
 * Compares profile photo and returns change if any
 */
function compareProfilePhoto(currentInfo: any, publishedInfo: any): DetailedChange | null {
  const currentPhoto = currentInfo.profilePhotoUrl || "";
  const publishedPhoto = publishedInfo.profilePhotoUrl || "";

  if (currentPhoto === publishedPhoto) {
    return null;
  }

  let changeType: PhotoChangeType;
  if (!publishedPhoto && currentPhoto) {
    changeType = "added";
  } else if (publishedPhoto && !currentPhoto) {
    changeType = "removed";
  } else {
    changeType = "unchanged"; // Changed to different photo
  }

  return {
    category: "photos",
    type: "photo",
    field: "profilePhoto",
    label: "Profil Fotoğrafı",
    oldValue: changeType === "added" ? "-" : "✓",
    newValue: changeType === "removed" ? "-" : "✓",
  };
}

/**
 * Compares portfolio and returns change if any
 */
function comparePortfolio(current: any[], published: any[]): DetailedChange | null {
  const currentCount = current.length;
  const publishedCount = published.length;

  // Check if counts are different
  const countChanged = currentCount !== publishedCount;

  // Check if any IDs don't match (photo changed)
  const currentIds = new Set(current.map((item) => item.imageUrl));
  const publishedIds = new Set(published.map((item) => item.imageUrl));

  let hasIdChanges = false;
  for (const id of currentIds) {
    if (!publishedIds.has(id)) {
      hasIdChanges = true;
      break;
    }
  }
  for (const id of publishedIds) {
    if (!currentIds.has(id)) {
      hasIdChanges = true;
      break;
    }
  }

  if (!countChanged && !hasIdChanges) {
    return null;
  }

  return {
    category: "portfolio",
    type: "portfolio",
    field: "portfolio",
    label: "Portfolio",
    oldValue: {
      count: publishedCount,
      hasIdChanges,
    },
    newValue: {
      count: currentCount,
      hasIdChanges,
    },
  };
}

