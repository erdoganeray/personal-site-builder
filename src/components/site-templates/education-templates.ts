import { ComponentTemplate } from "@/types/templates";

/**
 * Education section template'leri
 */

/**
 * Education template ID'leri - Tutarlılık için const olarak tanımlandı
 */
export const EDUCATION_TEMPLATE_IDS = {
  TIMELINE: 'education-timeline',
  CARDS: 'education-cards',
  MODERN: 'education-modern',
  ACCORDION: 'education-accordion',
  HORIZONTAL_TIMELINE: 'education-horizontal-timeline',
  TABS: 'education-tabs'
} as const;

export const educationTemplate1: ComponentTemplate = {
  id: EDUCATION_TEMPLATE_IDS.TIMELINE,
  name: "Timeline Education",
  category: "education",
  htmlTemplate: `
    <section class="education-section" id="education" aria-labelledby="education-title">
      <div class="container">
        <h2 id="education-title" class="section-title">Eğitim</h2>
        <div class="education-timeline" role="list">
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

    /* Empty State Styles */
    .education-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_PRIMARY}};
      color: white;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .empty-action:hover {
      background: {{COLOR_ACCENT}};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Tablet Responsive Design */
    @media (max-width: 1024px) {
      .education-timeline {
        padding-left: 1.75rem;
      }

      .education-degree {
        font-size: 1.3rem;
      }

      .education-school {
        font-size: 1rem;
      }
    }

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .section-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .education-timeline {
        padding-left: 1rem;
      }

      .education-timeline::before {
        width: 2px;
      }

      .education-item {
        margin-bottom: 2rem;
        padding-left: 1.5rem;
      }

      .education-item::before {
        left: -0.9rem;
        font-size: 1.2rem;
      }

      .education-duration {
        font-size: 0.85rem;
      }

      .education-degree {
        font-size: 1.2rem;
      }

      .education-school {
        font-size: 1rem;
      }

      .education-description {
        font-size: 0.95rem;
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .education-section {
        padding: 3rem 1rem;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .education-degree {
        font-size: 1.1rem;
      }
    }

    /* Print Styles */
    @media print {
      .education-section {
        page-break-inside: avoid;
        padding: 2rem 0;
      }

      .education-item {
        page-break-inside: avoid;
        margin-bottom: 1.5rem;
      }

      .education-item::before {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      .education-timeline::before {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
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
  id: EDUCATION_TEMPLATE_IDS.CARDS,
  name: "Card Grid Education",
  category: "education",
  htmlTemplate: `
    <section class="education-section-cards" id="education" aria-labelledby="education-title-cards">
      <div class="container">
        <h2 id="education-title-cards" class="section-title">Eğitim</h2>
        <div class="education-grid" role="list">
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

    /* Empty State Styles */
    .education-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_PRIMARY}};
      color: white;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .empty-action:hover {
      background: {{COLOR_ACCENT}};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Tablet Responsive Design */
    @media (max-width: 1024px) {
      .education-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }

      .education-card {
        padding: 1.75rem;
      }

      .education-degree {
        font-size: 1.3rem;
      }
    }

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .section-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .education-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .education-card {
        padding: 1.5rem;
      }

      .education-duration {
        font-size: 0.85rem;
      }

      .education-degree {
        font-size: 1.2rem;
      }

      .education-school {
        font-size: 1rem;
      }

      .education-description {
        font-size: 0.95rem;
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .education-section-cards {
        padding: 3rem 1rem;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .education-card {
        padding: 1.25rem;
      }

      .education-degree {
        font-size: 1.1rem;
      }
    }

    /* Print Styles */
    @media print {
      .education-section-cards {
        page-break-inside: avoid;
        padding: 2rem 0;
      }

      .education-grid {
        display: block;
      }

      .education-card {
        page-break-inside: avoid;
        margin-bottom: 1.5rem;
        box-shadow: none;
        border: 1px solid #ddd;
      }

      .education-card:hover {
        transform: none;
        box-shadow: none;
      }

      .education-card::before {
        display: none;
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
  id: EDUCATION_TEMPLATE_IDS.MODERN,
  name: "Modern Education",
  category: "education",
  htmlTemplate: `
    <section class="education-modern" id="education" aria-labelledby="education-title-modern">
      <div class="container">
        <h2 id="education-title-modern" class="section-title">Eğitim Geçmişim</h2>
        <div class="education-list" role="list">
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

    /* Empty State Styles */
    .education-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_PRIMARY}};
      color: white;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .empty-action:hover {
      background: {{COLOR_ACCENT}};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Tablet Responsive Design */
    @media (max-width: 1024px) {
      .education-modern-item {
        padding: 2rem;
      }

      .education-degree {
        font-size: 1.4rem;
      }

      .education-school {
        font-size: 1.1rem;
      }
    }

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .section-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .education-header {
        flex-direction: column;
        gap: 1rem;
      }

      .education-duration {
        align-self: flex-start;
        width: fit-content;
      }

      .education-modern-item {
        padding: 1.5rem;
      }

      .education-degree {
        font-size: 1.2rem;
      }

      .education-school {
        font-size: 1rem;
      }

      .education-description {
        font-size: 0.95rem;
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .education-modern {
        padding: 3rem 1rem;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .education-modern-item {
        padding: 1.25rem;
      }

      .education-degree {
        font-size: 1.1rem;
      }

      .education-duration {
        font-size: 0.85rem;
        padding: 0.4rem 0.8rem;
      }
    }

    /* Print Styles */
    @media print {
      .education-modern {
        page-break-inside: avoid;
        padding: 2rem 0;
        background: white;
      }

      .education-modern-item {
        page-break-inside: avoid;
        margin-bottom: 1.5rem;
        box-shadow: none;
        border: 1px solid #ddd;
      }

      .education-modern-item:hover {
        transform: none;
        box-shadow: none;
      }

      .education-modern-item::before {
        background: #333;
      }

      .education-duration {
        background: #f0f0f0;
        color: #333;
      }
    }
  `,
  placeholders: [
    "{{EDUCATION_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const educationTemplate4: ComponentTemplate = {
  id: EDUCATION_TEMPLATE_IDS.ACCORDION,
  name: "Accordion Education",
  category: "education",
  htmlTemplate: `
    <section class="education-section-accordion" id="education" aria-labelledby="education-accordion-title">
      <div class="container">
        <h2 id="education-accordion-title" class="section-title">Eğitim Geçmişim</h2>
        <div class="education-accordion" role="list">
          {{EDUCATION_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .education-section-accordion {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .education-accordion {
      max-width: 900px;
      margin: 0 auto;
    }

    .accordion-item-edu {
      background: white;
      border-radius: 8px;
      margin-bottom: 1rem;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s;
    }

    .accordion-item-edu:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .accordion-header-edu {
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

    .accordion-header-edu:hover {
      background: #f8f9fa;
    }

    .accordion-header-edu:focus {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: 2px;
    }

    .accordion-header-edu:focus:not(:focus-visible) {
      outline: none;
    }

    .accordion-header-edu:focus-visible {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: 2px;
    }

    .accordion-header-content-edu {
      flex: 1;
    }

    .accordion-degree-edu {
      font-size: 1.3rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.25rem;
    }

    .accordion-school-edu {
      font-size: 1rem;
      color: {{COLOR_PRIMARY}};
      font-weight: 500;
    }

    .accordion-year-edu {
      font-size: 0.85rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-top: 0.25rem;
    }

    .accordion-icon-edu {
      font-size: 1.5rem;
      color: {{COLOR_ACCENT}};
      transition: transform 0.3s;
      flex-shrink: 0;
      margin-left: 1rem;
    }

    .accordion-item-edu.active .accordion-icon-edu {
      transform: rotate(180deg);
    }

    .accordion-content-edu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out, padding 0.3s ease-out;
      padding: 0 1.5rem;
    }

    .accordion-item-edu.active .accordion-content-edu {
      max-height: 500px;
      padding: 0 1.5rem 1.5rem 1.5rem;
    }

    .accordion-description-edu {
      color: {{COLOR_TEXT}};
      line-height: 1.6;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }

    /* Empty State Styles */
    .education-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_PRIMARY}};
      color: white;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .empty-action:hover {
      background: {{COLOR_ACCENT}};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Tablet Responsive Design */
    @media (max-width: 1024px) {
      .accordion-degree-edu {
        font-size: 1.2rem;
      }

      .accordion-school-edu {
        font-size: 0.95rem;
      }
    }

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .section-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .accordion-degree-edu {
        font-size: 1.1rem;
      }

      .accordion-school-edu {
        font-size: 0.9rem;
      }

      .accordion-header-edu {
        padding: 1.25rem;
      }

      .accordion-item-edu.active .accordion-content-edu {
        padding: 0 1.25rem 1.25rem 1.25rem;
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .education-section-accordion {
        padding: 3rem 1rem;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .accordion-degree-edu {
        font-size: 1rem;
      }

      .accordion-year-edu {
        font-size: 0.8rem;
      }

      .accordion-header-edu {
        padding: 1rem;
      }

      .accordion-icon-edu {
        font-size: 1.2rem;
      }
    }

    /* Print Styles */
    @media print {
      .education-section-accordion {
        page-break-inside: avoid;
        padding: 2rem 0;
      }

      .accordion-item-edu {
        page-break-inside: avoid;
        margin-bottom: 1.5rem;
        box-shadow: none;
        border: 1px solid #ddd;
      }

      .accordion-item-edu.active .accordion-content-edu {
        max-height: none;
        padding: 0 1.5rem 1.5rem 1.5rem;
      }

      .accordion-icon-edu {
        display: none;
      }

      .accordion-header-edu:hover {
        background: white;
      }
    }
  `,
  jsTemplate: `
    // Accordion toggle functionality with ARIA support
    function toggleEducationAccordion(header, forceOpen = null) {
      const item = header.closest('.accordion-item-edu');
      const content = item.querySelector('.accordion-content-edu');
      const wasActive = item.classList.contains('active');
      const shouldOpen = forceOpen !== null ? forceOpen : !wasActive;
      
      // Close all accordion items
      document.querySelectorAll('.accordion-item-edu').forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.accordion-header-edu');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      
      // Open clicked item if needed
      if (shouldOpen) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    }

    // Click event handlers
    document.querySelectorAll('.accordion-header-edu').forEach(header => {
      header.addEventListener('click', function() {
        toggleEducationAccordion(this);
      });

      // Keyboard navigation
      header.addEventListener('keydown', function(e) {
        const allHeaders = Array.from(document.querySelectorAll('.accordion-header-edu'));
        const currentIndex = allHeaders.indexOf(this);

        switch(e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            toggleEducationAccordion(this);
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
    const firstAccordionItemEdu = document.querySelector('.accordion-item-edu');
    if (firstAccordionItemEdu) {
      firstAccordionItemEdu.classList.add('active');
      const firstHeader = firstAccordionItemEdu.querySelector('.accordion-header-edu');
      if (firstHeader) firstHeader.setAttribute('aria-expanded', 'true');
    }
  `,
  placeholders: [
    "{{EDUCATION_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const educationTemplate5: ComponentTemplate = {
  id: EDUCATION_TEMPLATE_IDS.HORIZONTAL_TIMELINE,
  name: "Horizontal Timeline Education",
  category: "education",
  htmlTemplate: `
    <section class="education-section-horizontal" id="education" aria-labelledby="education-horizontal-title">
      <div class="container">
        <h2 id="education-horizontal-title" class="section-title">Eğitim Geçmişim</h2>
        <div class="horizontal-timeline-wrapper-edu">
          <div class="horizontal-timeline-edu" role="list">
            {{EDUCATION_ITEMS}}
          </div>
        </div>
        <div class="timeline-nav-hint-edu">← Kaydırarak keşfedin →</div>
      </div>
    </section>
  `,
  cssTemplate: `
    .education-section-horizontal {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
      overflow: hidden;
    }

    .horizontal-timeline-wrapper-edu {
      position: relative;
      margin: 2rem 0;
    }

    .horizontal-timeline-edu {
      display: flex;
      gap: 3rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      padding: 3rem 1rem;
      position: relative;
      scroll-snap-type: x mandatory;
    }

    .horizontal-timeline-edu::before {
      content: '';
      position: absolute;
      top: 2rem;
      left: 0;
      width: var(--timeline-width, 100%);
      height: 3px;
      background: {{COLOR_ACCENT}};
      z-index: 0;
    }

    .horizontal-timeline-edu::-webkit-scrollbar {
      height: 8px;
    }

    .horizontal-timeline-edu::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .horizontal-timeline-edu::-webkit-scrollbar-thumb {
      background: {{COLOR_ACCENT}};
      border-radius: 4px;
    }

    .horizontal-timeline-edu::-webkit-scrollbar-thumb:hover {
      background: {{COLOR_PRIMARY}};
    }

    .horizontal-timeline-item-edu {
      min-width: 320px;
      max-width: 320px;
      position: relative;
      scroll-snap-align: start;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUpEdu 0.6s ease-out forwards;
    }

    @keyframes fadeInUpEdu {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .horizontal-timeline-item-edu:nth-child(1) { animation-delay: 0.1s; }
    .horizontal-timeline-item-edu:nth-child(2) { animation-delay: 0.2s; }
    .horizontal-timeline-item-edu:nth-child(3) { animation-delay: 0.3s; }
    .horizontal-timeline-item-edu:nth-child(4) { animation-delay: 0.4s; }
    .horizontal-timeline-item-edu:nth-child(5) { animation-delay: 0.5s; }

    .horizontal-timeline-item-edu::before {
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

    .horizontal-timeline-card-edu {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      height: 100%;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .horizontal-timeline-card-edu:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .horizontal-timeline-year-edu {
      font-size: 0.85rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 0.75rem;
      font-weight: 500;
    }

    .horizontal-timeline-degree-edu {
      font-size: 1.2rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    .horizontal-timeline-school-edu {
      font-size: 1rem;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 1rem;
      font-weight: 500;
    }

    .horizontal-timeline-description-edu {
      color: {{COLOR_TEXT}};
      line-height: 1.5;
      font-size: 0.9rem;
    }

    .timeline-nav-hint-edu {
      text-align: center;
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.9rem;
      margin-top: 1rem;
      font-style: italic;
    }

    /* Empty State Styles */
    .education-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_PRIMARY}};
      color: white;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .empty-action:hover {
      background: {{COLOR_ACCENT}};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Tablet Responsive Design */
    @media (max-width: 1024px) {
      .horizontal-timeline-item-edu {
        min-width: 280px;
        max-width: 280px;
      }

      .horizontal-timeline-degree-edu {
        font-size: 1.1rem;
      }
    }

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .section-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .horizontal-timeline-edu {
        gap: 2rem;
        padding: 2.5rem 0.5rem;
      }

      .horizontal-timeline-item-edu {
        min-width: 260px;
        max-width: 260px;
      }

      .horizontal-timeline-card-edu {
        padding: 1.25rem;
      }

      .horizontal-timeline-degree-edu {
        font-size: 1rem;
      }

      .horizontal-timeline-school-edu {
        font-size: 0.9rem;
      }

      .horizontal-timeline-description-edu {
        font-size: 0.85rem;
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .education-section-horizontal {
        padding: 3rem 1rem;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .horizontal-timeline-item-edu {
        min-width: 240px;
        max-width: 240px;
      }

      .horizontal-timeline-card-edu {
        padding: 1rem;
      }

      .horizontal-timeline-year-edu {
        font-size: 0.8rem;
      }

      .horizontal-timeline-degree-edu {
        font-size: 0.95rem;
      }
    }

    /* Print Styles */
    @media print {
      .education-section-horizontal {
        page-break-inside: avoid;
        padding: 2rem 0;
      }

      .horizontal-timeline-edu {
        display: block;
        overflow: visible;
      }

      .horizontal-timeline-item-edu {
        min-width: 100%;
        max-width: 100%;
        page-break-inside: avoid;
        margin-bottom: 1.5rem;
        animation: none;
        opacity: 1;
        transform: none;
      }

      .horizontal-timeline-item-edu::before {
        display: none;
      }

      .horizontal-timeline-edu::before {
        display: none;
      }

      .horizontal-timeline-card-edu {
        box-shadow: none;
        border: 1px solid #ddd;
      }

      .horizontal-timeline-card-edu:hover {
        transform: none;
        box-shadow: none;
      }

      .timeline-nav-hint-edu {
        display: none;
      }
    }
  `,
  jsTemplate: `
    // Horizontal scroll with mouse wheel
    const horizontalTimelineEdu = document.querySelector('.horizontal-timeline-edu');
    
    if (horizontalTimelineEdu) {
      horizontalTimelineEdu.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          horizontalTimelineEdu.scrollLeft += e.deltaY;
        }
      }, { passive: false });

      // Touch swipe support for mobile
      let startX = 0;
      let scrollLeft = 0;

      horizontalTimelineEdu.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - horizontalTimelineEdu.offsetLeft;
        scrollLeft = horizontalTimelineEdu.scrollLeft;
      });

      horizontalTimelineEdu.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - horizontalTimelineEdu.offsetLeft;
        const walk = (x - startX) * 2;
        horizontalTimelineEdu.scrollLeft = scrollLeft - walk;
      });
    }
  `,
  placeholders: [
    "{{EDUCATION_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const educationTemplate6: ComponentTemplate = {
  id: EDUCATION_TEMPLATE_IDS.TABS,
  name: "Tabbed Education",
  category: "education",
  htmlTemplate: `
    <section class="education-section-tabs" id="education" aria-labelledby="education-tabs-title">
      <div class="container">
        <h2 id="education-tabs-title" class="section-title">Eğitim Geçmişim</h2>
        <div class="education-tabs-container">
          <div class="tabs-nav-edu" role="tablist">
            {{EDUCATION_ITEMS}}
          </div>
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .education-section-tabs {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }

    .education-tabs-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .tabs-nav-edu {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .tab-item-edu {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s;
    }

    .tab-item-edu:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .tab-button-edu {
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

    .tab-button-edu:hover {
      background: #f8f9fa;
    }

    .tab-button-edu:focus {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: -3px;
    }

    .tab-button-edu.active {
      background: #f0f7ff;
      border-left-color: {{COLOR_PRIMARY}};
    }

    .tab-button-content-edu {
      flex: 1;
    }

    .tab-degree-edu {
      font-size: 1.2rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.25rem;
    }

    .tab-button-edu.active .tab-degree-edu {
      color: {{COLOR_PRIMARY}};
    }

    .tab-school-edu {
      font-size: 0.95rem;
      color: {{COLOR_TEXT_SECONDARY}};
    }

    .tab-year-edu {
      font-size: 0.85rem;
      color: {{COLOR_TEXT_SECONDARY}};
      white-space: nowrap;
      margin-left: 1rem;
    }

    .tab-icon-edu {
      font-size: 1.2rem;
      color: {{COLOR_ACCENT}};
      transition: transform 0.3s;
      margin-left: 1rem;
    }

    .tab-button-edu.active .tab-icon-edu {
      transform: rotate(90deg);
    }

    .tab-content-edu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out, padding 0.3s ease-out;
      padding: 0 1.5rem;
    }

    .tab-item-edu.active .tab-content-edu {
      max-height: 500px;
      padding: 0 1.5rem 1.5rem 1.5rem;
    }

    .tab-description-edu {
      color: {{COLOR_TEXT}};
      line-height: 1.6;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }

    /* Empty State Styles */
    .education-empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-message {
      font-size: 1.1rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .empty-action {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: {{COLOR_PRIMARY}};
      color: white;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .empty-action:hover {
      background: {{COLOR_ACCENT}};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Responsive breakpoints */
    @media (max-width: 768px) {
      .section-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .tab-button-edu {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .tab-year-edu {
        margin-left: 0;
      }

      .tab-degree-edu {
        font-size: 1.1rem;
      }

      .tab-school-edu {
        font-size: 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .education-section-tabs {
        padding: 3rem 1rem;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .tab-button-edu {
        padding: 1rem 1.25rem;
      }

      .tab-degree-edu {
        font-size: 1rem;
      }

      .tab-school-edu {
        font-size: 0.85rem;
      }
    }

    /* Print Styles */
    @media print {
      .education-section-tabs {
        page-break-inside: avoid;
        padding: 2rem 0;
      }

      .tab-item-edu {
        page-break-inside: avoid;
        margin-bottom: 1.5rem;
        box-shadow: none;
        border: 1px solid #ddd;
      }

      .tab-item-edu.active .tab-content-edu {
        max-height: none;
        padding: 0 1.5rem 1.5rem 1.5rem;
      }

      .tab-icon-edu {
        display: none;
      }

      .tab-button-edu {
        border-left-color: {{COLOR_PRIMARY}};
      }

      .tab-button-edu:hover {
        background: white;
      }
    }
  `,
  jsTemplate: `
    // Tab functionality with keyboard navigation
    function toggleEducationTab(button) {
      const item = button.closest('.tab-item-edu');
      const wasActive = item.classList.contains('active');
      
      // Close all tabs
      document.querySelectorAll('.tab-item-edu').forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.tab-button-edu');
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
    document.querySelectorAll('.tab-button-edu').forEach(button => {
      button.addEventListener('click', function() {
        toggleEducationTab(this);
      });

      // Keyboard navigation
      button.addEventListener('keydown', function(e) {
        const allButtons = Array.from(document.querySelectorAll('.tab-button-edu'));
        const currentIndex = allButtons.indexOf(this);

        switch(e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            toggleEducationTab(this);
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
    const firstTabEdu = document.querySelector('.tab-item-edu');
    if (firstTabEdu) {
      firstTabEdu.classList.add('active');
      const firstButton = firstTabEdu.querySelector('.tab-button-edu');
      if (firstButton) {
        firstButton.classList.add('active');
        firstButton.setAttribute('aria-expanded', 'true');
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
  educationTemplate3,
  educationTemplate4,
  educationTemplate5,
  educationTemplate6
];
