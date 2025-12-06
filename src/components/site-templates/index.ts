import { ComponentTemplate } from "@/types/templates";
import { heroTemplates } from "./hero-templates";
import { experienceTemplates } from "./experience-templates";
import { skillsTemplates } from "./skills-templates";
import { navigationTemplates } from "./navigation-templates";
import { educationTemplates } from "./education-templates";
import { contactTemplates } from "./contact-templates";

/**
 * Tüm template'lerin merkezi kaydı
 */

export const allTemplates: ComponentTemplate[] = [
  ...heroTemplates,
  ...experienceTemplates,
  ...educationTemplates,
  ...skillsTemplates,
  ...navigationTemplates,
  ...contactTemplates,
];

export function getTemplateById(id: string): ComponentTemplate | undefined {
  return allTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: ComponentTemplate['category']): ComponentTemplate[] {
  return allTemplates.filter(t => t.category === category);
}
