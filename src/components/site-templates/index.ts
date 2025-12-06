import { ComponentTemplate } from "@/types/templates";
import { heroTemplates } from "./hero-templates";
import { experienceTemplates } from "./experience-templates";
import { skillsTemplates } from "./skills-templates";
import { languagesTemplates } from "./languages-templates";
import { navigationTemplates } from "./navigation-templates";
import { educationTemplates } from "./education-templates";
import { portfolioTemplates } from "./portfolio-templates";
import { contactTemplates } from "./contact-templates";
import { footerTemplates } from "./footer-templates";

/**
 * Tüm template'lerin merkezi kaydı
 */

export const allTemplates: ComponentTemplate[] = [
  ...heroTemplates,
  ...experienceTemplates,
  ...educationTemplates,
  ...portfolioTemplates,
  ...skillsTemplates,
  ...languagesTemplates,
  ...navigationTemplates,
  ...contactTemplates,
  ...footerTemplates,
];

export function getTemplateById(id: string): ComponentTemplate | undefined {
  return allTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: ComponentTemplate['category']): ComponentTemplate[] {
  return allTemplates.filter(t => t.category === category);
}
