import { ComponentTemplate } from "@/types/templates";

/**
 * Skills section template'leri
 */

export const skillsTemplate1: ComponentTemplate = {
  id: "skills-progress-bars",
  name: "Progress Bar Skills",
  category: "skills",
  htmlTemplate: `
    <section class="skills-section" id="skills">
      <div class="container">
        <h2 class="section-title">Yeteneklerim</h2>
        <div class="skills-container">
          {{SKILL_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .skills-section {
      padding: 5rem 2rem;
      background: {{COLOR_PRIMARY}};
      color: {{COLOR_TEXT}};
    }

    .skills-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .skill-item {
      margin-bottom: 2rem;
    }

    .skill-name {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .skill-bar {
      height: 12px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      overflow: hidden;
    }

    .skill-progress {
      height: 100%;
      background: {{COLOR_ACCENT}};
      border-radius: 10px;
      transition: width 1s ease-in-out;
    }

    @media (max-width: 768px) {
      .skills-container {
        padding: 0 1rem;
      }
    }
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}"
  ]
};

export const skillsTemplate2: ComponentTemplate = {
  id: "skills-card-grid",
  name: "Card Grid Skills",
  category: "skills",
  htmlTemplate: `
    <section class="skills-section-cards" id="skills">
      <div class="container">
        <h2 class="section-title">Yeteneklerim</h2>
        <div class="skills-grid">
          {{SKILL_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .skills-section-cards {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .skill-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-top: 3px solid {{COLOR_ACCENT}};
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .skill-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .skill-icon {
      font-size: 2.5rem;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 0.75rem;
    }

    .skill-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
    }

    .skill-category {
      font-size: 0.85rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-top: 0.5rem;
      padding: 0.25rem 0.75rem;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 12px;
      display: inline-block;
    }

    @media (max-width: 768px) {
      .skills-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
      }
    }
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}"
  ]
};

export const skillsTemplate3: ComponentTemplate = {
  id: "skills-categorized",
  name: "Categorized Skills",
  category: "skills",
  htmlTemplate: `
    <section class="skills-section-categorized" id="skills">
      <div class="container">
        <h2 class="section-title">Yeteneklerim</h2>
        <div class="skills-categories">
          {{SKILL_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .skills-section-categorized {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .skills-categories {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .skill-category-group {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .skill-category-header {
      background: {{COLOR_PRIMARY}};
      color: white;
      padding: 1rem 1.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-left: 4px solid {{COLOR_ACCENT}};
    }

    .skill-category-items {
      padding: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .skill-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: {{COLOR_BACKGROUND}};
      border: 2px solid {{COLOR_ACCENT}};
      border-radius: 20px;
      font-size: 0.95rem;
      font-weight: 500;
      color: {{COLOR_TEXT}};
      transition: all 0.3s ease;
    }

    .skill-badge:hover {
      background: {{COLOR_ACCENT}};
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .skill-level {
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      text-transform: capitalize;
    }

    @media (max-width: 768px) {
      .skills-section-categorized {
        padding: 3rem 1rem;
      }

      .skill-category-items {
        padding: 1rem;
        gap: 0.5rem;
      }

      .skill-badge {
        font-size: 0.85rem;
        padding: 0.4rem 0.8rem;
      }
    }
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}"
  ]
};

export const skillsTemplate4: ComponentTemplate = {
  id: "skills-minimal-list",
  name: "Minimal List Skills",
  category: "skills",
  htmlTemplate: `
    <section class="skills-section-minimal" id="skills">
      <div class="container">
        <h2 class="section-title">Yeteneklerim</h2>
        <div class="skills-list-minimal">
          {{SKILL_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .skills-section-minimal {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .skills-list-minimal {
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .skill-item-minimal {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      transition: padding-left 0.3s ease;
    }

    .skill-item-minimal:hover {
      padding-left: 1rem;
    }

    .skill-item-minimal:last-child {
      border-bottom: none;
    }

    .skill-name-minimal {
      font-size: 1.1rem;
      font-weight: 500;
      color: {{COLOR_TEXT}};
    }

    .skill-level-minimal {
      font-size: 0.9rem;
      color: {{COLOR_TEXT_SECONDARY}};
      text-transform: capitalize;
      padding: 0.25rem 0.75rem;
      background: {{COLOR_BACKGROUND_LIGHT}};
      border-radius: 12px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .skills-section-minimal {
        padding: 3rem 1rem;
      }

      .skill-item-minimal {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .skill-name-minimal {
        font-size: 1rem;
      }

      .skill-level-minimal {
        font-size: 0.85rem;
      }
    }
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}", "{{COLOR_BACKGROUND_LIGHT}}"
  ]
};

export const skillsTemplate5: ComponentTemplate = {
  id: "skills-tag-cloud",
  name: "Tag Cloud Skills",
  category: "skills",
  htmlTemplate: `
    <section class="skills-section-tags" id="skills">
      <div class="container">
        <h2 class="section-title">Yeteneklerim</h2>
        <div class="skills-tag-cloud">
          {{SKILL_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .skills-section-tags {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .skills-tag-cloud {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 2rem 0;
    }

    .skill-tag {
      display: inline-block;
      padding: 0.6rem 1.2rem;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}});
      color: white;
      border-radius: 25px;
      font-weight: 600;
      transition: all 0.3s ease;
      cursor: default;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .skill-tag:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    /* Dynamic sizing based on level */
    .skill-tag[data-level="beginner"] {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .skill-tag[data-level="intermediate"] {
      font-size: 1.05rem;
      opacity: 0.9;
    }

    .skill-tag[data-level="advanced"] {
      font-size: 1.2rem;
      opacity: 0.95;
    }

    .skill-tag[data-level="expert"] {
      font-size: 1.4rem;
      opacity: 1;
    }

    @media (max-width: 768px) {
      .skills-section-tags {
        padding: 3rem 1rem;
      }

      .skills-tag-cloud {
        gap: 0.75rem;
      }

      .skill-tag[data-level="beginner"] {
        font-size: 0.85rem;
      }

      .skill-tag[data-level="intermediate"] {
        font-size: 0.95rem;
      }

      .skill-tag[data-level="advanced"] {
        font-size: 1.05rem;
      }

      .skill-tag[data-level="expert"] {
        font-size: 1.2rem;
      }
    }
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_PRIMARY}}",
    "{{COLOR_ACCENT}}"
  ]
};

export const skillsTemplates = [skillsTemplate1, skillsTemplate2, skillsTemplate3, skillsTemplate4, skillsTemplate5];
