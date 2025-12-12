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
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
        <div class="languages-container" role="list">
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
      background: {{COLOR_BORDER}};
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }

    .language-progress {
      height: 100%;
      background: {{COLOR_ACCENT}};
      border-radius: 10px;
      width: 0;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: left;
    }

    .language-progress.animate {
      width: var(--progress-width);
    }

    @media (prefers-reduced-motion: reduce) {
      .language-progress {
        transition: none;
      }
    }

    @media (max-width: 640px) {
      .languages-section {
        padding: 3rem 1rem;
      }

      .languages-container {
        padding: 0 0.5rem;
      }

      .language-name {
        font-size: 1rem;
      }

      .language-level {
        font-size: 0.85rem;
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .languages-section {
        padding: 4rem 1.5rem;
      }
    }

    @media (min-width: 1025px) {
      .languages-section {
        padding: 6rem 2rem;
      }
    }

    @media (min-width: 1440px) {
      .languages-container {
        max-width: 900px;
      }
    }

    /* Empty State Styles */
    .languages-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .languages-empty-state .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.6;
    }

    .languages-empty-state .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .languages-empty-state .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_ACCENT}};
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .languages-empty-state .empty-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 640px) {
      .languages-empty-state {
        padding: 3rem 1rem;
      }

      .languages-empty-state .empty-icon {
        font-size: 3rem;
      }

      .languages-empty-state .empty-message {
        font-size: 1rem;
      }
    }
  `,
  jsTemplate: `
    // Scroll-triggered progress bar animations
    document.addEventListener('DOMContentLoaded', function() {
      const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.style.width;
            progressBar.style.setProperty('--progress-width', width);
            progressBar.classList.add('animate');
            observer.unobserve(progressBar);
          }
        });
      }, observerOptions);

      document.querySelectorAll('.language-progress').forEach(el => {
        observer.observe(el);
      });
    });
  `,
  placeholders: [
    "{{LANGUAGE_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
    "{{COLOR_BORDER}}"
  ]
};

export const languagesTemplate2: ComponentTemplate = {
  id: "languages-card-grid",
  name: "Card Grid Languages",
  category: "languages",
  htmlTemplate: `
    <section class="languages-section-cards" id="languages">
      <div class="container">
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
        <div class="languages-grid" role="list">
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
      background: {{COLOR_CARD_BG}};
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
      backdrop-filter: blur(10px);
      opacity: 0;
      transform: translateY(20px);
    }

    .language-card.animate {
      animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .language-card:hover {
      transform: translateY(-5px);
      background: {{COLOR_CARD_BG_HOVER}};
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
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

    @media (max-width: 640px) {
      .languages-section-cards {
        padding: 3rem 1rem;
      }

      .languages-grid {
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 1rem;
      }

      .language-card {
        padding: 1.25rem;
      }

      .language-icon {
        font-size: 2rem;
      }

      .language-name {
        font-size: 1rem;
      }

      .language-level {
        font-size: 0.9rem;
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .languages-section-cards {
        padding: 4rem 1.5rem;
      }

      .languages-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1.5rem;
      }

      .language-card {
        padding: 1.75rem;
      }

      .language-icon {
        font-size: 2.5rem;
      }
    }

    @media (min-width: 1025px) {
      .languages-section-cards {
        padding: 6rem 2rem;
      }
    }

    @media (min-width: 1440px) {
      .languages-grid {
        max-width: 1100px;
      }
    }

    /* Empty State Styles */
    .languages-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
      grid-column: 1 / -1;
    }

    .languages-empty-state .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.6;
    }

    .languages-empty-state .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .languages-empty-state .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_ACCENT}};
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .languages-empty-state .empty-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 640px) {
      .languages-empty-state {
        padding: 3rem 1rem;
      }

      .languages-empty-state .empty-icon {
        font-size: 3rem;
      }

      .languages-empty-state .empty-message {
        font-size: 1rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .language-card {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Stagger animation for cards
    document.addEventListener('DOMContentLoaded', function() {
      const cards = document.querySelectorAll('.language-card');
      
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.language-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate');
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const grid = document.querySelector('.languages-grid');
      if (grid) {
        observer.observe(grid);
      }
    });
  `,
  placeholders: [
    "{{LANGUAGE_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_CARD_BG}}",
    "{{COLOR_CARD_BG_HOVER}}"
  ]
};

export const languagesTemplate3: ComponentTemplate = {
  id: "languages-minimalist",
  name: "Minimalist Languages",
  category: "languages",
  htmlTemplate: `
    <section class="languages-section-minimal" id="languages">
      <div class="container">
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
        <div class="languages-list" role="list">
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
      background: {{COLOR_CARD_BG}};
      border-radius: 8px;
      border-left: 4px solid {{COLOR_ACCENT}};
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      opacity: 0;
      transform: translateX(-20px);
    }

    .language-item-minimal.animate {
      animation: slideInLeft 0.5s ease forwards;
    }

    @keyframes slideInLeft {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .language-item-minimal:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px {{COLOR_SHADOW}};
    }

    .language-name-minimal {
      font-size: 1.2rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
    }

    .language-level-minimal {
      font-size: 1rem;
      color: {{COLOR_ACCENT}};
      font-weight: 500;
      padding: 0.5rem 1rem;
      background: {{COLOR_BADGE_BG}};
      border-radius: 20px;
    }

    @media (max-width: 640px) {
      .languages-section-minimal {
        padding: 3rem 1rem;
      }

      .languages-list {
        gap: 1rem;
      }

      .language-item-minimal {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        padding: 1rem 1.25rem;
      }

      .language-name-minimal {
        font-size: 1.05rem;
      }

      .language-level-minimal {
        align-self: flex-start;
        font-size: 0.9rem;
        padding: 0.4rem 0.85rem;
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .languages-section-minimal {
        padding: 4rem 1.5rem;
      }

      .language-item-minimal {
        padding: 1.25rem 1.75rem;
      }
    }

    @media (min-width: 1025px) {
      .languages-section-minimal {
        padding: 6rem 2rem;
      }
    }

    @media (min-width: 1440px) {
      .languages-list {
        max-width: 800px;
      }
    }

    /* Empty State Styles */
    .languages-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .languages-empty-state .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.6;
    }

    .languages-empty-state .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .languages-empty-state .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_ACCENT}};
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .languages-empty-state .empty-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 640px) {
      .languages-empty-state {
        padding: 3rem 1rem;
      }

      .languages-empty-state .empty-icon {
        font-size: 3rem;
      }

      .languages-empty-state .empty-message {
        font-size: 1rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .language-item-minimal {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Slide-in animations for list items
    document.addEventListener('DOMContentLoaded', function() {
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.language-item-minimal');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('animate');
              }, index * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const list = document.querySelector('.languages-list');
      if (list) {
        observer.observe(list);
      }
    });
  `,
  placeholders: [
    "{{LANGUAGE_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_SECONDARY}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_CARD_BG}}",
    "{{COLOR_BADGE_BG}}",
    "{{COLOR_SHADOW}}"
  ]
};

export const languagesTemplate4: ComponentTemplate = {
  id: "languages-certification",
  name: "Certification Languages",
  category: "languages",
  htmlTemplate: `
    <section class="languages-section-cert" id="languages">
      <div class="container">
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
        <div class="languages-cert-grid" role="list">
          {{LANGUAGE_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .languages-section-cert {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
      color: {{COLOR_TEXT}};
    }

    .languages-cert-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .language-cert-card {
      background: {{COLOR_CARD_BG}};
      border-radius: 16px;
      padding: 2rem;
      border: 2px solid {{COLOR_BORDER}};
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    }

    .language-cert-card.animate {
      animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .language-cert-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px {{COLOR_SHADOW}};
      border-color: {{COLOR_ACCENT}};
    }

    .language-cert-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .language-cert-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
    }

    .language-cert-level {
      font-size: 0.9rem;
      font-weight: 600;
      padding: 0.4rem 0.8rem;
      background: {{COLOR_ACCENT}};
      color: white;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .language-cert-cefr {
      display: inline-block;
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: {{COLOR_TEXT_SECONDARY}};
      font-weight: 500;
    }

    .language-cert-cefr-badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      background: {{COLOR_BADGE_BG}};
      border-radius: 6px;
      margin-left: 0.5rem;
      font-weight: 600;
      color: {{COLOR_ACCENT}};
    }

    .language-cert-badges {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid {{COLOR_BORDER}};
    }

    .language-cert-badges-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .language-cert-badge-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .language-cert-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, {{COLOR_ACCENT}}, {{COLOR_PRIMARY}});
      color: white;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .language-cert-badge-icon {
      font-size: 1.1rem;
    }

    .language-cert-no-badges {
      font-size: 0.9rem;
      color: {{COLOR_TEXT_SECONDARY}};
      font-style: italic;
    }

    @media (max-width: 640px) {
      .languages-section-cert {
        padding: 3rem 1rem;
      }

      .languages-cert-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .language-cert-card {
        padding: 1.5rem;
      }

      .language-cert-header {
        flex-direction: column;
        gap: 0.5rem;
      }

      .language-cert-name {
        font-size: 1.3rem;
      }

      .language-cert-level {
        align-self: flex-start;
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .languages-section-cert {
        padding: 4rem 1.5rem;
      }

      .languages-cert-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
    }

    @media (min-width: 1025px) {
      .languages-section-cert {
        padding: 6rem 2rem;
      }
    }

    @media (min-width: 1440px) {
      .languages-cert-grid {
        max-width: 1200px;
      }
    }

    /* Empty State Styles */
    .languages-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
      grid-column: 1 / -1;
    }

    .languages-empty-state .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.6;
    }

    .languages-empty-state .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .languages-empty-state .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_ACCENT}};
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .languages-empty-state .empty-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 640px) {
      .languages-empty-state {
        padding: 3rem 1rem;
      }

      .languages-empty-state .empty-icon {
        font-size: 3rem;
      }

      .languages-empty-state .empty-message {
        font-size: 1rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .language-cert-card {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Stagger animation for certification cards
    document.addEventListener('DOMContentLoaded', function() {
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.language-cert-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate');
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const grid = document.querySelector('.languages-cert-grid');
      if (grid) {
        observer.observe(grid);
      }
    });
  `,
  placeholders: [
    "{{LANGUAGE_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
    "{{COLOR_CARD_BG}}",
    "{{COLOR_BORDER}}",
    "{{COLOR_BADGE_BG}}",
    "{{COLOR_SHADOW}}"
  ]
};


export const languagesTemplate5: ComponentTemplate = {
  id: "languages-accordion",
  name: "Accordion Languages",
  category: "languages",
  htmlTemplate: `
    <section class="languages-section-accordion" id="languages">
      <div class="container">
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
        <div class="languages-accordion-list" role="list">
          {{LANGUAGE_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .languages-section-accordion {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
      color: {{COLOR_TEXT}};
    }

    .languages-accordion-list {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .language-accordion-item {
      background: {{COLOR_CARD_BG}};
      border-radius: 12px;
      border: 1px solid {{COLOR_BORDER}};
      overflow: hidden;
      transition: box-shadow 0.3s ease;
    }

    .language-accordion-item:hover {
      box-shadow: 0 4px 12px {{COLOR_SHADOW}};
    }

    .language-accordion-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: background 0.2s ease;
    }

    .language-accordion-header:hover {
      background: {{COLOR_BADGE_BG}};
    }

    .language-accordion-header:focus {
      outline: 2px solid {{COLOR_ACCENT}};
      outline-offset: -2px;
    }

    .language-accordion-header-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex: 1;
    }

    .language-accordion-name {
      font-size: 1.3rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
    }

    .language-accordion-level {
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.4rem 0.8rem;
      background: {{COLOR_ACCENT}};
      color: white;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .language-accordion-icon {
      font-size: 1.2rem;
      color: {{COLOR_TEXT_SECONDARY}};
      transition: transform 0.3s ease;
      flex-shrink: 0;
    }

    .language-accordion-header[aria-expanded="true"] .language-accordion-icon {
      transform: rotate(180deg);
    }

    .language-accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
    }

    .language-accordion-content.expanded {
      max-height: 500px;
      padding: 0 2rem 1.5rem 2rem;
    }

    .language-accordion-details {
      padding-top: 1rem;
      border-top: 1px solid {{COLOR_BORDER}};
    }

    .language-accordion-detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid {{COLOR_BORDER}};
    }

    .language-accordion-detail-row:last-child {
      border-bottom: none;
    }

    .language-accordion-detail-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: {{COLOR_TEXT_SECONDARY}};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .language-accordion-detail-value {
      font-size: 1rem;
      font-weight: 500;
      color: {{COLOR_TEXT}};
    }

    .language-accordion-cefr-badge {
      display: inline-block;
      padding: 0.3rem 0.7rem;
      background: {{COLOR_ACCENT}};
      color: white;
      border-radius: 6px;
      font-weight: 600;
    }

    .language-accordion-certifications {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .language-accordion-cert-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.8rem;
      background: linear-gradient(135deg, {{COLOR_ACCENT}}, {{COLOR_PRIMARY}});
      color: white;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .language-accordion-no-certs {
      font-size: 0.9rem;
      color: {{COLOR_TEXT_SECONDARY}};
      font-style: italic;
    }

    @media (max-width: 640px) {
      .languages-section-accordion {
        padding: 3rem 1rem;
      }

      .language-accordion-header {
        padding: 1.25rem 1.5rem;
      }

      .language-accordion-header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .language-accordion-name {
        font-size: 1.1rem;
      }

      .language-accordion-content.expanded {
        padding: 0 1.5rem 1.25rem 1.5rem;
      }

      .language-accordion-detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .languages-section-accordion {
        padding: 4rem 1.5rem;
      }
    }

    @media (min-width: 1025px) {
      .languages-section-accordion {
        padding: 6rem 2rem;
      }
    }

    @media (min-width: 1440px) {
      .languages-accordion-list {
        max-width: 900px;
      }
    }

    /* Empty State Styles */
    .languages-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .languages-empty-state .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.6;
    }

    .languages-empty-state .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .languages-empty-state .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_ACCENT}};
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .languages-empty-state .empty-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 640px) {
      .languages-empty-state {
        padding: 3rem 1rem;
      }

      .languages-empty-state .empty-icon {
        font-size: 3rem;
      }

      .languages-empty-state .empty-message {
        font-size: 1rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .language-accordion-icon,
      .language-accordion-content {
        transition: none;
      }
    }
  `,
  jsTemplate: `
    // Accordion toggle logic with keyboard navigation
    document.addEventListener('DOMContentLoaded', function() {
      const accordionHeaders = document.querySelectorAll('.language-accordion-header');
      
      accordionHeaders.forEach((header, index) => {
        header.addEventListener('click', function() {
          toggleAccordion(this);
        });

        // Keyboard navigation
        header.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleAccordion(this);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextHeader = accordionHeaders[index + 1];
            if (nextHeader) nextHeader.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevHeader = accordionHeaders[index - 1];
            if (prevHeader) prevHeader.focus();
          }
        });
      });

      function toggleAccordion(header) {
        const content = header.nextElementSibling;
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        
        // Close all other accordions (optional: remove to allow multiple open)
        accordionHeaders.forEach(h => {
          if (h !== header) {
            h.setAttribute('aria-expanded', 'false');
            h.nextElementSibling.classList.remove('expanded');
          }
        });
        
        // Toggle current accordion
        header.setAttribute('aria-expanded', !isExpanded);
        content.classList.toggle('expanded');
      }
    });
  `,
  placeholders: [
    "{{LANGUAGE_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
    "{{COLOR_CARD_BG}}",
    "{{COLOR_BORDER}}",
    "{{COLOR_BADGE_BG}}",
    "{{COLOR_SHADOW}}"
  ]
};


export const languagesTemplate6: ComponentTemplate = {
  id: "languages-badge-cloud",
  name: "Badge Cloud Languages",
  category: "languages",
  htmlTemplate: `
    <section class="languages-section-badges" id="languages">
      <div class="container">
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
        <div class="languages-badge-cloud" role="list">
          {{LANGUAGE_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .languages-section-badges {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
      color: {{COLOR_TEXT}};
    }

    .languages-badge-cloud {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      align-items: center;
    }

    .language-badge-item {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: default;
      position: relative;
      opacity: 0;
      transform: scale(0.8);
    }

    .language-badge-item.animate {
      animation: popIn 0.4s ease forwards;
    }

    @keyframes popIn {
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .language-badge-item:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Color coding by proficiency level */
    .language-badge-item[data-level="native"] {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .language-badge-item[data-level="fluent"] {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
    }

    .language-badge-item[data-level="advanced"] {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
    }

    .language-badge-item[data-level="intermediate"] {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .language-badge-item[data-level="basic"] {
      background: linear-gradient(135deg, #6b7280, #4b5563);
      color: white;
    }

    .language-badge-name {
      font-size: 1rem;
      font-weight: 600;
    }

    .language-badge-level {
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .language-badge-percentage {
      font-size: 0.85rem;
      font-weight: 700;
      margin-left: 0.25rem;
    }

    /* Tooltip for additional info */
    .language-badge-item[data-cefr]::after {
      content: "CEFR: " attr(data-cefr);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      padding: 0.5rem 0.75rem;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border-radius: 6px;
      font-size: 0.75rem;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .language-badge-item[data-cefr]:hover::after {
      opacity: 1;
      transform: translateX(-50%) translateY(-4px);
    }

    @media (max-width: 640px) {
      .languages-section-badges {
        padding: 3rem 1rem;
      }

      .languages-badge-cloud {
        gap: 0.75rem;
      }

      .language-badge-item {
        padding: 0.6rem 1.25rem;
      }

      .language-badge-name {
        font-size: 0.9rem;
      }

      .language-badge-level {
        font-size: 0.7rem;
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .languages-section-badges {
        padding: 4rem 1.5rem;
      }
    }

    @media (min-width: 1025px) {
      .languages-section-badges {
        padding: 6rem 2rem;
      }
    }

    @media (min-width: 1440px) {
      .languages-badge-cloud {
        max-width: 1000px;
      }
    }

    /* Empty State Styles */
    .languages-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .languages-empty-state .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.6;
    }

    .languages-empty-state .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .languages-empty-state .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_ACCENT}};
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .languages-empty-state .empty-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 640px) {
      .languages-empty-state {
        padding: 3rem 1rem;
      }

      .languages-empty-state .empty-icon {
        font-size: 3rem;
      }

      .languages-empty-state .empty-message {
        font-size: 1rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .language-badge-item {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Badge animation on scroll
    document.addEventListener('DOMContentLoaded', function() {
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const badges = entry.target.querySelectorAll('.language-badge-item');
            badges.forEach((badge, index) => {
              setTimeout(() => {
                badge.classList.add('animate');
              }, index * 50);
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const cloud = document.querySelector('.languages-badge-cloud');
      if (cloud) {
        observer.observe(cloud);
      }
    });
  `,
  placeholders: [
    "{{LANGUAGE_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
    "{{COLOR_ACCENT}}"
  ]
};

export const languagesTemplates = [
  languagesTemplate1,
  languagesTemplate2,
  languagesTemplate3,
  languagesTemplate4,
  languagesTemplate5,
  languagesTemplate6,
];
