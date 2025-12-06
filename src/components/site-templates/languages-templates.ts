import { ComponentTemplate } from "@/types/templates";

/**
 * Languages section template'leri
 */

export const languagesTemplate1: ComponentTemplate = {
  id: "languages-progress-bars",
  name: "Progress Bar Languages",
  category: "languages",
  htmlTemplate: `
    <section class="languages-section" id="languages">
      <div class="container">
        <h2 class="section-title">Diller</h2>
        <div class="languages-container">
          {{LANGUAGE_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .languages-section {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
      color: {{COLOR_TEXT}};
    }

    .languages-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .language-item {
      margin-bottom: 2rem;
    }

    .language-name {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .language-level {
      font-size: 0.9rem;
      color: {{COLOR_TEXT_SECONDARY}};
      font-weight: 400;
    }

    .language-bar {
      height: 12px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      overflow: hidden;
    }

    .language-progress {
      height: 100%;
      background: {{COLOR_ACCENT}};
      border-radius: 10px;
      transition: width 1s ease-in-out;
    }

    @media (max-width: 768px) {
      .languages-container {
        padding: 0 1rem;
      }
    }
  `,
  placeholders: [
    "{{LANGUAGE_ITEMS}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const languagesTemplate2: ComponentTemplate = {
  id: "languages-card-grid",
  name: "Card Grid Languages",
  category: "languages",
  htmlTemplate: `
    <section class="languages-section-cards" id="languages">
      <div class="container">
        <h2 class="section-title">Diller</h2>
        <div class="languages-grid">
          {{LANGUAGE_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .languages-section-cards {
      padding: 5rem 2rem;
      background: {{COLOR_PRIMARY}};
      color: {{COLOR_TEXT}};
    }

    .languages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .language-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      transition: transform 0.3s ease, background 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .language-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    .language-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .language-name {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .language-level {
      font-size: 1rem;
      color: {{COLOR_ACCENT}};
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .languages-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1.5rem;
      }

      .language-card {
        padding: 1.5rem;
      }

      .language-icon {
        font-size: 2.5rem;
      }

      .language-name {
        font-size: 1.1rem;
      }
    }
  `,
  placeholders: [
    "{{LANGUAGE_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}"
  ]
};

export const languagesTemplate3: ComponentTemplate = {
  id: "languages-minimalist",
  name: "Minimalist Languages",
  category: "languages",
  htmlTemplate: `
    <section class="languages-section-minimal" id="languages">
      <div class="container">
        <h2 class="section-title">Diller</h2>
        <div class="languages-list">
          {{LANGUAGE_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .languages-section-minimal {
      padding: 5rem 2rem;
      background: {{COLOR_SECONDARY}};
      color: {{COLOR_TEXT}};
    }

    .languages-list {
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .language-item-minimal {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: white;
      border-radius: 8px;
      border-left: 4px solid {{COLOR_ACCENT}};
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .language-item-minimal:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .language-name-minimal {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
    }

    .language-level-minimal {
      font-size: 1rem;
      color: {{COLOR_ACCENT}};
      font-weight: 500;
      padding: 0.5rem 1rem;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 20px;
    }

    @media (max-width: 768px) {
      .language-item-minimal {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        padding: 1rem 1.5rem;
      }

      .language-level-minimal {
        align-self: flex-start;
      }
    }
  `,
  placeholders: [
    "{{LANGUAGE_ITEMS}}",
    "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}"
  ]
};

export const languagesTemplates = [
  languagesTemplate1,
  languagesTemplate2,
  languagesTemplate3,
];
