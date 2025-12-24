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
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
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
      font-family: {{FONT_BODY}}, sans-serif;
    }

    .section-title {
      font-family: {{FONT_HEADING}}, sans-serif;
    }

    .skills-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .skill-item {
      margin-bottom: 2rem;
      opacity: 0;
      transform: translateY(20px);
    }

    .skill-item.animate {
      animation: skillsFadeInUp 0.5s ease forwards;
    }

    @keyframes skillsFadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .skill-name {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .skill-level {
      font-size: 0.85rem;
      color: {{COLOR_TEXT_SECONDARY}};
      font-weight: 400;
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
      width: 0;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .skill-progress.animate {
      width: var(--progress-width);
    }

    @media (max-width: 768px) {
      .skills-section {
        padding: 3rem 1rem;
      }

      .skills-container {
        padding: 0 1rem;
      }

      .skill-name {
        font-size: 1rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .skill-item,
      .skill-progress {
        animation: none;
        transition: none;
        opacity: 1;
        transform: none;
      }

      .skill-progress {
        width: var(--progress-width) !important;
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
            const container = entry.target;
            const items = container.querySelectorAll('.skill-item');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('animate');
                const progress = item.querySelector('.skill-progress');
                if (progress) {
                  const width = progress.getAttribute('data-width') || progress.style.width;
                  progress.style.setProperty('--progress-width', width);
                  progress.classList.add('animate');
                }
              }, index * 100);
            });
            observer.unobserve(container);
          }
        });
      }, observerOptions);

      const container = document.querySelector('.skills-container');
      if (container) {
        observer.observe(container);
      }
    });
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
    "{{FONT_HEADING}}",
    "{{FONT_BODY}}"
  ]
};

