import { ComponentTemplate } from "@/types/templates";

/**
 * Experience section template'leri
 */

export const experienceTemplate1: ComponentTemplate = {
  id: "experience-timeline",
  name: "Timeline Experience",
  category: "experience",
  htmlTemplate: `
    <section class="experience-section" id="experience" role="region" aria-labelledby="experience-heading">
      <div class="container">
        <h2 class="section-title" id="experience-heading">İş Deneyimlerim</h2>
        <div class="timeline" role="list" aria-label="İş deneyimleri zaman çizelgesi">
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

    .no-experience {
      text-align: center;
      color: {{COLOR_TEXT_SECONDARY}};
      font-style: italic;
      padding: 2rem;
    }

    /* Scroll animations */
    .timeline-item {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    .timeline-item.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Responsive breakpoints */
    @media (max-width: 1024px) {
      .timeline-position {
        font-size: 1.3rem;
      }

      .timeline-company {
        font-size: 1rem;
      }
    }

    @media (max-width: 768px) {
      .timeline {
        padding-left: 1.5rem;
      }

      .timeline-position {
        font-size: 1.2rem;
      }

      .timeline-description {
        font-size: 0.95rem;
      }
    }

    @media (max-width: 480px) {
      .experience-section {
        padding: 3rem 1rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .timeline {
        padding-left: 1rem;
      }

      .timeline-item {
        padding-left: 1.5rem;
      }

      .timeline-position {
        font-size: 1.1rem;
      }

      .timeline-description {
        font-size: 0.9rem;
      }
    }
  `,
  jsTemplate: `
    // Scroll-triggered animations for timeline items
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
      timelineObserver.observe(item);
    });
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
    <section class="experience-section-cards" id="experience" role="region" aria-labelledby="experience-cards-heading">
      <div class="container">
        <h2 class="section-title" id="experience-cards-heading">İş Deneyimlerim</h2>
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

    .no-experience {
      text-align: center;
      color: {{COLOR_TEXT_SECONDARY}};
      font-style: italic;
      padding: 2rem;
    }

    /* Scroll animations */
    .experience-card {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s;
    }

    .experience-card.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Staggered animation delay */
    .experience-card:nth-child(1) { transition-delay: 0.1s; }
    .experience-card:nth-child(2) { transition-delay: 0.2s; }
    .experience-card:nth-child(3) { transition-delay: 0.3s; }
    .experience-card:nth-child(4) { transition-delay: 0.4s; }
    .experience-card:nth-child(5) { transition-delay: 0.5s; }

    /* Responsive breakpoints */
    @media (max-width: 1024px) {
      .experience-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      .experience-position {
        font-size: 1.3rem;
      }
    }

    @media (max-width: 768px) {
      .experience-grid {
        grid-template-columns: 1fr;
      }

      .experience-position {
        font-size: 1.2rem;
      }

      .experience-description {
        font-size: 0.95rem;
      }
    }

    @media (max-width: 480px) {
      .experience-section-cards {
        padding: 3rem 1rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .experience-card {
        padding: 1.5rem;
      }

      .experience-position {
        font-size: 1.1rem;
      }

      .experience-company {
        font-size: 1rem;
      }

      .experience-description {
        font-size: 0.9rem;
      }
    }
  `,
  jsTemplate: `
    // Scroll-triggered animations for experience cards
    const cardsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.experience-card').forEach(card => {
      cardsObserver.observe(card);
    });
  `,
  placeholders: [
    "{{EXPERIENCE_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const experienceTemplate3: ComponentTemplate = {
  id: "experience-accordion",
  name: "Accordion Experience",
  category: "experience",
  htmlTemplate: `
    <section class="experience-section-accordion" id="experience">
      <div class="container">
        <h2 class="section-title">İş Deneyimlerim</h2>
        <div class="experience-accordion">
          {{EXPERIENCE_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .experience-section-accordion {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .experience-accordion {
      max-width: 900px;
      margin: 0 auto;
    }

    .accordion-item {
      background: white;
      border-radius: 8px;
      margin-bottom: 1rem;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s;
    }

    .accordion-item:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .accordion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      cursor: pointer;
      background: white;
      border: none;
      width: 100%;
      text-align: left;
      transition: background 0.3s;
    }

    .accordion-header:hover {
      background: #f8f9fa;
    }

    .accordion-header:focus {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: 2px;
    }

    .accordion-header:focus:not(:focus-visible) {
      outline: none;
    }

    .accordion-header:focus-visible {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: 2px;
    }

    .accordion-header-content {
      flex: 1;
    }

    .accordion-position {
      font-size: 1.3rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.25rem;
    }

    .accordion-company {
      font-size: 1rem;
      color: {{COLOR_PRIMARY}};
      font-weight: 500;
    }

    .accordion-duration {
      font-size: 0.85rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-top: 0.25rem;
    }

    .accordion-icon {
      font-size: 1.5rem;
      color: {{COLOR_ACCENT}};
      transition: transform 0.3s;
      flex-shrink: 0;
      margin-left: 1rem;
    }

    .accordion-item.active .accordion-icon {
      transform: rotate(180deg);
    }

    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out, padding 0.3s ease-out;
      padding: 0 1.5rem;
    }

    .accordion-item.active .accordion-content {
      max-height: 500px;
      padding: 0 1.5rem 1.5rem 1.5rem;
    }

    .accordion-description {
      color: {{COLOR_TEXT}};
      line-height: 1.6;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }

    .no-experience {
      text-align: center;
      color: {{COLOR_TEXT_SECONDARY}};
      font-style: italic;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .accordion-position {
        font-size: 1.1rem;
      }

      .accordion-company {
        font-size: 0.9rem;
      }

      .accordion-header {
        padding: 1.25rem;
      }

      .accordion-item.active .accordion-content {
        padding: 0 1.25rem 1.25rem 1.25rem;
      }
    }

    @media (max-width: 480px) {
      .accordion-position {
        font-size: 1rem;
      }

      .accordion-duration {
        font-size: 0.8rem;
      }
    }
  `,
  jsTemplate: `
    // Accordion toggle functionality with ARIA support
    function toggleAccordion(header, forceOpen = null) {
      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const wasActive = item.classList.contains('active');
      const shouldOpen = forceOpen !== null ? forceOpen : !wasActive;
      
      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.accordion-header');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      
      // Open clicked item if needed
      if (shouldOpen) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    }

    // Click event handlers
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', function() {
        toggleAccordion(this);
      });

      // Keyboard navigation
      header.addEventListener('keydown', function(e) {
        const allHeaders = Array.from(document.querySelectorAll('.accordion-header'));
        const currentIndex = allHeaders.indexOf(this);

        switch(e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            toggleAccordion(this);
            break;
          
          case 'ArrowDown':
            e.preventDefault();
            const nextHeader = allHeaders[currentIndex + 1] || allHeaders[0];
            nextHeader.focus();
            break;
          
          case 'ArrowUp':
            e.preventDefault();
            const prevHeader = allHeaders[currentIndex - 1] || allHeaders[allHeaders.length - 1];
            prevHeader.focus();
            break;
          
          case 'Home':
            e.preventDefault();
            allHeaders[0].focus();
            break;
          
          case 'End':
            e.preventDefault();
            allHeaders[allHeaders.length - 1].focus();
            break;
        }
      });
    });

    // Open first item by default and set ARIA
    const firstAccordionItem = document.querySelector('.accordion-item');
    if (firstAccordionItem) {
      firstAccordionItem.classList.add('active');
      const firstHeader = firstAccordionItem.querySelector('.accordion-header');
      if (firstHeader) firstHeader.setAttribute('aria-expanded', 'true');
    }
  `,
  placeholders: [
    "{{EXPERIENCE_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const experienceTemplate4: ComponentTemplate = {
  id: "experience-minimal",
  name: "Minimal List Experience",
  category: "experience",
  htmlTemplate: `
    <section class="experience-section-minimal" id="experience" role="region" aria-labelledby="experience-minimal-heading">
      <div class="container">
        <h2 class="section-title" id="experience-minimal-heading">İş Deneyimlerim</h2>
        <div class="experience-list-minimal">
          {{EXPERIENCE_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .experience-section-minimal {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .experience-list-minimal {
      max-width: 800px;
      margin: 0 auto;
    }

    .experience-item-minimal {
      border-bottom: 1px solid #e0e0e0;
      padding: 2rem 0;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    }

    .experience-item-minimal.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .experience-item-minimal:last-child {
      border-bottom: none;
    }

    .experience-header-minimal {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.5rem;
      gap: 1rem;
    }

    .experience-position-minimal {
      font-size: 1.2rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      flex: 1;
    }

    .experience-duration-minimal {
      font-size: 0.9rem;
      color: {{COLOR_TEXT_SECONDARY}};
      white-space: nowrap;
    }

    .experience-company-minimal {
      font-size: 1rem;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 0.75rem;
      font-weight: 500;
    }

    .experience-description-minimal {
      color: {{COLOR_TEXT}};
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .no-experience {
      text-align: center;
      color: {{COLOR_TEXT_SECONDARY}};
      font-style: italic;
      padding: 2rem;
    }

    /* Responsive breakpoints */
    @media (max-width: 768px) {
      .experience-header-minimal {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }

      .experience-position-minimal {
        font-size: 1.1rem;
      }

      .experience-duration-minimal {
        font-size: 0.85rem;
      }
    }

    @media (max-width: 480px) {
      .experience-section-minimal {
        padding: 3rem 1rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .experience-item-minimal {
        padding: 1.5rem 0;
      }

      .experience-position-minimal {
        font-size: 1rem;
      }

      .experience-company-minimal {
        font-size: 0.95rem;
      }

      .experience-description-minimal {
        font-size: 0.9rem;
      }
    }
  `,
  jsTemplate: `
    // Scroll-triggered animations for minimal list items
    const minimalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.experience-item-minimal').forEach(item => {
      minimalObserver.observe(item);
    });
  `,
  placeholders: [
    "{{EXPERIENCE_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const experienceTemplate5: ComponentTemplate = {
  id: "experience-horizontal-timeline",
  name: "Horizontal Timeline Experience",
  category: "experience",
  htmlTemplate: `
    <section class="experience-section-horizontal" id="experience" role="region" aria-labelledby="experience-horizontal-heading">
      <div class="container">
        <h2 class="section-title" id="experience-horizontal-heading">İş Deneyimlerim</h2>
        <div class="horizontal-timeline-wrapper">
          <div class="horizontal-timeline">
            {{EXPERIENCE_ITEMS}}
          </div>
        </div>
        <div class="timeline-nav-hint">← Scroll to explore →</div>
      </div>
    </section>
  `,
  cssTemplate: `
    .experience-section-horizontal {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
      overflow: hidden;
    }

    .horizontal-timeline-wrapper {
      position: relative;
      margin: 2rem 0;
    }

    .horizontal-timeline {
      display: flex;
      gap: 3rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      padding: 3rem 1rem;
      position: relative;
      scroll-snap-type: x mandatory;
    }

    .horizontal-timeline::before {
      content: '';
      position: absolute;
      top: 2rem;
      left: 0;
      width: var(--timeline-width, 100%);
      height: 3px;
      background: {{COLOR_ACCENT}};
      z-index: 0;
    }

    .horizontal-timeline::-webkit-scrollbar {
      height: 8px;
    }

    .horizontal-timeline::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .horizontal-timeline::-webkit-scrollbar-thumb {
      background: {{COLOR_ACCENT}};
      border-radius: 4px;
    }

    .horizontal-timeline::-webkit-scrollbar-thumb:hover {
      background: {{COLOR_PRIMARY}};
    }

    .horizontal-timeline-item {
      min-width: 320px;
      max-width: 320px;
      position: relative;
      scroll-snap-align: start;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .horizontal-timeline-item:nth-child(1) { animation-delay: 0.1s; }
    .horizontal-timeline-item:nth-child(2) { animation-delay: 0.2s; }
    .horizontal-timeline-item:nth-child(3) { animation-delay: 0.3s; }
    .horizontal-timeline-item:nth-child(4) { animation-delay: 0.4s; }
    .horizontal-timeline-item:nth-child(5) { animation-delay: 0.5s; }

    .horizontal-timeline-item::before {
      content: '';
      position: absolute;
      top: -1rem;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: {{COLOR_ACCENT}};
      border: 4px solid {{COLOR_BACKGROUND}};
      z-index: 1;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .horizontal-timeline-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      height: 100%;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .horizontal-timeline-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .horizontal-timeline-duration {
      font-size: 0.85rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 0.75rem;
      font-weight: 500;
    }

    .horizontal-timeline-position {
      font-size: 1.2rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    .horizontal-timeline-company {
      font-size: 1rem;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 1rem;
      font-weight: 500;
    }

    .horizontal-timeline-description {
      color: {{COLOR_TEXT}};
      line-height: 1.5;
      font-size: 0.9rem;
    }

    .timeline-nav-hint {
      text-align: center;
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.9rem;
      margin-top: 1rem;
      font-style: italic;
    }

    .no-experience {
      text-align: center;
      color: {{COLOR_TEXT_SECONDARY}};
      font-style: italic;
      padding: 2rem;
    }

    /* Responsive breakpoints */
    @media (max-width: 768px) {
      .horizontal-timeline-item {
        min-width: 280px;
        max-width: 280px;
      }

      .horizontal-timeline {
        gap: 2rem;
      }

      .horizontal-timeline-position {
        font-size: 1.1rem;
      }

      .horizontal-timeline-description {
        font-size: 0.85rem;
      }
    }

    @media (max-width: 480px) {
      .experience-section-horizontal {
        padding: 3rem 1rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .horizontal-timeline-item {
        min-width: 260px;
        max-width: 260px;
      }

      .horizontal-timeline-card {
        padding: 1.25rem;
      }

      .horizontal-timeline-position {
        font-size: 1rem;
      }

      .horizontal-timeline-company {
        font-size: 0.95rem;
      }
    }
  `,
  jsTemplate: `
    // Smooth scroll navigation for horizontal timeline
    const horizontalTimeline = document.querySelector('.horizontal-timeline');
    
    if (horizontalTimeline) {
      // Auto-hide scroll hint after first scroll
      const scrollHint = document.querySelector('.timeline-nav-hint');
      let hasScrolled = false;
      
      horizontalTimeline.addEventListener('scroll', () => {
        if (!hasScrolled && scrollHint) {
          scrollHint.style.opacity = '0';
          scrollHint.style.transition = 'opacity 0.5s';
          hasScrolled = true;
        }
      });

      // Optional: Add keyboard navigation
      horizontalTimeline.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          horizontalTimeline.scrollBy({ left: 340, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          horizontalTimeline.scrollBy({ left: -340, behavior: 'smooth' });
        }
      });

      // Calculate and set timeline line width dynamically
      const timelineLine = window.getComputedStyle(horizontalTimeline, '::before');
      const totalWidth = horizontalTimeline.scrollWidth;
      horizontalTimeline.style.setProperty('--timeline-width', totalWidth + 'px');
    }
  `,
  placeholders: [
    "{{EXPERIENCE_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const experienceTemplate6: ComponentTemplate = {
  id: "experience-tabs",
  name: "Tabbed Experience",
  category: "experience",
  htmlTemplate: `
    <section class="experience-section-tabs" id="experience" role="region" aria-labelledby="experience-tabs-heading">
      <div class="container">
        <h2 class="section-title" id="experience-tabs-heading">İş Deneyimlerim</h2>
        <div class="experience-tabs-container">
          <div class="tabs-nav" role="tablist">
            {{EXPERIENCE_ITEMS}}
          </div>
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .experience-section-tabs {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .experience-tabs-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .tabs-nav {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .tab-item {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s;
    }

    .tab-item:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .tab-button {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      background: white;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: background 0.3s;
      border-left: 4px solid transparent;
    }

    .tab-button:hover {
      background: #f8f9fa;
    }

    .tab-button:focus {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: -3px;
    }

    .tab-button.active {
      background: #f0f7ff;
      border-left-color: {{COLOR_PRIMARY}};
    }

    .tab-button-content {
      flex: 1;
    }

    .tab-company {
      font-size: 1.2rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.25rem;
    }

    .tab-button.active .tab-company {
      color: {{COLOR_PRIMARY}};
    }

    .tab-position {
      font-size: 0.95rem;
      color: {{COLOR_TEXT_SECONDARY}};
    }

    .tab-duration {
      font-size: 0.85rem;
      color: {{COLOR_TEXT_SECONDARY}};
      white-space: nowrap;
      margin-left: 1rem;
    }

    .tab-icon {
      font-size: 1.2rem;
      color: {{COLOR_ACCENT}};
      transition: transform 0.3s;
      margin-left: 1rem;
    }

    .tab-button.active .tab-icon {
      transform: rotate(90deg);
    }

    .tab-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out, padding 0.3s ease-out;
      padding: 0 1.5rem;
    }

    .tab-item.active .tab-content {
      max-height: 500px;
      padding: 0 1.5rem 1.5rem 1.5rem;
    }

    .tab-description {
      color: {{COLOR_TEXT}};
      line-height: 1.6;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }

    .no-experience {
      text-align: center;
      color: {{COLOR_TEXT_SECONDARY}};
      font-style: italic;
      padding: 2rem;
    }

    /* Responsive breakpoints */
    @media (max-width: 768px) {
      .tab-button {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .tab-duration {
        margin-left: 0;
      }

      .tab-company {
        font-size: 1.1rem;
      }

      .tab-position {
        font-size: 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .experience-section-tabs {
        padding: 3rem 1rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .tab-button {
        padding: 1rem 1.25rem;
      }

      .tab-company {
        font-size: 1rem;
      }

      .tab-position {
        font-size: 0.85rem;
      }
    }
  `,
  jsTemplate: `
    // Tab functionality with keyboard navigation
    function toggleTab(button) {
      const item = button.closest('.tab-item');
      const wasActive = item.classList.contains('active');
      
      // Close all tabs
      document.querySelectorAll('.tab-item').forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.tab-button');
        if (btn) {
          btn.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Open clicked tab if it wasn't active
      if (!wasActive) {
        item.classList.add('active');
        button.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    }

    // Click event handlers
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', function() {
        toggleTab(this);
      });

      // Keyboard navigation
      button.addEventListener('keydown', function(e) {
        const allButtons = Array.from(document.querySelectorAll('.tab-button'));
        const currentIndex = allButtons.indexOf(this);

        switch(e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            toggleTab(this);
            break;
          
          case 'ArrowDown':
            e.preventDefault();
            const nextButton = allButtons[currentIndex + 1] || allButtons[0];
            nextButton.focus();
            break;
          
          case 'ArrowUp':
            e.preventDefault();
            const prevButton = allButtons[currentIndex - 1] || allButtons[allButtons.length - 1];
            prevButton.focus();
            break;
          
          case 'Home':
            e.preventDefault();
            allButtons[0].focus();
            break;
          
          case 'End':
            e.preventDefault();
            allButtons[allButtons.length - 1].focus();
            break;
        }
      });
    });

    // Open first tab by default
    const firstTab = document.querySelector('.tab-item');
    if (firstTab) {
      firstTab.classList.add('active');
      const firstButton = firstTab.querySelector('.tab-button');
      if (firstButton) {
        firstButton.classList.add('active');
        firstButton.setAttribute('aria-expanded', 'true');
      }
    }
  `,
  placeholders: [
    "{{EXPERIENCE_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const experienceTemplates = [experienceTemplate1, experienceTemplate2, experienceTemplate3, experienceTemplate4, experienceTemplate5, experienceTemplate6];
