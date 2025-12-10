import { ComponentTemplate } from "@/types/templates";

/**
 * Navigation menu template'leri
 */

export const navigationTemplate1: ComponentTemplate = {
  id: "nav-classic-horizontal",
  name: "Classic Horizontal Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-section" aria-label="Main navigation">
      <div class="nav-container">
        <div class="nav-logo">
          <a href="#hero">{{NAME}}</a>
        </div>
        <button class="nav-toggle" 
                aria-label="Toggle menu" 
                aria-expanded="false"
                aria-controls="nav-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-menu" id="nav-menu">
          {{NAV_MENU_ITEMS}}
        </ul>
      </div>
    </nav>
  `,
  cssTemplate: `
    /* Fixed navigation için body padding */
    body {
      padding-top: 70px;
    }

    .nav-section {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: {{COLOR_BACKGROUND}};
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-logo a {
      font-size: 1.5rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .nav-logo a:hover {
      color: {{COLOR_PRIMARY}};
    }

    .nav-toggle {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .nav-toggle span {
      width: 25px;
      height: 3px;
      background: {{COLOR_TEXT}};
      transition: all 0.3s ease;
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      color: {{COLOR_TEXT}};
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .nav-link:hover,
    .nav-link.active {
      background: {{COLOR_ACCENT}};
      color: {{COLOR_BACKGROUND}};
    }

    @media (max-width: 768px) {
      .nav-toggle {
        display: flex;
      }

      .nav-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        gap: 0;
        background: {{COLOR_BACKGROUND}};
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }

      .nav-menu.active {
        max-height: 100vh;
        overflow-y: auto;
      }

      .nav-link {
        display: block;
        padding: 1rem 2rem;
        border-bottom: 1px solid {{COLOR_TEXT_SECONDARY}};
      }
    }
  `,
  jsTemplate: `
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenuEl = document.querySelector('.nav-menu');
    
    if (navToggle && navMenuEl) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navMenuEl.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isExpanded.toString());
      });

      // Close menu when link is clicked
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenuEl.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
      
      // ESC key to close menu
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenuEl.classList.contains('active')) {
          navMenuEl.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Active link management
    const navHeight = document.querySelector('nav')?.offsetHeight || 80;
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - navHeight - 50) {
          current = section.getAttribute('id');
        }
      });

      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    });
  `,
  placeholders: [
    "{{NAME}}", "{{NAV_MENU_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ],
  designNotes: "Klasik yatay navigasyon. Mobilde hamburger menüye dönüşür. Menu item'ları server-side oluşturulur.",
};

export const navigationTemplate2: ComponentTemplate = {
  id: "nav-minimal-centered",
  name: "Minimal Centered Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-minimal" aria-label="Main navigation">
      <div class="nav-minimal-container">
        <ul class="nav-minimal-menu" id="nav-minimal-menu">
          {{NAV_MENU_ITEMS}}
          <li class="nav-minimal-logo">
            <a href="#hero">{{INITIALS}}</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  cssTemplate: `
    /* Fixed navigation için body padding */
    body {
      padding-top: 80px;
    }

    .nav-minimal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: {{COLOR_BACKGROUND}};
      backdrop-filter: blur(10px);
      z-index: 1000;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .nav-minimal-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
    }

    .nav-minimal-menu {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 3rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-minimal-logo {
      margin: 0 2rem;
    }

    .nav-minimal-logo a {
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: {{COLOR_PRIMARY}};
      color: {{COLOR_BACKGROUND}};
      border-radius: 50%;
      font-weight: 700;
      font-size: 1.2rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .nav-minimal-logo a:hover {
      background: {{COLOR_ACCENT}};
      transform: scale(1.1);
    }

    .nav-minimal-link {
      color: {{COLOR_TEXT}};
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      position: relative;
      transition: color 0.3s ease;
    }

    .nav-minimal-link::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: {{COLOR_PRIMARY}};
      transition: width 0.3s ease;
    }

    .nav-minimal-link:hover,
    .nav-minimal-link.active {
      color: {{COLOR_PRIMARY}};
    }

    .nav-minimal-link:hover::after,
    .nav-minimal-link.active::after {
      width: 100%;
    }

    @media (max-width: 768px) {
      .nav-minimal-menu {
        flex-wrap: wrap;
        gap: 1.5rem;
      }

      .nav-minimal-logo {
        order: -1;
        width: 100%;
        text-align: center;
        margin: 0 0 1rem 0;
      }
    }
  `,
  jsTemplate: `
    // Active link management
    const navHeight = document.querySelector('nav')?.offsetHeight || 80;
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - navHeight - 50) {
          current = section.getAttribute('id');
        }
      });

      document.querySelectorAll('.nav-minimal-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    });
  `,
  placeholders: [
    "{{INITIALS}}", "{{NAV_MENU_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_TEXT}}"
  ],
  designNotes: "Minimal tasarım. Logo ortada, linkler çevresinde. Menu item'ları server-side oluşturulur. Aktif sayfa göstergesi var.",
};

export const navigationTemplate3: ComponentTemplate = {
  id: "nav-sidebar-modern",
  name: "Modern Sidebar Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-sidebar" aria-label="Main navigation">
      <div class="nav-sidebar-header">
        <div class="nav-sidebar-logo">{{INITIALS}}</div>
        <h3 class="nav-sidebar-name">{{NAME}}</h3>
      </div>
      <ul class="nav-sidebar-menu" id="nav-sidebar-menu">
        {{NAV_MENU_ITEMS}}
      </ul>
      <div class="nav-sidebar-footer">
        <div class="nav-sidebar-social">
          {{SOCIAL_LINKS}}
        </div>
      </div>
    </nav>
    <button class="nav-sidebar-toggle" 
            aria-label="Toggle sidebar"
            aria-expanded="false"
            aria-controls="nav-sidebar">☰</button>
  `,
  cssTemplate: `
    .nav-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 280px;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}} 0%, {{COLOR_SECONDARY}} 100%);
      color: {{COLOR_TEXT}};
      padding: 2rem 0;
      display: flex;
      flex-direction: column;
      z-index: 1000;
      transition: transform 0.3s ease;
    }

    .nav-sidebar-header {
      text-align: center;
      padding: 0 2rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-sidebar-logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      backdrop-filter: blur(10px);
    }

    .nav-sidebar-name {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .nav-sidebar-menu {
      flex: 1;
      list-style: none;
      padding: 2rem 0;
      margin: 0;
    }

    .nav-sidebar-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 2rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-sidebar-link::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: {{COLOR_ACCENT}};
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    .nav-sidebar-link:hover,
    .nav-sidebar-link.active {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .nav-sidebar-link.active::before {
      transform: scaleY(1);
    }

    .nav-sidebar-icon {
      font-size: 1.5rem;
    }

    .nav-sidebar-text {
      font-weight: 500;
    }

    .nav-sidebar-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-sidebar-social {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .nav-sidebar-social a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 1.5rem;
      transition: color 0.3s ease;
    }

    .nav-sidebar-social a:hover {
      color: #ffffff;
    }

    .nav-sidebar-toggle {
      display: none;
      position: fixed;
      top: 1rem;
      left: 1rem;
      z-index: 1001;
      background: {{COLOR_PRIMARY}};
      color: #ffffff;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .nav-sidebar {
        transform: translateX(-100%);
      }

      .nav-sidebar.active {
        transform: translateX(0);
      }

      .nav-sidebar-toggle {
        display: block;
      }
    }

    /* Main content adjustment */
    body {
      margin-left: 280px;
    }

    @media (max-width: 768px) {
      body {
        margin-left: 0;
      }
    }
  `,
  jsTemplate: `
    // Sidebar toggle for mobile
    const sidebarToggle = document.querySelector('.nav-sidebar-toggle');
    const sidebar = document.querySelector('.nav-sidebar');
    
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        const isExpanded = sidebar.classList.toggle('active');
        sidebarToggle.setAttribute('aria-expanded', isExpanded.toString());
      });

      // Close sidebar when link is clicked on mobile
      if (window.innerWidth <= 768) {
        document.querySelectorAll('.nav-sidebar-link').forEach(link => {
          link.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarToggle.setAttribute('aria-expanded', 'false');
          });
        });
      }
    }

    // Active link management
    const navHeight = 80;
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - navHeight - 50) {
          current = section.getAttribute('id');
        }
      });

      document.querySelectorAll('.nav-sidebar-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    });
  `,
  placeholders: [
    "{{NAME}}", "{{INITIALS}}", "{{NAV_MENU_ITEMS}}", "{{SOCIAL_LINKS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}"
  ],
  designNotes: "Modern sidebar navigasyon. Sol tarafta sabit durur. Mobilde hamburger menü ile açılır. Menu item'ları server-side oluşturulur, iconlu.",
};

