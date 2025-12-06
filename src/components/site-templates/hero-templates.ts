import { ComponentTemplate } from "@/types/templates";

/**
 * Hero section template'leri
 */

export const heroTemplate1: ComponentTemplate = {
  id: "hero-modern-centered",
  name: "Modern Centered Hero",
  category: "hero",
  htmlTemplate: `
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-image-wrapper">
          <div class="hero-image">{{PROFILE_IMAGE}}</div>
        </div>
        <h1 class="hero-name">{{NAME}}</h1>
        <p class="hero-title">{{TITLE}}</p>
        <p class="hero-summary">{{SUMMARY}}</p>
        <div class="hero-cta">
          <a href="#contact" class="btn-primary">İletişime Geç</a>
          <a href="#about" class="btn-secondary">Hakkımda</a>
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      color: {{COLOR_TEXT}};
      padding: 2rem;
    }

    .hero-container {
      text-align: center;
      max-width: 800px;
    }

    .hero-image-wrapper {
      margin-bottom: 2rem;
    }

    .hero-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto;
      border: 4px solid {{COLOR_ACCENT}};
      background: {{COLOR_BACKGROUND}};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
    }

    .hero-name {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .hero-title {
      font-size: 1.5rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 1.5rem;
    }

    .hero-summary {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .btn-primary {
      background: {{COLOR_ACCENT}};
      color: white;
    }

    .btn-secondary {
      background: transparent;
      border: 2px solid {{COLOR_ACCENT}};
      color: {{COLOR_TEXT}};
    }

    .btn-primary:hover, .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  `,
  placeholders: [
    "{{NAME}}", "{{TITLE}}", "{{SUMMARY}}", "{{PROFILE_IMAGE}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const heroTemplate2: ComponentTemplate = {
  id: "hero-split-screen",
  name: "Split Screen Hero",
  category: "hero",
  htmlTemplate: `
    <section class="hero-section-split">
      <div class="hero-content">
        <h1 class="hero-name">{{NAME}}</h1>
        <p class="hero-title">{{TITLE}}</p>
        <p class="hero-summary">{{SUMMARY}}</p>
        <div class="hero-cta">
          <a href="#contact" class="btn-primary">Benimle İletişime Geçin</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-image">{{PROFILE_IMAGE}}</div>
      </div>
    </section>
  `,
  cssTemplate: `
    .hero-section-split {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: {{COLOR_BACKGROUND}};
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 3rem;
      background: {{COLOR_PRIMARY}};
      color: {{COLOR_TEXT}};
    }

    .hero-name {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-title {
      font-size: 1.75rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
    }

    .hero-summary {
      font-size: 1.1rem;
      line-height: 1.8;
      margin-bottom: 2.5rem;
    }

    .hero-visual {
      display: flex;
      align-items: center;
      justify-content: center;
      background: {{COLOR_SECONDARY}};
    }

    .hero-image {
      width: 300px;
      height: 300px;
      border-radius: 20px;
      background: {{COLOR_ACCENT}};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 5rem;
      color: white;
    }

    @media (max-width: 768px) {
      .hero-section-split {
        grid-template-columns: 1fr;
      }
      
      .hero-content {
        padding: 2rem;
      }

      .hero-name {
        font-size: 2.5rem;
      }
    }
  `,
  placeholders: [
    "{{NAME}}", "{{TITLE}}", "{{SUMMARY}}", "{{PROFILE_IMAGE}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const heroTemplates = [heroTemplate1, heroTemplate2];
