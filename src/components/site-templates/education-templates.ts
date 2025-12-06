import { ComponentTemplate } from "@/types/templates";

/**
 * Education section template'leri
 */

export const educationTemplate1: ComponentTemplate = {
  id: "education-timeline",
  name: "Timeline Education",
  category: "education",
  htmlTemplate: `
    <section class="education-section" id="education">
      <div class="container">
        <h2 class="section-title">Eğitim</h2>
        <div class="education-timeline">
          {{EDUCATION_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .education-section {
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

    .education-timeline {
      max-width: 900px;
      margin: 0 auto;
      position: relative;
      padding-left: 2rem;
    }

    .education-timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: {{COLOR_ACCENT}};
    }

    .education-item {
      margin-bottom: 3rem;
      position: relative;
      padding-left: 2rem;
    }

    .education-item::before {
      content: '🎓';
      position: absolute;
      left: -1.2rem;
      top: -0.2rem;
      font-size: 1.5rem;
      background: {{COLOR_BACKGROUND}};
      padding: 0.2rem;
    }

    .education-duration {
      font-size: 0.9rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 0.5rem;
    }

    .education-degree {
      font-size: 1.5rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.25rem;
    }

    .education-school {
      font-size: 1.1rem;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 1rem;
    }

    .education-description {
      color: {{COLOR_TEXT}};
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .education-timeline {
        padding-left: 1.5rem;
      }
    }
  `,
  placeholders: [
    "{{EDUCATION_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const educationTemplate2: ComponentTemplate = {
  id: "education-cards",
  name: "Card Grid Education",
  category: "education",
  htmlTemplate: `
    <section class="education-section-cards" id="education">
      <div class="container">
        <h2 class="section-title">Eğitim</h2>
        <div class="education-grid">
          {{EDUCATION_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .education-section-cards {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .education-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .education-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-top: 4px solid {{COLOR_ACCENT}};
      transition: transform 0.3s, box-shadow 0.3s;
      position: relative;
      overflow: hidden;
    }

    .education-card::before {
      content: '🎓';
      position: absolute;
      right: 1rem;
      top: 1rem;
      font-size: 3rem;
      opacity: 0.1;
    }

    .education-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }

    .education-duration {
      font-size: 0.9rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 0.5rem;
    }

    .education-degree {
      font-size: 1.5rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.5rem;
    }

    .education-school {
      font-size: 1.1rem;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 1rem;
      font-weight: 500;
    }

    .education-description {
      color: {{COLOR_TEXT}};
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .education-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  placeholders: [
    "{{EDUCATION_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const educationTemplate3: ComponentTemplate = {
  id: "education-modern",
  name: "Modern Education",
  category: "education",
  htmlTemplate: `
    <section class="education-modern" id="education">
      <div class="container">
        <h2 class="section-title">Eğitim Geçmişim</h2>
        <div class="education-list">
          {{EDUCATION_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .education-modern {
      padding: 5rem 2rem;
      background: linear-gradient(135deg, {{COLOR_BACKGROUND}} 0%, #f8f9fa 100%);
    }

    .education-list {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .education-modern-item {
      background: white;
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .education-modern-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 6px;
      background: linear-gradient(180deg, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}});
    }

    .education-modern-item:hover {
      transform: translateX(10px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    }

    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .education-title-group {
      flex: 1;
    }

    .education-degree {
      font-size: 1.6rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.5rem;
    }

    .education-school {
      font-size: 1.2rem;
      color: {{COLOR_PRIMARY}};
      font-weight: 500;
    }

    .education-duration {
      background: {{COLOR_ACCENT}};
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .education-description {
      color: {{COLOR_TEXT}};
      line-height: 1.8;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .education-header {
        flex-direction: column;
      }

      .education-duration {
        align-self: flex-start;
      }

      .education-modern-item {
        padding: 1.5rem;
      }
    }
  `,
  placeholders: [
    "{{EDUCATION_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const educationTemplates = [
  educationTemplate1,
  educationTemplate2,
  educationTemplate3
];
