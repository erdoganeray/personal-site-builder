import { ComponentTemplate } from "@/types/templates";

/**
 * Experience section template'leri
 */

export const experienceTemplate1: ComponentTemplate = {
  id: "experience-timeline",
  name: "Timeline Experience",
  category: "experience",
  htmlTemplate: `
    <section class="experience-section" id="experience">
      <div class="container">
        <h2 class="section-title">İş Deneyimlerim</h2>
        <div class="timeline">
          {{EXPERIENCE_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .experience-section {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 3rem;
      color: {{COLOR_PRIMARY}};
    }

    .timeline {
      max-width: 900px;
      margin: 0 auto;
      position: relative;
      padding-left: 2rem;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: {{COLOR_ACCENT}};
    }

    .timeline-item {
      margin-bottom: 3rem;
      position: relative;
      padding-left: 2rem;
    }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -0.65rem;
      top: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: {{COLOR_ACCENT}};
      border: 3px solid {{COLOR_BACKGROUND}};
    }

    .timeline-duration {
      font-size: 0.9rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 0.5rem;
    }

    .timeline-position {
      font-size: 1.5rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.25rem;
    }

    .timeline-company {
      font-size: 1.1rem;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 1rem;
    }

    .timeline-description {
      color: {{COLOR_TEXT}};
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .timeline {
        padding-left: 1.5rem;
      }
    }
  `,
  placeholders: [
    "{{EXPERIENCE_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const experienceTemplate2: ComponentTemplate = {
  id: "experience-cards",
  name: "Card Grid Experience",
  category: "experience",
  htmlTemplate: `
    <section class="experience-section-cards" id="experience">
      <div class="container">
        <h2 class="section-title">İş Deneyimlerim</h2>
        <div class="experience-grid">
          {{EXPERIENCE_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .experience-section-cards {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .experience-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .experience-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid {{COLOR_ACCENT}};
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .experience-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }

    .experience-duration {
      font-size: 0.9rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 0.5rem;
    }

    .experience-position {
      font-size: 1.5rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.5rem;
    }

    .experience-company {
      font-size: 1.1rem;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 1rem;
      font-weight: 500;
    }

    .experience-description {
      color: {{COLOR_TEXT}};
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .experience-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  placeholders: [
    "{{EXPERIENCE_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const experienceTemplates = [experienceTemplate1, experienceTemplate2];
