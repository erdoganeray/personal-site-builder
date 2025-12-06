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

export const skillsTemplates = [skillsTemplate1, skillsTemplate2];