export const navigationTemplate4: ComponentTemplate = {
  id: "nav-floating-dot",
  name: "Floating Dot Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-floating" aria-label="Main navigation">
      <ul class="nav-floating-menu" id="nav-floating-menu">
        {{NAV_MENU_ITEMS}}
      </ul>
    </nav>
  `,
  cssTemplate: `
    .nav-floating {
      position: fixed;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1000;
    }

    .nav-floating-menu {
      list-style: none;
      padding: 1rem;
      margin: 0;
      background: {{COLOR_BACKGROUND}};
      backdrop-filter: blur(10px);
      border-radius: 50px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .nav-floating-dot {
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: {{COLOR_TEXT_SECONDARY}};
      position: relative;
      transition: all 0.3s ease;
    }

    .nav-floating-dot::before {
      content: attr(data-tooltip);
      position: absolute;
      right: calc(100% + 1rem);
      top: 50%;
      transform: translateY(-50%);
      background: {{COLOR_PRIMARY}};
      color: {{COLOR_BACKGROUND}};
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .nav-floating-dot::after {
      content: '';
      position: absolute;
      right: calc(100% + 0.5rem);
      top: 50%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-left-color: {{COLOR_PRIMARY}};
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .nav-floating-dot:hover::before,
    .nav-floating-dot:hover::after {
      opacity: 1;
    }

    .nav-floating-dot:hover {
      background: {{COLOR_PRIMARY}};
      transform: scale(1.5);
    }

    .nav-floating-dot.active {
      background: {{COLOR_PRIMARY}};
      width: 16px;
      height: 16px;
    }

    @media (max-width: 768px) {
      .nav-floating {
        right: 1rem;
      }

      .nav-floating-menu {
        padding: 0.75rem;
        gap: 1rem;
      }

      .nav-floating-dot::before,
      .nav-floating-dot::after {
        display: none;
      }
    }
  `,
  jsTemplate: `
    // Active dot management based on scroll
    const navHeight = 80;
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - navHeight - 50) {
          current = section.getAttribute('id');
        }
      });

      document.querySelectorAll('.nav-floating-dot').forEach(dot => {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
        if (dot.getAttribute('href') === '#' + current) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'page');
        }
      });
    });
  `,
  placeholders: [
    "{{NAV_MENU_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_BACKGROUND}}", "{{COLOR_TEXT_SECONDARY}}"
  ],
  designNotes: "Minimal floating dot navigation. Sağ tarafta sabit durur. Menu item'ları server-side oluşturulur. Hover'da tooltip gösterir. Aktif sayfa daha büyük gösterilir.",
};

export const navigationTemplates: ComponentTemplate[] = [
  navigationTemplate1,
  navigationTemplate2,
  navigationTemplate3,
  navigationTemplate4,
];
