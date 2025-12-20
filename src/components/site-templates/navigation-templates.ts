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
      background: rgba({{COLOR_BACKGROUND_RGB}}, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba({{COLOR_TEXT_RGB}}, 0.08);
      z-index: 1000;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-section::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}}, {{COLOR_PRIMARY}});
      background-size: 200% 100%;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .nav-section.scrolled::after {
      opacity: 1;
      animation: gradientMove 3s linear infinite;
    }

    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    .nav-section.scrolled {
      padding-top: 0;
      padding-bottom: 0;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-section.scrolled .nav-container {
      padding: 0.6rem 2rem;
    }

    .nav-logo a {
      font-size: 1.5rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-section.scrolled .nav-logo a {
      font-size: 1.3rem;
    }

    .nav-logo a:hover {
      color: {{COLOR_PRIMARY}};
      transform: scale(1.02);
    }

    .nav-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      z-index: 1001;
    }

    .nav-toggle span {
      width: 24px;
      height: 2px;
      background: {{COLOR_TEXT}};
      border-radius: 2px;
      transition: all 0.3s ease;
      transform-origin: center;
    }

    .nav-toggle.active span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    .nav-toggle.active span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .nav-toggle.active span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    .nav-menu {
      display: flex;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: {{COLOR_TEXT}};
      text-decoration: none;
      font-weight: 500;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .nav-link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: {{COLOR_TEXT_SECONDARY}};
      transition: all 0.3s ease;
    }

    .nav-link-icon svg {
      width: 18px;
      height: 18px;
    }

    .nav-link-text {
      position: relative;
    }

    .nav-link-text::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: {{COLOR_PRIMARY}};
      transition: width 0.3s ease;
    }

    .nav-link:hover .nav-link-text::after,
    .nav-link.active .nav-link-text::after {
      width: 100%;
    }

    .nav-link:hover {
      background: rgba({{COLOR_PRIMARY_RGB}}, 0.1);
      color: {{COLOR_PRIMARY}};
    }

    .nav-link:hover .nav-link-icon {
      color: {{COLOR_PRIMARY}};
      transform: scale(1.1);
    }

    .nav-link.active {
      background: rgba({{COLOR_PRIMARY_RGB}}, 0.15);
      color: {{COLOR_PRIMARY}};
    }

    .nav-link.active .nav-link-icon {
      color: {{COLOR_PRIMARY}};
    }

    @media (max-width: 768px) {
      .nav-toggle {
        display: flex;
      }

      .nav-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        flex-direction: column;
        gap: 0.5rem;
        padding: 80px 1.5rem 2rem;
        background: rgba({{COLOR_BACKGROUND_RGB}}, 0.98);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: -10px 0 40px rgba(0, 0, 0, 0.15);
        transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow-y: auto;
      }

      .nav-menu.active {
        right: 0;
      }

      .nav-link {
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 1.05rem;
      }

      .nav-link-icon svg {
        width: 20px;
        height: 20px;
      }
    }
  `,
  jsTemplate: `
    // Navigation references
    const navSection = document.querySelector('.nav-section');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenuEl = document.querySelector('.nav-menu');
    
    // Mobile menu toggle with hamburger animation
    if (navToggle && navMenuEl) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navMenuEl.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isExpanded.toString());
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
      });

      // Close menu when link is clicked
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenuEl.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
      
      // ESC key to close menu
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenuEl.classList.contains('active')) {
          navMenuEl.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (navMenuEl.classList.contains('active') && 
            !navMenuEl.contains(e.target) && 
            !navToggle.contains(e.target)) {
          navMenuEl.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    // Scroll shrink effect & active link management
    const navHeight = navSection?.offsetHeight || 80;
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      
      // Add/remove scrolled class for shrink effect
      if (navSection) {
        if (scrollY > 50) {
          navSection.classList.add('scrolled');
        } else {
          navSection.classList.remove('scrolled');
        }
      }
      
      // Active link management
      let current = '';
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - navHeight - 50) {
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
      
      lastScrollY = scrollY;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const headerOffset = navHeight;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  `,
  placeholders: [
    "{{NAME}}", "{{NAV_MENU_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_PRIMARY_RGB}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_BACKGROUND_RGB}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_RGB}}", "{{COLOR_TEXT_SECONDARY}}"
  ],
  designNotes: "Modern glassmorphism navigasyon. Icon destekli menü öğeleri, scroll'da küçülme efekti, mobilde slide-in drawer. Hamburger X'e dönüşür.",
};

export const navigationTemplate2: ComponentTemplate = {
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
      color: {{COLOR_TEXT}};
      backdrop-filter: blur(10px);
    }

    .nav-sidebar-name {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
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
      width: 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: {{COLOR_ICON_PRIMARY}};
    }

    .nav-sidebar-icon svg {
      width: 20px;
      height: 20px;
      stroke: currentColor;
      fill: none;
      transition: transform 0.3s ease, stroke-width 0.3s ease;
    }

    .nav-sidebar-link:hover .nav-sidebar-icon {
      color: {{COLOR_ICON_SECONDARY}};
    }

    .nav-sidebar-link:hover .nav-sidebar-icon svg {
      transform: scale(1.15) rotate(5deg);
    }

    .nav-sidebar-link.active .nav-sidebar-icon svg {
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .nav-sidebar-text {
      font-weight: 500;
      font-size: 0.95rem;
    }

    .nav-sidebar-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-sidebar-social {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .nav-sidebar-social a {
      color: {{COLOR_ICON_PRIMARY}};
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-sidebar-social a:hover {
      color: {{COLOR_ICON_SECONDARY}};
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .nav-sidebar-social a svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      fill: none;
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

export const navigationTemplate3: ComponentTemplate = {
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
];