export const skillsTemplate2: ComponentTemplate = {
  id: "skills-card-grid",
  name: "Card Grid Skills",
  category: "skills",
  htmlTemplate: `
    <section class="skills-section-cards" id="skills">
      <div class="container">
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
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
      color: {{COLOR_TEXT}};
      font-family: {{FONT_BODY}}, sans-serif;
    }

    .section-title {
      font-family: {{FONT_HEADING}}, sans-serif;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .skill-card {
      background: {{COLOR_SURFACE}};
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-top: 3px solid {{COLOR_ACCENT}};
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    }

    .skill-card.animate {
      animation: skillsCardFadeInUp 0.5s ease forwards;
    }

    @keyframes skillsCardFadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .skill-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .skill-icon {
      font-size: 2.5rem;
      color: {{COLOR_ICON_PRIMARY}};
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
      .skills-section-cards {
        padding: 3rem 1rem;
      }

      .skills-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
      }

      .skill-card {
        padding: 1.25rem;
      }

      .skill-icon {
        font-size: 2rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .skill-card {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Stagger animation for skill cards
    document.addEventListener('DOMContentLoaded', function() {
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.skill-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate');
              }, index * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const grid = document.querySelector('.skills-grid');
      if (grid) {
        observer.observe(grid);
      }
    });
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
    "{{COLOR_SURFACE}}",
    "{{COLOR_ICON_PRIMARY}}",
    "{{FONT_HEADING}}",
    "{{FONT_BODY}}"
  ]
};

export const skillsTemplate3: ComponentTemplate = {
  id: "skills-categorized",
  name: "Categorized Skills",
  category: "skills",
  htmlTemplate: `
    <section class="skills-section-categorized" id="skills">
      <div class="container">
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
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
      color: {{COLOR_TEXT}};
      font-family: {{FONT_BODY}}, sans-serif;
    }

    .section-title {
      font-family: {{FONT_HEADING}}, sans-serif;
    }

    .skills-categories {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .skill-category-group {
      background: {{COLOR_SURFACE}};
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      opacity: 0;
      transform: translateY(20px);
    }

    .skill-category-group.animate {
      animation: skillsCatFadeInUp 0.5s ease forwards;
    }

    @keyframes skillsCatFadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .skill-category-header {
      background: {{COLOR_PRIMARY}};
      color: white;
      padding: 1rem 1.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-left: 4px solid {{COLOR_ACCENT}};
      font-family: {{FONT_HEADING}}, sans-serif;
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

    @media (prefers-reduced-motion: reduce) {
      .skill-category-group {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Stagger animation for category groups
    document.addEventListener('DOMContentLoaded', function() {
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const groups = entry.target.querySelectorAll('.skill-category-group');
            groups.forEach((group, index) => {
              setTimeout(() => {
                group.classList.add('animate');
              }, index * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const container = document.querySelector('.skills-categories');
      if (container) {
        observer.observe(container);
      }
    });
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_SURFACE}}",
    "{{FONT_HEADING}}",
    "{{FONT_BODY}}"
  ]
};

export const skillsTemplate4: ComponentTemplate = {
  id: "skills-minimal-list",
  name: "Minimal List Skills",
  category: "skills",
  htmlTemplate: `
    <section class="skills-section-minimal" id="skills">
      <div class="container">
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
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
      color: {{COLOR_TEXT}};
      font-family: {{FONT_BODY}}, sans-serif;
    }

    .section-title {
      font-family: {{FONT_HEADING}}, sans-serif;
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
      transition: padding-left 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateX(-20px);
    }

    .skill-item-minimal.animate {
      animation: skillsSlideInLeft 0.5s ease forwards;
    }

    @keyframes skillsSlideInLeft {
      to {
        opacity: 1;
        transform: translateX(0);
      }
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

    @media (prefers-reduced-motion: reduce) {
      .skill-item-minimal {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Stagger animation for list items
    document.addEventListener('DOMContentLoaded', function() {
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.skill-item-minimal');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('animate');
              }, index * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const list = document.querySelector('.skills-list-minimal');
      if (list) {
        observer.observe(list);
      }
    });
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
    "{{COLOR_BACKGROUND_LIGHT}}",
    "{{FONT_HEADING}}",
    "{{FONT_BODY}}"
  ]
};

export const skillsTemplate5: ComponentTemplate = {
  id: "skills-tag-cloud",
  name: "Tag Cloud Skills",
  category: "skills",
  htmlTemplate: `
    <section class="skills-section-tags" id="skills">
      <div class="container">
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
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
      color: {{COLOR_TEXT}};
      font-family: {{FONT_BODY}}, sans-serif;
    }

    .section-title {
      font-family: {{FONT_HEADING}}, sans-serif;
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
      opacity: 0;
      transform: scale(0.8);
    }

    .skill-tag.animate {
      animation: skillsPopIn 0.4s ease forwards;
    }

    @keyframes skillsPopIn {
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .skill-tag:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    /* Dynamic sizing based on level */
    .skill-tag[data-level="beginner"] {
      font-size: 0.9rem;
    }

    .skill-tag[data-level="intermediate"] {
      font-size: 1.05rem;
    }

    .skill-tag[data-level="advanced"] {
      font-size: 1.2rem;
    }

    .skill-tag[data-level="expert"] {
      font-size: 1.4rem;
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

    @media (prefers-reduced-motion: reduce) {
      .skill-tag {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Pop-in animation for tags
    document.addEventListener('DOMContentLoaded', function() {
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const tags = entry.target.querySelectorAll('.skill-tag');
            tags.forEach((tag, index) => {
              setTimeout(() => {
                tag.classList.add('animate');
              }, index * 50);
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const cloud = document.querySelector('.skills-tag-cloud');
      if (cloud) {
        observer.observe(cloud);
      }
    });
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}",
    "{{FONT_HEADING}}",
    "{{FONT_BODY}}"
  ]
};

/**
 * Skills Template 6 - Glass Modern (Glassmorphism)
 * Modern glassmorphism kartları, animated orb arka plan, neon glow efektleri
 */
export const skillsTemplate6: ComponentTemplate = {
  id: "skills-glass-modern",
  name: "Glass Modern Skills",
  category: "skills",
  htmlTemplate: `
    <section class="skills-glass" id="skills">
      <!-- Animated background orbs -->
      <div class="skills-glass-orbs" aria-hidden="true">
        <div class="skills-orb skills-orb-1"></div>
        <div class="skills-orb skills-orb-2"></div>
        <div class="skills-orb skills-orb-3"></div>
      </div>
      
      <div class="container">
        <h2 class="section-title">{{SECTION_TITLE}}</h2>
        <div class="skills-glass-grid">
          {{SKILL_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .skills-glass {
      padding: 6rem 2rem;
      background: {{COLOR_BACKGROUND}};
      color: {{COLOR_TEXT}};
      font-family: {{FONT_BODY}}, sans-serif;
      position: relative;
      overflow: hidden;
      isolation: isolate;
    }

    .skills-glass .section-title {
      font-family: {{FONT_HEADING}}, sans-serif;
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 3rem;
      position: relative;
      z-index: 2;
    }

    /* Animated background orbs */
    .skills-glass-orbs {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }

    .skills-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: skillsOrbFloat 20s ease-in-out infinite;
    }

    .skills-orb-1 {
      width: 350px;
      height: 350px;
      background: {{COLOR_PRIMARY}};
      top: -10%;
      right: -5%;
      animation-delay: 0s;
    }

    .skills-orb-2 {
      width: 250px;
      height: 250px;
      background: {{COLOR_ACCENT}};
      bottom: -5%;
      left: -5%;
      animation-delay: -7s;
    }

    .skills-orb-3 {
      width: 200px;
      height: 200px;
      background: {{COLOR_SECONDARY}};
      top: 40%;
      left: 50%;
      animation-delay: -14s;
    }

    @keyframes skillsOrbFloat {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(30px, -30px) scale(1.1);
      }
      50% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      75% {
        transform: translate(20px, 10px) scale(1.05);
      }
    }

    .skills-glass-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    /* Glassmorphism card */
    .skill-glass-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem 1.5rem;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      opacity: 0;
      transform: translateY(30px);
    }

    .skill-glass-card.animate {
      animation: glassCardIn 0.6s ease forwards;
    }

    @keyframes glassCardIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Gradient border glow on hover */
    .skill-glass-card::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 22px;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}});
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .skill-glass-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      background: {{COLOR_BACKGROUND}};
      z-index: -1;
    }

    .skill-glass-card:hover {
      transform: translateY(-8px);
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.2),
        0 0 30px {{COLOR_PRIMARY}}20;
    }

    .skill-glass-card:hover::before {
      opacity: 1;
    }

    /* Icon container */
    .skill-glass-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 1rem;
      border-radius: 16px;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}20, {{COLOR_ACCENT}}20);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      color: {{COLOR_ICON_PRIMARY}};
      transition: all 0.3s ease;
    }

    .skill-glass-card:hover .skill-glass-icon {
      transform: scale(1.1);
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}40, {{COLOR_ACCENT}}40);
      box-shadow: 0 0 20px {{COLOR_PRIMARY}}40;
    }

    .skill-glass-icon svg {
      width: 28px;
      height: 28px;
    }

    .skill-glass-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.5rem;
      font-family: {{FONT_HEADING}}, sans-serif;
    }

    .skill-glass-level {
      font-size: 0.8rem;
      padding: 0.35rem 0.85rem;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}30, {{COLOR_ACCENT}}30);
      color: {{COLOR_ACCENT}};
      border-radius: 20px;
      display: inline-block;
      font-weight: 500;
      text-transform: capitalize;
    }

    .skill-glass-category {
      font-size: 0.75rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-top: 0.75rem;
      opacity: 0.7;
    }

    @media (max-width: 768px) {
      .skills-glass {
        padding: 4rem 1rem;
      }

      .skills-glass .section-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .skills-glass-grid {
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 1rem;
      }

      .skill-glass-card {
        padding: 1.5rem 1rem;
      }

      .skill-glass-icon {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
      }

      .skill-glass-name {
        font-size: 1rem;
      }

      .skills-orb {
        opacity: 0.25;
      }
    }

    @media (min-width: 1440px) {
      .skills-glass-grid {
        max-width: 1300px;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .skills-orb,
      .skill-glass-card {
        animation: none;
      }

      .skill-glass-card {
        opacity: 1;
        transform: none;
      }

      .skill-glass-card:hover {
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Stagger animation for glass cards
    document.addEventListener('DOMContentLoaded', function() {
      const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.skill-glass-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate');
              }, index * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const grid = document.querySelector('.skills-glass-grid');
      if (grid) {
        observer.observe(grid);
      }
    });
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{SECTION_TITLE}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_SECONDARY}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
    "{{COLOR_ICON_PRIMARY}}",
    "{{FONT_HEADING}}",
    "{{FONT_BODY}}"
  ],
  designNotes: "Premium glassmorphism skills template. Animated background orbs, blur(20px) kart efektleri, neon border glow on hover. Staggered scroll-triggered animasyonlar."
};

export const skillsTemplates = [skillsTemplate1, skillsTemplate2, skillsTemplate3, skillsTemplate4, skillsTemplate5, skillsTemplate6];
